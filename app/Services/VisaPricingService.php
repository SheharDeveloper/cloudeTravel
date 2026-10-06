<?php

namespace App\Services;

use App\Models\AgencyCommission;
use App\Models\Country;
use App\Models\TaxSetup;
use App\Models\Visa;

/**
 * Prices a visa for the country the applicant lives in: that country's tax
 * (GST / VAT, from Tax Setup) and the agency's commission are added, and the
 * amounts are converted to the applicant's currency by PriceCalculationService.
 */
class VisaPricingService
{
    public function __construct(protected PriceCalculationService $priceCalculation)
    {
    }

    /**
     * What the price table needs to know about the "Living In" country:
     * currency, conversion factor, the taxes that apply, and a note when
     * something is missing and prices fall back to the base currency.
     * $taxEnabled is the agency's Tax Status; when off, no tax is applied at all.
     * $commission is the signed-in agency's own visa commission (none for the
     * superadmin), added to the service fee.
     */
    public function context(?Country $livingIn, bool $taxEnabled = true, ?AgencyCommission $commission = null): array
    {
        $taxes = $livingIn && $taxEnabled
            ? TaxSetup::where('country_id', $livingIn->id)
                ->orderBy('tax_name')
                ->get(['tax_name', 'amount'])
                ->map(fn (TaxSetup $tax) => ['name' => $tax->tax_name, 'percent' => (float) $tax->amount])
                ->all()
            : [];

        // Currency, rate and note (base_code, code, symbol, rate, converted, note)
        return $this->priceCalculation->forCountry($livingIn) + [
            'commission' => $commission
                ? ['type' => $commission->commission_type, 'value' => $commission->commission_value]
                : null,
            'living_country' => $livingIn?->countryName,
            'tax_enabled' => $taxEnabled,
            'taxes' => $taxes,
        ];
    }

    /**
     * The visa's cost rows priced with the given context. Tax applies to the
     * service fee (the embassy fee is a government charge and is not taxed).
     * The agency's commission is added to the service fee first, so it is
     * taxed along with it.
     */
    public function priceRows(Visa $visa, array $context): array
    {
        $taxPercent = collect($context['taxes'])->sum('percent');
        $commission = $context['commission'] ?? null;

        return $visa->costDetails->map(function ($row) use ($context, $taxPercent, $commission) {
            $embassy = (float) ($row->embassy_fee ?? $row->credit_amount ?? 0);
            $service = (float) ($row->service_fee ?? 0);
            if ($commission) {
                $service += $commission['type'] === AgencyCommission::TYPE_FIXED
                    ? $commission['value']
                    : $service * $commission['value'] / 100;
            }
            $tax = $service * $taxPercent / 100;

            // Exact amount × rate, not rounded
            $convert = fn (float $amount) => $this->priceCalculation->convert($amount, $context);

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
}
