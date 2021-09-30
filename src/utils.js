function flatten( object, prefix = '' ) {

	return Object.keys( object ).reduce( ( acc, key ) => {

		const path = prefix.length ? `${prefix}.` : '';

		if (
			typeof object[ key ] === 'object'
			&& object[ key ] !== null
			&& Object.keys( object[ key ] ).length
		) {

			Object.assign( acc, flatten( object[ key ], path + key ) );

		} else {

			acc[ path + key ] = object[ key ];

		}

		return acc;

	}, {} );

}

function unflatten( object ) {

	return Object.keys( object ).reduce( ( result, key ) => {

		key.split( '.' ).reduce(
			( acc, path, i, keys ) => acc[ path ] || (
				acc[ path ] = isNaN( Number( keys[ i + 1 ] ) )
					? keys.length - 1 === i
						? object[ key ]
						: {}
					: []
			), result
		);

		return result;

	}, {} );

}

function copy( object ) {

	return JSON.parse( JSON.stringify( object ) );

}

function diff( object1, object2 ) {

	const changes = {};

	Object.entries( object1 ).forEach( ( [ key, value ] )=>{

		if ( value !== object2[ key ] ) changes[ key ] = value;

	} );

	if ( ! Object.keys( changes ).length ) return false;

	return changes;

}

const utils = { flatten, unflatten, copy, diff };

export { utils };
