'use strict';

const express = require('express');

require('dotenv').config();

const cors = require('cors');

const server = express();

const PORT = process.env.PORT || 5330;

server.use(cors());

server.get('/', (req, res) => {
    res.send('Welcome to the Main')
})


server.get('/location', (req, res) => {

    let locationData = require('./data/location.json');

    let renderedLocationData = new Location(locationData);

    res.send(renderedLocationData);
})


function Location(locationData) {

    /*  {
         "search_query": "seattle",
         "formatted_query": "Seattle, WA, USA",
         "latitude": "47.606210",
         "longitude": "-122.332071"
       } */
    let idx = 0;

    this.search_query = 'Lynnwood';
    this.formatted_query = locationData[idx].display_name;
    this.latitude = locationData[idx].lat;
    this.longitude = locationData[idx].lon;

}



server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})