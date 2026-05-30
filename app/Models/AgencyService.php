<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * AgencyService Model
 * Represents a service assigned to an agency/user
 *
 * Attributes:
 * - user_id: ID of the user/agency
 * - service_name: Name of the service (e.g., "Hotel Booking", "Flight Booking")
 * - status: Service status (Active or Inactive)
 * - timestamps: created_at and updated_at
 */
class AgencyService extends Model
{
    protected $fillable = ['user_id', 'service_name', 'status'];

    /**
     * Get the user who owns this service
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
