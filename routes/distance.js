//  Imports
var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

//  Import custom modules
var helper = require('./helper');

//  use body parser module
router.use(bodyParser.json());

router.get('/', (req,res,next) => {
    
    //  got no origin
    if (Object.entries(req.query).length === 0 && req.query.constructor === Object)
        res.json({info: 'Please refer to / for help.'});
    else {
        let params = req.query.origin.split(',').map(x => Number(x));

        helper.getStationsInfo().then(stations => {
            let operationalStations = stations
                .filter(x => (x.station_state.localeCompare('Operative') == 0));

            //  extract coordinates
            let coordsArr = operationalStations
            .map(x => {return {lat: (x.geo)[0], lon: (x.geo)[1]}});

            let userCoords = {lat: params[0], lon: params[1]};

            
            let distances = coordsArr.map(x => 
                helper.haversineDistance(userCoords.lat, userCoords.lon, x.lat, x.lon));

            let min = distances[0];
            let ind = 0;

            for (let i = 1; i < distances.length; i++) {
                if (distances[i] < min) {
                    min = distances[i];
                    ind = i;
                }
            }

            res.json({station: operationalStations[ind], distance: min});
        }).catch(err => console.log(err));
    }
});

module.exports = router;
