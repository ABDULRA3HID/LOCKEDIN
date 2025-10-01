# Locked In - GPS-Based Attendance System

A modern, secure attendance verification web application that uses GPS technology to ensure genuine physical presence at events.

## Overview

Locked In is designed for educational institutions and organizations that need reliable attendance tracking. The system verifies that students/participants are physically present at event locations by comparing their GPS coordinates with the instructor's confirmed location.

## Key Features

### For Leads (Instructors/Organizers)
- Create and manage events with customizable check-in radius
- Confirm GPS location at the event venue
- Generate unique attendance links and QR codes
- Real-time attendance monitoring dashboard
- Export attendance reports in CSV format
- View detailed check-in analytics (distance, accuracy, timestamps)

### For Followers (Students/Participants)
- Quick check-in via link or QR code
- GPS-based location verification
- View personal attendance history
- Track attendance rate and statistics

### For Institutions
- Multi-role user management
- Institution-wide event tracking
- Secure data isolation between institutions

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS with custom color scheme (Coral, Teal, Gold)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (email/password)
- **Real-time**: Supabase Realtime for live attendance updates
- **Location**: HTML5 Geolocation API
- **Distance Calculation**: Server-side Haversine formula

## Security Features

- Server-side distance validation (never trust client calculations)
- GPS accuracy threshold enforcement (default: 100m max)
- Device information and IP logging for audit trails
- Duplicate check-in prevention
- Secure token-based attendance links with expiration
- Row Level Security (RLS) policies on all database tables
- Encrypted data at rest and in transit

## Database Schema

### Tables
- **institutions**: Organization/school information
- **users**: User profiles with role-based access (institution_admin, lead, follower)
- **events**: Event details, location, and attendance settings
- **attendance_records**: Check-in records with GPS data and validation results
- **audit_logs**: System audit trail

### Key Functions
- `calculate_distance_meters()`: Server-side Haversine distance calculation

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. The Supabase environment variables are already configured in `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## User Flows

### Lead Creating an Event
1. Sign up as a Lead
2. Navigate to Dashboard
3. Click "Create Event"
4. Fill in event details (title, time, radius, location note)
5. At the venue, click "Confirm Location" to set GPS reference point
6. Generate attendance link/QR code
7. Share link with students
8. Monitor real-time check-ins on dashboard
9. Export attendance report as CSV

### Follower Checking In
1. Sign up as a Follower (Student)
2. Receive attendance link from lead
3. Click link and allow location access
4. System validates GPS coordinates
5. Receive confirmation (present/absent based on distance)
6. View check-in in personal attendance history

## Configuration

### Event Settings
- **Check-in Radius**: 10-1000 meters (default: 50m)
- **Link Expiration**: Configurable (default: 24 hours)
- **GPS Accuracy Threshold**: 100 meters maximum

### Validation Rules
- Distance must be within configured radius
- GPS accuracy must be ≤ 100 meters
- Event location must be confirmed by lead
- Attendance link must be valid and not expired
- One check-in per user per event

## Color Scheme

The application uses a professional, modern color palette:
- **Coral** (#FF6B6B): Primary accent, CTAs
- **Teal** (#00A6A6): Primary brand color, buttons
- **Gold** (#D4AF37): Secondary accent
- **Black** (#0A0A0A): Text, headers

## Privacy & Compliance

- Location data collected only during check-in
- Minimal data retention
- Clear consent mechanisms
- User data export/deletion on request
- HTTPS-only communication
- Compliant with privacy regulations (GDPR considerations)

## Anti-Spoofing Measures

1. **Accuracy Threshold**: Reject check-ins with poor GPS accuracy
2. **Device Fingerprinting**: Log device info and user agent
3. **IP Verification**: Record IP address for cross-reference
4. **Distance Validation**: Server-side calculation prevents tampering
5. **Audit Trail**: Immutable logs of all check-in attempts

## API Overview

The application uses Supabase client libraries, but key operations include:

- **Authentication**: Sign up, sign in, sign out
- **Event Management**: Create, update, confirm location, generate links
- **Attendance**: Validate and record check-ins
- **Reporting**: Query and export attendance data

## Development

### Project Structure
```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (Auth)
├── lib/           # Utilities and configs
├── pages/         # Page components
└── App.tsx        # Main app with routing
```

### Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run typecheck`: Run TypeScript checks

## Credits

**Built by KAR Tech** (company pending registration)

## License

Proprietary - All rights reserved

## Support

For questions or support, contact: support@lockedin.example.com

---

**Locked In** - Ensuring genuine attendance through GPS precision.
