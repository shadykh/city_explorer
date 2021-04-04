# city_explorer


**Author**: Shady Khaled
**Version**: 1.0.0 

## Overview
City Explorer Application, allowing a user to search for a location, present a Map, as well as interesting information about the area, all using data from APIs that your server will fetch and manage.

## Getting Started
Just visit the link of the app.

## Architecture
I used : 
- cors
- dotenv
- express
- npm

## Change Log
- pull/1 :
    - data directory - containing location.json and weather.json
    - .env - with your PORT. Make sure this file is in your .gitignore.
    - README.md - with documentation regarding your lab and its current state of development. Check the "documentation" section below for more details on how that should look AT MINIMUM
    - .gitignore - with standard NodeJS configurations
    - .eslintrc.json - with Code 301 course standards for the linter
    - package.json - with all dependencies and any associated details related to configuration. The dependencies needed for today's lab include: express, dotenv, and cors. 
    - Note that the package-lock.json file is automatically created when dependencies are installed and ensures that future installations of the project use the same versions of the dependencies.
    - Deploy your basic express server to Heroku.
    - Create a route with a method of get and a path of /location. The route callback should invoke a function to convert the search query to a latitude and longitude. The function should use the provided JSON data.
    - A constructor function will ensure that each object is created according to the same format when your server receives the external data. Ensure your code base uses a constructor function for this resource.
    - Return an object which contains the necessary information for correct client rendering. See the sample response.
    - Deploy your updated express server to Heroku.
    - Confirm that your route is responding as expected by entering your deployed backend URL on the City Explorer app's welcome page. Then search for a location. You should see the map, but not any other data yet.


- pull/2 :
    - Create a route with a method of get and a path of /weather. The callback should use the provided JSON data.
    - A constructor function will ensure that each object is created according to the same format when the server receives data. Ensure your code base uses a constructor function for this resource.
    - Using each weather object of the result, return an array of objects for each day of the response which contains the necessary information for correct client rendering. See the sample response.
    - Deploy your updated server code to Heroku. 
    - Confirm that your route is responding as expected by entering your deployed backend URL on the City Explorer app's welcome page. Then search for a location. You should see the map, and now weather data.

- pull/3 :
    - Send a status of 500 and an error message to the client.
    - Deploy your updated sever code to Heroku.
    - Confirm that your route is responding as expected by entering your deployed backend URL on the City Explorer app's welcome page. Then search for an invalid location, by submitting an empty string. The network inspector panel should show a 500 for the response to the AJAX query.
    - Modfiy the README file.

-->