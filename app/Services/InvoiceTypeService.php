<?php

namespace App\Services;

use App\Models\AgencyUser;
use Illuminate\Support\Facades\Auth;

/**
 * Invoices: the invoice types, and what the signed-in session may do.
 *
 * - The superadmin may do everything and create every type.
 * - An agency's invoice actions (Invoice List, View, Create, Edit, Amendment,
 *   Cancel, Refund, Pay) are permissions the superadmin ticks for it
 *   (Agencies → the agency → Permissions → Invoice). Its staff need the same
 *   permissions through their own role.
 * - Which types an agency may create follows the services the superadmin
 *   assigned to it (Visa, Hotel, Flight…), like Visa always has.
 */
class InvoiceTypeService
{
    /** Every invoice type, in the order of the Service Type list (each is also an agency service). */
    public const TYPES_LABELS = [
        'flight' => 'Flight', 'visa' => 'Visa Services', 'hotel' => 'Hotel', 'insurance' => 'Insurance',
        'sightseeing' => 'Local Sight Seen', 'local_transport' => 'Local Transport', 'other' => 'Other Facilities', 'car_rental' => 'Car Rental',
    ];

    /** The invoice actions, as permissions (invoice.<action>) and how the agency page names them. */
    public const ACTIONS = [
        'list' => 'Invoice List',
        'view' => 'View Invoice',
        'create' => 'Create Invoice',
        'edit' => 'Edit Invoice',
        'amendment' => 'Amendment',
        'cancel' => 'Cancel',
        'refund' => 'Refund',
        'pay' => 'Pay',
    ];

    /** Every invoice permission (seeded on both guards). */
    public static function permissionNames(): array
    {
        return array_map(fn ($action) => "invoice.{$action}", array_keys(self::ACTIONS));
    }

    /** Whether the session may do this invoice action ("list", "edit"…). */
    public function can(string $action): bool
    {
        return $this->isSuperadmin() || in_array("invoice.{$action}", $this->permissions(), true);
    }

    /** action => allowed, for the page. */
    public function abilities(): array
    {
        return collect(array_keys(self::ACTIONS))->mapWithKeys(fn ($a) => [$a => $this->can($a)])->all();
    }

    /** type => label: the invoice types this session may create (none without "Create Invoice"). */
    public function allowedTypes(): array
    {
        if ($this->isSuperadmin()) {
            return self::TYPES_LABELS;
        }
        if (! $this->can('create')) {
            return [];
        }

        // An agency: the services the superadmin assigned to it
        $agency = Auth::guard('agency')->user()?->agency;
        if (! $agency) {
            return self::TYPES_LABELS;
        }
        $services = $agency->agencyServices()->where('status', 1)->pluck('service_name')->all();

        return array_intersect_key(self::TYPES_LABELS, array_flip($services));
    }

    private function isSuperadmin(): bool
    {
        return ! Auth::guard('agency')->check()
            && (bool) Auth::guard('web')->user()?->hasRole('superadmin');
    }

    /**
     * The session's permissions — as the sidebar sees them: the agency's own
     * for its owner login, a staff member's from their role.
     */
    private function permissions(): array
    {
        $agencyUser = Auth::guard('agency')->user();
        if ($agencyUser instanceof AgencyUser) {
            return $agencyUser->is_owner
                ? $agencyUser->agency->permissions->pluck('name')->all()
                : $agencyUser->getAllPermissions()->pluck('name')->all();
        }

        return Auth::guard('web')->user()?->getAllPermissions()->pluck('name')->all() ?? [];
    }
}
