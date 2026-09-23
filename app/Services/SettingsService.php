<?php

namespace App\Services;

use App\Models\Setting;

class SettingsService
{
    public function getIsreviewEnabled()
    {
        return Setting::get('isreview', 'active') === 'active';
    }

    public function setIsreviewEnabled($enabled)
    {
        $value = $enabled ? 'active' : 'inactive';
        return Setting::set('isreview', $value);
    }

    /**
     * The country whose currency Tax Setup price values are entered in.
     * Other countries' amounts are converted from this via exchange_rate.
     */
    public function getDefaultTaxCountryId()
    {
        $value = Setting::get('default_tax_country_id');

        return $value ? (int) $value : null;
    }

    public function setDefaultTaxCountryId($countryId)
    {
        return Setting::set('default_tax_country_id', $countryId);
    }

    public function getAll()
    {
        return [
            'isreview' => $this->getIsreviewEnabled(),
        ];
    }

    public function update($data)
    {
        if (isset($data['isreview'])) {
            $this->setIsreviewEnabled($data['isreview']);
        }

        return $this->getAll();
    }
}
