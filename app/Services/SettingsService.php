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
