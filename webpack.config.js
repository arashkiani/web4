const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
//const FlowWebpackPlugin = require('flow-webpack-plugin')

module.exports = {
	entry: './index.js',
	output: {
		filename: 'web37.min.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
						options: { minimize: false },
					},
				],
			},
		],
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 8081,
	},
	plugins: [
		//new FlowWebpackPlugin(),
		new HtmlWebPackPlugin({
			inject: true,
			template: './template/index.html',
			filename: './index.html',
		}),
	],
}
