<?php

return [
    'types' => [
        [
            'id' => 'hotel',
            'name' => 'Hotel',
            'description' => 'Hotel booking and accommodation services',
        ],
        [
            'id' => 'visa',
            'name' => 'Visa',
            'description' => 'Visa and travel document services',
        ],
        [
            'id' => 'service',
            'name' => 'Service',
            'description' => 'General travel services',
        ],
        // Invoice types an agency can be given (Create Invoice follows the services it has)
        ['id' => 'flight', 'name' => 'Flight', 'description' => 'Flight tickets'],
        ['id' => 'insurance', 'name' => 'Insurance', 'description' => 'Travel insurance'],
        ['id' => 'sightseeing', 'name' => 'Local Sight Seen', 'description' => 'Local sightseeing tours'],
        ['id' => 'local_transport', 'name' => 'Local Transport', 'description' => 'Local transport and transfers'],
        ['id' => 'other', 'name' => 'Other Facilities', 'description' => 'Other travel facilities'],
        ['id' => 'car_rental', 'name' => 'Car Rental', 'description' => 'Car hire'],
    ],
];
