import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

export let clean = (path) => {
    return {
        plugins: [
            new CleanWebpackPlugin([path], {
                root: process.cwd()
            })
        ]
    };
};

export let extractBundle = (options) => {
    const entry = {};
    entry[options.name] = options.entries;

    return {
        entry: entry,
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: [options.name, 'manifest']
            })
        ]
    };
};

export let setFreeVariable = (key, value) => {
    const env = {};
    env[key] = JSON.stringify(value);
    return {
        plugins: [
            new webpack.DefinePlugin(env)
        ]
    };
};

export let minify = () => {
    return {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                mangle: {
                    except: ['$'],
                    keep_fnames: true
                }
            })
        ]
    };
};

export let devServer = (options) => {
    return {
        devServer: {
            historyApiFallback: true,

            hot: true,
            inline: true,

            stats: "errors-only",

            host: options.host,
            port: options.port
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin({
                multiStep: true
            })
        ]
    };
};

export let setupSass = (paths) => {
    return {
        module: {
            loaders: [
                {
                    test: /\.sass$/,
                    loaders: ["style", "css?sourceMap", "sass?sourceMap"],
                    include: paths
                }
            ]
        }
    };
};

export let extractSass = (paths) => {
    return {
        module: {
            loaders: [
                {
                    test: /\.sass$/,
                    loader: ExtractTextPlugin.extract("css?sourceMap!sass?sourceMap"),
                    include: paths
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin('[name].[chunkhash].css')
        ]
    };
};

export let setupPug = (paths) => {
    return {
        module: {
            loaders: [
                {
                    test: /\.pug$/,
                    loader: "pug",
                    query: {
                        pretty: true
                    },
                    include: paths
                }
            ]
        }
    };
};
