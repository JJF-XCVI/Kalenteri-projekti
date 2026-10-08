# Kalenterisovellus

## Mikä sovellus on ja kenelle

Sovellus on tarkoitettu auttamaan merkitsemään päiviä ja muistuttamaan tapahtumista.

## Asennus ja käynnistys

Kloonaa repositorio ja asenna tarvittavat riippuvuudet.
https://github.com/JJF-XCVI/Kalenteri-projekti.git

### Frontend

```bash
cd Kalenteri-projekti
cd Kalenteri
npm install
npm run dev
```

### Backend

Avaa toinen terminaali ja suorita:

```bash
cd Kalenteri-projekti
cd backend
npm install
node server.js
```

Frontend ja backend käynnistetään siis omissa terminaaleissaan.

## Toteutetut ominaisuudet

* kuukausien selaaminen
* tietyn päivän valitseminen
* valitun päivän tapahtumien näyttäminen
* lista-näkymä
* tapahtumien lisääminen
* tapahtumien poistaminen
* tapahtumalle kategorian määrittäminen
* tapahtumien hakeminen backendistä
* tapahtumien lisääminen backendin kautta
* tapahtumien poistaminen backendin kautta

## Projektin dokumentointi

Dokumentointi jäi projektin aikana hieman puutteelliseksi, koska keskityin paljon koodin kommentointiin ja unohdin dokumentoida projektin etenemistä samalla kun kirjoitin koodia. Tässä käyn kuitenkin läpi projektin tärkeimmät vaiheet ja vastaan tulleet ongelmat.

### 1. Projektin aloittaminen

Aloitin kalenterisovelluksen tekemisen App.jsx-tiedostosta, jonka tarkoituksena on toimia sovelluksen pääsivuna ja tuoda Kalenteri-komponentti selaimeen.

Tämän jälkeen loin Kalenteri.jsx-tiedoston, jossa aloin rakentaa kalenterin rakennetta ja toiminnallisuuksia. Samalla loin events.json-tiedoston alustavia tapahtumia varten sekä CSS-tyylit kalenterin ulkoasua varten.

### 2. date-fns-kirjaston käyttöönotto

Ennen kalenterin toiminnallisuuksien tekemistä asensin date-fns-kirjaston:

```bash
npm install date-fns
```

Kirjastoa käytin päivämäärien käsittelyyn, kuten kuukausien, viikkojen ja päivien muodostamiseen sekä päivämäärien näyttämiseen oikeassa muodossa. Suomenkielistä näyttöä varten käytin myös date-fns-kirjaston suomenkielistä localea.

### 3. Backendin lisääminen

Projektin alkuvaiheessa lisäsin backendin, jossa toteutin CORS-asetukset, API-reitit ja CRUD-toiminnot tapahtumille.

Backendin tekemisessä hyödynsin melko paljon tekoälyä, koska backend-kehityksestä ei ollut itselläni yhtä paljon aikaisempaa osaamista. Tekoäly auttoi erityisesti rakenteen ja toteutustavan kanssa.

CRUD-toiminnot tarkoittavat tapahtumien luomista, hakemista, päivittämistä ja poistamista.

### 4. Kalenterin perusrakenne ja kuukausien vaihtaminen

Kun kalenterin perusrakenne oli valmis, aloin rakentaa toiminnallisuuksia. Ensimmäinen suurempi haaste oli kuukausien vaihtaminen. Aluksi kalenteri oli jumissa yhdessä kuukaudessa.

Ratkaisin tämän tekemällä currentMonth-tilan ja toiminnot edelliseen ja seuraavaan kuukauteen siirtymistä varten. Kuukausien vaihtamiseen liittyvät toiminnot löytyvät riveiltä 24–25 ja 38–39. Kalenterin yläreunaan lisäsin myös painikkeet kuukausien vaihtamista varten.

### 5. Lista- ja lomakenäkymät

Seuraavaksi aloin rakentaa lista- ja lomakenäkymiä. Lista löytyy riveiltä 136–161 ja lomake riveiltä 164–211.

Lisäsin events.json-tiedostoon kaksi testitapahtumaa, joiden avulla pystyin testaamaan kalenteria. Samalla rakensin navigoinnin eri näkymien välille.

