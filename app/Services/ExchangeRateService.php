<?php

namespace App\Services;

use App\Models\Country;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

/**
 * Exchange rates from the Frankfurter API, filtered by base and quotes:
 * https://api.frankfurter.dev/v2/rates?base=EUR&quotes=INR
 *
 * The Countries page lists the rates against the default country's currency
 * (?base=INR for India; EUR, the API's default, when it has none). Visa
 * prices use the EUR rates: GBP → INR is worked out from both EUR rates. Rates are cached for a few hours; "Refresh
 * Rates" fetches them again.
 */
class ExchangeRateService
{
    public const API_URL = 'https://api.frankfurter.dev/v2/rates';
    public const CURRENCIES_URL = 'https://api.frankfurter.dev/v2/currencies';
    public const BASE = 'EUR';

    private const CACHE_HOURS = 6;

    public function __construct(protected SettingsService $settingsService)
    {
    }

    /**
     * Rates for the base currency: units of each quote per 1 base, e.g.
     * rates('EUR', ['INR', 'USD']) => ['INR' => ['rate' => 104.3, 'date' => '2026-10-04'], …].
     * No quotes = every currency the API has. Unknown currencies are left out.
     *
     * @param  string|string[]  $quotes
     * @return array<string, array{rate: float, date: string}>
     *
     * @throws RequestException
     */
    public function rates(string $base, string|array $quotes = []): array
    {
        $base = strtoupper(trim($base));
        $quotes = collect((array) $quotes)->map(fn ($q) => strtoupper(trim($q)))->filter()->unique()->reject(fn ($q) => $q === $base)->sort()->values();

        return Cache::remember($this->cacheKey($base, $quotes->all()), now()->addHours(self::CACHE_HOURS), function () use ($base, $quotes) {
            if ($quotes->isEmpty()) {
                return $this->fetch($base);
            }

            try {
                return $this->fetch($base, $quotes->implode(','));
            } catch (RequestException $e) {
                // One unknown currency fails the whole call ("invalid currency: XYZ"):
                // ask for each quote on its own and skip the unknown ones
                if ($e->response->status() !== 422 || $quotes->count() === 1) {
                    throw $e;
                }

                return $quotes->flatMap(function ($quote) use ($base) {
                    try {
                        return $this->fetch($base, $quote);
                    } catch (RequestException $e) {
                        if ($e->response->status() === 422) {
                            return [];
                        }
                        throw $e;
                    }
                })->all();
            }
        });
    }

    /**
     * One rate: units of $quote per 1 $base, straight from the API
     * (?base=EUR&quotes=INR → 108.56). 1 for the same currency; null if the
     * API has none or can't be reached.
     */
    public function rate(string $base, string $quote): ?float
    {
        $base = strtoupper(trim($base));
        $quote = strtoupper(trim($quote));
        if ($base === $quote) {
            return 1.0;
        }

        try {
            return $this->rates($base, $quote)[$quote]['rate'] ?? null;
        } catch (\Throwable $e) {
            report($e);

            return null;
        }
    }

    /** The API call for a base (and quotes): https://api.frankfurter.dev/v2/rates?base=EUR&quotes=INR */
    public function url(string $base, string|array $quotes = []): string
    {
        return self::API_URL . '?' . http_build_query(array_filter([
            'base' => strtoupper(trim($base)),
            'quotes' => collect((array) $quotes)->map(fn ($q) => strtoupper(trim($q)))->filter()->implode(','),
        ]));
    }

    /**
     * The base currency (Countries page list and visa fees): the default
     * country's currency. Falls back to the app's currency (config/currency.php)
     * when the default country has none, or the API has no rates for it.
     */
    public function displayBase(): string
    {
        $code = $this->currencyOf(Country::find($this->settingsService->getDefaultTaxCountryId()));

        return $code && $this->supports($code) ? $code : strtoupper(config('currency.code'));
    }

    /** Whether the API has rates for the currency (assumed yes while the API can't be reached). */
    public function supports(string $code): bool
    {
        $code = strtoupper(trim($code));
        if ($code === self::BASE) {
            return true;
        }

        try {
            return isset($this->rates(self::BASE)[$code]);
        } catch (\Throwable $e) {
            report($e);

            return true;
        }
    }

    /**
     * Any country's currency, found dynamically: the one saved on the country,
     * else the official currency of its ISO country code from the system's
     * locale data (PHP intl) — nothing is listed by hand.
     */
    public function currencyOf(?Country $country): ?string
    {
        $code = strtoupper(trim((string) $country?->currency_code));
        if ($code !== '' || ! $country || ! class_exists(\NumberFormatter::class)) {
            return $code ?: null;
        }

        $formatter = new \NumberFormatter('en_' . strtoupper(trim((string) $country->countryCode)), \NumberFormatter::CURRENCY);
        $code = strtoupper((string) $formatter->getTextAttribute(\NumberFormatter::CURRENCY_CODE));

        // An unknown region gives the placeholder "XXX"
        return preg_match('/^[A-Z]{3}$/', $code) && $code !== 'XXX' ? $code : null;
    }

    /**
     * The Countries page list: every currency's rate against the base, with
     * its name and symbol.
     *
     * @return array<int, array{code: string, name: ?string, symbol: ?string, rate: float, date: string}>
     */
    public function list(string $base): array
    {
        $currencies = $this->currencies();

        return collect($this->rates($base))
            ->map(fn ($r, $code) => [
                'code' => $code,
                'name' => $currencies[$code]['name'] ?? null,
                'symbol' => $currencies[$code]['symbol'] ?? null,
                'rate' => $r['rate'],
                'date' => $r['date'],
            ])
            ->sortKeys()
            ->values()
            ->all();
    }

    /** Drops every cached rate (all bases and quotes) so the next calls fetch them again. */
    public function refresh(): void
    {
        Cache::forever('frankfurter_rates_version', $this->cacheVersion() + 1);
    }

    /** ISO code => ['name' => …, 'symbol' => …], cached for a day. */
    private function currencies(): array
    {
        try {
            return Cache::remember('frankfurter_currencies', now()->addDay(), fn () => Http::timeout(15)->acceptJson()
                ->get(self::CURRENCIES_URL)
                ->throw()
                ->collect()
                ->mapWithKeys(fn ($c) => [strtoupper($c['iso_code']) => ['name' => $c['name'] ?? null, 'symbol' => $c['symbol'] ?? null]])
                ->all());
        } catch (\Throwable $e) {
            report($e);

            return [];
        }
    }

    /** One API call: ?base=EUR&quotes=INR,USD. */
    private function fetch(string $base, ?string $quotes = null): array
    {
        return Http::timeout(15)->acceptJson()
            ->get(self::API_URL, array_filter(['base' => $base, 'quotes' => $quotes]))
            ->throw()
            ->collect()
            ->mapWithKeys(fn ($row) => [strtoupper($row['quote']) => ['rate' => (float) $row['rate'], 'date' => $row['date']]])
            ->all();
    }

    private function cacheKey(string $base, array $quotes): string
    {
        return 'frankfurter_rates:v' . $this->cacheVersion() . ':' . $base . ':' . implode(',', $quotes);
    }

    private function cacheVersion(): int
    {
        return (int) Cache::get('frankfurter_rates_version', 1);
    }
}
