import { useEffect, useState } from 'react';
import { Plus, Calendar, Users, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../lib/database.types';
import { CreateEventModal } from './CreateEventModal';
import { EventCard } from './EventCard';

type Event = Database['public']['Tables']['events']['Row'];

interface LeadDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export function LeadDashboard({ onNavigate }: LeadDashboardProps) {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('lead_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const activeEvents = events.filter((e) => e.is_active);
  const upcomingEvents = activeEvents.filter(
    (e) => new Date(e.start_time) > new Date()
  );
  const pastEvents = events.filter((e) => new Date(e.end_time) < new Date());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}</h1>
              <p className="text-teal-100">Manage your events and track attendance</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 md:mt-0 px-6 py-3 bg-coral-500 hover:bg-coral-600 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Event</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<Calendar className="w-8 h-8" />}
            label="Total Events"
            value={events.length}
            color="teal"
          />
          <StatCard
            icon={<MapPin className="w-8 h-8" />}
            label="Active Events"
            value={activeEvents.length}
            color="coral"
          />
          <StatCard
            icon={<Users className="w-8 h-8" />}
            label="Upcoming Events"
            value={upcomingEvents.length}
            color="gold"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Events Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first event to start tracking attendance
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Event</span>
            </button>
          </div>
        ) : (
          <>
            {upcomingEvents.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Upcoming Events
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onNavigate={onNavigate}
                      onUpdate={fetchEvents}
                    />
                  ))}
                </div>
              </div>
            )}

            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Past Events
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {pastEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onNavigate={onNavigate}
                      onUpdate={fetchEvents}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(eventId) => {
            setShowCreateModal(false);
            fetchEvents();
            onNavigate('event-detail', { eventId });
          }}
        />
      )}
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
  value: number;
  color: 'teal' | 'coral' | 'gold';
}) {
  const colorClasses = {
    teal: 'from-teal-100 to-teal-200 text-teal-600',
    coral: 'from-coral-100 to-coral-200 text-coral-600',
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
