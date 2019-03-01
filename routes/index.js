//  Import standard modules
var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

//  Import custom modules
var helper = require('./helper');

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
  helper.getStationsInfo().then(stations => {
    //  station_state === 'Operative'
    let operationalStations = stations.filter(x => (x.station_state.localeCompare('Operative') == 0));

    //  get number of bikes (bikes + ebikes)
    const num_bikes = operationalStations
      .map(x => x.nbebike + x.nbbike)
      .reduce((acc, currValue, currIndex, array) => acc + currValue);

    //  get number of operational stations
    const num_stations = operationalStations.length;
    
    res.json({
      number_of_stations: num_stations,
      number_of_bikes: num_bikes
    });
  });
  
})
;

router.route('/distance')
//  /distance?origin=x -> info
.get((req,res,next) => {
  res.json({info: 'Please refer to / for help.'});
})

router.route('/distance:origin')
//  /distance?origin=x -> distance to closest operational station with available bikes
.get((req,res,next) => {
  getStationsInfo().then(stations => {
    //  Get operational stations' coordinates, note: geo[0] = latitude and geo[1] = longtitude
    let coords = stations
      .filter(x => (x.station_state.localeCompare('Operative') == 0))
      .map(x => {return {lat: (x.geo)[0], lon: (x.geo)[1]}});
    console.log(req.params);
    res.json(coords);
  }).catch(err => console.log(err));
});


module.exports = router;
