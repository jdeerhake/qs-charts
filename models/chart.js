var d3 = require( 'd3' ),
  $ = require( 'jquery' ),
  SmoothedDataSeries = require( './smoothed_data_series' );

var range = {
  pad : function( range, factor ) {
    return [ range[0] * ( 1 - factor ), range[1] * ( 1 + factor ) ];
  },
  clip : function( range, min, max ) {
    return [ Math.max( range[0], min ), Math.min( range[1], max ) ];
  },
  expand : function( range, min, max ) {
    return [ Math.min( range[0], min ), Math.max( range[1], max ) ];
  }
};

var w = Math.floor( window.innerWidth * 0.9 ) + 30,
  h = Math.floor( window.innerHeight * 0.8 ) + 30;

function Chart( selector, dataSeries, conf ) {
  this.data = [ dataSeries ];
  this.smoothData = [ (new SmoothedDataSeries( dataSeries )).singleExponential( 0.15 ) ];
  var x = this.x = d3.time.scale().range([ 0, w - 30 ]);
  var y = this.y = d3.scale.linear().range([ h - 30, 0 ]);
  this.xAxis = d3.svg.axis().scale( this.x ).orient( 'bottom' );
  this.yAxis = d3.svg.axis().scale( this.y ).orient( 'left' );
  this.line = d3.svg.line().x(function( p ) { return x( p[ 0 ] ); })
                           .y(function( p ) { return y( p[ 1 ] ); });

  this.svg = d3.select( 'body' ).append( 'svg' ).attr( 'width', w ).attr( 'height', h ).append( 'g' ).attr( 'transform', 'translate(30, 30)' );
}

Chart.prototype = {
  draw : function() {
    this.x.domain( this.smoothData[0].domain() );
    this.y.domain( range.pad( this.smoothData[0].range(), 0.01 ) );

    this.svg.append( 'g' )
      .attr( 'class', 'x axis' )
      .attr( 'transform', 'translate(0,' + (h - 60) + ')' )
      .call( this.xAxis );

    this.svg.append( 'g' )
      .attr( 'class', 'y axis' )
      .call( this.yAxis );

    this.path = this.svg.append( 'path' )
      .datum( this.smoothData[ 0 ].data() )
      .attr( 'class', 'line' )
      .attr( 'd', this.line );
  }
};


module.exports = Chart;