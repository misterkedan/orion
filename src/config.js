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

const config = { defaults, random };

export { config };
