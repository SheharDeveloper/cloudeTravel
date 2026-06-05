export const hotelCityList = [
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

export const filterHotelCities = (search: string) => {
    if (!search) return hotelCityList;
    return hotelCityList.filter(city =>
        city.code.toLowerCase().includes(search.toLowerCase()) ||
        city.name.toLowerCase().includes(search.toLowerCase())
    );
};

export const hotelInitialState = {
    city: '',
    citySearch: '',
    showCityDropdown: false,
    checkInDate: '',
    checkOutDate: '',
    rooms: 1,
    guests: 1,
};

export type HotelState = typeof hotelInitialState;
