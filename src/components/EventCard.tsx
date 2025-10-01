import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { formatDate } from '../lib/utils';
import type { Database } from '../lib/database.types';

type Event = Database['public']['Tables']['events']['Row'];

interface EventCardProps {
  event: Event;
  onNavigate: (page: string, params?: any) => void;
  onUpdate: () => void;
}

export function EventCard({ event, onNavigate }: EventCardProps) {
  const isUpcoming = new Date(event.start_time) > new Date();
  const isPast = new Date(event.end_time) < new Date();
  const isActive = !isPast && event.location_confirmed_at;

  return (
    <button
      onClick={() => onNavigate('event-detail', { eventId: event.id })}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 text-left w-full group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
        <StatusBadge
          isUpcoming={isUpcoming}
          isPast={isPast}
          isActive={isActive}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>{formatDate(event.start_time)}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span>
            {new Date(event.start_time).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            -{' '}
            {new Date(event.end_time).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {event.location_note && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{event.location_note}</span>
          </div>
        )}

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="w-4 h-4 flex-shrink-0" />
          <span>Radius: {event.radius_meters}m</span>
        </div>
      </div>

      {!event.location_confirmed_at && isUpcoming && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800 font-medium">
            Location not confirmed yet
          </p>
        </div>
      )}
    </button>
  );
}

function StatusBadge({
  isUpcoming,
  isPast,
  isActive,
}: {
  isUpcoming: boolean;
  isPast: boolean;
  isActive: boolean;
}) {
  if (isPast) {
    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
        Ended
      </span>
    );
  }

  if (isActive) {
    return (
      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
        Active
      </span>
    );
  }

  if (isUpcoming) {
    return (
      <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full">
        Upcoming
      </span>
    );
  }

  return null;
}
