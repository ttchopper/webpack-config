import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import merge from 'webpack-merge';
import validate from 'webpack-validator';
import * as parts from './libs/parts';

const PATHS = {
    app: path.join(__dirname, 'app'),
    style: path.join(__dirname, 'app', 'style.sass'),
    build: path.join(__dirname, 'build')
};

const common = {
    entry: {
        style: PATHS.style,
        app: PATHS.app
    },
    output: {
        path: PATHS.build,
        filename: '[name].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack demo',
            template: PATHS.app + "/index.pug"
        })
    ],
    module: {
        loaders: [
            {
                loader: "babel",
                test: /\.jsx?$/,
                exclude: /node_modules/,
                include: PATHS.app
            }
        ]
    }
};

let config;
switch (process.env.npm_lifecycle_event) {
case 'build':
case 'stats':
    config = merge(
        common,
        {
            devtool: 'source-map',

            output: {
                publicPath: '/testDeploy/',
                path: PATHS.build,
                filename: '[name].[chunkhash].js',
                chunkFilename: '[chunkhash].js'
            }
        },
        parts.clean(PATHS.build),
        parts.setFreeVariable(
            "process.env.NODE_ENV",
            "production"
        ),
        parts.extractBundle({
            name: 'vendor',
            entries: ['react']
        }),
        parts.minify(),
        parts.extractSass(PATHS.style),
        parts.setupPug(PATHS.app)
);
    break;
default:
    config = merge(
            common,
        {
            devtool: 'eval-source-map'
        },
            parts.setupSass(PATHS.style),
            parts.setupPug(PATHS.app),
            parts.devServer({
                host: process.env.HOST,
                port: process.env.PORT
            })
        );
}


export default validate(config, {
    quiet: true
});
