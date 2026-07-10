// REST Countries API Service
const REST_COUNTRIES_API = 'https://restcountries.com/v3.1';

interface CountryData {
    code: string;
    name: string;
    capital?: string;
    region?: string;
}

interface CountryResponse {
    cca2: string;
    name: {
        common: string;
    };
    capital?: string[];
    region?: string;
}

export const countryService = {
    // Fetch all countries
    async getAllCountries(): Promise<CountryData[]> {
        try {
            const response = await fetch(`${REST_COUNTRIES_API}/all?fields=cca2,name,capital,region`);
            if (!response.ok) throw new Error('Failed to fetch countries');

            const data: CountryResponse[] = await response.json();
            return data
                .map(country => ({
                    code: country.cca2,
                    name: country.name.common,
                    capital: country.capital?.[0] || '',
                    region: country.region || ''
                }))
                .sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
            console.error('Error fetching countries:', error);
            return getDefaultCountries();
        }
    },

    // Search countries by name
    async searchCountries(query: string): Promise<CountryData[]> {
        if (!query.trim()) {
            return this.getAllCountries();
        }

        try {
            const response = await fetch(`${REST_COUNTRIES_API}/name/${encodeURIComponent(query)}`);
            if (!response.ok) return [];

            const data: CountryResponse[] = await response.json();
            return data.map(country => ({
                code: country.cca2,
                name: country.name.common,
                capital: country.capital?.[0] || '',
                region: country.region || ''
            }));
        } catch (error) {
            console.error('Error searching countries:', error);
            return [];
        }
    },

    // Get country by code
    async getCountryByCode(code: string): Promise<CountryData | null> {
        try {
            const response = await fetch(`${REST_COUNTRIES_API}/alpha/${code}`);
            if (!response.ok) return null;

            const data: CountryResponse = await response.json();
            return {
                code: data.cca2,
                name: data.name.common,
                capital: data.capital?.[0] || '',
                region: data.region || ''
            };
        } catch (error) {
            console.error('Error fetching country:', error);
            return null;
        }
    }
};

// Default countries fallback
function getDefaultCountries(): CountryData[] {
    return [
        { code: 'GB', name: 'United Kingdom', capital: 'London', region: 'Europe' },
        { code: 'IN', name: 'India', capital: 'New Delhi', region: 'Asia' },
        { code: 'US', name: 'United States', capital: 'Washington', region: 'Americas' },
        { code: 'FR', name: 'France', capital: 'Paris', region: 'Europe' },
        { code: 'AE', name: 'United Arab Emirates', capital: 'Abu Dhabi', region: 'Asia' },
        { code: 'SG', name: 'Singapore', capital: 'Singapore', region: 'Asia' },
        { code: 'CA', name: 'Canada', capital: 'Ottawa', region: 'Americas' },
        { code: 'AU', name: 'Australia', capital: 'Canberra', region: 'Oceania' },
        { code: 'DE', name: 'Germany', capital: 'Berlin', region: 'Europe' },
        { code: 'JP', name: 'Japan', capital: 'Tokyo', region: 'Asia' },
    ];
}
