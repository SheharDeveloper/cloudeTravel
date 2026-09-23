<?php

namespace App\Services;

use App\Models\Country;
use App\Models\TaxSetup;
use App\Models\Visa;

/**
 * Prices a visa for the country the applicant lives in: that country's tax
 * (GST / VAT, from Tax Setup) is added and the amounts are converted from the
 * currency visa fees are entered in (config/currency.php) to the applicant's
 * currency. On the Countries page each country's exchange rate is the amount of
 * its currency per 1 unit of the default country's currency, which is the
 * currency the fees are in, so converting is a single multiplication.
 */
class VisaPricingService
{
    public function __construct(protected SettingsService $settingsService)
    {
    }

    /**
     * What the price table needs to know about the "Living In" country:
     * currency, conversion factor, the taxes that apply, and a note when
     * something is missing and prices fall back to the base currency.
     * $taxEnabled is the agency's Tax Status; when off, no tax is applied at all.
     */
    public function context(?Country $livingIn, bool $taxEnabled = true): array
    {
        $baseCode = strtoupper(config('currency.code'));

        $context = [
            'living_country' => $livingIn?->countryName,
            'code' => $baseCode,
            'symbol' => config('currency.symbol'),
            'rate' => 1.0,
            'converted' => false,
            'base_code' => $baseCode,
            'tax_enabled' => $taxEnabled,
            'taxes' => [],
            'note' => null,
        ];

        if (!$livingIn) {
            return $context;
        }

        if ($taxEnabled) {
            $context['taxes'] = TaxSetup::where('country_id', $livingIn->id)
                ->orderBy('tax_name')
                ->get(['tax_name', 'amount'])
                ->map(fn (TaxSetup $tax) => ['name' => $tax->tax_name, 'percent' => (float) $tax->amount])
                ->all();
        }

        // The default country's own currency is the one the fees are already in.
        if ($livingIn->id === $this->settingsService->getDefaultTaxCountryId()) {
            return $context;
        }

        $target = strtoupper(trim((string) $livingIn->currency_code));

        if ($target === '') {
            $context['note'] = "No currency is set for {$livingIn->countryName}, so prices are shown in {$baseCode}. The administrator sets it under Countries.";

            return $context;
        }

        if ($target === $baseCode) {
            return $context;
        }

        $rate = (float) $livingIn->exchange_rate;

        if ($rate <= 0) {
            $context['note'] = "No exchange rate (per 1 {$baseCode}) is set for {$livingIn->countryName}, so prices are shown in {$baseCode}. The administrator sets it under Countries.";

            return $context;
        }

        $context['rate'] = $rate;
        $context['code'] = $target;
        $context['symbol'] = $this->symbolFor($target);
        $context['converted'] = true;

        return $context;
    }

    /**
     * The visa's cost rows priced with the given context. Tax applies to the
     * service fee (the embassy fee is a government charge and is not taxed).
     */
    public function priceRows(Visa $visa, array $context): array
    {
        $taxPercent = collect($context['taxes'])->sum('percent');

        return $visa->costDetails->map(function ($row) use ($context, $taxPercent) {
            $embassy = (float) ($row->embassy_fee ?? $row->credit_amount ?? 0);
            $service = (float) ($row->service_fee ?? 0);
            $tax = $service * $taxPercent / 100;

            $convert = fn (float $amount) => round($amount * $context['rate'], 2);

            return [
                'id' => $row->id,
                'type' => $row->type,
                'validation_process' => $row->validation_process,
                'processing_time' => $row->processing_time,
                'embassy_fee' => $convert($embassy),
                'service_fee' => $convert($service),
                'tax_fee' => $convert($tax),
                'total_cost' => $convert($embassy + $service + $tax),
            ];
        })->all();
    }

    /** "Indian Rupee (₹)" in config/currency.php -> "₹"; the code if unlisted. */
    private function symbolFor(string $code): string
    {
        $label = config("currency.list.{$code}", '');

        return preg_match('/\((.+)\)$/u', $label, $match) ? $match[1] : $code;
    }
}
