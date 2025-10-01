import { useEffect, useState } from 'react';
import { MapPin, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getCurrentPosition } from '../lib/geolocation';
import { formatDistance } from '../lib/utils';
import type { Database } from '../lib/database.types';

type Event = Database['public']['Tables']['events']['Row'];

interface CheckInPageProps {
  token: string;
}

export function CheckInPage({ token }: CheckInPageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    distance?: number;
  } | null>(null);

  useEffect(() => {
    fetchEvent();
  }, [token]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('link_token', token)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setResult({
          success: false,
          message: 'Invalid or expired attendance link',
        });
        setLoading(false);
        return;
      }

      if (
        data.link_expires_at &&
        new Date(data.link_expires_at) < new Date()
      ) {
        setResult({
          success: false,
          message: 'This attendance link has expired',
        });
        setLoading(false);
        return;
      }

      if (!data.location_confirmed_at) {
        setResult({
          success: false,
          message: 'Event location not confirmed yet. Please try again later.',
        });
        setLoading(false);
        return;
      }

      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
      setResult({
        success: false,
        message: 'Failed to load event',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!event) return;

    setCheckingIn(true);
    setResult(null);

    try {
      const position = await getCurrentPosition();

      if (position.accuracy > 100) {
        setResult({
          success: false,
          message: `GPS accuracy too low (${Math.round(
            position.accuracy
          )}m). Please try moving to an area with better GPS signal.`,
        });
        setCheckingIn(false);
        return;
      }

      const { data: distanceData, error: distanceError } = await supabase.rpc(
        'calculate_distance_meters',
        {
          lat1: event.location_lat!,
          lng1: event.location_lng!,
          lat2: position.lat.toString(),
          lng2: position.lng.toString(),
        }
      );

      if (distanceError) throw distanceError;

      const distance = parseFloat(distanceData);
      const isWithinRadius = distance <= event.radius_meters;

      const { data: { user } } = await supabase.auth.getUser();

      let studentNumber = null;
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('student_number')
          .eq('id', user.id)
          .maybeSingle();
        studentNumber = profile?.student_number;
      }

      const { error: insertError } = await supabase
        .from('attendance_records')
        .insert({
          event_id: event.id,
          user_id: user?.id || null,
          student_number: studentNumber,
          lat: position.lat.toString(),
          lng: position.lng.toString(),
          accuracy_m: Math.round(position.accuracy),
          distance_m: distance.toFixed(2),
          device_info: navigator.userAgent,
          status: isWithinRadius ? 'present' : 'absent',
          rejection_reason: isWithinRadius
            ? null
            : `Outside check-in radius (${distance.toFixed(1)}m from venue)`,
        });

      if (insertError) {
        if (insertError.code === '23505') {
          setResult({
            success: false,
            message: 'You have already checked in to this event',
          });
        } else {
          throw insertError;
        }
      } else {
        setResult({
          success: isWithinRadius,
          message: isWithinRadius
            ? 'Check-in successful! You are marked present.'
            : `Check-in recorded, but you are outside the allowed radius (${distance.toFixed(
                1
              )}m from venue). Status: Absent`,
          distance,
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || 'Failed to check in. Please try again.',
      });
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-coral-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-coral-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to Check In
          </h2>
          <p className="text-gray-600">{result?.message}</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-coral-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          {result.success ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Check-In Successful!
              </h2>
              <p className="text-gray-600 mb-4">{result.message}</p>
              {result.distance !== undefined && (
                <p className="text-sm text-gray-500">
                  Distance from venue: {formatDistance(result.distance)}
                </p>
              )}
            </>
          ) : (
            <>
              <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Check-In Issue
              </h2>
              <p className="text-gray-600">{result.message}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-coral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
            <MapPin className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
          {event.description && (
            <p className="text-gray-600">{event.description}</p>
          )}
        </div>

        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-teal-900 mb-2">
            Location Verification Required
          </h3>
          <p className="text-sm text-teal-800 leading-relaxed">
            To mark your attendance, you need to allow location access. Your
            location will only be used to verify you're within{' '}
            {event.radius_meters} meters of the event venue. The check-in
            timestamp will be recorded.
          </p>
        </div>

        {event.location_note && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Location:</strong> {event.location_note}
            </p>
          </div>
        )}

        <button
          onClick={handleCheckIn}
          disabled={checkingIn}
          className="w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <MapPin className="w-5 h-5" />
          <span>{checkingIn ? 'Checking In...' : 'Check In Now'}</span>
        </button>

        <p className="mt-4 text-xs text-center text-gray-500">
          By checking in, you consent to location verification as described in
          our Privacy Policy
        </p>
      </div>
    </div>
  );
}
