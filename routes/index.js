//  Imports
var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const https = require('https');

//  consts
const bike_api_url = 'https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&';

//  use body parser module
router.use(bodyParser.json());

//  configure routing
//  basic route
router

//  get methods

//  / -> info
.get('/', (req,res,next) => {
  res.json({
    body: {
      title: 'Information about the API',
      allowed_methods: 'GET',
      allowed_resources: '/distance, /stations_and_bikes',
      parameters_distance: 
        'origin : GPS coordinates, units : metric (default) or imperial, mode : ' +
        'walking (default) or transit or cycling or driving',
      parameters_stations_and_bikes: false
    }
  });
})

//  /stations_and_bikes -> # operational stations and # total bikes available
.get('/stations_and_bikes', (req,res,next) => {
  const rows = 10;
  let start = 1;
  https.get(bike_api_url + 'rows=' + rows + '&start=' + start, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      let stations = JSON.parse(data).records.map(x => x.fields);
      stations = stations.filter(x => (x.station_state.localeCompare('Operative') == 0));
      const num_bikes = stations
        .map(x => x.nbebike + x.nbbike)
        .reduce((acc, currValue, currIndex, array) => acc + currValue, 0);
      const num_stations = stations.length;
      
      res.json({
        number_of_stations: num_stations,
        number_of_bikes: num_bikes
      });
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
})

//  /distance?origin=x -> distance to closest operational station with available bikes
.get('/distance', (req,res,next) => {
  res.json({
    body: {
      title: 'distance'
    }
  });
})

;
/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/

module.exports = router;
