<?php

namespace App\Services;

use App\Models\PublicDocument;
use App\Models\Setting;

class HomeService
{
    public function getHomeData()
    {
        $documents = PublicDocument::where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->get();

        $isreviewEnabled = Setting::get('isreview', 'active') === 'active';

        return [
            'documents' => $documents,
            'isreviewEnabled' => $isreviewEnabled,
        ];
    }
}
