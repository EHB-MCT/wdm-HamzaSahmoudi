1. Overzicht

Project: Games Recommendations
Doel: Een interactieve website waar gebruikers hun gespeelde games kunnen bekijken in een lijst en grafiek.
Op basis van de genres die ze het meest spelen, geeft het systeem aanbevelingen (recommendations) voor andere games die ze waarschijnlijk leuk vinden.
De site gebruikt een lichte parallax-animatie bij het scrollen om het geheel dynamisch en modern te maken.

2. Technologieën

- Framework: React
- Taal: JavaScript (ES6+)
- Styling: CSS
- Visualisatie: Chart.js
- Data-opslag: eigen games.json (later MongoDB)
- Versiebeheer: Git en GitHub

3. Data

Bron: lokaal JSON-bestand met informatie over games (titel, genre, rating, speeltijd).
Later wordt de data opgeslagen in MongoDB zodat de gebruiker eigen gegevens kan beheren.

Voorbeeld record:

{
"title": "Elden Ring",
"genre": "RPG",
"rating": 9,
"playtime": 120
}

Voordelen:

- JSON werkt offline en is snel te bewerken.
- MongoDB maakt dynamische opslag en updates mogelijk.

Nadelen:

- JSON is statisch.
- MongoDB vereist een backend (Node.js en Express).

Alternatieven (optioneel)

API / Dataset Type Link
RAWG API Gratis https://rawg.io/apidocs

IGDB API Key nodig https://api-docs.igdb.com/

4. Testplan

Ik test of:

de lijst alle games correct toont,

de grafiek de juiste genres weergeeft,

de parallax soepel werkt bij scrollen,

de layout goed blijft op kleine schermen,

de recommendation juist genres herkent,

en later of data goed uit MongoDB wordt geladen.

5. Beslissingen

Ik begin met een eenvoudige lokale setup (React + JSON) zodat ik snel een prototype heb.
Daarna voeg ik:

MongoDB toe voor echte data-opslag,

een recommendation-functie die kijkt naar het populairste genre,

en eventueel een API om extra game-info op te halen.

7. Roadmap

Prototype bouwen met JSON-data.

Recommendation-systeem toevoegen (op basis van genre).

Backend maken (Node.js + Express + MongoDB).

Data opslaan en dynamisch laden.

Verbeterde visualisaties of extra grafieken toevoegen.
