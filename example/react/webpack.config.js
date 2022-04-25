const path = require('path');

module.exports = {
	entry: './src/app.tsx',
	output: {
		path: path.resolve(__dirname, './public/'),
	},
	module:{
		rules:[
			{
				test: /\.tsx$|\.ts$/,
				use: [
					{
						loader: 'ts-loader',
					},
				],
			},
		]
	}
};
