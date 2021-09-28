import * as THREE from 'three';
import { ThreeSet } from './ThreeSet';
import gsap from 'gsap';
import vShader from './shaders/vertex.glsl';
import fShader from './shaders/fragment.glsl';
import RotationControls from 'three-rotation-controls';

const loopDuration = 6;
let mixer = 0;
let sphere;
let mousePos = { x: 0, y: 0 };
let controls;

const set = new ThreeSet( document.getElementById( 'canvas' ) );
set.init();

gsap.ticker.add( () => set.composer.render() );

function start() {

	set.camera.position.z = 6;
	set.camera.position.y = 0;
	set.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

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
	set.scene.add( sphere );

	controls = new RotationControls( sphere, {
		lerpFactor: 0.05,
		amp: 0.5
	} );

	gsap.ticker.add( time => {

		controls.update();

		material.uniforms.uTime.value = time;

		mixer = 0.5 + Math.cos( Math.PI + ( time / loopDuration ) * 2 * Math.PI ) / 2;
		material.uniforms.uMix.value = mixer;

		sphere.position.x = lerp( sphere.position.x, mousePos.x * 3, 0.05 );
		sphere.position.z = lerp( sphere.position.z, - ( 0.25 + mousePos.y ) * 3.5, 0.05 );

	} );

}

function addPlane() {

	var material = new THREE.MeshStandardMaterial( {
		color: 'grey',
		side: THREE.DoubleSide,
		metalness: 0.2,
		roughness: 0.8,
		//map: loader.textures['subst-col'],
		//bumpMap: loader.textures['subst-nrm'],
		//bumpScale: 1,
		//normalMap: loader.textures['subst-nrm'],
		//normalScale: new THREE.Vector2(.1, .1)
	} );

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
	plane.scale.set( 300, 1000, 1 );
	plane.rotation.x = Math.PI / 2;
	plane.position.y = 1.1;
	set.scene.add( plane );

	var plane2 = plane.clone();
	plane2.position.y = - 1.1;
	//plane2.rotation.z = Math.PI;
	set.scene.add( plane2 );

	//gsap.ticker.add( time => {
	//    //loader.textures['subst-col'].offset.y = - time / 20;
	//    //loader.textures['subst-nrm'].offset.y = - time / 20;
	//    //loader.textures['subst-nrm'].rotation = time / 1000;
	//})

}

function addLight() {

	var light = new THREE.PointLight();
	set.scene.add( light );

	var color1 = new THREE.Color( 'orange' );
	var color2 = new THREE.Color( 'white' );

	gsap.ticker.add( () => {

		light.position.copy( sphere.position );
		light.color.lerpColors( color1, color2, mixer );
		light.intensity = lerp( 3.5, 1, mixer );

	} );

}

function lerp( value1, value2, amount ) {

	amount = ( amount < 0 ) ? 0 : ( amount > 1 ) ? 1 : amount;
	return value1 + ( value2 - value1 ) * amount;

}

function onPointerMove( event ) {

	const source = ( event.touches ) ? event.touches[ 0 ] : event;
	mousePos.x = - 2 * ( 0.5 - source.clientX / window.innerWidth );
	mousePos.y = 2 * ( 0.5 - source.clientY / window.innerHeight );

}

//window.addEventListener( 'pointermove', onPointerMove );

start();
