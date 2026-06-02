<?php

namespace App\Services;

use App\Models\Tour;
use App\Models\Highlight;
use App\Models\Itinerary;
use App\Models\KeyDestination;
use App\Models\TermsCondition;
use Illuminate\Support\Facades\Storage;
use Illuminate\Pagination\Paginator;

class TourService
{
    /**
     * Retrieve all tours with optional filtering and pagination
     *
     * @param int $page - Page number for pagination
     * @param int $perPage - Number of records per page
     * @param string|null $status - Filter by tour status (active, inactive, draft)
     * @param string|null $search - Search term for tour title or country
     * @param mixed $featured - Filter by featured status (1/true for featured, 0/false for non-featured)
     * @return array - Paginated tours data
     */
    public function getAllTours(int $page = 1, int $perPage = 15, ?string $status = null, ?string $search = null, $featured = null)
    {
        $query = Tour::query();

        // Apply status filter if provided
        if ($status) {
            $query->where('status', $status);
        }

        // Apply featured filter if provided
        if ($featured !== null) {
            $query->where('featured', in_array($featured, [1, '1', true, 'true'], true) ? 1 : 0);
        }

        // Apply search filter if provided
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('tour_title', 'like', "%{$search}%")
                  ->orWhere('country', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        // Paginate results
        return $query->orderBy('created_at', 'desc')->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Create a new tour with all related records
     * Handles image uploads and creates child records for highlights, itineraries, destinations, and T&Cs
     *
     * @param array $data - Tour data including relations
     * @return Tour - Created tour with all relationships
     */
    public function createTourWithRelations(array $data): Tour
    {
        // Extract relations from data
        $highlights = $data['highlights'] ?? [];
        $itineraries = $data['itineraries'] ?? [];
        $keyDestinations = $data['key_destinations'] ?? [];
        $termsConditions = $data['terms_conditions'] ?? [];

        // Remove relations from data to prepare for tour creation
        unset($data['highlights'], $data['itineraries'], $data['key_destinations'], $data['terms_conditions']);

        // Handle feature image upload
        if (isset($data['feature_image'])) {
            $data['feature_image'] = $this->uploadImage($data['feature_image'], 'tours/featured');
        }

        // Handle banner images upload (array)
        if (isset($data['banner_images']) && is_array($data['banner_images'])) {
            $bannerPaths = [];
            foreach ($data['banner_images'] as $image) {
                $bannerPaths[] = $this->uploadImage($image, 'tours/banners');
            }
            $data['banner_images'] = $bannerPaths;
        }

        // Create the tour
        $tour = Tour::create($data);

        // Create related highlights
        if (!empty($highlights)) {
            foreach ($highlights as $highlight) {
                $tour->highlights()->create([
                    'title' => $highlight['title'],
                    'description' => $highlight['description'] ?? null,
                    'short_order' => $highlight['short_order'] ?? 0,
                ]);
            }
        }

        // Create related itineraries
        if (!empty($itineraries)) {
            foreach ($itineraries as $itinerary) {
                $itineraryData = [
                    'day' => $itinerary['day'],
                    'date' => $itinerary['date'],
                    'title' => $itinerary['title'],
                    'location' => $itinerary['location'],
                    'description' => $itinerary['description'] ?? null,
                    'short_order' => $itinerary['short_order'] ?? 0,
                ];

                // Handle itinerary image upload
                if (isset($itinerary['image'])) {
                    $itineraryData['images'] = json_encode([
                        $this->uploadImage($itinerary['image'], 'tours/itineraries')
                    ]);
                }

                $tour->itineraries()->create($itineraryData);
            }
        }

        // Create related key destinations
        if (!empty($keyDestinations)) {
            foreach ($keyDestinations as $destination) {
                $tour->keyDestinations()->create([
                    'destination_name' => $destination['destination_name'],
                    'location' => $destination['location'] ?? null,
                    'description' => $destination['description'] ?? null,
                ]);
            }
        }

        // Create related terms and conditions
        if (!empty($termsConditions)) {
            foreach ($termsConditions as $tc) {
                $tour->termsConditions()->create([
                    'type' => $tc['type'],
                    'policy' => $tc['policy'],
                ]);
            }
        }

        // Return tour with all loaded relationships
        return $tour->load(['highlights', 'itineraries', 'keyDestinations', 'termsConditions']);
    }

    /**
     * Update an existing tour with all related records
     * Handles image uploads and syncs child records for highlights, itineraries, destinations, and T&Cs
     *
     * @param Tour $tour - Tour model to update
     * @param array $data - Updated tour data including relations
     * @return Tour - Updated tour with all relationships
     */
    public function updateTourWithRelations(Tour $tour, array $data): Tour
    {
        // Extract relations from data
        $highlights = $data['highlights'] ?? [];
        $itineraries = $data['itineraries'] ?? [];
        $keyDestinations = $data['key_destinations'] ?? [];
        $termsConditions = $data['terms_conditions'] ?? [];

        // Remove relations from data to prepare for tour update
        unset($data['highlights'], $data['itineraries'], $data['key_destinations'], $data['terms_conditions']);

        // Handle feature image upload
        if (isset($data['feature_image'])) {
            // Delete old image if exists
            if ($tour->feature_image) {
                Storage::disk('public')->delete($tour->feature_image);
            }
            $data['feature_image'] = $this->uploadImage($data['feature_image'], 'tours/featured');
        }

        // Handle banner images upload (array)
        if (isset($data['banner_images']) && is_array($data['banner_images'])) {
            $bannerPaths = [];
            foreach ($data['banner_images'] as $image) {
                $bannerPaths[] = $this->uploadImage($image, 'tours/banners');
            }
            $data['banner_images'] = $bannerPaths;
        }

        // Update the tour
        $tour->update($data);

        // Sync highlights (delete old and create new ones)
        $tour->highlights()->delete();
        if (!empty($highlights)) {
            foreach ($highlights as $highlight) {
                $tour->highlights()->create([
                    'title' => $highlight['title'],
                    'description' => $highlight['description'] ?? null,
                    'short_order' => $highlight['short_order'] ?? 0,
                ]);
            }
        }

        // Sync itineraries
        $tour->itineraries()->delete();
        if (!empty($itineraries)) {
            foreach ($itineraries as $itinerary) {
                $itineraryData = [
                    'day' => $itinerary['day'],
                    'date' => $itinerary['date'],
                    'title' => $itinerary['title'],
                    'location' => $itinerary['location'],
                    'description' => $itinerary['description'] ?? null,
                    'short_order' => $itinerary['short_order'] ?? 0,
                ];

                // Handle itinerary image upload
                if (isset($itinerary['image'])) {
                    $itineraryData['images'] = json_encode([
                        $this->uploadImage($itinerary['image'], 'tours/itineraries')
                    ]);
                }

                $tour->itineraries()->create($itineraryData);
            }
        }

        // Sync key destinations
        $tour->keyDestinations()->delete();
        if (!empty($keyDestinations)) {
            foreach ($keyDestinations as $destination) {
                $tour->keyDestinations()->create([
                    'destination_name' => $destination['destination_name'],
                    'location' => $destination['location'] ?? null,
                    'description' => $destination['description'] ?? null,
                ]);
            }
        }

        // Sync terms and conditions
        $tour->termsConditions()->delete();
        if (!empty($termsConditions)) {
            foreach ($termsConditions as $tc) {
                $tour->termsConditions()->create([
                    'type' => $tc['type'],
                    'policy' => $tc['policy'],
                ]);
            }
        }

        // Return tour with all loaded relationships
        return $tour->load(['highlights', 'itineraries', 'keyDestinations', 'termsConditions']);
    }

    /**
     * Handle image upload to storage and return file path
     * Stores images in public disk under specified directory
     *
     * @param mixed $file - The uploaded file object
     * @param string $directory - Directory path relative to storage/app/public
     * @return string - Relative file path to the uploaded image
     */
    private function uploadImage($file, string $directory = 'tours'): string
    {
        // Generate unique filename with timestamp
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

        // Store file in public disk
        $path = Storage::disk('public')->putFileAs($directory, $file, $filename);

        return $path;
    }
}
