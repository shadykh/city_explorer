'use strict';

const express = require('express');

require('dotenv').config();

const cors = require('cors');

const superagent = require('superagent');

const server = express();

const PORT = process.env.PORT || 5330;



// Routes

server.use(cors());

server.get('/', homePageFun);

server.get('/location', locationPageFun);

server.get('/weather', weatherPageFun);

server.get('*', missPathFun);



// Routes-Functions

function homePageFun(req, res) {
    res.send('Welcome to the Main')
};



function locationPageFun(req, res) {

    let cityVar = req.query.city;

    let keyVal = process.env.LOCATION_KEY;

    let LocationURL = `https://eu1.locationiq.com/v1/search.php?key=${keyVal}&q=${cityVar}&format=json`;

    superagent.get(LocationURL)
        .then(LocationData => {
            let locData = LocationData.body;

            const newlocationData = new Location(cityName, locData);

            res.send(newlocationData);

        })

        .catch(error => {
            console.log('inside superagent');
            console.log('Error in getting data from LocationIQ server')
            console.error(error);
            res.send(error);
        })
};



function weatherPageFun(req, res) {

    let weatherData = require('./data/weather.json');
    let data = weatherData.data.map(value => {
        let renderedWeatherData = new Location(value);
        return renderedWeatherData;
    });

    res.send(data);
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




function Location(weatherData) {

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

    this.forecast = weatherData.weather.description;

    this.time = weatherData.datetime;

    Location.all.push(this);
}

Location.all = [];



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




server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})