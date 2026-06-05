export const cityList = [
    { code: 'LON', name: 'London' },
    { code: 'DEL', name: 'Delhi' },
    { code: 'BOM', name: 'Mumbai' },
    { code: 'NYC', name: 'New York' },
    { code: 'LAX', name: 'Los Angeles' },
    { code: 'CDG', name: 'Paris' },
    { code: 'LHR', name: 'London Heathrow' },
    { code: 'DXB', name: 'Dubai' },
    { code: 'SIN', name: 'Singapore' },
    { code: 'HND', name: 'Tokyo' },
    { code: 'IXC', name: 'Chandigarh' },
];

export const filterCities = (search: string) => {
    if (!search) return cityList;
    return cityList.filter(city =>
        city.code.toLowerCase().includes(search.toLowerCase()) ||
        city.name.toLowerCase().includes(search.toLowerCase())
    );
};

export const flightInitialState = {
    tripType: 'roundtrip',
    showTravellerModal: false,
    adults: 1,
    children: 0,
    infants: 0,
    selectedClass: 'Economy',
    fromCity: '',
    toCity: '',
    fromSearch: '',
    toSearch: '',
    showFromDropdown: false,
    showToDropdown: false,
    departureDate: '',
    returnDate: '',
    specialFares: [] as string[],
    freeCancellation: false,
};

export type FlightState = typeof flightInitialState;
