export const airlineService = {
    baseUrl: 'https://api.aviationstack.com/v1',
    accessKey: import.meta.env.VITE_AVIATIONSTACK_API_KEY,

    async getAirlines(limit: number = 20, offset: number = 0) {
        try {
            const response = await fetch(
                `${this.baseUrl}/airlines?access_key=${this.accessKey}&limit=${limit}&offset=${offset}`
            );
            const data = await response.json();

            if (data.data) {
                return data.data.map((airline: any) => ({
                    id: airline.airline_id,
                    name: airline.airline_name,
                    iata: airline.iata_code,
                    icao: airline.icao_code,
                    country: airline.country_name,
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching airlines:', error);
            return [];
        }
    },

    async getAirlinesByCountry(country: string, limit: number = 20) {
        try {
            const response = await fetch(
                `${this.baseUrl}/airlines?access_key=${this.accessKey}&airline_country=${country}&limit=${limit}`
            );
            const data = await response.json();

            if (data.data) {
                return data.data.map((airline: any) => ({
                    id: airline.airline_id,
                    name: airline.airline_name,
                    iata: airline.iata_code,
                    icao: airline.icao_code,
                    country: airline.country_name,
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching airlines by country:', error);
            return [];
        }
    },
};
