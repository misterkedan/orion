const path = require( 'path' );

const TerserPlugin = require( 'terser-webpack-plugin' );

let config = {
	entry: './src/main.js',
	output: {
		filename: 'main.min.js',
		path: path.resolve( __dirname, 'dist' ),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: [ /node_modules/ ],
				loader: 'babel-loader',
				options: {
					presets: [
						[
							'@babel/preset-env',
							{
								useBuiltIns: 'usage',
								corejs: 2
							}
						]
					],
				}
			},
			{
				test: /\.(glsl)$/,
				exclude: /(node_modules)/,
				use: [
					'raw-loader'
				]
			}
		]
	},
	externals: {
		'dat.gui': 'dat.gui',
		three: 'THREE'
	},
	resolve: {
		alias: {
			root: path.resolve( __dirname, './src/' ),
			alien: path.resolve( __dirname, './src/alien/' ),
			keda: path.resolve( __dirname, './src/keda/' ),
			shaders: path.resolve( __dirname, './src/shaders/' ),
		}
	}
};

module.exports = ( env, argv ) => {

	if ( argv.mode === 'development' ) return {
		...config,
		mode: 'development',
		devServer: {
			static: {
				directory: path.resolve( __dirname, 'dist' ),
			},
			host: '192.168.1.10',
			port: 8080,
		},
		optimization: {
			minimize: false,
		},
	};

	return {
		...config,
		mode: 'production',
		optimization: {
			minimize: true,
			minimizer: [ new TerserPlugin( { extractComments: false } ) ],
		},
	};

};
