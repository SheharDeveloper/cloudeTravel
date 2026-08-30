# Attendance Management System

## Requirement

Add attendance for both superadmin-side staff (`User`, `type=staff`) and
agency-side staff (`AgencyUser`, `is_owner=false`). When a staff member logs
in, they must mark today's attendance before they can access any other
route. This applies only to staff — not superadmin and not the agency owner
login.

## Flow

1. **Database — new `attendances` table**
   - `staffable_type` / `staffable_id` (morphs — the `User` or `AgencyUser`
     marking attendance, same pattern as `staff_profiles` etc.)
   - `owner_type` / `owner_id` (nullableMorphs — which `Agency` or
     superadmin `User` they belong to)
   - `date` (the calendar day)
   - `checked_in_at` (timestamp)
   - Unique constraint on `(staffable_type, staffable_id, date)` so a staff
     member can only mark once per day.

2. **Model + Service**
   - `Attendance` model with `staffable()` / `owner()` relations.
   - `AttendanceService::hasMarkedToday($staff)` and `markAttendance($staff)`.

3. **Middleware — the enforcement piece**
   - New middleware (`EnsureAttendanceMarked`) added to the same
     `auth:web,agency` admin route group everything else already sits
     behind.
   - Only acts on staff: `User` with `type === 'staff'`, or `AgencyUser`
     with `is_owner === false`. Superadmin and agency owner pass through
     untouched.
   - If today's attendance isn't marked yet, redirects to the "Mark
     Attendance" page — except for the attendance routes themselves and
     logout, to avoid a redirect loop.

4. **Route + Page**
   - `GET/POST /attendance/mark` — small Inertia page with a "Mark
     Attendance" button; submitting it records today's entry and sends
     them on to the dashboard.

5. **Applies to both**
   - Driven by the existing `staffable` polymorphism, so the same
     middleware/service covers `User` staff and `AgencyUser` staff with no
     duplicated logic.

## Open question

Should the owner/superadmin be able to **view** staff attendance history
(a report/list), or is this first pass just the mark-in gate itself?
