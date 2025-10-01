import { useEffect, useState } from 'react';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../lib/utils';
import type { Database } from '../lib/database.types';

type AttendanceRecord = Database['public']['Tables']['attendance_records']['Row'] & {
  events: Database['public']['Tables']['events']['Row'];
};

interface FollowerDashboardProps {
  onNavigate: (page: string) => void;
}

export function FollowerDashboard({ onNavigate }: FollowerDashboardProps) {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, [user]);

  const fetchAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*, events(*)')
        .eq('user_id', user!.id)
        .order('checkin_time', { ascending: false });

      if (error) throw error;
      setAttendance(data as any || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const presentCount = attendance.filter((a) => a.status === 'present').length;
  const totalCount = attendance.length;
  const attendanceRate =
    totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}</h1>
          <p className="text-teal-100">View your attendance history</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<Calendar className="w-8 h-8" />}
            label="Total Check-ins"
            value={totalCount}
            color="teal"
          />
          <StatCard
            icon={<CheckCircle className="w-8 h-8" />}
            label="Present"
            value={presentCount}
            color="green"
          />
          <StatCard
            icon={<CheckCircle className="w-8 h-8" />}
            label="Attendance Rate"
            value={`${attendanceRate}%`}
            color="gold"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : attendance.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Attendance Records
            </h3>
            <p className="text-gray-600">
              Your attendance history will appear here after you check in to events
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Attendance History
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {attendance.map((record) => (
                <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {record.events.title}
                      </h3>
                      {record.events.description && (
                        <p className="text-sm text-gray-600">
                          {record.events.description}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={record.status} />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Check-in:</strong>{' '}
                      {formatDate(record.checkin_time)}
                    </div>
                    <div>
                      <strong>Distance:</strong>{' '}
                      {parseFloat(record.distance_m).toFixed(1)}m
                    </div>
                    <div>
                      <strong>Accuracy:</strong> {record.accuracy_m}m
                    </div>
                  </div>
                  {record.rejection_reason && (
                    <div className="mt-2 text-sm text-red-600">
                      <strong>Note:</strong> {record.rejection_reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: 'teal' | 'green' | 'gold';
}) {
  const colorClasses = {
    teal: 'from-teal-100 to-teal-200 text-teal-600',
    green: 'from-green-100 to-green-200 text-green-600',
    gold: 'from-gold-100 to-gold-200 text-gold-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`w-14 h-14 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    present: {
      icon: <CheckCircle className="w-4 h-4" />,
      className: 'bg-green-100 text-green-700',
      label: 'Present',
    },
    absent: {
      icon: <XCircle className="w-4 h-4" />,
      className: 'bg-red-100 text-red-700',
      label: 'Absent',
    },
    invalid: {
      icon: <XCircle className="w-4 h-4" />,
      className: 'bg-gray-100 text-gray-700',
      label: 'Invalid',
    },
  };

  const { icon, className, label } =
    config[status as keyof typeof config] || config.invalid;

  return (
    <span
      className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full ${className}`}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
}
