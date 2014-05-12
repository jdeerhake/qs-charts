var _ = require( 'lodash' );
var keys = require( './keys' );

var settings = {
  app : {
    url : 'localhost',
    port : 8000
  },
  withings : {
    consumerKey: 'set me in keys.js',
    consumerSecret: 'set me in keys.js'
  },
  cookies : {
    secret : 'set me in keys.js'
  }
};


module.exports = _.merge( settings, keys );
