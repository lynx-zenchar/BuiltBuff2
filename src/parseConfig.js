// parseConfig.js
import Parse from 'parse/dist/parse.min.js';

Parse.initialize(
  'wZx2txCduEKOjoqh6Pln5mFQlkYTyis38Iv8CcSk',        // Replace with your Application ID
  'eS3B87fbW0jpd3Blf3zWt1dVODBqBlgiTIflS7ri' // Replace with your JavaScript Key
);
Parse.serverURL = 'https://parseapi.back4app.com/'; // Replace if your server URL is different

export default Parse;