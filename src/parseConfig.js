// parseConfig.js
import Parse from 'parse/dist/parse.min.js';

Parse.initialize(
  import.meta.env.VITE_PARSE_APP_ID,        // Application ID from environment
  import.meta.env.VITE_PARSE_JS_KEY         // JavaScript Key from environment
);
Parse.serverURL = 'https://parseapi.back4app.com/';

export default Parse;