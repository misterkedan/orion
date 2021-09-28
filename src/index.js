import '@babel/polyfill'
import 'normalize.css'
import './styles/main.scss'
import * as THREE from 'three'
import TM from './js/objects/threeManager'
import loader from './js/objects/assetLoader'
import gsap from 'gsap'
import './js/objects/gsapTicker.js'
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import vShader from './shaders/sphere/vertex.glsl';
import fShader from './shaders/sphere/fragment.glsl';
import RotationControls from 'three-rotation-controls'

//let controls = new OrbitControls(TM.camera, TM.canvas);
const loopDuration = 6;
let mixer = 0;
let sphere;
let mousePos = {x: 0, y: 0};
let controls;

loader.onLoaded.add(() => {
    TM.init(
        loader.images['smaa-search'],
        loader.images['smaa-area']
    );

    loader.textures['subst-nrm'].wrapS = loader.textures['subst-nrm'].wrapT = THREE.RepeatWrapping;//THREE.MirroredRepeatWrapping;
    loader.textures['subst-nrm'].repeat.set( 100, 100 ); 

    start();
});

gsap.ticker.add(function ( time, delta, frame ) {
    TM.composer.render();
});

function start() {
    TM.camera.position.z = 6;
    TM.camera.position.y = 0;
    TM.camera.lookAt( new THREE.Vector3(0, 0, 0) );
    
    //addCameraAnimation();
    //addModel();
    addMesh();
    addPlane();
    addLight();
}

function addMesh() {
    const spheres = [];
    const geometry = new THREE.SphereGeometry( 1, 256, 256 );

    const material = new THREE.ShaderMaterial( {
        vertexShader: vShader,
        fragmentShader: fShader,
        uniforms: {
            uTime: { value: 0 },
            uDuration: { value: loopDuration },
            uMix: { value: 1 }
        }
    } );

    sphere = new THREE.Mesh( geometry, material );
    spheres.push( sphere );
    TM.scene.add( sphere );

    controls = new RotationControls( sphere, {
        lerpFactor: .05,
        amp: .5
    } );

    gsap.ticker.add( (time, delta) => {
        controls.update(); 

        material.uniforms.uTime.value = time;

        mixer = .5 + Math.cos(Math.PI + (time / loopDuration) * 2 * Math.PI) / 2;
        material.uniforms.uMix.value = mixer;
        //sphere.position.y = (-.5 + Math.sin( mixer )) / 4;
        //sphere.position.z = (-.5 + Math.sin( mixer )) * -1;

        sphere.position.x = Math.lerp(sphere.position.x, mousePos.x * 3, .05);
        sphere.position.z = Math.lerp(sphere.position.z, - ( .25 + mousePos.y) * 3.5, .05);
    })

}

function addPlane() {
    var material = new THREE.MeshStandardMaterial({
        color: 'black',
        side: THREE.DoubleSide,
        metalness: .2,
        roughness: .8,
        //map: loader.textures['subst-col'],
        //bumpMap: loader.textures['subst-nrm'],
        //bumpScale: 1,
        normalMap: loader.textures['subst-nrm'],
        normalScale: new THREE.Vector2(.1, .1)
    });

    /* material.onBeforeCompile = (shader) => {
        console.log( shader.fragmentShader );
        shader.fragmentShader = shader.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );', 
        `
            outgoingLight *= 1.0;
            gl_FragColor = vec4( outgoingLight, diffuseColor.a );
        `);
    }; */

    var plane = new THREE.Mesh(
        //new THREE.PlaneGeometry(1,1),
        new THREE.CircleGeometry( 1, 32 ),
        material
    );
    //plane.scale.set(300,2000,1);
    plane.scale.set(300,1000,1);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = 1.1;
    TM.scene.add( plane );

    var plane2 = plane.clone();
    plane2.position.y = -1.1;
    //plane2.rotation.z = Math.PI;
    TM.scene.add( plane2 );

    gsap.ticker.add( time => {
        //loader.textures['subst-col'].offset.y = - time / 20;
        loader.textures['subst-nrm'].offset.y = - time / 20;
        //loader.textures['subst-nrm'].rotation = time / 1000;
    })
}

function addLight() {
    var light = new THREE.PointLight();
    TM.scene.add(light);

    var color1 = new THREE.Color('orange');
    var color2 = new THREE.Color('white');

    gsap.ticker.add( (time, delta) => {
        light.position.copy( sphere.position );
        light.color.lerpColors(color1, color2, mixer);
        light.intensity = Math.lerp(3.5, 1, mixer);
    });
}

Math.lerp = function (value1, value2, amount) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
};

function normalizeMousePosition(ev) {
    let normalizedX, normalizedY;

    // Desktop
    if (ev.clientX != undefined) {
        normalizedX = -2 * (.5 - ev.clientX / window.innerWidth);
        normalizedY = 2 * (.5 - ev.clientY / window.innerHeight);
    }
    // Mobile 
    else {
        normalizedX = -2 * (.5 - ev.touches[0].clientX / window.innerWidth);
        normalizedY = 2 * (.5 - ev.touches[0].clientY / window.innerHeight);
    }    
    
    return {
        x: normalizedX,
        y: normalizedY
    }
}

function doSomething(ev) {
    mousePos = normalizeMousePosition(ev);
}

window.addEventListener('mousemove', doSomething);