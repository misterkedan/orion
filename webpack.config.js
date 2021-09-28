/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const ASSET_PATH = process.env.ASSET_PATH || './';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

let config = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		// output path is necessary for clean-webpack-plugin
		path: path.resolve(process.cwd(), 'dist'), // cwd = current working directory
	},
	watch: false,
	module: {
		rules: [
			{
				test: /\.(jpe?g|gif|svg|png|mp3|mp4|woff|woff2|eot|ttf|otf|obj)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							esModule: false
						}
					}
				]
			},
			{
				test: /\.s?css$/,
				use: [
					MiniCssExtractPlugin.loader,
				  	"css-loader",
					"postcss-loader",
				  	{
				  		loader: 'sass-loader',
				   		options: {
							implementation: require('sass'),
				   		},
				  	},
				],
			},
			{
				type: 'javascript/auto',
				test: /\.json$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]'
				}
			},
			{
				test: /\.m?js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
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
    devServer: {
		watchContentBase: true,
		port: 8000
    },
	plugins: [
		// This makes it possible for us to safely use env vars on our code
		new webpack.DefinePlugin({
			'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
		}),
		new HtmlWebpackPlugin({
			hash: true,
			minify: false,
			filename: './index.html',
			template: './src/index.html'
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css"
		}),
		new CopyPlugin({
			patterns: [
				{ from: "static" }
			]
		}),
		new CleanWebpackPlugin()
	]
};

module.exports = (env, argv) => {
	if (argv.mode === 'development') {
		config.devtool = 'eval';
	}
  
	if (argv.mode === 'production') {
	}
  
	return config;
};