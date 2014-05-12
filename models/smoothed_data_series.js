var _ = require( 'lodash' ),
  DataSeries = require( './data_series' );

var smoothers = {
  singleExponential : function( a, y ) {
    return y.reduce(function( S, val, i ) {
      if( i === 0 ) {
        S[ 0 ] = val;
      } else {
        S[ i ] = ( y[ i - 1 ] * a ) + ( S[ i - 1 ] * ( 1 - a ) );
      }
      return S;
    }, []);
  }
};

function zipVals( times, vals ) {
  vals.unshift( times );
  return _.zip.apply( null, vals );
}


function SmoothedDataSeries( dataSeries ) {
  this._dataSeries = dataSeries;
  this._vals = _.range( 1, dataSeries.seriesCount() + 1 ).map(function( i ) {
    return dataSeries.values( i );
  });
  this._times = dataSeries.values( 0 ).map(function( m ) { return m.unix(); });
}

SmoothedDataSeries.prototype = {
  smooth : function() {
    var smoothed = zipVals( this._times, this._vals.map( _.partial.apply( null, arguments ) ) );
    return new DataSeries({ values : smoothed, unit : this._dataSeries.unit });
  }
};

_.extend( SmoothedDataSeries.prototype, (function() {
  return Object.keys( smoothers ).reduce(function( funcs, key ) {
    funcs[ key ] = function() {
      var args = [ smoothers[ key ] ].concat( Array.prototype.slice.call( arguments ) );
      return this.smooth.apply( this, args );
    };
    return funcs;
  }, {});
}()) );


module.exports = SmoothedDataSeries;