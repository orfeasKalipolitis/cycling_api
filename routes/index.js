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
        'origin : GPS coordinates as latitude, longtitude',
      parameters_stations_and_bikes: false
    }
  });
});

module.exports = router;
