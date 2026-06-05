export const countryList = [
    { code: 'US', name: 'United States' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'SG', name: 'Singapore' },
    { code: 'JP', name: 'Japan' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'IN', name: 'India' },
];

export const filterCountries = (search: string) => {
    if (!search) return countryList;
    return countryList.filter(country =>
        country.code.toLowerCase().includes(search.toLowerCase()) ||
        country.name.toLowerCase().includes(search.toLowerCase())
    );
};

export const visaInitialState = {
    passportCountry: '',
    passportCountrySearch: '',
    showPassportDropdown: false,
    destination: '',
    destinationSearch: '',
    showDestinationDropdown: false,
    travelDate: '',
    visaType: 'tourist',
};

export type VisaState = typeof visaInitialState;
