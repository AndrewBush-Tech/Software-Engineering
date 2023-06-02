import { useNavigate } from 'react-router-dom';
import backArrow from '../images/back-arrow.png';
import React, { useState, useEffect } from 'react';
import './styles/backArrow.css';
import './styles/Agenda.css';

const Agenda = () => {
  const navigate = useNavigate();

  // State variables
  const [entries, setEntries] = useState(() => {
    // Retrieve saved entries from localStorage or initialize an empty array
    const savedEntries = window.localStorage.getItem('agendaEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  // Save entries to localStorage whenever 'entries' changes
  useEffect(() => {
    window.localStorage.setItem('agendaEntries', JSON.stringify(entries));
  }, [entries]);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      // Remove the entry with the matching 'id' from 'entries'
      setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (title && date && time) {
      const newEntry = {
        id: Date.now(),
        title,
        date,
        time,
      };
      // Add a new entry to 'entries'
      setEntries((prevEntries) => [...prevEntries, newEntry]);
      setTitle('');
      setDate('');
      setTime('');
    } else {
      alert('Please fill in all fields before submitting.');
    }
  };

  const handleEdit = (event) => {
    event.preventDefault();
    if (selectedEntry && selectedEntry.title && selectedEntry.date && selectedEntry.time) {
      // Update the entry with the matching 'id' in 'entries'
      setEntries((prevEntries) =>
        prevEntries.map((entry) => {
          if (entry.id === selectedEntry.id) {
            return {
              ...entry,
              title: selectedEntry.title,
              date: selectedEntry.date,
              time: selectedEntry.time,
            };
          } else {
            return entry;
          }
        })
      );
      setSelectedEntry(null);
    } else {
      alert('Please fill in all fields before editing.');
    }
  };

  const handleBack = () => {
    // Go back to the previous page using react-router's navigate function
    navigate(-1);
  };

  return (
    <div style={{ paddingTop: '50px', paddingBottom: '50px' }} className="page-container">
      <h1>Agenda</h1>
      <img src={backArrow} alt="back arrow" className="back-arrow" onClick={handleBack} />
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Title</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.date}</td>
              <td>{entry.time}</td>
              <td>{entry.title}</td>
              <td>
                <button onClick={() => handleDelete(entry.id)}>Delete</button>
                <button onClick={() => setSelectedEntry(entry)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedEntry && (
        <form onSubmit={handleEdit}>
          <label htmlFor="title" style={{ fontWeight: 'bold', fontSize: '16px' }}>
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={selectedEntry.title}
            onChange={(event) => setSelectedEntry({ ...selectedEntry, title: event.target.value })}
          />
          <label htmlFor="date" style={{ fontWeight: 'bold', fontSize: '16px' }}>
            Date:
          </label>
          <input
            type="date"
            id="date"
            value={selectedEntry.date}
            onChange={(event) => setSelectedEntry({ ...selectedEntry, date: event.target.value })}
          />
          <label htmlFor="time" style={{ fontWeight: 'bold', fontSize: '16px' }}>
            Time:
          </label>
          <input
            type="time"
            id="time"
            value={selectedEntry.time}
            onChange={(event) => setSelectedEntry({ ...selectedEntry, time: event.target.value })}
          />
          <button type="submit">Save Entry</button>
          <button onClick={() => setSelectedEntry(null)}>Cancel</button>
        </form>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="title" style={{ fontWeight: 'bold', fontSize: '16px' }}>
          Title:
        </label>
        <input type="text" id="title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <label htmlFor="date" style={{ fontWeight: 'bold', fontSize: '16px' }}>
          Date:
        </label>
        <input type="date" id="date" value={date} onChange={(event) => setDate(event.target.value)} />
        <label htmlFor="time" style={{ fontWeight: 'bold', fontSize: '16px' }}>
          Time:
        </label>
        <input type="time" id="time" value={time} onChange={(event) => setTime(event.target.value)} />
        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
};

export default Agenda;
