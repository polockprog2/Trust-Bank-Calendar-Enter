import React, { useContext } from 'react';
import dayjs from 'dayjs';
import GlobalContext from '../context/GlobalContext';

const venues = [
  { id: 1, name: 'Conference Room A', capacity: 20, floor: '1st Floor' },
  { id: 2, name: 'Meeting Room 1', capacity: 10, floor: '2nd Floor' },
  { id: 3, name: 'Board Room', capacity: 15, floor: '3rd Floor' },
  { id: 4, name: 'Training Room', capacity: 30, floor: '2nd Floor' },
  { id: 5, name: 'Auditorium', capacity: 100, floor: 'Ground Floor' }
];

export default function Venues() {
  const { savedEvents, daySelected } = useContext(GlobalContext);

  const getVenueBookings = (venueId) => {
    return savedEvents.filter(event => 
      event.venue === venueId.toString() && 
      dayjs(event.day).format('YYYY-MM-DD') === daySelected.format('YYYY-MM-DD')
    );
  };

  const getTimeRanges = (bookings) => {
    return bookings.map(event => ({
      start: dayjs(event.startTime),
      end: dayjs(event.endTime),
      title: event.title
    }));
  };

  const isVenueAvailable = (bookings) => {
    if (bookings.length === 0) return true;
    const currentTime = dayjs();
    return !bookings.some(booking => {
      const startTime = dayjs(booking.startTime);
      const endTime = dayjs(booking.endTime);
      return currentTime.isAfter(startTime) && currentTime.isBefore(endTime);
    });
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Venue Availability</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {venues.map(venue => {
            const bookings = getVenueBookings(venue.id);
            const available = isVenueAvailable(bookings);

            return (
              <div key={venue.id} 
                   className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800">{venue.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {available ? 'Available' : 'Occupied'}
                  </span>
                </div>
                
                <div className="mt-2 text-sm text-gray-600">
                  <div>Capacity: {venue.capacity} people</div>
                  <div>Location: {venue.floor}</div>
                </div>

                {bookings.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Today's Bookings:</h4>
                    <div className="space-y-2">
                      {bookings.map((booking, idx) => (
                        <div key={idx} 
                             className="text-xs bg-gray-50 p-2 rounded border border-gray-100">
                          <div className="font-medium">{booking.title}</div>
                          <div className="text-gray-500">
                            {dayjs(booking.startTime).format('HH:mm')} - 
                            {dayjs(booking.endTime).format('HH:mm')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}