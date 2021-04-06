'use strict';

const express = require('express');

require('dotenv').config();

const cors = require('cors');

const superagent = require('superagent');

const pg = require('pg');

const server = express();

const PORT = process.env.PORT || 5330;

//const client = new pg.Client(process.env.DATABASE_URL);
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });



// Routes

server.use(cors());

server.get('/', homePageFun);

server.get('/location', checkDataBase);

server.get('/weather', weatherPageFun);

server.get('/parks', parksPageFun);

server.get('*', missPathFun);



// Routes-Functions

function homePageFun(req, res) {
    res.send('Welcome to the Main')
};


function checkDataBase(req, res) {

    let cityVar = req.query.city;

    let SQL = `SELECT * FROM cities WHERE search_query = '${cityVar}'`

    client.query(SQL)
        .then(result => {
            if (result.rows.length !== 0) {
                res.send(result.rows[0])
            }
        })
    client.query(SQL)
        .then(result => {
            if (result.rows.length === 0) {
                let data = locationPageFun(cityVar);
                res.send(data);
            }
        })
        .catch(error => {
            res.send(error);
        })
}


function bulidData(data) {
    let search_query = data.search_query;
    let formatted_query = data.formatted_query;
    let latitude = data.latitude;
    let longitude = data.longitude;
    let SQL = `INSERT INTO cities (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4);`;
    let safeValues = [search_query, formatted_query, latitude, longitude];
    client.query(SQL, safeValues);
}



//http://localhost:4420/location?city=amman

function locationPageFun(city) {

    let cityVar = city;

    let keyVal = process.env.LOCATION_KEY;

    let locationURL = `https://eu1.locationiq.com/v1/search.php?key=${keyVal}&q=${cityVar}&format=json`;

    superagent.get(locationURL)
        .then(locationData => {

            let locData = locationData.body;
            const newLocationData = new Location(cityVar, locData);
            let data = bulidData(newLocationData);
            return data;
        })

};


// http://localhost:4420/weather?search_query=amman&formatted_query=Amman%2C%2011181%2C%20Jordan&latitude=31.9515694&longitude=35.9239625&page=1

function weatherPageFun(req, res) {

    let cityVar = req.query.search_query;

    let keyVal = process.env.WEATHER_KEY;

    let weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityVar}&key=${keyVal}`;

    superagent.get(weatherURL)
        .then(weatherData => {

            let wethData = weatherData.body;
            let data = wethData.data.map(val => {
                const newWeatherData = new Weather(val);
                return newWeatherData
            })


            res.send(data);

        })

        .catch(error => {
            console.log('Error in getting data from LocationIQ server')
            console.error(error);
            res.send(error);
        })
};

// http://localhost:4420/parks?search_query=seattle%20&formatted_query=Seattle%2C%20King%20County%2C%20Washington%2C%20USA&latitude=47.6038321&longitude=-122.3300624&page=1

function parksPageFun(req, res) {

    let cityVar = req.query.search_query;

    let keyVal = process.env.PARKS_KEY;

    let parksURL = `https://developer.nps.gov/api/v1/parks?q=${cityVar}&limit=10&api_key=${keyVal}`;

    superagent.get(parksURL)
        .then(parksData => {


            let parkData = parksData.body;
            let data = parkData.data.map(val => {
                const newParksData = new Park(val);
                return newParksData
            })


            res.send(data);

        })

        .catch(error => {
            console.log('Error in getting data from LocationIQ server')
            console.error(error);
            res.send(error);
        })
};





function Location(cityName, locData) {

    /*     {
            "search_query": "seattle",
            "formatted_query": "Seattle, WA, USA",
            "latitude": "47.606210",
            "longitude": "-122.332071"
        } */

    this.search_query = cityName;
    this.formatted_query = locData[0].display_name;
    this.latitude = locData[0].lat;
    this.longitude = locData[0].lon;

}




function Weather(weatherData) {

    /* 
        [
            {
              "forecast": "Partly cloudy until afternoon.",
              "time": "Mon Jan 01 2001"
            },
            {
              "forecast": "Mostly cloudy in the morning.",
              "time": "Tue Jan 02 2001"
            },
            ...
          ] */

    this.forecast = weatherData.weather.description

    this.time = new Date(weatherData.datetime).toString().slice(0, 15);
}



function Park(parkData) {

    /*     [
            {
             "name": "Klondike Gold Rush - Seattle Unit National Historical Park",
             "address": "319 Second Ave S., Seattle, WA 98104",
             "fee": "0.00",
             "description": "Seattle flourished during and after the Klondike Gold Rush. Merchants supplied people from around the world passing through this port city on their way to a remarkable adventure in Alaska. Today, the park is your gateway to learn about the Klondike Gold Rush, explore the area's public lands, and engage with the local community.",
             "url": "https://www.nps.gov/klse/index.htm"
            },
            {
             "name": "Mount Rainier National Park",
             "address": "55210 238th Avenue East, Ashford, WA 98304",
             "fee": "0.00",
             "description": "Ascending to 14,410 feet above sea level, Mount Rainier stands as an icon in the Washington landscape. An active volcano, Mount Rainier is the most glaciated peak in the contiguous U.S.A., spawning five major rivers. Subalpine wildflower meadows ring the icy volcano while ancient forest cloaks Mount Rainier’s lower slopes. Wildlife abounds in the park’s ecosystems. A lifetime of discovery awaits.",
             "url": "https://www.nps.gov/mora/index.htm"
            },
            ...
        ] */

    this.name = parkData.fullName

    this.address = `${parkData.addresses[0].line1}, ${parkData.addresses[0].city}, ${parkData.addresses[0].stateCode} ${parkData.addresses[0].postalCode}`;

    if (parkData.fees.length === 0) {
        this.fee = '0.00';
    } else {
        this.fee = parkData.fees;
    }

    this.description = parkData.description

    this.url = parkData.url
}




function missPathFun(req, res) {

    /*  {
         status: 500,
         responseText: "Sorry, something went wrong",
         ...
       } */

    let err500 = handelError();

    res.send(err500)
};


function handelError() {

    let errObj = {
        'status': 500,
        'responseText': 'Sorry, something went wrong'
    };

    return errObj;
}




client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Listening on PORT ${PORT}`)
        })
    })

