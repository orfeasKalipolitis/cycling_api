//  Imports
const https = require('https');

//  consts
const bike_api_url = 'https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&';

//  prototype for degrees -> rads
Number.prototype.toRad = () => this * Math.PI / 180;

//  gets crow flight distance between two coordinates
let haversineDistance = (lat1, lon1, lat2, lon2) => {
    //  Earth's radius in km
    const R = 6371;
  
    //  perform calculation
    let x1 = lat2-lat1;
    let dLat = x1.toRad();  
    let x2 = lon2-lon1;
    let dLon = x2.toRad();  
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);  
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  
    return d = R * c; 
};

//  gets stations from bike API
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

module.exports = {haversineDistance, getStationsInfo};
