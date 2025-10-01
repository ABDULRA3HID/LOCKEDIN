/*
  # Locked In - GPS-Based Attendance System Schema

  ## Overview
  This migration creates the complete database schema for Locked In, a GPS-based attendance verification system.
  
  ## New Tables
  
  ### 1. institutions
  - `id` (uuid, primary key) - Unique institution identifier
  - `name` (text) - Institution name
  - `org_code` (text, unique) - Organization code for institution identification
  - `contact_email` (text) - Primary contact email
  - `address` (text, nullable) - Physical address
  - `logo_url` (text, nullable) - Institution logo URL
  - `created_at` (timestamptz) - Creation timestamp
  
  ### 2. users
  - `id` (uuid, primary key) - References auth.users(id)
  - `institution_id` (uuid, nullable, foreign key) - Associated institution
  - `role` (enum: institution_admin, lead, follower) - User role
  - `name` (text) - Full name
  - `email` (text, unique) - Email address
  - `phone` (text, nullable) - Phone number
  - `student_number` (text, nullable) - Student/registration number for followers
  - `is_verified` (boolean) - Email/phone verification status
  - `last_login` (timestamptz, nullable) - Last login timestamp
  - `created_at` (timestamptz) - Creation timestamp
  
  ### 3. events
  - `id` (uuid, primary key) - Event identifier
  - `institution_id` (uuid, nullable, foreign key) - Associated institution
  - `lead_id` (uuid, foreign key) - Event creator/lead
  - `title` (text) - Event title
  - `description` (text, nullable) - Event description
  - `start_time` (timestamptz) - Event start time
  - `end_time` (timestamptz) - Event end time
  - `location_lat` (decimal(9,6), nullable) - Confirmed GPS latitude
  - `location_lng` (decimal(9,6), nullable) - Confirmed GPS longitude
  - `location_accuracy_m` (integer, nullable) - Location accuracy in meters
  - `radius_meters` (integer) - Check-in radius (default 50m)
  - `location_note` (text, nullable) - Location description
  - `location_confirmed_at` (timestamptz, nullable) - When location was confirmed
  - `link_token` (text, unique, nullable) - Attendance link token
  - `link_expires_at` (timestamptz, nullable) - Link expiration time
  - `is_active` (boolean) - Event active status
  - `created_at` (timestamptz) - Creation timestamp
  
  ### 4. attendance_records
  - `id` (uuid, primary key) - Record identifier
  - `event_id` (uuid, foreign key) - Associated event
  - `user_id` (uuid, nullable, foreign key) - User who checked in
  - `student_number` (text, nullable) - Student number for tracking
  - `lat` (decimal(9,6)) - Check-in latitude
  - `lng` (decimal(9,6)) - Check-in longitude
  - `accuracy_m` (integer) - GPS accuracy in meters
  - `distance_m` (decimal(10,2)) - Distance from event location
  - `device_info` (text, nullable) - Device user agent
  - `ip_address` (inet, nullable) - IP address for audit
  - `checkin_time` (timestamptz) - Check-in timestamp
  - `status` (enum: present, absent, invalid) - Attendance status
  - `rejection_reason` (text, nullable) - Reason for rejection
  - `proof_image_url` (text, nullable) - Optional photo proof
  
  ### 5. audit_logs
  - `id` (uuid, primary key) - Log entry identifier
  - `user_id` (uuid, nullable, foreign key) - User who performed action
  - `action` (text) - Action performed
  - `details` (jsonb) - Additional details
  - `created_at` (timestamptz) - Log timestamp
  
  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Institution admins can manage their institution's data
  - Leads can manage their own events
  - Followers can only view their own attendance records
  - Public access to check-in endpoint with valid token
  
  ## Important Notes
  1. Uses decimal(9,6) for lat/lng to maintain sub-meter precision
  2. Link tokens must be cryptographically secure (generated in application layer)
  3. Distance calculations performed server-side using Haversine formula
  4. All location data stored with accuracy metrics for audit
  5. Data retention policies should be defined at application level
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('institution_admin', 'lead', 'follower');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'invalid');

-- Create institutions table
CREATE TABLE IF NOT EXISTS institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  org_code text UNIQUE NOT NULL,
  contact_email text NOT NULL,
  address text,
  logo_url text,
  created_at timestamptz DEFAULT now()
);

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id uuid REFERENCES institutions(id) ON DELETE SET NULL,
  role user_role NOT NULL,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  student_number text,
  is_verified boolean DEFAULT false,
  last_login timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid REFERENCES institutions(id) ON DELETE SET NULL,
  lead_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location_lat decimal(9,6),
  location_lng decimal(9,6),
  location_accuracy_m integer,
  radius_meters integer DEFAULT 50,
  location_note text,
  location_confirmed_at timestamptz,
  link_token text UNIQUE,
  link_expires_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time),
  CONSTRAINT valid_radius CHECK (radius_meters > 0 AND radius_meters <= 1000)
);

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  student_number text,
  lat decimal(9,6) NOT NULL,
  lng decimal(9,6) NOT NULL,
  accuracy_m integer NOT NULL,
  distance_m decimal(10,2) NOT NULL,
  device_info text,
  ip_address inet,
  checkin_time timestamptz DEFAULT now(),
  status attendance_status NOT NULL,
  rejection_reason text,
  proof_image_url text,
  CONSTRAINT unique_user_event_checkin UNIQUE (event_id, user_id)
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_institution ON users(institution_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_student_number ON users(student_number) WHERE student_number IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_events_lead ON events(lead_id);
CREATE INDEX IF NOT EXISTS idx_events_institution ON events(institution_id);
CREATE INDEX IF NOT EXISTS idx_events_link_token ON events(link_token) WHERE link_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_events_time_range ON events(start_time, end_time);

CREATE INDEX IF NOT EXISTS idx_attendance_event ON attendance_records(event_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user ON attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_time ON attendance_records(checkin_time);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance_records(status);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

-- Enable Row Level Security
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for institutions
CREATE POLICY "Institution admins can view their institution"
  ON institutions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.institution_id = institutions.id
      AND users.role = 'institution_admin'
    )
  );

CREATE POLICY "Institution admins can update their institution"
  ON institutions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.institution_id = institutions.id
      AND users.role = 'institution_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.institution_id = institutions.id
      AND users.role = 'institution_admin'
    )
  );

CREATE POLICY "Anyone can create an institution"
  ON institutions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for users
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Institution admins can view users in their institution"
  ON users FOR SELECT
  TO authenticated
  USING (
    institution_id IN (
      SELECT institution_id FROM users
      WHERE id = auth.uid()
      AND role = 'institution_admin'
    )
  );

CREATE POLICY "Leads can view followers in their institution"
  ON users FOR SELECT
  TO authenticated
  USING (
    role = 'follower' AND institution_id IN (
      SELECT institution_id FROM users
      WHERE id = auth.uid()
      AND role IN ('lead', 'institution_admin')
    )
  );

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "New users can insert their profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- RLS Policies for events
CREATE POLICY "Leads can view their own events"
  ON events FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

CREATE POLICY "Followers can view events they can attend"
  ON events FOR SELECT
  TO authenticated
  USING (
    is_active = true AND
    (institution_id IS NULL OR institution_id IN (
      SELECT institution_id FROM users WHERE id = auth.uid()
    ))
  );

CREATE POLICY "Institution admins can view events in their institution"
  ON events FOR SELECT
  TO authenticated
  USING (
    institution_id IN (
      SELECT institution_id FROM users
      WHERE id = auth.uid()
      AND role = 'institution_admin'
    )
  );

CREATE POLICY "Leads can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    lead_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'lead'
    )
  );

CREATE POLICY "Leads can update their own events"
  ON events FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "Leads can delete their own events"
  ON events FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- RLS Policies for attendance_records
CREATE POLICY "Users can view their own attendance"
  ON attendance_records FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Leads can view attendance for their events"
  ON attendance_records FOR SELECT
  TO authenticated
  USING (
    event_id IN (
      SELECT id FROM events WHERE lead_id = auth.uid()
    )
  );

CREATE POLICY "Institution admins can view attendance in their institution"
  ON attendance_records FOR SELECT
  TO authenticated
  USING (
    event_id IN (
      SELECT id FROM events
      WHERE institution_id IN (
        SELECT institution_id FROM users
        WHERE id = auth.uid()
        AND role = 'institution_admin'
      )
    )
  );

CREATE POLICY "Authenticated users can create attendance records"
  ON attendance_records FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for audit_logs
CREATE POLICY "Users can view their own audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Institution admins can view audit logs for their institution"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users
      WHERE institution_id IN (
        SELECT institution_id FROM users
        WHERE id = auth.uid()
        AND role = 'institution_admin'
      )
    )
  );

CREATE POLICY "System can create audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create function for Haversine distance calculation
CREATE OR REPLACE FUNCTION calculate_distance_meters(
  lat1 decimal,
  lng1 decimal,
  lat2 decimal,
  lng2 decimal
)
RETURNS decimal AS $$
DECLARE
  earth_radius_m constant decimal := 6371000;
  dlat decimal;
  dlng decimal;
  a decimal;
  c decimal;
BEGIN
  dlat := radians(lat2 - lat1);
  dlng := radians(lng2 - lng1);
  
  a := sin(dlat / 2) * sin(dlat / 2) +
       cos(radians(lat1)) * cos(radians(lat2)) *
       sin(dlng / 2) * sin(dlng / 2);
  
  c := 2 * atan2(sqrt(a), sqrt(1 - a));
  
  RETURN earth_radius_m * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
