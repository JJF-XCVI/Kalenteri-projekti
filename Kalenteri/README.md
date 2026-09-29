Dokumentointi on puuttelista koska keskityin liikaa koodin kommentointiin ja unohdin alkaa dokumentoimaan samaan aikaan kun kirjoitan koodia.

Kalenteri teon aloitin sillä että loin ensin ulkoisen vision ja event.jsonin mistä sitten saan kyseiset tapahtumat myöhemmin

Backendin lisäsin jossain tässä aika alussa tässä backendissa luotin aikalailla AI:hin ihan vaan sen takia että mulla ei oo tästä paljoon mitää muistissa CORS API Reitit (CRUD)

Ennen kuin loin mitään asensin npm install date-fns mikä on a moderni and modulaarinen JavaScript apuohjelmakirjasto päivämäärien muotoiluun, jäsentämiseen, vertailuun ja käsittelyyn.

Vision jälkeen aloin luomaan kalenterin toimintoja missä ensimmäinen haaste tuli siitä että miten teen kalenterin missä voin vaihtaa kalenterin kuukausia alunperin oli siis jumissa yhdessä kuukaudessa. Toiminollisuus löytyy riveiltä 24-25 38-39 ja napit lyötyy 111-113

Aloin luomaan lista- ja lomakenäkymää (listanäkyma riveillä 136–161 ja lomake 164–211), ja lisäsin events.json-tiedostoon kaksi testitapahtumaa. Tässä kohtaa rakensin myös navigaation ja näkymien renderöinnin, jotta pääsen liikkumaan niiden välillä. Yläreunan napit vaihtavat sovelluksen tilaa (currentView), ja <main>-alue renderöi ruudulle lennosta vain valitun näkymän funktion (kuten renderListView()) ilman sivun uudelleenlataust

 Ongelmana tässä kohtaa se että päivät ei näyttäneet mitään kun niihin klikkattiin joten joudut aina tapahtumalistasta katsoa mitä siellä on. Riveillä 69-70 ja 117-133 ovat toiminnot mitkä näyttävät päivien tapahtumat jos niitä on.
