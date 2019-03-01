//  Imports
var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const https = require('https');

//  consts
const bike_api_url = 'https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&';

//  use body parser module
router.use(bodyParser.json());

let getStationsInfo = () => {
  return new Promise(function(resolve, reject) {
    //  how many stations to ask for
    const rows = 1;
    //  which should be the first station to be brought back
    let start = 1;

    //  first get to check how many results are available
    https.get(bike_api_url + 'rows=' + rows + '&start=' + start, (resp) => {
      let data = '';
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        //  total number of results reported by the bike API
        const num_hits = JSON.parse(data).nhits;

        //  get all station results from bike API
        https.get(bike_api_url + 'rows=' + num_hits + '&start=' + start, (resp) => {
          let allData = '';

          // A chunk of data has been recieved.
          resp.on('data', (newChunk) => {
            allData += newChunk;
          });

          // The whole response has been received. Print out the result.
          resp.on('end', () => {
            let stations = JSON.parse(allData).records.map(x => x.fields);
            resolve(stations);
          });
        }).on("error", (err) => {
          reject(err.message);
        });
      });
    }).on("error", (err) => {
      reject(err.message);
    });
  });
};

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
  getStationsInfo().then(stations => {
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

//  /distance?origin=x -> distance to closest operational station with available bikes
.get('/distance', async (req,res,next) => {
  returnPromise().then(x => {
    console.log('Did it');
    res.json(x);
  }).catch(err => console.log(err));
})

;
/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/

module.exports = router;
