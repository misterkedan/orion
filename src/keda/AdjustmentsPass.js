import { NodePass } from 'three/examples/jsm/nodes/postprocessing/NodePass';
import {
	ScreenNode,
	FloatNode,
	ColorAdjustmentNode
} from 'three/examples/jsm/nodes/Nodes';

class AdjustmentsPass extends NodePass {

	/**
	 * Use with EffectComposer to control image adjustments.
	 * @param { Number } hue 			[0]- 1
	 * @param { Number } saturation 	 0 -[1]
	 * @param { Number } vibrance 		[0]- 1
	 * @param { Number } brightness 	[0]- 1
	 * @param { Number } contrast 		 0 -[1]
	 */
	constructor( {

		hue = 0,
		saturation = 1,
		vibrance = 0,
		brightness = 0,
		contrast = 1

	} = {} ) {

		super();

		hue = new FloatNode( hue );
		saturation = new FloatNode( saturation );
		vibrance = new FloatNode( vibrance );
		brightness = new FloatNode( brightness );
		contrast = new FloatNode( contrast );

		let screenNode = new ScreenNode();
		let hueNode = new ColorAdjustmentNode(
			screenNode, hue, ColorAdjustmentNode.HUE );
		let satNode = new ColorAdjustmentNode(
			hueNode, saturation, ColorAdjustmentNode.SATURATION );
		let vibranceNode = new ColorAdjustmentNode(
			satNode, vibrance, ColorAdjustmentNode.VIBRANCE );
		let brightnessNode = new ColorAdjustmentNode(
			vibranceNode, brightness, ColorAdjustmentNode.BRIGHTNESS );
		let contrastNode = new ColorAdjustmentNode(
			brightnessNode, contrast, ColorAdjustmentNode.CONTRAST );

		this.input = contrastNode;
		this._hue = hue;
		this._saturation = saturation;
		this._vibrance = vibrance;
		this._brightness = brightness;
		this._contrast = contrast;

	}

	get hue() {

		return this._hue.value;

	}

	get saturation() {

		return this._saturation.value;

	}

	get vibrance() {

		return this._vibrance.value;

	}

	get brightness() {

		return this._brightness.value;

	}

	get contrast() {

		return this._contrast.value;

	}

	set hue( value ) {

		this._hue.value = value;

	}

	set saturation( value ) {

		this._saturation.value = value;

	}

	set vibrance( value ) {

		this._vibrance.value = value;

	}

	set brightness( value ) {

		this._brightness.value = value;

	}

	set contrast( value ) {

		this._contrast.value = value;

	}

}

export { AdjustmentsPass };
