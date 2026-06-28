# CloudTravel Testing Guide

## Overview
This guide explains how to run automated tests for CloudTravel using Playwright and verify API authentication.

## What's Been Added

### 1. API Service (`resources/js/services/apiService.ts`)
A centralized API service that handles all API requests with:
- ✅ Automatic token-based authentication
- ✅ Bearer token in Authorization header
- ✅ Error handling and 401 redirect
- ✅ Helper methods for common operations (GET, POST, PATCH, DELETE)
- ✅ Booking-specific methods

**Usage:**
```typescript
import apiService from '@/services/apiService';

// Get bookings with authentication
const bookings = await apiService.getBookings({ page: 1 });

// Get single booking
const booking = await apiService.getBooking(uid);

// Check if authenticated
if (apiService.isAuthenticated()) {
  console.log('User is logged in');
}
```

### 2. Playwright Configuration (`playwright.config.ts`)
- ✅ Configured to run tests against http://127.0.0.1:8000
- ✅ Screenshots on failure
- ✅ Video recording on failure
- ✅ Automatic server startup for tests
- ✅ JSON test results

### 3. E2E Tests (`tests/e2e/booking-and-auth.spec.ts`)
Comprehensive test suite covering:

#### Test 1: Login Flow and Authentication
- Tests login page functionality
- Verifies auth_token is saved to localStorage
- Takes screenshots of login process

#### Test 2: Admin Bookings Page Access
- Logs in user
- Accesses admin bookings page
- Verifies API requests include Authorization header
- Takes screenshots of bookings page

#### Test 3: Visa Booking Modal and Form Submission
- Navigates to visa services
- Clicks on visa detail page
- Fills and submits booking form
- Verifies booking modal appears
- Takes screenshots of the entire flow

#### Test 4: Sidebar Navigation and Route Protection
- Verifies protected routes redirect to login
- Tests access after authentication
- Takes screenshots of protected route behavior

#### Test 5: API Authentication Verification
- Makes unauthenticated API request (should return 302)
- Makes authenticated API request (should return 200)
- Verifies Authorization header format

## Running Tests

### Prerequisites
1. Application must be running: `npm run dev`
2. Database must be seeded with test user
3. Test user credentials (configure in test file):
   - Email: `admin@example.com`
   - Password: `password`

### Run All Tests
```bash
npm run test:e2e
```

### Run Tests with UI
```bash
npm run test:e2e:ui
```

### Debug Mode
```bash
npm run test:e2e:debug
```

### View Test Report
```bash
npm run test:e2e:report
```

## Test Results

### Screenshots Location
All screenshots are saved to: `D:\AIproject\cloudtravel\testcaseandimage\`

Test images include:
- `01-login-page.png` - Initial login page
- `02-login-form-filled.png` - Filled login form
- `03-dashboard-after-login.png` - Dashboard after successful login
- `04-admin-bookings-page.png` - Admin bookings list
- `05-bookings-table.png` - Bookings data table
- `06-visa-services.png` - Visa services page
- `07-visa-detail-page.png` - Visa detail page
- `08-visa-search-form.png` - Visa search form
- `09-booking-modal.png` - Booking modal popup
- `10-booking-form-filled.png` - Filled booking form
- `11-booking-success.png` - Success message
- `12-protected-route-redirect.png` - Protected route redirect to login
- `13-admin-access-granted.png` - Admin access after login
- `14-api-auth-success.png` - API authentication success

### Video Recordings
Videos are saved when tests fail (in `test-results/` directory).

## API Security Implementation

### Routes Protected
✅ **GET** `/api/bookings` - Requires authentication
✅ **GET** `/api/bookings/{uid}` - Requires authentication  
✅ **PATCH** `/api/bookings/{uid}` - Requires authentication
✅ **GET** `/api/bookings/{uid}/notes` - Requires authentication
✅ **POST** `/api/bookings/{uid}/notes` - Requires authentication
✅ **DELETE** `/api/bookings/{uid}/notes/{id}` - Requires authentication

### Routes Public
✅ **POST** `/api/bookings` - Public (for booking form submission)
✅ **POST** `/auth/login` - Public (for user login)

### Admin Routes Protected
✅ All `/admin/*` routes now require authentication
- Unauthenticated users are redirected to `/auth/login`

## Authentication Flow

### Login Process
1. User visits `/auth/login`
2. Submits credentials via `/api/auth/login` (public endpoint)
3. Server returns `auth_token` and user data
4. Token is stored in `localStorage` as `auth_token`
5. Token is automatically sent in all API requests via `Authorization: Bearer {token}` header

### API Requests
All API requests automatically include:
```
Authorization: Bearer {auth_token}
X-CSRF-TOKEN: {csrf_token}
Accept: application/json
Content-Type: application/json
```

### Session Management
- Token stored in `localStorage['auth_token']`
- Automatically cleared on 401 response
- User redirected to login on unauthorized access

## Example: Using API Service

```typescript
import apiService from '@/services/apiService';

// Check if user is authenticated
if (!apiService.isAuthenticated()) {
  window.location.href = '/auth/login';
}

// Get all bookings
try {
  const response = await apiService.getBookings({ page: 1 });
  console.log('Bookings:', response.data);
} catch (error) {
  console.error('Failed to fetch bookings:', error);
}

// Get specific booking
try {
  const booking = await apiService.getBooking('55c09328-35af-491a-a53e-19098d34d882');
  console.log('Booking:', booking.booking);
} catch (error) {
  console.error('Failed to fetch booking:', error);
}

// Add booking note
try {
  const note = await apiService.addBookingNote(bookingId, 'Customer followed up');
  console.log('Note added:', note);
} catch (error) {
  console.error('Failed to add note:', error);
}
```

## Troubleshooting

### Tests Getting 302 Redirect
- Verify the test user exists in database
- Check that auth_token is properly stored in localStorage
- Ensure apiFetch helper is being used, not plain fetch()

### API Requests Not Including Token
- Verify `auth_token` exists in localStorage
- Check browser console for token-related logs
- Ensure page used `apiFetch` instead of plain `fetch()`

### Protected Routes Still Accessible
- Clear browser cache and localStorage
- Verify `auth` middleware is applied to admin routes
- Check that `ProtectedRoute` component is used on pages

## Next Steps

1. Update all admin page components to use `apiService`
2. Add more comprehensive E2E tests for other features
3. Set up CI/CD pipeline to run tests on each commit
4. Configure test results reporting in CI system

## Files Modified/Created

### Created
- `resources/js/services/apiService.ts` - Centralized API service
- `playwright.config.ts` - Playwright configuration
- `tests/e2e/booking-and-auth.spec.ts` - E2E test suite
- `TESTING_GUIDE.md` - This file

### Modified
- `routes/web.php` - Added auth middleware to admin routes
- `routes/api.php` - Protected booking endpoints
- `package.json` - Added test scripts
- `resources/js/pages/Admin/Bookings/Show.tsx` - Ready for apiService integration

## Security Checklist

- ✅ All admin routes require authentication
- ✅ Booking API endpoints protected with auth token
- ✅ Public endpoints only for login and booking submission
- ✅ Token automatically included in all API requests
- ✅ 401 responses automatically redirect to login
- ✅ CSRF token included in all requests
- ✅ Tests verify authentication works correctly
