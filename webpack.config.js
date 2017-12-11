/* eslint no-unused-vars: off */

/**
 * Webpack and Node.js Stuff
 */
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

/**
 * Webpack Plugins
 */
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin-for-multihtml');
//const HtmlWebpackPathAssetsFix = require('html-webpack-plugin-assets-fix');
const InlineChunkManifestHtmlWebpackPlugin = require('inline-chunk-manifest-html-webpack-plugin');
const ImageMinWebpack = require('imagemin-webpack')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const WebpackChunkHash = require('webpack-chunk-hash');
const WebpackManifestPlugin = require('webpack-manifest-plugin');


/**
 * Webpack Ignite Files
 */
const threadLoader = require('thread-loader');
const {WebpackIgnite} = require('webpack-ignite');
const localConfiguration = require('./.ignite/configuration')

/**
 * Webpack Configuration
 * @param env
 */

module.exports = env => {

    const webpackIgnite = new WebpackIgnite(env, localConfiguration);

    return webpackIgnite.ignite().then(() => {
        /**
         * Local Variables / Plugins / Modules
         */
        const configuration = webpackIgnite.configuration;
        const startupFolder = process.cwd();
        const {imageminLoader, ImageminWebpackPlugin} = ImageMinWebpack;

        const extractCSSFile = new ExtractTextPlugin({
            filename: (getPath) => {
                return getPath(webpackIgnite.Utils.assetFileName(webpackIgnite.enums.moduleTypes.STYLESHEET))
            }
        });

        const cssLoaderConfig =
            [
                configuration.runtime.sassWorkerPool.threads > 0 &&
                {
                    loader: 'thread-loader',
                    options: configuration.runtime.sassWorkerPool,
                },
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: webpackIgnite.Utils.ifNotProduction(),
                        minimize: webpackIgnite.Utils.ifProduction(),
                        importLoaders: 2
                    }
                },
                {
                    loader:'postcss-loader'
                },
                {
                    loader: 'sass-loader',
                    options: configuration.advanced.sass.loaderOptions
                }
            ]

        /**
         * Worker Thread Boot Up
         */
        if (configuration.runtime.babelWorkerPool.threads > 0) {
            threadLoader.warmup(configuration.runtime.babelWorkerPool, ['babel-loader', '@babel/preset-env']);
        }
        if (configuration.runtime.sassWorkerPool.threads > 0) {
            threadLoader.warmup(configuration.runtime.sassWorkerPool, ['sass-loader', 'css-loader']);
        }

        return {
            bail: webpackIgnite.Utils.ifProduction(),
            parallelism: 5,
            stats: {children: false},

            //recordsPath: path.resolve(startupFolder, '.ignite', 'records.json'),

            devtool: webpackIgnite.Utils.ifProduction(configuration.sourceMaps.production, configuration.sourceMaps.development),

            devServer: {
                contentBase: path.resolve(startupFolder, configuration.source.assetsPath),
                //watchContentBase: true,
                host: configuration.devServer.host,
                disableHostCheck: configuration.devServer.allowExternal,
                open: configuration.devServer.openBrowser,
                hot: true,
                compress: false,
                overlay: {
                    warnings: true,
                    errors: true
                },
                stats: configuration.devServer.stats
            },

            entry: webpackIgnite.Utils.entryFiles,

            output: {
                path: path.join(__dirname, configuration.output.outputPath),
                pathinfo: webpackIgnite.Utils.ifProduction(false, true),
                filename: webpackIgnite.Utils.assetFileName(webpackIgnite.enums.moduleTypes.JAVASCRIPT),
                publicPath: configuration.output.serverPath
            },

            resolve: {
                modules: [
                    path.resolve(startupFolder, configuration.source.path),
                    path.resolve(startupFolder, 'node_modules'),
                ],
                extensions: ['.js', '.json', '.jsx', '.vue'],
                alias: configuration.advanced.aliases,
                symlinks: false
            },

            externals: configuration.advanced.externals,

            module: {
                rules: [
                    //ES Lint
                    {
                        test: /\.(js|jsx|vue)$/,
                        include: path.resolve(startupFolder, configuration.source.path),
                        exclude: path.resolve(startupFolder, 'node_modules'),
                        use: ['eslint-loader'],
                        enforce: 'pre'
                    },

                    //Vue.js
                    {
                        test: /\.vue$/,
                        include: path.resolve(startupFolder, configuration.source.path),
                        exclude: path.resolve(startupFolder, 'node_modules'),
                        loader: 'vue-loader',
                        options: {
                            cssSourceMap: false
                        }
                    },

                    //URL Loader for Images
                    {
                        include: path.resolve(startupFolder, configuration.source.path),
                        exclude: configuration.advanced.urlLoader.exclude,
                        use: [
                            {
                                loader: 'url-loader',
                                options: {
                                    //publicPath: configuration.advanced.fileLoader.relativeAssetsPath,
                                    //useRelativePath: true,
                                    context: configuration.source.path,
                                    limit: configuration.output.inlineAssetMaxSize,
                                    name: webpackIgnite.Utils.assetFileName()
                                }
                            },
                            configuration.advanced.urlLoader.processImages > 0 && {
                                loader: imageminLoader,
                                options: {
                                    bail: false,
                                    plugins: configuration.advanced.urlLoader.imageProcessingPlugins
                                }
                            }
                        ].filter(Boolean)
                    },

                    //File Loader for excluded file(s)
                    {

                        test: configuration.advanced.fileLoader.fileLoaderFiles,
                        //include: path.resolve(startupFolder, configuration.source.path),
                        use: [{
                            loader: 'file-loader',
                            options: {
                                publicPath: configuration.advanced.fileLoader.relativeAssetsPath,
                                context: configuration.source.path,
                                name: webpackIgnite.Utils.assetFileName()
                            }
                        }]
                    },

                    // Process JS down to ES2015 with Babel
                    {
                        test: configuration.advanced.babel.files,
                        exclude: webpackIgnite.Utils.checkIf(configuration.advanced.babel.exclude.length > 0, configuration.advanced.babel.exclude, /null_exclude/),
                        include: path.resolve(startupFolder, configuration.source.path),
                        use: [
                            configuration.runtime.babelWorkerPool.threads > 0 && {
                                loader: 'thread-loader',
                                options: configuration.runtime.babelWorkerPool,
                            },
                            {
                                loader: 'babel-loader',
                                options: {
                                    'cacheDirectory': true
                                }
                            }
                        ].filter(Boolean),
                    },

                    //Process CSS Files
                    webpackIgnite.Utils.checkIf(configuration.runtime.env.isDevServer,
                        //Dev Server
                        {
                            test: /(\.scss|\.css)$/,
                            include: [path.resolve(startupFolder, configuration.source.path), ...configuration.advanced.sass.includes],
                            exclude: webpackIgnite.Utils.checkIf(configuration.advanced.sass.excludes.length > 0, configuration.advanced.sass.excludes, /null_exclude/),
                            use: [{loader:'style-loader'}, ...cssLoaderConfig].filter(Boolean),
                        },

                        //Regular Build
                        {
                            test: /(\.scss|\.css)$/,
                            include: [path.resolve(startupFolder, configuration.source.path), ...configuration.advanced.sass.includes],
                            exclude: webpackIgnite.Utils.checkIf(configuration.advanced.sass.excludes.length > 0, configuration.advanced.sass.excludes, /null_exclude/),
                            oneOf: [
                                {test: /html-webpack-plugin-for-multihtml/, use: "null-loader"},
                                {use: extractCSSFile.extract([...cssLoaderConfig].filter(Boolean))}
                            ]

                        }
                    ),

                    //EJS for templates
                    {
                        test: /\.ejs$/,
                        include: path.resolve(startupFolder, configuration.source.path),
                        use:
                            [
                                {
                                    loader: 'html-loader',
                                    options: {
                                        attrs: ['img:src', 'source:src', 'link:href'],
                                        minimize: false,
                                        interpolate: true,
                                    },
                                },
                                {
                                    loader: 'ejs-html-loader'
                                },
                            ]
                    },
                ].filter(Boolean)
            },

            plugins: [

                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': env.NODE_ENV
                }),

                //Cause errors when file path case doesn't match
                new CaseSensitivePathsPlugin(),

                //Clean the output folder if we are running this as a production build
                webpackIgnite.Utils.ifProduction(new CleanWebpackPlugin([configuration.output.outputPath], {
                    verbose: true,
                    dry: !configuration.output.clean,
                    watch: false,
                })),

                //Pickup new npm modules in watch mode
                webpackIgnite.Utils.ifNotProduction(new WatchMissingNodeModulesPlugin(webpackIgnite.Utils.nodePaths)),

                //Use Hashed Module IDs for production
                webpackIgnite.Utils.ifProduction(new webpack.HashedModuleIdsPlugin()),

                //Use Named Chunks in Production
                webpackIgnite.Utils.ifProduction(new webpack.NamedChunksPlugin()),

                //Use Named Modules in development for HMR purposes
                webpackIgnite.Utils.ifNotProduction(new webpack.NamedModulesPlugin()),

                //Don't emit files when there is an error
                webpackIgnite.Utils.ifNotProduction(new webpack.NoEmitOnErrorsPlugin()),

                //extract CSS files so that they can be handled by the browser
                extractCSSFile,

                //Enable HMR
                configuration.runtime.env.isDevServer ? (new webpack.HotModuleReplacementPlugin()) : null,

                //Create a common code chunk for shared modules
                new webpack.optimize.CommonsChunkPlugin({
                    name: configuration.advanced.chunkNames.common,
                    minChunks: 2
                }),

                //Also for Async
                new webpack.optimize.CommonsChunkPlugin({
                    name: configuration.advanced.chunkNames.common,
                    //chunks: Object.keys(entries).map((name) => name),
                    async: true,
                    deepChildren: true
                }),

                //Create a common "vendor" chunk for libraries used in more than one module.
                new webpack.optimize.CommonsChunkPlugin({
                    name: configuration.advanced.chunkNames.vendor,
                    minChunks: function (module) {
                        return module.context && module.context.indexOf('node_modules') !== -1;
                    }
                }),

                //Extract Runtime and Manifest
                new webpack.optimize.CommonsChunkPlugin({
                    name: configuration.advanced.chunkNames.manifest,
                    minChunks: Infinity
                }),

                //Extract manifest into JSON
                //new WebpackManifestPlugin({fileName: `${path.join(webpackIgnite.enums.moduleTypes.JSON.folder, 'manifest.json')}`}),

                //Inline manifest JSON into html files
                webpackIgnite.Utils.ifProduction(new InlineChunkManifestHtmlWebpackPlugin({
                    filename: `${path.join(webpackIgnite.enums.moduleTypes.JSON.folder, 'manifest.json')}`,
                    manifestVariable: 'webpackManifest',
                    //dropAsset: true
                    //extractManifest: false,
                })),

                //Webpack HTML plugins
                ...Object.keys(webpackIgnite.Utils.entries).map((name) => {
                    let template = path.join(startupFolder, configuration.source.templatePath, `${webpackIgnite.Utils.entries[name].templateFile}.ejs`);
                    let exists = false;
                    try {
                        fs.statSync(template);
                        exists = true;
                    } catch (e) {
                    }

                    if (exists) {
                        return new HtmlWebpackPlugin({
                            multihtmlCache: true,
                            inject: configuration.advanced.html.injectStylesAndScripts,
                            chunks: [name, configuration.advanced.chunkNames.vendor, configuration.advanced.chunkNames.common, configuration.advanced.chunkNames.manifest],
                            template,
                            filename: `${webpackIgnite.Utils.entries[name].outputTemplateFile}.html`,
                            minify: configuration.advanced.html.minify
                        })
                    }
                }),


                new CopyWebpackPlugin(configuration.advanced.additionalCopyOperations, {debug: 'info'}),

                //Minify Images in Production
                webpackIgnite.Utils.checkIf(configuration.advanced.urlLoader.processImages, new ImageminWebpackPlugin({
                    bail: false,
                    //excludeChunksAssets: false,
                    name: webpackIgnite.Utils.assetFileName(),
                    imageminOptions: {
                        plugins: configuration.advanced.urlLoader.imageProcessingPlugins
                    }
                })),

                webpackIgnite.Utils.checkIf(configuration.runtime.env.optimize,
                    new BundleAnalyzerPlugin({
                        analyzerMode: 'static',
                        reportFilename: '_stats/webpack_report.html',
                        defaultSizes: 'parsed',
                        openAnalyzer: false,
                        generateStatsFile: true,
                        statsFilename: '_stats/webpack_stats.json',
                        statsOptions: null,
                        logLevel: 'info'
                    })
                ),

                webpackIgnite.Utils.ifProduction(new webpack.optimize.ModuleConcatenationPlugin())
            ].filter(Boolean),

            node: {
                setImmediate: false,
                dgram: 'empty',
                fs: 'empty',
                net: 'empty',
                tls: 'empty',
                child_process: 'empty'
            },

        };

    });
}