export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'institution_admin' | 'lead' | 'follower';
export type AttendanceStatus = 'present' | 'absent' | 'invalid';

export interface Database {
  public: {
    Tables: {
      institutions: {
        Row: {
          id: string;
          name: string;
          org_code: string;
          contact_email: string;
          address: string | null;
          logo_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          org_code: string;
          contact_email: string;
          address?: string | null;
          logo_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          org_code?: string;
          contact_email?: string;
          address?: string | null;
          logo_url?: string | null;
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          institution_id: string | null;
          role: UserRole;
          name: string;
          email: string;
          phone: string | null;
          student_number: string | null;
          is_verified: boolean;
          last_login: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          institution_id?: string | null;
          role: UserRole;
          name: string;
          email: string;
          phone?: string | null;
          student_number?: string | null;
          is_verified?: boolean;
          last_login?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          institution_id?: string | null;
          role?: UserRole;
          name?: string;
          email?: string;
          phone?: string | null;
          student_number?: string | null;
          is_verified?: boolean;
          last_login?: string | null;
          created_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          institution_id: string | null;
          lead_id: string;
          title: string;
          description: string | null;
          start_time: string;
          end_time: string;
          location_lat: string | null;
          location_lng: string | null;
          location_accuracy_m: number | null;
          radius_meters: number;
          location_note: string | null;
          location_confirmed_at: string | null;
          link_token: string | null;
          link_expires_at: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          institution_id?: string | null;
          lead_id: string;
          title: string;
          description?: string | null;
          start_time: string;
          end_time: string;
          location_lat?: string | null;
          location_lng?: string | null;
          location_accuracy_m?: number | null;
          radius_meters?: number;
          location_note?: string | null;
          location_confirmed_at?: string | null;
          link_token?: string | null;
          link_expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          institution_id?: string | null;
          lead_id?: string;
          title?: string;
          description?: string | null;
          start_time?: string;
          end_time?: string;
          location_lat?: string | null;
          location_lng?: string | null;
          location_accuracy_m?: number | null;
          radius_meters?: number;
          location_note?: string | null;
          location_confirmed_at?: string | null;
          link_token?: string | null;
          link_expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      attendance_records: {
        Row: {
          id: string;
          event_id: string;
          user_id: string | null;
          student_number: string | null;
          lat: string;
          lng: string;
          accuracy_m: number;
          distance_m: string;
          device_info: string | null;
          ip_address: string | null;
          checkin_time: string;
          status: AttendanceStatus;
          rejection_reason: string | null;
          proof_image_url: string | null;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id?: string | null;
          student_number?: string | null;
          lat: string;
          lng: string;
          accuracy_m: number;
          distance_m: string;
          device_info?: string | null;
          ip_address?: string | null;
          checkin_time?: string;
          status: AttendanceStatus;
          rejection_reason?: string | null;
          proof_image_url?: string | null;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string | null;
          student_number?: string | null;
          lat?: string;
          lng?: string;
          accuracy_m?: number;
          distance_m?: string;
          device_info?: string | null;
          ip_address?: string | null;
          checkin_time?: string;
          status?: AttendanceStatus;
          rejection_reason?: string | null;
          proof_image_url?: string | null;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          details: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          details?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          details?: Json | null;
          created_at?: string;
        };
      };
    };
    Functions: {
      calculate_distance_meters: {
        Args: {
          lat1: string;
          lng1: string;
          lat2: string;
          lng2: string;
        };
        Returns: string;
      };
    };
  };
}
