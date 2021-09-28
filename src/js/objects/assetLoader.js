import MultiLoader from '@thibka/three-multiloader'
//import TM from './threeManager'
//import { CubeTextureLoader } from 'three';
//import { BasisTextureLoader } from 'three/examples/jsm/loaders/BasisTextureLoader.js';

const loader = new MultiLoader({ 
    progressBar: false,
    
    //cubeTextureLoader: CubeTextureLoader,

    //basisLoader: BasisTextureLoader, 
    //renderer: TM.composer.renderer 
});

loader.load([
    { alias: 'subst-nrm', type: 'texture', path: 'textures/Metal_Hammered_004_normal.jpg' },
]);

export default loader;