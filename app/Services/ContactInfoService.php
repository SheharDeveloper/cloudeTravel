<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\AgencyUser;
use App\Models\ContactInfo;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ContactInfoService
{
    /**
     * Whoever is signed in right now (agency staff or superadmin), or null
     * for an anonymous visitor on the public site.
     */
    public function currentOwner(): Agency|User|null
    {
        $agencyUser = Auth::guard('agency')->user();
        if ($agencyUser instanceof AgencyUser) {
            return $agencyUser->agency;
        }

        return Auth::guard('web')->user();
    }

    /**
     * The agency that owns the domain a visitor is currently on.
     */
    private function viewingAgency(): ?Agency
    {
        $tenant = request()->attributes->get('tenant');

        return $tenant ? Agency::where('tenant_id', $tenant->id)->first() : null;
    }

    /**
     * The shared loader video shown while the site is loading, used only
     * for the superadmin — agencies with no video of their own get a
     * spinner instead (see the frontend), never this shared file.
     */
    private const DEFAULT_LOADER_VIDEO = '/images/loader.mp4';

    /**
     * Get contact info.
     * - Signed in (admin context): this agency's own record (or the
     *   superadmin's own, for the global/default record).
     * - Anonymous (public site): the viewing agency's own record if it has
     *   one. If it doesn't, we deliberately do NOT fall back to the
     *   superadmin's address/phone/email/socials/about/loader video —
     *   showing another business's identity on this agency's site would be
     *   misleading.
     * In both cases, an agency with no ContactInfo record yet (created
     * before this record was auto-seeded on agency creation) falls back to
     * the basic details already entered on its own agency profile, rather
     * than showing nothing.
     */
    public function getInfo(): ?ContactInfo
    {

        if ($owner = $this->currentOwner()) {
             $contact = ContactInfo::where('owner_type', get_class($owner))->where('owner_id', $owner->id)->first();

            if ($owner instanceof Agency) {
                return $contact ? $this->withAgencyLogoFallback($contact, $owner) : $this->defaultsFromAgency($owner);
            }

            return $this->withDefaultLoaderVideo($contact);
        }


        $agency = $this->viewingAgency();

        if ($agency) {
            $own = ContactInfo::where('owner_type', Agency::class)->where('owner_id', $agency->id)->first();

            return $own
                ? $this->withAgencyLogoFallback($own, $agency)
                : $this->defaultsFromAgency($agency);
        }

        return $this->withDefaultLoaderVideo(ContactInfo::where('owner_type', User::class)->first());
    }

    /**
     * A specific agency's contact info, for the superadmin managing it
     * directly (e.g. from the agency detail page) rather than via session.
     */
    public function getInfoForOwner(Agency $agency): ?ContactInfo
    {
        $contact = ContactInfo::where('owner_type', Agency::class)->where('owner_id', $agency->id)->first();

        return $contact ? $this->withAgencyLogoFallback($contact, $agency) : $this->defaultsFromAgency($agency);
    }

    /**
     * A non-persisted ContactInfo built from the Agency's own basic fields,
     * used whenever no ContactInfo record exists yet for it — so the public
     * site and the admin edit form show this agency's real details instead
     * of a blank record.
     */
    private function defaultsFromAgency(Agency $agency): ContactInfo
    {
        $location = implode(', ', array_filter([$agency->city, $agency->state, $agency->country]));

        return new ContactInfo([
            'email' => $agency->email,
            'phone' => $agency->phone_number,
            'location' => $location,
            'address' => $agency->address,
            'logo' => $agency->logo,
        ]);
    }

    /**
     * Seed a default contact info record from the details already entered
     * on the agency form, so there's something to edit right away instead
     * of an empty record.
     */
    public function createDefaultForAgency(Agency $agency): ContactInfo
    {
        $data = $this->defaultsFromAgency($agency)->toArray();
        unset($data['logo']);

        return ContactInfo::create([
            'owner_type' => Agency::class,
            'owner_id' => $agency->id,
            ...$data,
        ]);
    }

    /**
     * An agency's own uploaded brand logo (the one already shown on its
     * login page) is more likely to exist than a separate ContactInfo
     * upload, so use it whenever ContactInfo doesn't have its own logo.
     */
    private function withAgencyLogoFallback(?ContactInfo $contact, Agency $agency): ?ContactInfo
    {
        if ($contact && !$contact->logo && $agency->logo) {
            $contact->logo = $agency->logo;
        }

        return $contact;
    }

    /**
     * Only the superadmin gets the shared default loader video when it
     * hasn't uploaded its own — agencies never do (see getInfo()).
     */
    private function withDefaultLoaderVideo(?ContactInfo $contact): ?ContactInfo
    {
        if ($contact && !$contact->loader_video) {
            $contact->loader_video = self::DEFAULT_LOADER_VIDEO;
        }

        return $contact;
    }

    /**
     * Save or update a contact info record. Defaults to this admin
     * session's own record; pass $owner to target a specific agency
     * instead (e.g. superadmin editing an agency's record directly).
     */
    public function save(array $data, Agency|User|null $owner = null): ContactInfo
    {
        $owner = $owner ?? $this->currentOwner();
        $contact = $owner
            ? ContactInfo::where('owner_type', get_class($owner))->where('owner_id', $owner->id)->first()
            : null;

        // Handle logo file upload
        if (isset($data['logo']) && is_object($data['logo'])) {
            // Delete old file if exists
            if ($contact && $contact->logo && strpos($contact->logo, 'storage/') !== false) {
                $oldPath = str_replace('/storage/', '', $contact->logo);
                Storage::disk('public')->delete($oldPath);
            }
            $file = $data['logo'];
            $path = $file->store('contact', 'public');
            $data['logo'] = Storage::url($path);
        } else if (!isset($data['logo']) && $contact) {
            // Keep existing logo if no file uploaded
            unset($data['logo']);
        }

        // Handle get_in_touch_image file upload
        if (isset($data['get_in_touch_image']) && is_object($data['get_in_touch_image'])) {
            // Delete old file if exists
            if ($contact && $contact->get_in_touch_image && strpos($contact->get_in_touch_image, 'storage/') !== false) {
                $oldPath = str_replace('/storage/', '', $contact->get_in_touch_image);
                Storage::disk('public')->delete($oldPath);
            }
            $file = $data['get_in_touch_image'];
            $path = $file->store('contact', 'public');
            $data['get_in_touch_image'] = Storage::url($path);
        } else if (!isset($data['get_in_touch_image']) && $contact) {
            // Keep existing image if no file uploaded
            unset($data['get_in_touch_image']);
        }

        // Handle loader_video file upload
        if (isset($data['loader_video']) && is_object($data['loader_video'])) {
            // Delete old file if exists
            if ($contact && $contact->loader_video && strpos($contact->loader_video, 'storage/') !== false) {
                $oldPath = str_replace('/storage/', '', $contact->loader_video);
                Storage::disk('public')->delete($oldPath);
            }
            $file = $data['loader_video'];
            $path = $file->store('contact', 'public');
            $data['loader_video'] = Storage::url($path);
        } else if (!isset($data['loader_video']) && $contact) {
            // Keep existing video if no file uploaded
            unset($data['loader_video']);
        }

        if ($contact) {
            $contact->update($data);
        } else {
            if ($owner) {
                $data['owner_type'] = get_class($owner);
                $data['owner_id'] = $owner->id;
            }
            $contact = ContactInfo::create($data);
        }

        return $contact;
    }
}
