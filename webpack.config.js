
const HtmlWebPackPlugin = require('html-webpack-plugin')
const path = require('path')

const config = {
	entry: './src',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'main.js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {          
						presets: ['@babel/preset-react'],        
					},
				},
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
					},
				],
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			}
		],
	},
	resolve: {
		extensions: ['*', '.js', '.jsx'],
	},
	devServer: {
		historyApiFallback: true,
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: './public/index.html',
			filename: './index.html',
		}),
	],
}

module.exports = config