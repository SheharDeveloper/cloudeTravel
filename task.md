1. Tour Table

| Column Name              |                        Type | Description            |
| ------------------------ | --------------------------: | ---------------------- |
| id                       |                 bigint (PK) | Primary key            |
| tour_title               |                     varchar | Tour title             |
| hero_title               |                     varchar | Hero section title     |
| hero_subtitle            |              text / varchar | Hero subtitle          |
| short_description        |                        text | Short description      |
| country                  |                     varchar | Country name           |
| city                     |                     varchar | City name              |
| duration_days            |                     integer | Tour duration in days  |
| start_date               |                        date | Tour start date        |
| end_date                 |                        date | Tour end date          |
| status                   | enum(active,inactive,draft) | Tour status            |
| early_booking_price_text |                     varchar | Early booking text     |
| feature_image            |                     varchar | Feature image path     |
| banner_images            |                        json | Multiple banner images |
| created_at               |                   timestamp | Created date           |
| updated_at               |                   timestamp | Updated date           |


2. Highlights Table

| Column Name |        Type | Description             |
| ----------- | ----------: | ----------------------- |
| id          | bigint (PK) | Primary key             |
| tour_id     | bigint (FK) | Reference to tour table |
| title       |     varchar | Highlight title         |
| description |        text | Highlight description   |
| short_order |     integer | Display order           |
| created_at  |   timestamp | Created date            |
| updated_at  |   timestamp | Updated date            |


3. Itinerary Table

| Column Name |        Type | Description             |
| ----------- | ----------: | ----------------------- |
| id          | bigint (PK) | Primary key             |
| tour_id     | bigint (FK) | Reference to tour table |
| day         |     integer | Day number              |
| date        |        date | Travel date             |
| title       |     varchar | Itinerary title         |
| location    |     varchar | Location name           |
| description |    longText | Full description        |
| images      |        json | Multiple images         |
| short_order |     integer | Display order           |
| created_at  |   timestamp | Created date            |
| updated_at  |   timestamp | Updated date            |


4. Key Destinations Table

| Column Name      |        Type | Description             |
| ---------------- | ----------: | ----------------------- |
| id               | bigint (PK) | Primary key             |
| tour_id          | bigint (FK) | Reference to tour table |
| destination_name |     varchar | Destination name        |
| location         |     varchar | Destination location    |
| description      |        text | Destination description |
| created_at       |   timestamp | Created date            |
| updated_at       |   timestamp | Updated date            |


5. Terms & Conditions Table

| Column Name |                                             Type | Description               |
| ----------- | -----------------------------------------------: | ------------------------- |
| id          |                                      bigint (PK) | Primary key               |
| tour_id     |                                      bigint (FK) | Reference to tour table   |
| type        | enum(package_includes, package_does_not_include) | Policy type               |
| policy      |                                             text | Terms & condition content |
| created_at  |                                        timestamp | Created date              |
| updated_at  |                                        timestamp | Updated date              |



Relationship Structure
Tour
 ├── Highlights (One to Many)
 ├── Itinerary (One to Many)
 ├── Key Destinations (One to Many)
 └── Terms & Conditions (One to Many)


## API Implementation

### API Endpoints (Resource Routes)
All endpoints use Laravel Resource routing pattern. Base URL: `/api/tours`

#### Tour CRUD Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/api/tours` | List all tours with pagination & filtering | Yes |
| POST | `/api/tours` | Create new tour with all relations | Yes |
| GET | `/api/tours/{id}` | Get single tour with all relations | Yes |
| PUT/PATCH | `/api/tours/{id}` | Update tour with all relations | Yes |
| DELETE | `/api/tours/{id}` | Delete tour and all related data | Yes |

### Query Parameters for List Endpoint
- `page` - Page number (default: 1)
- `per_page` - Records per page (default: 15)
- `status` - Filter by status (active, inactive, draft)
- `search` - Search by tour title, country, or city

### Request/Response Format

#### Create Tour Request (POST /api/tours)
Content-Type: multipart/form-data

**Basic Fields:**
```json
{
  "tour_title": "string",
  "hero_title": "string",
  "hero_subtitle": "string (optional)",
  "short_description": "string (optional)",
  "country": "string",
  "city": "string",
  "duration_days": "integer",
  "start_date": "date (YYYY-MM-DD)",
  "end_date": "date (YYYY-MM-DD)",
  "status": "active|inactive|draft",
  "early_booking_price_text": "string (optional)",
  "feature_image": "file (image, max 10MB)",
  "banner_images[]": "file (image, max 10MB)"
}
```

