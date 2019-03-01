//  Imports
var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

//  Import custom modules
var helper = require('./helper');

//  use body parser module
router.use(bodyParser.json());

router
//  /stations_and_bikes -> # operational stations and # total bikes available
.get('/', (req,res,next) => {
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
    }).catch(err => console.log(err));
    
  });
  
    
module.exports = router;
