var gulp = require( 'gulp' ),
    plumber = require( 'gulp-plumber' ),
    browserify = require( 'gulp-browserify' );

var bfyConf = {
    source : 'public/entry.js'
};

var paths = {
    scripts : [ 'public/entry.js' ],
    output : 'public/compiled'
};

gulp.task( 'scripts', function() {
    gulp.src( paths.scripts )
        .pipe( plumber() )
        .pipe( browserify( bfyConf ) )
        .pipe( gulp.dest( paths.output ) );
});

gulp.task( 'watch', function() {
    gulp.watch( [ 'public/entry.js', 'lib/*.js', 'models/*.js' ], [ 'scripts' ]);
});

gulp.task( 'compile', [ 'scripts' ]);

gulp.task( 'default', [ 'watch' ]);