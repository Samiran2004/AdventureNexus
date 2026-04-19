const axios = require('axios');
axios.get('https://indianapi.in/trains_between_stations', {
  params: { from_station_code: 'KGP', to_station_code: 'HWH' },
  headers: { 'x-api-key': process.env.INDIANAPI_KEY || '' },
  timeout: 5000
}).then(console.log).catch(e => console.log(e.message));
