import * as THREE from 'three'
import { VignetteEffect, TextureEffect, DepthOfFieldEffect, BloomEffect, SMAAEffect, SMAAPreset, EffectComposer, EffectPass, RenderPass, BlendFunction } from "postprocessing"

class _ThreeManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000 );
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            powerPreference: 'high-performance',
            antialias: false,
            stencil: false,
            depth: false
        });
        this.renderer.setClearColor(0xffffff);
        this.composer = new EffectComposer( this.renderer );
    }

    init(smaaSearch, smaaArea) {
        this.renderPass = new RenderPass(this.scene, this.camera);

        let dofEffect = new DepthOfFieldEffect(this.camera, {
            focusDistance: .004,
            focalLength: .01,
            bokehScale: 2
        });

        //dofEffect.target = new THREE.Vector3(0,0,0);
        
        this.effectPass = new EffectPass( this.camera, 
            //dofEffect, 
            new BloomEffect({
                intensity: .6,
                luminanceThreshold: .45
            }),
            new VignetteEffect({
                offset: .5,
                darkness: 1
            })
        );
        this.smaaPass = new EffectPass( this.camera, new SMAAEffect(smaaSearch, smaaArea, SMAAPreset.ULTRA) );
        
        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.effectPass);
        this.composer.addPass(this.smaaPass);
        
        window.addEventListener('resize', this.setSize.bind(this));
        this.setSize();
        
        // debug mode 
        if ( 1 ) {
            console.error('Debug mode! Press space to switch to COC');

            let cocTextureEffect = new TextureEffect({
                blendFunction: BlendFunction.SKIP,
                texture: dofEffect.renderTargetCoC.texture
            });
            this.composer.addPass( new EffectPass(this.camera, cocTextureEffect) );
            
            let blendSwitch = false;
            window.addEventListener('keydown', ev => {
                if (ev.key == ' ') {
                    blendSwitch = !blendSwitch;
                    cocTextureEffect.blendMode.setBlendFunction( blendSwitch ? BlendFunction.NORMAL : BlendFunction.SKIP );
                }
            })
            
            window.cocMaterial = dofEffect.circleOfConfusionMaterial;
            // use this in the console:
            // cocMaterial.uniforms.focusDistance.value = .03;
            // cocMaterial.uniforms.focalLength.value = .01;
        }
    }

    setSize() {        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.composer.setSize(this.canvas.width, this.canvas.height);
        this.camera.aspect = this.canvas.width / this.canvas.height;
        this.camera.updateProjectionMatrix();
        //if (!this.clock.running) this.renderOnce();
        //this.composer.render();
    }
}

const TM = new _ThreeManager( document.getElementById('canvas') );
window.TM = TM;
export default TM;

