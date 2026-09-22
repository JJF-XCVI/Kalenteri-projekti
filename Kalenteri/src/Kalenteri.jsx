import React, { useState } from 'react';
// 1. Tuodaan subMonths ja addMonths kuukauden vaihtamista varten
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
// Tuodaan suomen kielen lokalisointi (valinnainen, jos haluat kuukaudet suomeksi)
import { fi } from 'date-fns/locale'; 


export default function OmaKalenteri() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Logiikka kuukauden vaihtamiseen
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const renderDays = () => {
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        days.push(
          <div
            key={day.toISOString()}
            className={`day-cell ${!isSameMonth(day, monthStart) ? 'disabled' : ''} ${isSameDay(day, selectedDate) ? 'selected' : ''}`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            {format(day, 'd')}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="week-row" key={day.toISOString()}>{days}</div>);
      days = [];
    }
    return <div className="calendar-body">{rows}</div>;
  };

  return (
    <div className="calendar-container">
      {/* 2. Kalenterin yläosa ja painikkeet */}
      <div className="calendar-header">
        <button onClick={prevMonth} className="nav-btn">&lt;</button>
        <h2>
          {/* format-funktion kolmas argumentti muuttaa kielen suomeksi */}
          {format(currentMonth, 'LLLL yyyy', { locale: fi })}
        </h2>
        <button onClick={nextMonth} className="nav-btn">&gt;</button>
      </div>
      
      {renderDays()}
    </div>
  );
}
