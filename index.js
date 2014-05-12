var settings = require( './settings' );

var app = require( './lib/server' );

require( './lib/passport' )( app );

require( './controllers/withings' )( app );

app.listen( settings.app.port );