Navigointi perustuu currentView-tilaan, jonka avulla sovellus näyttää vain valitun näkymän. Näkymien vaihtaminen tapahtuu ilman sivun uudelleenlatausta.

### 6. Päivän tapahtumien näyttäminen

Seuraava ongelma oli, että kalenteripäivää pystyi klikkaamaan, mutta päivän tapahtumia ei vielä näytetty kalenterissa. Tämän vuoksi tapahtumia piti tarkistaa lista-näkymästä.

Ratkaisin tämän tekemällä toiminnon, joka etsii valitun päivän tapahtumat. Riveillä 69–70 tarkistetaan valitun päivän päivämäärä ja etsitään sitä vastaavat tapahtumat. Riveillä 117–133 nämä tapahtumat näytetään käyttäjälle.

### 7. Tapahtumien lisääminen ja poistaminen

Lomakenäkymässä käyttäjä voi luoda uuden tapahtuman antamalla sille nimen, kuvauksen, päivämäärän ja kategorian.

Tapahtuman nimi tarkistetaan ennen tallentamista. Jos nimi puuttuu, käyttäjälle näytetään virheilmoitus.

Lista-näkymässä tapahtumia voi myös poistaa **Poista**-painikkeella.

### 8. Backendin ja frontendin yhdistäminen

Projektin loppuvaiheessa yhdistin backendin ja frontendin toimimaan yhdessä.

Lisäsin Kalenteri.jsx-tiedostoon GET-, POST- ja DELETE-pyynnöt, joiden avulla frontend hakee tapahtumia backendistä sekä lisää ja poistaa tapahtumia.

### 9. Lopputulos

Lopputuloksena syntyi Reactilla toteutettu kalenterisovellus, jossa käyttäjä voi:

* selata eri kuukausia
* valita tietyn päivän
* nähdä valitun päivän tapahtumat
* tarkastella tapahtumia lista-näkymässä
* lisätä uusia tapahtumia
* poistaa tapahtumia
* määrittää tapahtumalle kategorian

Projektin aikana opin erityisesti Reactin tilanhallintaa, komponenttien rakentamista, päivämäärien käsittelyä date-fns-kirjastolla sekä eri näkymien hallintaa.

Backendin kautta sain myös kokemusta API-reiteistä, CRUD-toiminnoista ja CORS-asetuksista. Backendissä tarvitsin enemmän tekoälyn tukea, koska nämä asiat olivat itselleni vähemmän tuttuja kuin React-puoli.

## Työnjako

Projekti on tehty yksin.

## Tekoälyn käyttö tässä projektissa

Käytin projektissa tekoälyä erityisesti backendin toteutuksessa, koska backend-kehitys oli itselleni vähemmän tuttua.

Tekoäly auttoi esimerkiksi backendin rakenteen, API-reittien, CRUD-toimintojen ja CORS-asetusten kanssa. Lisäksi käytin tekoälyä joidenkin ongelmien selvittämiseen.

Tekoälyn antamia ratkaisuja tarkistin ja muokkasin itse projektin tarpeisiin. Vastasin itse lopullisesta toteutuksesta ja testasin sovelluksen toimivuuden.

En syöttänyt tekoälylle salasanoja, API-avaimia tai muuta arkaluonteista tietoa.

## Kuvakaappaukset

### Kalenterinäkymä

![Kalenterinäkymä](./screenshots/kalenteri.png)

### Lista-näkymä

![Lista-näkymä](./screenshots/lista.png)

### Tapahtuman lisääminen

![Tapahtuman lisääminen](./screenshots/lisaa-tapahtuma.png)

## Jatkokehitys

Sovellukseen olisi voinut lisätä vielä tarkemman päivä- ja tuntinäkymän. Päivää klikkaamalla voisi avautua näkymä, jossa päivän tapahtumat näkyvät tarkemmin eri kellonaikoina.

Lisäksi sovellukseen voisi myöhemmin lisätä esimerkiksi:

* tapahtumien muokkaamisen
* tapahtumille kellonajan ja keston
* toistuvat tapahtumat
* tapahtumien suodattamisen kategorian mukaan
* paremman mobiilinäkymän
