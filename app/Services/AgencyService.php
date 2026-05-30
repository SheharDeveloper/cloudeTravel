<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AgencyService
{
    public function getAllAgencies()
    {
        return Agency::with('user', 'agencyDocuments')->paginate(15);
    }

    public function getAgencyById(int $id)
    {
        return Agency::with('user', 'agencyDocuments.documents')->findOrFail($id);
    }

    public function createAgency(array $data)
    {
        // Create a user for the agency
        $user = User::create([
            'name' => $data['agency_name'],
            'email' => $data['email'],
            'password' => Hash::make('agency'),
            'phone_number' => $data['phone_number'],
            'type' => 'agency',
            'parent_id' => $data['user_id'],
        ]);

        // Create the agency with the created user
        $data['user_id'] = $user->id;
        return Agency::create($data);
    }

    public function updateAgency(int $id, array $data)
    {
        $agency = Agency::findOrFail($id);
        $agency->update($data);
        return $agency;
    }

    public function deleteAgency(int $id)
    {
        $agency = Agency::findOrFail($id);
        return $agency->delete();
    }

    public function getAgenciesByUser(int $userId)
    {
        return Agency::where('user_id', $userId)->with('agencyDocuments')->get();
    }
}
