# Tour Management API - Complete Implementation Guide

## Overview
Full RESTful API implementation for Tour management system with complete CRUD operations, image handling, and related data management.

---

## Architecture

### Backend Stack
- **Framework:** Laravel 11
- **API Style:** RESTful with Resource Routes
- **Authentication:** Laravel Sanctum (Bearer tokens)
- **Database:** Multi-table relational structure with cascade deletes
- **File Storage:** Public disk storage with organized directories

### Frontend Stack
- **Framework:** React with TypeScript
- **API Client:** Custom fetch-based service layer
- **State Management:** React Hooks (useState)
- **Error Handling:** Global 401 interceptor redirects to login

---

## API Endpoints Summary

### Base URL: `/api/tours`

```
GET    /api/tours              → List all tours (paginated)
POST   /api/tours              → Create new tour
GET    /api/tours/{id}         → Get single tour
PATCH  /api/tours/{id}         → Update tour
DELETE /api/tours/{id}         → Delete tour
```

### Authentication
All endpoints require: `Authorization: Bearer {token}`

---

## Database Schema

### Tours Table
```
Fields: tour_title, hero_title, hero_subtitle, short_description, 
        country, city, duration_days, start_date, end_date, status, 
        early_booking_price_text, feature_image, banner_images
Relations: hasMany(Highlights, Itineraries, KeyDestinations, TermsConditions)
```

### Related Tables
- **highlights** - Icon, title, description, sort order
- **itineraries** - Day, date, title, location, description, images array
- **key_destinations** - Destination name, location, description
- **terms_conditions** - Type (includes/excludes), policy text

---

## Implementation Files

### Backend Controllers & Services
```
✅ app/Http/Controllers/Api/TourController.php
   - index()    : List tours with filtering/pagination
   - store()    : Create new tour
   - show()     : Get single tour
   - update()   : Update existing tour
   - destroy()  : Delete tour

✅ app/Services/TourService.php
   - getAllTours()           : Fetch with filters
   - createTourWithRelations(): Create tour + all child records
   - updateTourWithRelations(): Update tour + sync child records
   - uploadImage()           : Handle image storage

✅ app/Http/Requests/StoreTourRequest.php
   - Validates all input fields
   - Custom error messages
   - File type/size validation
```

### Backend Models
```
✅ app/Models/Tour.php
✅ app/Models/Highlight.php
✅ app/Models/Itinerary.php
✅ app/Models/KeyDestination.php
✅ app/Models/TermsCondition.php
```

### Database Migrations
```
✅ database/migrations/2026_05_29_000001_create_tours_table.php (updated)
✅ database/migrations/2026_05_31_000001_create_highlights_table.php
✅ database/migrations/2026_05_31_000002_create_itineraries_table.php
✅ database/migrations/2026_05_31_000003_create_key_destinations_table.php
✅ database/migrations/2026_05_31_000004_create_terms_conditions_table.php
```

### Routes
```
✅ routes/api.php
   - Added: Route::resource('tours', TourController::class);
   - Middleware: auth:sanctum
```

### Frontend Services
```
✅ resources/js/services/tourService.ts
   - createTour(formData)                    : POST request
   - updateTour(id, formData)                : PATCH request
   - getTours(page, perPage, status, search) : GET with filters
   - getTour(id)                             : Get single tour
   - deleteTour(id)                          : DELETE request
```

### Frontend Components
```
✅ resources/js/pages/Admin/Tour/Create.tsx
   - Multi-step form (5 steps)
   - Form submission handler
   - Loading state indicator
   - Error/success messages
   - Auto-redirect on success
```

### API Client
```
✅ resources/js/lib/api.ts
   - apiFetch() : Custom fetch with 401 redirect
   - Global 401 handler redirects to /login
```

---

## Data Flow

### Creating a Tour

```
User fills form (5 steps)
    ↓
Click "Publish Tour" button
    ↓
publishTour() function triggered
    ↓
createTour(formData) service called
    ↓
FormData constructed with all nested arrays
    ↓
POST request to /api/tours
    ↓
TourController@store validates & stores
    ↓
TourService creates tour + all relations
    ↓
Images uploaded to storage/app/public/tours/
    ↓
Response returns created tour with all relations
    ↓
Success message shown
    ↓
Auto-redirect to /admin/tours after 1.5s
```

### Updating a Tour

