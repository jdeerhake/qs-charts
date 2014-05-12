var express = require( 'express' );
var session = require( 'express-session' );
var cookieParser = require( 'cookie-parser' );
var settings = require( '../settings' );

var app = express();

app.use( express.static( process.cwd() + '/public' ) );
app.use( cookieParser( settings.cookies.secret ) );
app.use( session() );


module.exports = app;