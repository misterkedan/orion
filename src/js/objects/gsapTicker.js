import Stats from 'three/examples/jsm/libs/stats.module.js'
import gsap from 'gsap'

gsap.ticker.fps(60);

if ( process.env.NODE_ENV == "development" ) {
    var stats = new Stats();

    document.body.appendChild( stats.dom );

    gsap.ticker.add( function() {
        stats.end();
    });
    gsap.ticker.add( function() {
        stats.begin();
    });    
}