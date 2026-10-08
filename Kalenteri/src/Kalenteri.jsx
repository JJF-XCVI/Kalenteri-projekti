import React, { useState, useEffect } from 'react';
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

// Backendin API-osoite tallennetaan yhteen muuttujaan,
// jotta samaa osoitetta ei tarvitse kirjoittaa useaan paikkaan.
const API_URL = 'http://localhost:3000/api/events';

export default function KalenteriSovellus() {

  // Tallentaa käyttäjän valitseman näkymän.
  // Näkymä voi olla kalenteri, tapahtumalista tai uuden tapahtuman lomake.
  const [currentView, setCurrentView] = useState('kalenteri');
  
  // currentMonth määrittää, mikä kuukausi kalenterissa näytetään.
  // selectedDate tallentaa käyttäjän valitseman yksittäisen päivän.
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Tapahtumat haetaan backendistä, joten aluksi lista on tyhjä.
  // Kun palvelimelta saadaan tapahtumat, ne tallennetaan tähän tilaan.
  const [events, setEvents] = useState([]);

  // Lomakkeen kenttien tilat.
  // Jokaisella kentällä on oma tila, jota päivitetään käyttäjän kirjoittaessa.
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDate, setFormDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [formCategory, setFormCategory] = useState('työ');

  // Tänne tallennetaan mahdollinen lomakkeessa näytettävä virheilmoitus.
  const [errorMessage, setErrorMessage] = useState('');


  // haetaan tapahtumat backendistä

  // useEffect suoritetaan komponentin ensimmäisen renderöinnin jälkeen.
  // Tyhjä [] tarkoittaa, että tapahtumat haetaan vain kerran,
  // kun sovellus avataan.
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        // Palvelimelta saadut tapahtumat tallennetaan Reactin tilaan.
        setEvents(data);
      })
      .catch(err => {
        // Jos palvelimeen ei saada yhteyttä, virhe tulostetaan konsoliin.
        console.error("Virhe haettaessa tapahtumia:", err);
      });
  }, []);


  // KUUKAUDEN VAIHTAMINEN

  // Siirtyy kalenterissa yhden kuukauden taaksepäin.
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Siirtyy kalenterissa yhden kuukauden eteenpäin.
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));


  // UUDEN TAPAHTUMAN LUOMINEN

  // Funktio suoritetaan, kun käyttäjä lähettää uuden tapahtuman lomakkeen.
  const handleCreateEvent = (e) => {
    // Estetään selaimen oletustoiminto eli sivun uudelleenlataus.
    e.preventDefault();
    
    // Tarkistetaan, että tapahtumalle on annettu nimi.
    // trim() poistaa alussa ja lopussa olevat tyhjät merkit.
    if (!formTitle.trim()) {
      setErrorMessage('Tapahtuman nimi ei saa olla tyhjä!');
      return;
    }

    // Luodaan olio lomakkeen tietojen perusteella.
    // Tämä olio lähetetään myöhemmin backendille.
    const newEvent = {
      title: formTitle,
      description: formDesc,
      date: formDate,
      category: formCategory
    };


    // Lähetetään tapahtuma backendille post-pyynnöllä

    fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(newEvent)
    })
      .then(res => res.json())
      .then(savedEvent => {

        // Backend palauttaa tallennetun tapahtuman
        // Se lisätään Reactin nykyiseen tapahtumalistaan
        // jolloin uusi tapahtuma näkyy käyttöliittymässä ilman sivun päivittämistä
        setEvents([...events, savedEvent]);
      
        // Tyhjennetään lomakkeen kentät onnistuneen tallennuksen jälkeen
        setFormTitle('');
        setFormDesc('');
        setErrorMessage('');

        // Siirrytään takaisin tapahtumien listanäkymään
        setCurrentView('lista'); 
      })
      .catch(err => {
        // Jos tallennuksessa tapahtuu virhe, se näytetään konsolissa
        console.error("Virhe tallennettaessa:", err);
      });
  };


  // Tapahtuman poistaminen

  // Saa parametrina poistettavan tapahtuman id:n.
  const handleDeleteEvent = (id) => {

    // Lähetetään backendille DELETE-pyyntö kyseisen tapahtuman poistamiseksi
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
      .then(() => {

        // Poistetaan tapahtuma myös Reactin tilasta.
        // filter() palauttaa uuden taulukon, josta poistettava tapahtuma puuttuu.
        setEvents(events.filter(event => event.id !== id));
      })
      .catch(err => {
        // Jos poistaminen epäonnistuu, virhe tulostetaan konsoliin.
        console.error("Virhe poistettaessa:", err);
      });
  };


  // Kalenterinäkymä

  const renderCalendarView = () => {

    // Muutetaan valittu päivämäärä samaan muotoon kuin
    // backendissä tallennetut tapahtumien päivämäärät.
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

    // Etsitään kaikki tapahtumat, jotka kuuluvat valitulle päivälle.
    const selectedDayEvents = events.filter(
      e => e.date === selectedDateStr
    );


    // Selvitetään nykyisen kuukauden ensimmäinen ja viimeinen päivä
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);

    // Kalenteri aloitetaan viikon maanantaista.
    // Mukaan otetaan myös edellisen kuukauden päiviä,
    // jos kuukauden ensimmäinen päivä ei ole maanantai.
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });

    // Vastaavasti kalenteriin lisätään seuraavan kuukauden päiviä,
    // jotta viimeinen viikko tulee täyteen.
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });


    // rows sisältää lopulliset kalenterin viikkorivit.
    const rows = [];

    // days sisältää yhden viikon seitsemän päivää.
    let days = [];

    // Aloitetaan kalenterin rakentaminen ensimmäisestä näytettävästä päivästä
    let day = startDate;


    // Rakennetaan kalenteri viikko kerrallaan,
    // kunnes saavutaan kuukauden viimeiseen kalenteripäivään
    while (day <= endDate) {

      // Jokaiselle viikolle lisätään seitsemän päivää
      for (let i = 0; i < 7; i++) {

        // Tallennetaan nykyinen päivä muuttujaan,
        // jota voidaan käyttää myöhemmin klikkaustapahtumassa
        const cloneDay = day;

        // Muutetaan päivämäärä muotoon, jota käytetään tapahtumien vertailussa
        const formattedDayStr = format(day, 'yyyy-MM-dd');
        
        // Etsitään kaikki kyseiselle päivälle kuuluvat tapahtumat
        const dayEvents = events.filter(
          e => e.date === formattedDayStr
        );


        // Luodaan yhden päivän solu kalenteriin.
        // Luodaan yhden päivän solu kalenteriin.
days.push(
  <div
    key={day.toISOString()}
    // Lisätään CSS-luokkia tilanteen mukaan:
    // disabled = päivä kuuluu toiseen kuukauteen
    // selected = käyttäjän valitsema päivä
    className={`
      day-cell 
      ${!isSameMonth(day, monthStart) ? 'disabled' : ''} 
      ${isSameDay(day, selectedDate) ? 'selected' : ''}
    `}
    // Kun päivää klikataan, siitä tulee valittu päivä.
    onClick={() => setSelectedDate(cloneDay)}
  >
    <span className="day-number">
      {format(day, 'd')}
    </span>

    <div className="day-events-dots">
      {dayEvents.map(e => (
        <span
          key={e.id}
          className={`event-dot ${e.category}`}
          title={e.title}
        ></span>
      ))}
    </div>
  </div>
);


        // Siirrytään seuraavaan päivään.
        day = addDays(day, 1);
      }


      // Kun seitsemän päivää on käsitelty,
      // niistä muodostetaan yksi kalenterin viikkorivi.
      rows.push(
        <div className="week-row" key={day.toISOString()}>
          {days}
        </div>
      );

      // Tyhjennetään viikon päivät seuraavaa viikkoa varten.
      days = [];
    }


    // Palautetaan valmis kalenterin HTML-rakenne.
    return (
      <div className="calendar-view">

        {/* Kalenterin yläpalkki, jossa vaihdetaan kuukautta. */}
        <div className="calendar-header">

          {/* Edellinen kuukausi */}
          <button 
            onClick={prevMonth} 
            className="nav-btn"
          >
            &lt;
          </button>

          {/* Nykyisen kuukauden nimi ja vuosi */}
          <h2>
            {format(currentMonth, 'LLLL yyyy', { locale: fi })}
          </h2>

          {/* Seuraava kuukausi */}
          <button 
            onClick={nextMonth} 
            className="nav-btn"
          >
            &gt;
          </button>
        </div>


        {/* Itse kalenterin viikot ja päivät */}
        <div className="calendar-body">
          {rows}
        </div>


        {/* Näytetään valitun päivän tapahtumat vain,
            jos kyseiselle päivälle löytyy tapahtumia. */}
        {selectedDayEvents.length > 0 && (
          <div className="selected-day-events">

            <h3>
              Päivän {format(selectedDate, 'd.M.yyyy')} tapahtumat:
            </h3>

            <ul style={{ listStyle: 'none', padding: 0 }}>
              {selectedDayEvents.map(event => (
                <li 
                  key={event.id} 
                  style={{ 
                    marginBottom: '10px', 
                    paddingBottom: '10px', 
                    borderBottom: '1px dashed #eee' 
                  }}
                >

                  {/* Tapahtuman nimi ja kategoria */}
                  <h4>
                    {event.title}

                    <span 
                      className={`badge ${event.category}`} 
                      style={{ 
                        fontSize: '0.8rem', 
                        padding: '2px 6px', 
                        borderRadius: '4px' 
                      }}
                    >
                      {event.category}
                    </span>
                  </h4>

                  {/* Tapahtuman kuvaus */}
                  <p>{event.description}</p>

                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };


  // Listanäkymä

  const renderListView = () => {
    return (
      <div className="list-view">

        <h2>Tulevat tapahtumat</h2>

        {/* Jos tapahtumia ei ole, näytetään ilmoitus. */}
        {events.length === 0 ? (
          <p>Ei tapahtumia kalenterissa.</p>
        ) : (

          // Muussa tapauksessa käydään kaikki tapahtumat läpi
          // ja luodaan jokaisesta oma listaelementti.
          <ul className="event-list">

            {events.map(event => (
              <li 
                key={event.id} 
                className={`event-item ${event.category}`}
              >

                {/* Tapahtuman nimi ja kategoria */}
                <h3>
                  {event.title} 
                  <span className="badge">
                    {event.category}
                  </span>
                </h3>

                {/* Tapahtuman päivämäärä */}
                <p>
                  <strong>Päiväys:</strong> {event.date}
                </p>

                {/* Tapahtuman kuvaus */}
                <p>{event.description}</p>

                {/* Poistaa kyseisen tapahtuman backendistä ja
                    samalla Reactin tapahtumalistasta. */}
                <button 
                  className="delete-btn" 
                  onClick={() => handleDeleteEvent(event.id)} 
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


  // Uusi tapahtuma lomake

  const renderFormView = () => {
    return (
      <div className="form-view">

        <h2>Lisää uusi tapahtuma</h2>

        {/* Virheilmoitus näytetään vain silloin,
            kun errorMessage sisältää tekstiä. */}
        {errorMessage && (
          <p className="error-msg">
            {errorMessage}
          </p>
        )}
        
        {/* onSubmit kutsuu tapahtuman tallennusfunktiota. */}
        <form 
          onSubmit={handleCreateEvent} 
          className="event-form"
        >

          {/* Tapahtuman nimi */}
          <div className="form-group">
            <label>Tapahtuman nimi *</label>

            <input 
              type="text" 
              value={formTitle} 

              // Päivitetään tila aina, kun käyttäjä kirjoittaa.
              onChange={(e) => setFormTitle(e.target.value)} 

              placeholder="esim. Matematiikan tentti"
            />
          </div>


          {/* Tapahtuman kuvaus */}
          <div className="form-group">
            <label>Kuvaus</label>

            <textarea 
              value={formDesc} 

              // Tallennetaan kirjoitettu kuvaus Reactin tilaan.
              onChange={(e) => setFormDesc(e.target.value)} 

              placeholder="Mitä pitää muistaa?"
            />
          </div>


          {/* Tapahtuman päivämäärä */}
          <div className="form-group">
            <label>Päivämäärä</label>

            <input 
              type="date" 
              value={formDate} 

              // Päivitetään valittu päivämäärä Reactin tilaan.
              onChange={(e) => setFormDate(e.target.value)} 
            />
          </div>


          {/* Tapahtuman kategorian valinta */}
          <div className="form-group">
            <label>Kategoria</label>

            <select 
              value={formCategory} 
              onChange={(e) => setFormCategory(e.target.value)}
            >
              <option value="työ">
                Työ / Opiskelu
              </option>

              <option value="vapaa-aika">
                Vapaa-aika
              </option>
            </select>
          </div>


          {/* Lomakkeen lähetyspainike */}
          <button 
            type="submit" 
            className="save-btn"
          >
            Tallenna tapahtuma
          </button>

        </form>
      </div>
    );
  };


  // Päänäkymä

  return (
    <div className="app-container">

      {/* Navigaation painikkeilla vaihdetaan sovelluksen näkymää. */}
      <nav className="main-nav">

        <button 
          className={currentView === 'kalenteri' ? 'active' : ''} 
          onClick={() => setCurrentView('kalenteri')}
        >
          Kalenteri
        </button>

        <button 
          className={currentView === 'lista' ? 'active' : ''} 
          onClick={() => setCurrentView('lista')}
        >
          Lista-näkymä
        </button>

        <button 
          className={currentView === 'lomake' ? 'active' : ''} 
          onClick={() => setCurrentView('lomake')}
        >
          + Lisää tapahtuma
        </button>

      </nav>


      {/* Sisältöalueella näytetään vain käyttäjän valitsema näkymä. */}
      <main className="content-area">

        {currentView === 'kalenteri' && renderCalendarView()}

        {currentView === 'lista' && renderListView()}

        {currentView === 'lomake' && renderFormView()}

      </main>

    </div>
  );
}
