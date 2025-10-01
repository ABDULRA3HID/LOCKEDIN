import { useEffect, useState } from 'react';
import {
  MapPin,
  Link as LinkIcon,
  QrCode,
  Download,
  Users,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentPosition } from '../lib/geolocation';
import { generateSecureToken, formatDate } from '../lib/utils';
import type { Database } from '../lib/database.types';

type Event = Database['public']['Tables']['events']['Row'];
type AttendanceRecord = Database['public']['Tables']['attendance_records']['Row'];

interface EventDetailPageProps {
  eventId: string;
  onNavigate: (page: string) => void;
}

export function EventDetailPage({ eventId, onNavigate }: EventDetailPageProps) {
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingLocation, setConfirmingLocation] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [error, setError] = useState('');

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('event_id', eventId)
        .order('checkin_time', { ascending: false });

      if (error) throw error;
      setAttendance(data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  useEffect(() => {
    fetchEvent();
    fetchAttendance();

    const channel = supabase
      .channel(`event-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'attendance_records',
          filter: `event_id=eq.${eventId}`,
        },
        () => {
          fetchAttendance();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [eventId]);

  const handleConfirmLocation = async () => {
    setError('');
    setConfirmingLocation(true);

    try {
      const position = await getCurrentPosition();

      const { error: updateError } = await supabase
        .from('events')
        .update({
          location_lat: position.lat.toString(),
          location_lng: position.lng.toString(),
          location_accuracy_m: Math.round(position.accuracy),
          location_confirmed_at: new Date().toISOString(),
        })
        .eq('id', eventId);

      if (updateError) throw updateError;

      await fetchEvent();
    } catch (err: any) {
      setError(err.message || 'Failed to get location');
    } finally {
      setConfirmingLocation(false);
    }
  };

  const handleGenerateLink = async () => {
    setGeneratingLink(true);
    setError('');

    try {
      const token = generateSecureToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error: updateError } = await supabase
        .from('events')
        .update({
          link_token: token,
          link_expires_at: expiresAt.toISOString(),
        })
        .eq('id', eventId);

      if (updateError) throw updateError;

      await fetchEvent();
    } catch (err: any) {
      setError(err.message || 'Failed to generate link');
    } finally {
      setGeneratingLink(false);
    }
  };

  const handleExportCSV = () => {
    if (attendance.length === 0) return;

    const headers = [
      'Student Number',
      'Check-in Time',
      'Status',
      'Distance (m)',
      'Accuracy (m)',
      'Rejection Reason',
    ];

    const rows = attendance.map((record) => [
      record.student_number || 'N/A',
      new Date(record.checkin_time).toLocaleString(),
      record.status,
      parseFloat(record.distance_m).toFixed(2),
      record.accuracy_m,
      record.rejection_reason || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${event?.title.replace(/\s+/g, '-')}-${Date.now()}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Event not found</p>
      </div>
    );
  }

  const attendanceUrl = event.link_token
    ? `${window.location.origin}#checkin/${event.link_token}`
    : '';

  const presentCount = attendance.filter((a) => a.status === 'present').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-2 text-teal-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
          {event.description && (
            <p className="text-teal-100 text-lg">{event.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Event Details
              </h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  <strong>Start:</strong> {formatDate(event.start_time)}
                </p>
                <p>
                  <strong>End:</strong> {formatDate(event.end_time)}
                </p>
                <p>
                  <strong>Check-in Radius:</strong> {event.radius_meters}m
                </p>
                {event.location_note && (
                  <p>
                    <strong>Location:</strong> {event.location_note}
                  </p>
                )}
              </div>
            </div>

            {!event.location_confirmed_at ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Confirm Your Location
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Before students can check in, you need to confirm your GPS
                      location at the event venue. This will be the reference point
                      for attendance verification.
                    </p>
                    <button
                      onClick={handleConfirmLocation}
                      disabled={confirmingLocation}
                      className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors inline-flex items-center space-x-2"
                    >
                      <MapPin className="w-5 h-5" />
                      <span>
                        {confirmingLocation
                          ? 'Getting Location...'
                          : 'Confirm Location'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Location Confirmed
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Accuracy: {event.location_accuracy_m}m
                    </p>
                  </div>
                </div>

                {!event.link_token ? (
                  <button
                    onClick={handleGenerateLink}
                    disabled={generatingLink}
                    className="px-6 py-3 bg-coral-500 hover:bg-coral-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors inline-flex items-center space-x-2"
                  >
                    <LinkIcon className="w-5 h-5" />
                    <span>
                      {generatingLink ? 'Generating...' : 'Generate Attendance Link'}
                    </span>
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Attendance Link
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          readOnly
                          value={attendanceUrl}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                        />
                        <button
                          onClick={() => navigator.clipboard.writeText(attendanceUrl)}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Expires:{' '}
                        {event.link_expires_at
                          ? formatDate(event.link_expires_at)
                          : 'Never'}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <QrCode className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        QR code generation available in production
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Attendance</h3>
              {attendance.length > 0 && (
                <button
                  onClick={handleExportCSV}
                  className="text-teal-600 hover:text-teal-700 transition-colors"
                  title="Export CSV"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <Users className="w-8 h-8 text-teal-600" />
                <div>
                  <p className="text-3xl font-bold text-gray-900">{presentCount}</p>
                  <p className="text-sm text-gray-600">Students Present</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {attendance.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No check-ins yet
                </p>
              ) : (
                attendance.map((record) => (
                  <div
                    key={record.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">
                        {record.student_number || 'Unknown'}
                      </span>
                      <StatusBadge status={record.status} />
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>
                        Time:{' '}
                        {new Date(record.checkin_time).toLocaleTimeString()}
                      </p>
                      <p>
                        Distance: {parseFloat(record.distance_m).toFixed(1)}m
                      </p>
                      {record.rejection_reason && (
                        <p className="text-red-600">{record.rejection_reason}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    present: 'bg-green-100 text-green-700',
    absent: 'bg-red-100 text-red-700',
    invalid: 'bg-gray-100 text-gray-700',
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${
        colors[status as keyof typeof colors] || colors.invalid
      }`}
    >
      {status}
    </span>
  );
}
