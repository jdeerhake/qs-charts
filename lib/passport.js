var passport = require( 'passport' );

passport.serializeUser(function( user, done ) {
  done( null, user );
});

passport.deserializeUser(function( obj, done ) {
  done( null, obj );
});


module.exports = function( app ) {
  app.use( passport.initialize() );
  app.use( passport.session() );
};