var moment = require( 'moment' ),
  _ = require( 'lodash' );


var helpers = {
  minMax : function( arr ) {
    return [ Math.min.apply( null, arr ), Math.max.apply( null, arr) ];
  },
  asMilliseconds : function( m ) {
    return m.valueOf();
  },
  asMoment : function( ms ) {
    return moment( ms );
  }
};


function DataSeries( data ) {
  this.unit = data.unit;
  this._data = data.values.map(function( pair ) {
    return [ moment.unix( pair[0] ) ].concat( _.rest( pair ) );
  });

}

DataSeries.prototype = {
  data : function( timeFormatter ) {
    timeFormatter = timeFormatter || helpers.asMilliseconds;
    return this._data.map(function( pair ) {
      return [ timeFormatter( pair[0] ) ].concat( _.rest( pair ) );
    });
  },
  domain : function() {
    return helpers.minMax( this.values( 0 ).map( helpers.asMilliseconds ) );
  },
  range : function( i ) {
    i = i || 1;
    return helpers.minMax( this.values( i ) );
  },
  values : function( index ) {
    return this._data.map(function( p ) { return p[ index ]; });
  },
  seriesCount : function() {
    return this._data[ 0 ].length - 1;
  }
};


module.exports = DataSeries;