var Chart = require( '../models/chart' ),
  DataSeries = require( '../models/data_series' ),
  $ = require( 'jquery' );


function smooth( data, radius, weightFunc ) {
  var weighted = [],
    len = data.length;

  data.forEach(function( pair, i ) {
    var val = pair[ 1 ];

    var x;
    for( x = -radius; x <= radius; x++ ) {
      var newI = i + x,
        weight = weightFunc( x );

      if( newI < 0 || newI >= len ) { break; }

      var w = weighted[ newI ] = weighted[ newI ] || { weight : 0, val : 0 };
      w.weight += weight;
      w.val += ( weight * val );
    }
  });

  return data.map(function( pair, i ) {
    return [ pair[ 0 ], weighted[ i ].val / weighted[ i ].weight ];
  });
}


$.ajax({
  url : '/withings/measurements',
  type : 'get',
  dataType : 'json'
}).done(function( data ) {
  var series = new DataSeries( data.weight );

  window.chart = new Chart( 'body', series );
  window.chart.draw();
});