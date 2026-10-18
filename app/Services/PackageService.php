<?php

namespace App\Services;

use App\Models\Package;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/** Packages (admin): the list, and adding, changing and deleting a package with its image. */
class PackageService
{
    /** Every package, newest first. */
    public function all()
    {
        return Package::orderByDesc('created_at')->get();
    }

    public function create(array $data, ?UploadedFile $image): Package
    {
        if ($image) {
            $data['image'] = $this->storeImage($image);
        }

        return Package::create($data);
    }

    /** Saves the changes; a new image replaces the old one (the old file is removed). */
    public function update(Package $package, array $data, ?UploadedFile $image): Package
    {
        unset($data['image']);
        if ($image) {
            $old = $package->image;
            $data['image'] = $this->storeImage($image);
            $this->deleteImage($old);
        }

        $package->update($data);

        return $package;
    }

    /** Soft-deletes the package; its image is kept so the package can still be restored. */
    public function delete(Package $package): void
    {
        $package->delete();
    }

    private function storeImage(UploadedFile $image): string
    {
        return '/storage/' . $image->store('packages', 'public');
    }

    private function deleteImage(?string $url): void
    {
        if ($url && str_starts_with($url, '/storage/')) {
            Storage::disk('public')->delete(substr($url, strlen('/storage/')));
        }
    }
}