Same flow as creation but:
- PATCH request to `/api/tours/{id}`
- updateTour() service method called
- Old images deleted before storing new ones
- Child records deleted and recreated

### Deleting a Tour

```
User clicks delete button
    ↓
Confirmation dialog
    ↓
deleteTour(id) service called
    ↓
DELETE request to /api/tours/{id}
    ↓
Tour and all related records cascade deleted
    ↓
Success message
```

---

## Form Submission Structure

### Frontend Data Structure
```typescript
{
  basic: {
    tourTitle, heroTitle, heroSubtitle, shortDescription,
    country, city, duration, startDate, endDate, bookingPrice,
    featuredImage, bannerImage, status
  },
  highlights: [
    { id, icon, title, description, sortOrder }
  ],
  itineraries: [
    { id, dayNumber, date, title, location, description, image }
  ],
  destinations: [
    { id, destinationName, location, description, image, sortOrder }
  ],
  termsConditions: {
    cancellationPolicy, paymentTerms, generalTerms
  }
}
```

### API Request Format
```
FormData with:
- tour_title, hero_title, ... (basic fields)
- highlights[0][title], highlights[0][description], ... (arrays)
- itineraries[0][day], itineraries[0][image], ... (with files)
- key_destinations[0][destination_name], ... (arrays)
- terms_conditions[0][type], terms_conditions[0][policy] (arrays)
- feature_image (single file)
- banner_images[] (array of files)
```

---

## Error Handling

### Frontend
```
API Response → Check status
    ↓
401 → Clear token + redirect to /login
422 → Show validation errors in form
500 → Display error message to user
200/201 → Process success response
```

### Backend
```
Request validation → StoreTourRequest rules
    ↓
Pass → Process tour creation/update
Fail → Return 422 with errors
    ↓
Any exception → Return 500 with message
```

---

## File Upload Handling

### Supported Formats
- jpg, jpeg, png, gif, webp

### Size Limits
- Individual file: 10MB max
- Feature image: 10MB
- Banner images: 10MB each
- Itinerary images: 10MB each

### Storage Path
```
storage/app/public/tours/
├── featured/
│   └── {timestamp}_{uniqid}.{ext}
├── banners/
│   └── {timestamp}_{uniqid}.{ext}
└── itineraries/
    └── {timestamp}_{uniqid}.{ext}
```

### API Response
Images returned as full URLs:
```
"feature_image": "/storage/tours/featured/1717145400_60f3e8.jpg"
```

---

## Authentication Flow

### Token-Based Authentication
1. Login endpoint returns token
2. Token stored in localStorage
3. ProtectedRoute checks for token on page load
4. apiFetch adds token to Authorization header
5. 401 responses clear token + redirect to /login

---

## Response Format

### List Response
```json
{
  "success": true,
  "message": "Tours retrieved successfully",
  "data": {
    "data": [...],
    "current_page": 1,
    "per_page": 15,
    "total": 50,
    "last_page": 4
  }
}
```

### Single Resource Response
```json
{
  "success": true,
  "message": "Tour created successfully",
  "data": {
    "id": 1,
    "tour_title": "...",
    "highlights": [...],
    "itineraries": [...],
    "key_destinations": [...],
    "terms_conditions": [...]
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "tour_title": ["Tour title is required"],
    "country": ["Country is required"]
  }
}
```

---

## Next Steps to Integrate

1. Run migrations:
   ```bash
   php artisan migrate
   ```

2. Create symbolic link for storage:
   ```bash
   php artisan storage:link
   ```

3. Test API endpoints with Postman/Insomnia

4. Update frontend Index.tsx to fetch tours from API

5. Create Edit.tsx page for editing existing tours

6. Add delete confirmation modal

---

## Testing Checklist

- [ ] Create tour via form
- [ ] Verify all data saved to database
- [ ] Check images uploaded to storage
- [ ] Verify relations created (highlights, itineraries, etc.)
- [ ] Test validation errors
- [ ] Test 401 redirect
- [ ] Update existing tour
- [ ] Delete tour
- [ ] List tours with pagination
- [ ] Filter by status
- [ ] Search functionality

---

## Code Comments

All files include comprehensive comments explaining:
- Function purpose and parameters
- Return types and structures
- Business logic flow
- Error handling approach
- Database operations

See individual files for detailed comments on each method.
