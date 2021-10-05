class AnimationClock {

	/**
	 * Fires the specified callback or array of callbacks at a specific FPS rate.
	 * @param { Function|Array[Function] } 	callbacks 	Function
	 * @param { Number } fps	Frames per second limiter, 0 for uncapped frames.
	 */
	constructor( callbacks = null, fps = 0 ) {

		this.callbacks = ( typeof callbacks === 'function' )
			? [ callbacks ] : callbacks;
		this.fps = fps;
		this.elapsed = 0;

		this._last = 0;
		this._delta = 0;
		this._isPlaying = false;
		this._onTick = this.update.bind( this );

	}

	/*-------------------------------------------------------------------------/

		Callback management

	/-------------------------------------------------------------------------*/

	add( callback ) {

		if ( this.has( callback ) ) return;
		this.callbacks.push( callback );

	}

	remove( callback ) {

		if ( ! this.has( callback ) ) return;
		this.callbacks.splice( this.callbacks.indexOf( callback ), 1 );

	}

	has( callback ) {

		return this.callbacks.includes( callback );

	}

	/*-------------------------------------------------------------------------/

		Animation

	/-------------------------------------------------------------------------*/

	reset() {

		this.elapsed = 0;

	}

	start() {

		this._last = this.now;
		this._delta = 0;
		this._isPlaying = true;
		this.tick();

	}

	pause() {

		this._isPlaying = false;

	}

	stop() {

		this.pause();
		this.reset();

	}

	update() {

		if ( this.isPlaying ) this.tick();
		else return;

		const now = this.now;
		let delta = Math.min( AnimationClock.maxDelta, now - this._last );

		this._last = now;
		this._delta += delta;
		this.elapsed += delta;

		const diff = this._frameDuration - this._delta;
		if ( diff <= 0 ) {

			this.callbacks.forEach(
				callback => callback.call( this, this.elapsed, this._delta )
			);

			this._delta = Math.abs( diff );

		}

	}

	tick() {

		requestAnimationFrame( this._onTick );

	}

	/*-------------------------------------------------------------------------/

		Getters/Setters

	/-------------------------------------------------------------------------*/

	get fps() {

		return this._fps;

	}

	set fps( fps ) {

		this._fps = fps;
		this._frameDuration = ( fps > 0 ) ? Math.floor( 1000 / fps ) : 0;

	}

	/*-------------------------------------------------------------------------/

		Read-only

	/-------------------------------------------------------------------------*/

	get isPlaying() {

		return this._isPlaying;

	}

	get now() {

		return AnimationClock.time.now();

	}

}

AnimationClock.maxDelta = 100;
AnimationClock.time = ( performance === undefined ) ? Date : performance;

export { AnimationClock };
