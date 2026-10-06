<?php

namespace App\Services;

use App\Models\Country;

/**
 * Price calculation by country: prices are entered in the base currency (the
 * default country's, Countries → Default Country) and shown in the currency
 * of the country they're for, converted at today's rate from the exchange
 * rate API (ExchangeRateService: ?base=GBP&quotes=EUR). Converted prices are
 * exact (amount × rate), not rounded.
 *
 *   $conversion = $priceCalculation->forCountry($germany);   // GBP → EUR, rate 1.1726
 *   $priceCalculation->convert(100, $conversion);            // 117.26
 */
class PriceCalculationService
{
    /**
     * Fees have up to 2 decimals and API rates up to 6, so amount × rate is
     * exact within 8 decimals; this only strips binary floating-point noise
     * (117.26000000000001 → 117.26), it never rounds the price itself.
     */
    private const PRECISION = 10;

    public function __construct(
        protected SettingsService $settingsService,
        protected ExchangeRateService $exchangeRateService,
    ) {
    }

    /** The currency prices are entered in: the default country's (falls back to config/currency.php). */
    public function baseCurrency(): string
    {
        return $this->exchangeRateService->displayBase();
    }

    /**
     * How prices are shown for a country:
     * - base_code: the currency prices are entered in
     * - code / symbol: the currency they're shown in (the country's, or the base)
     * - rate: units of code per 1 base_code; converted: whether rate applies
     * - note: why prices stay in the base currency, if they do
     */
    public function forCountry(?Country $country): array
    {
        $base = $this->baseCurrency();
        $conversion = [
            'base_code' => $base,
            'code' => $base,
            'symbol' => $this->symbolFor($base),
            'rate' => 1.0,
            'converted' => false,
            'note' => null,
        ];

        // No country, or the default country itself: prices are already in its currency
        if (! $country || $country->id === $this->settingsService->getDefaultTaxCountryId()) {
            return $conversion;
        }

        $target = $this->exchangeRateService->currencyOf($country);
        if (! $target) {
            return ['note' => "No currency is known for {$country->countryName}, so prices are shown in {$base}."] + $conversion;
        }
        if ($target === $base) {
            return $conversion;
        }

        $rate = (float) $this->exchangeRateService->rate($base, $target);
        if ($rate <= 0) {
            return ['note' => "No exchange rate from {$base} to {$target} is available right now, so prices are shown in {$base}."] + $conversion;
        }

        return [
            'code' => $target,
            'symbol' => $this->symbolFor($target),
            'rate' => $rate,
            'converted' => true,
        ] + $conversion;
    }

    /** An amount in the base currency, in the country's currency: exactly amount × rate. */
    public function convert(float $amount, array $conversion): float
    {
        return round($amount * $conversion['rate'], self::PRECISION);
    }

    /** An amount in the base currency, priced for a country in one step. */
    public function priceFor(float $amount, ?Country $country): array
    {
        $conversion = $this->forCountry($country);

        return [
            'amount' => $this->convert($amount, $conversion),
            'code' => $conversion['code'],
            'symbol' => $conversion['symbol'],
        ];
    }

    /** "Indian Rupee (₹)" in config/currency.php -> "₹"; otherwise the currency's own symbol (NT$), or the code. */
    public function symbolFor(string $code): string
    {
        $label = config("currency.list.{$code}", '');
        if (preg_match('/\((.+)\)$/u', $label, $match)) {
            return $match[1];
        }

        if (class_exists(\NumberFormatter::class)) {
            $symbol = (new \NumberFormatter("en@currency={$code}", \NumberFormatter::CURRENCY))->getSymbol(\NumberFormatter::CURRENCY_SYMBOL);
            if ($symbol !== '') {
                return $symbol;
            }
        }

        return $code;
    }
}
