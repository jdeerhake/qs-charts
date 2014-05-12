var _ = require( 'lodash' );
var passport = require( 'passport' );
var WithingsStrategy = require( 'passport-withings' ).Strategy;
var WithingsAPI = require( 'withings-api' );

var settings = require( '../settings' );


passport.use(new WithingsStrategy( _.extend({
    callbackURL: 'http://' + settings.app.url + ':' + settings.app.port + '/withings/auth/return'
  }, settings.withings ),
  function( token, verifier, profile, done ) {
    var withings = {
      token : token,
      verifier : verifier
    };

    profile.withings = withings;

    return done( null, profile );
  }
));

function ensureAuthenticated( req, res, next ) {
  if( req.isAuthenticated() || ( req.cookies.user && req.cookies.user.withings ) ) {
    var user = req.session.passport.user || req.cookies.user;
    req.withings = new WithingsAPI( keys( user ), user.id, { timeSeriesFormat : true, standardUnits : true } );
    return next();
  } else {
    res.send( 401 );
  }
}

function keys( user ) {
  return {
    consumerKey : settings.withings.consumerKey,
    consumerSecret : settings.withings.consumerSecret,
    token : user.withings.token,
    verifier : user.withings.verifier
  };
}

function measurements( req, res ) {
  req.withings.measurements().then( res.send.bind( res ), console.log );
}

function weight( req, res ) {
  req.withings.weight().then( res.send.bind( res ) );
}

function height( req, res ) {
  req.withings.height().then( res.send.bind( res ) );
}

function user( req, res ) {
  req.withings.user().then( res.send.bind( res ) );
}


module.exports = function( app ) {
  app.get( '/withings/auth', passport.authenticate('withings'));

  app.get( '/withings/auth/return',
          passport.authenticate( 'withings', { failureRedirect: '/' }),
          function( req, res ) {
            res.cookie( 'user', req.session.passport.user );
            res.send();
          }
          );


  app.get( '/withings/measurements/weight', ensureAuthenticated, weight );
  app.get( '/withings/measurements/height', ensureAuthenticated, height );
  app.get( '/withings/measurements', ensureAuthenticated, measurements );
  app.get( '/withings/user',   ensureAuthenticated, user );

};