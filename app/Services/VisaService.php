<?php

namespace App\Services;

use App\Models\Visa;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VisaService
{
    private const RELATIONS = ['visaType', 'originCountry', 'destinationCountry', 'category', 'costDetails'];

    private const COST_COLUMNS = [
        'type', 'validation_process', 'processing_time',
        'embassy_fee', 'service_fee', 'tax_fee', 'credit_amount', 'tax_amount',
    ];

    private const AMOUNT_COLUMNS = ['embassy_fee', 'service_fee', 'tax_fee', 'credit_amount', 'tax_amount'];

    public function all()
    {
        return Visa::with(self::RELATIONS)->orderBy('created_at', 'desc')->get();
    }

    /**
     * Admin list. status: active (default) | inactive | all; search matches
     * the visa name or title.
     */
    public function paginate(array $filters, int $perPage = 10)
    {
        $status = $filters['status'] ?? 'active';
        $search = trim((string) ($filters['search'] ?? ''));

        return Visa::with(self::RELATIONS)
            ->when($status === 'active', fn ($query) => $query->where('status', true))
            ->when($status === 'inactive', fn ($query) => $query->where('status', false))
            ->when($search !== '', fn ($query) => $query->where(
                fn ($match) => $match->where('name', 'like', "%{$search}%")->orWhere('title', 'like', "%{$search}%")
            ))
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function statusCounts(): array
    {
        return [
            'all' => Visa::count(),
            'active' => Visa::where('status', true)->count(),
            'inactive' => Visa::where('status', false)->count(),
        ];
    }

    /** Active visas, for the public site and search dropdowns. */
    public function active()
    {
        return Visa::with(self::RELATIONS)->where('status', true)->orderBy('created_at', 'desc')->get();
    }

    /**
     * Active visas for a route. Either side may be left out to match any
     * country on that side.
     */
    public function search(?int $originCountryId, ?int $destinationCountryId)
    {
        return Visa::with(self::RELATIONS)
            ->where('status', true)
            ->when($originCountryId, fn ($query) => $query->where('origin_country_id', $originCountryId))
            ->when($destinationCountryId, fn ($query) => $query->where('destination_country_id', $destinationCountryId))
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * One visa for the admin "Preview" button, whatever its status, as long as
     * it is on the given route.
     */
    public function preview(string $uid, int $originCountryId, int $destinationCountryId): ?Visa
    {
        return Visa::with(self::RELATIONS)
            ->where('uid', $uid)
            ->where('origin_country_id', $originCountryId)
            ->where('destination_country_id', $destinationCountryId)
            ->first();
    }

    /** Active visas flagged as featured, for the home page. */
    public function featured()
    {
        return Visa::with(self::RELATIONS)->where('status', true)->where('is_featured', true)->orderBy('created_at', 'desc')->get();
    }

    public function load(Visa $visa): Visa
    {
        return $visa->load(self::RELATIONS);
    }

    public function create(array $data, ?UploadedFile $image, array $costRows): Visa
    {
        return DB::transaction(function () use ($data, $image, $costRows) {
            if ($image) {
                $data['image'] = $this->storeImage($image);
            }

            $visa = Visa::create($data);
            $this->replaceCostRows($visa, $costRows);

            return $visa;
        });
    }

    public function update(Visa $visa, array $data, ?UploadedFile $image, array $costRows): Visa
    {
        return DB::transaction(function () use ($visa, $data, $image, $costRows) {
            if ($image) {
                $this->deleteImage($visa->image);
                $data['image'] = $this->storeImage($image);
            }

            $visa->update($data);
            $this->replaceCostRows($visa, $costRows);

            return $visa;
        });
    }

    public function setStatus(Visa $visa, bool $active): Visa
    {
        $visa->update(['status' => $active]);

        return $visa;
    }

    public function delete(Visa $visa): bool
    {
        $this->deleteImage($visa->image);

        return (bool) $visa->delete();
    }

    /**
     * The form always submits the complete list of cost rows, so the stored
     * set is replaced wholesale. Totals are calculated here, never trusted
     * from the browser.
     */
    private function replaceCostRows(Visa $visa, array $costRows): void
    {
        $visa->costDetails()->delete();

        foreach ($costRows as $row) {
            $row = collect($row)
                ->only(self::COST_COLUMNS)
                ->filter(fn ($value) => !is_null($value))
                ->all();

            if (empty($row)) {
                continue;
            }

            $row['total_cost'] = collect(self::AMOUNT_COLUMNS)->sum(fn ($key) => (float) ($row[$key] ?? 0));

            $visa->costDetails()->create($row);
        }
    }

    private function storeImage(UploadedFile $image): string
    {
        return '/storage/' . $image->store('visas', 'public');
    }

    private function deleteImage(?string $path): void
    {
        if ($path && Str::startsWith($path, '/storage/')) {
            Storage::disk('public')->delete(Str::after($path, '/storage/'));
        }
    }
}