**Highlights Array:**
```json
{
  "highlights": [
    {
      "title": "string",
      "description": "string (optional)",
      "short_order": "integer (optional)"
    }
  ]
}
```

**Itineraries Array:**
```json
{
  "itineraries": [
    {
      "day": "integer",
      "date": "date (YYYY-MM-DD)",
      "title": "string",
      "location": "string",
      "description": "string (optional)",
      "image": "file (image, optional, max 10MB)"
    }
  ]
}
```

**Key Destinations Array:**
```json
{
  "key_destinations": [
    {
      "destination_name": "string",
      "location": "string (optional)",
      "description": "string (optional)"
    }
  ]
}
```

**Terms & Conditions Array:**
```json
{
  "terms_conditions": [
    {
      "type": "package_includes|package_does_not_include",
      "policy": "string"
    }
  ]
}
```

#### Success Response (201 Created / 200 OK)
```json
{
  "success": true,
  "message": "Tour created/updated successfully",
  "data": {
    "id": 1,
    "tour_title": "...",
    "hero_title": "...",
    "country": "...",
    "city": "...",
    "duration_days": 12,
    "start_date": "2026-06-01",
    "end_date": "2026-06-12",
    "status": "active",
    "feature_image": "storage/tours/featured/...",
    "banner_images": ["storage/tours/banners/..."],
    "created_at": "2026-05-31T10:30:00Z",
    "updated_at": "2026-05-31T10:30:00Z",
    "highlights": [...],
    "itineraries": [...],
    "key_destinations": [...],
    "terms_conditions": [...]
  }
}
```

#### Error Response (422 Validation / 500 Server Error)
```json
{
  "success": false,
  "message": "Validation error|Error message",
  "errors": {
    "tour_title": ["Tour title is required"],
    "country": ["Country is required"]
  }
}
```

### Backend Implementation Files

**Controllers:**
- `app/Http/Controllers/Api/TourController.php` - CRUD operations with all methods
- Methods: index(), store(), show(), update(), destroy()
- All methods include error handling and validation

**Services:**
- `app/Services/TourService.php` - Business logic for tour operations
- Methods: 
  - `getAllTours()` - Get paginated tours with filtering
  - `createTourWithRelations()` - Create tour with all child records
  - `updateTourWithRelations()` - Update tour with all child records
  - `uploadImage()` - Handle image uploads to storage

**Requests:**
- `app/Http/Requests/StoreTourRequest.php` - Input validation rules
- Validates all fields including file types and sizes
- Custom error messages for better UX

**Routes:**
- `routes/api.php` - Resource route registered
- `Route::resource('tours', TourController::class);`
- Automatically creates: index, store, show, update, destroy

**Models:**
- `app/Models/Tour.php` - Main tour model with relationships
- `app/Models/Highlight.php` - Highlight model (belongs to Tour)
- `app/Models/Itinerary.php` - Itinerary model (belongs to Tour)
- `app/Models/KeyDestination.php` - Destination model (belongs to Tour)
- `app/Models/TermsCondition.php` - Terms & Conditions model (belongs to Tour)

### Frontend Implementation Files

**Services:**
- `resources/js/services/tourService.ts` - API client functions
- Functions:
  - `createTour(formData)` - POST /api/tours
  - `updateTour(id, formData)` - PATCH /api/tours/{id}
  - `getTours(page, perPage, status, search)` - GET /api/tours
  - `getTour(id)` - GET /api/tours/{id}
  - `deleteTour(id)` - DELETE /api/tours/{id}

**Components:**
- `resources/js/pages/Admin/Tour/Create.tsx` - Multi-step tour creation form
- Handles form submission via tourService
- Shows loading state and error/success messages
- Auto-redirects to tours list on success

### Authentication
All endpoints require Sanctum authentication with `auth:sanctum` middleware
- Include Bearer token in Authorization header
- Token obtained from login endpoint
- Invalid/expired tokens redirect to /login automatically

### Image Handling
- Images stored in `storage/app/public/tours/` directory
- Subdirectories: featured/, banners/, itineraries/
- Maximum file size: 10MB
- Supported formats: jpg, jpeg, png, gif, webp
- Auto-delete old images on update
- Returned as full URLs in API response

### Error Codes
- `422` - Validation error (check errors field)
- `401` - Unauthenticated (redirect to login)
- `403` - Unauthorized
- `500` - Server error