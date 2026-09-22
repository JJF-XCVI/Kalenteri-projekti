import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  subMonths, 
  addMonths 
} from 'date-fns';
import { fi } from 'date-fns/locale'; 


export default function KalenteriSovellus() {
  // Aktiivinen näkymä: 'kalenteri', 'lista' tai 'lomake'
  const [currentView, setCurrentView] = useState('kalenteri');
  
  // Kalenterin kuukauden hallinta
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Testidataa (tapahtumat), joka myöhemmin haetaan backendistä
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Koodausprojekti palautus",
      description: "Palauta valmis Full-stack sovellus",
      date: "2026-09-25",
      category: "työ"
    },
    {
      id: "2",
      title: "Kaverin synttärit",
      description: "Muista ostaa lahja matkalla",
      date: "2026-09-28",
      category: "vapaa-aika"
    }
  ]);

  // Lomakkeen tilat uutta tapahtumaa varten
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDate, setFormDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [formCategory, setFormCategory] = useState('työ');
  const [errorMessage, setErrorMessage] = useState('');

  // Kuukauden vaihtofunktiot
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Lomakkeen lähetyksen käsittely (Uuden tapahtuman luonti)
  const handleCreateEvent = (e) => {
    e.preventDefault();
    
    // Suunnitelman mukainen tarkistus: ettei nimeä jätetä tyhjäksi
    if (!formTitle.trim()) {
      setErrorMessage('Tapahtuman nimi ei saa olla tyhjä!');
      return;
    }

    const newEvent = {
      id: Date.now().toString(), // Väliaikainen id ennen backend-vaihetta
      title: formTitle,
      description: formDesc,
      date: formDate,
      category: formCategory
    };

    setEvents([...events, newEvent]);
    
    // Tyhjennetään lomake ja palataan listaan
    setFormTitle('');
    setFormDesc('');
    setErrorMessage('');
    setCurrentView('lista'); 
  };


  // KALENTERINÄKYMÄ
  const renderCalendarView = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDayStr = format(day, 'yyyy-MM-dd');
        
        // Etsitään päivälle kuuluvat tapahtumat kalenteriruutuun
        const dayEvents = events.filter(e => e.date === formattedDayStr);

        days.push(
          <div
            key={day.toISOString()}
            className={`day-cell ${!isSameMonth(day, monthStart) ? 'disabled' : ''} ${isSameDay(day, selectedDate) ? 'selected' : ''}`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <span className="day-number">{format(day, 'd')}</span>
            <div className="day-events-dots">
              {dayEvents.map(e => (
                <span key={e.id} className={`event-dot ${e.category}`} title={e.title}></span>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="week-row" key={day.toISOString()}>{days}</div>);
      days = [];
    }

    return (
      <div className="calendar-view">
        <div className="calendar-header">
          <button onClick={prevMonth} className="nav-btn">&lt;</button>
          <h2>{format(currentMonth, 'LLLL yyyy', { locale: fi })}</h2>
          <button onClick={nextMonth} className="nav-btn">&gt;</button>
        </div>
        <div className="calendar-body">{rows}</div>
      </div>
    );
  };

  // Listanäkymä
  const renderListView = () => {
    return (
      <div className="list-view">
        <h2>Tulevat tapahtumat</h2>
        {events.length === 0 ? (
          <p>Ei tapahtumia kalenterissa.</p>
        ) : (
          <ul className="event-list">
            {events.map(event => (
              <li key={event.id} className={`event-item ${event.category}`}>
                <h3>{event.title} <span className="badge">{event.category}</span></h3>
                <p><strong>Päiväys:</strong> {event.date}</p>
                <p>{event.description}</p>
                <button 
                  className="delete-btn" 
                  onClick={() => setEvents(events.filter(e => e.id !== event.id))}
                >
                  Poista
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  // Lomakenäkymä
  const renderFormView = () => {
    return (
      <div className="form-view">
        <h2>Lisää uusi tapahtuma</h2>
        {errorMessage && <p className="error-msg">{errorMessage}</p>}
        
        <form onSubmit={handleCreateEvent} className="event-form">
          <div className="form-group">
            <label>Tapahtuman nimi *</label>
            <input 
              type="text" 
              value={formTitle} 
              onChange={(e) => setFormTitle(e.target.value)} 
              placeholder="esim. Matematiikan tentti"
            />
          </div>

          <div className="form-group">
            <label>Kuvaus</label>
            <textarea 
              value={formDesc} 
              onChange={(e) => setFormDesc(e.target.value)} 
              placeholder="Mitä pitää muistaa?"
            />
          </div>

          <div className="form-group">
            <label>Päivämäärä</label>
            <input 
              type="date" 
              value={formDate} 
              onChange={(e) => setFormDate(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Kategoria</label>
            <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
              <option value="työ">Työ / Opiskelu</option>
              <option value="vapaa-aika">Vapaa-aika</option>
            </select>
          </div>

          <button type="submit" className="save-btn">Tallenna tapahtuma</button>
        </form>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Päänagivointi näkymien välillä */}
      <nav className="main-nav">
        <button className={currentView === 'kalenteri' ? 'active' : ''} onClick={() => setCurrentView('kalenteri')}>Kalenteri</button>
        <button className={currentView === 'lista' ? 'active' : ''} onClick={() => setCurrentView('lista')}>Lista-näkymä</button>
        <button className={currentView === 'lomake' ? 'active' : ''} onClick={() => setCurrentView('lomake')}>+ Lisää tapahtuma</button>
      </nav>

      {/* Renderöidään valittu näkymä */}
      <main className="content-area">
        {currentView === 'kalenteri' && renderCalendarView()}
        {currentView === 'lista' && renderListView()}
        {currentView === 'lomake' && renderFormView()}
      </main>
    </div>
  );
}
