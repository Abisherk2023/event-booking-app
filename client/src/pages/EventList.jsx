import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (location) params.location = location;
      if (date) params.date = date;

      const res = await api.get('/events', { params });
      setEvents(res.data);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleClear = () => {
    setLocation('');
    setDate('');
    // fetchEvents will run with cleared filters after state updates
  };

  useEffect(() => {
    if (location === '' && date === '') {
      fetchEvents();
    }
  }, [location, date]);

  return (
    <div className="page-container">
      <h2>Upcoming Events</h2>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', flex: '1', minWidth: '150px' }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button className="btn-primary" type="submit">Search</button>
        <button type="button" className="btn-secondary" onClick={handleClear}>Clear</button>
      </form>

      {loading && <p>Loading events...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && events.length === 0 && <p>No events found.</p>}

      {events.map((event) => {
        const seatsLeft = event.capacity - event.seatsBooked;
        return (
          <div key={event._id} className="event-card">
            <h3>{event.title}</h3>
            <p>{event.location} — {new Date(event.date).toLocaleDateString()}</p>
            <p className={seatsLeft > 0 ? 'seats-left' : 'seats-full'}>
              {seatsLeft > 0 ? `${seatsLeft} seats left` : 'Fully booked'}
            </p>
            <Link to={`/events/${event._id}`}>View Details</Link>
          </div>
        );
      })}
    </div>
  );
}

export default EventList;