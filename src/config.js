const constants = {

	CAMERA_SPEED: 0.02,
	CAMERA_X: 0,
	CAMERA_Y: 0.5,
	CAMERA_Z: 10,
	CAMERA_Z_PORTRAIT: 14,

	FLOOR_SIZE: 110,
	FLOOR_TEXTURE_URL: 'textures/polished_concrete_basecolor.jpg',
	FLOOR_Y: - 1.35,

	MAX_FPS: 60,

	MIN_HUE: 0, 		MAX_HUE: Math.PI * 2,
	MIN_PASSES: 1, 		MAX_PASSES: 4,
	MIN_SATURATION: 0, 	MAX_SATURATION: 3,
	MIN_SMOOTHNESS: 3, 	MAX_SMOOTHNESS: 30,
	MIN_SPEED: 1, 		MAX_SPEED: 100,
	MIN_ORB_VALUE: 0, 	MAX_ORB_VALUE: 1,

	ORB_ROTATION_SPEED: 0.01,
	ORB_SEGMENTS: 320,
	ORB_Z_LANDSCAPE: 0,
	ORB_Z_PORTRAIT: 2,

	SAVE_BUTTON_LABEL: 'save (URL)',

	STORAGE_LAST: 'last',
	STORAGE_GUI: 'closeGUI',
	STORAGE_DURATION: 60 * 60 * 1000, // 1 hour, in milliseconds

	TITLE: 'Orion',

	VIGNETTE_TOP: 0.72,
	VIGNETTE_BOTTOM: 1.2,
	VIGNETTE_FALLOFF: 0.25,

	DIGITS: 2,

};

const defaults = {

	adjustments: {
		hue: 0,
		saturation: 1.5,
	},

	bloom: {
		threshold: 0.6,
		strength: 0.2,
		radius: 0.8,
	},

	orb: {
		passes: 3,
		speed: 6,
		smoothness: 7,

		value1: 0.7,
		value2: 0.9,

		rotationSpeed: {
			x: 0,
			y: 9,
			z: 0,
		},
	},

};

const RANDOM_RANGE = 30;
const random = {

	adjustments: {
		hue: { min: 0, max: 2 * Math.PI },
		saturation: { min: 0, max: 3 },
	},

	orb: {
		passes: { min: 2, max: 4, round: true },
		speed: { min: 1, max: RANDOM_RANGE, round: true },
		smoothness: { min: 5, max: 10, round: true },
		value1: { min: 0, max: 1 },
		value2: { min: 0, max: 1 },
	},

	rotationSpeed: {
		x: { min: - RANDOM_RANGE, max: RANDOM_RANGE, round: true },
		y: { min: - RANDOM_RANGE, max: RANDOM_RANGE, round: true },
		z: { min: - RANDOM_RANGE, max: RANDOM_RANGE, round: true },
	},

};

const config = { ...constants, defaults, random };

export { config };
