const {realpathSync} = require('fs-extra');
const __appDir = realpathSync(process.cwd());
const path = require('path');
const os = require('os');

const gifSicle = require('imagemin-gifsicle');
const mozJpeg = require('imagemin-mozjpeg');
const optiPng = require('imagemin-optipng');
const svgO = require('imagemin-svgo');

/**
 *

 let baseConfig = {
    source: {
        path: 'src',
            assetsPath: 'src',
            templatePath: 'src',
    },
    output: {
        outputPath: 'build',
            serverPath: '',
            inlineAssetMaxSize: 20000,
            clean: true,
            addContentHash: true,
    },
    sourceMaps: {
        development: false,
            production: false
    },
    devServer: {
        host: 'localhost',
            openBrowser: true,
            allowExternal: false,
            port: 3001,
            hot: 'hot',
            stats: {children: false}
    },
    jQuery: {
        enablejQuery: true,
    },
    react: {
        usePreact: false,
    },
    vue: {
        useStandaloneLibrary: false,
    },
    advanced: {
        aliases: {},
        externals: {},
        resolves: {},
        babel: {
            files: [/\.(js|jsx)$/],
                exclude: [/node_modules/],
        },
        sass: {
            relativeAssetsPath: '../',
                loaderOptions: {
                include: [
                    //path.join(__appDir, '..', 'src/assets/scss/')
                ]
            }
        },
        html: {
            injectStylesAndScripts: true,
            minify: false //https://github.com/kangax/html-minifier
        },
        fileLoader: {
            relativeAssetsPath: '../',
                fileLoaderFiles: [],
                moduleString: (type, hash) => {
                return `${type.extension}/[name]${hash ? '.[hash:8]' : ''}.${type.extension}`
            },
                assetString: (hash) => {
                return `[path][name]${hash ? '.[hash:8]' : ''}.[ext]`
            },
        },
        urlLoader: {
            exclude: [
                /\.html$/,
                /\.(js|jsx|vue)(\?.*)?$/,
                /\.css$/,
                /\.scss$/,
                /\.json$/,
                /\.ejs$/,
            ],
        },
        chunkNames: {
            manifest: 'runtime',
                common: 'common',
                vendor: 'vendor'
        },
        additionalCopyOperations: [],
    },
    runtime: {
        babelWorkerPool: {
            threads: 0
        },
        sassWorkerPool: {
            threads: 0
        },
    }
}
 **/


module.exports = {
    runtime: {
        babelWorkerPool: {
            threads: 2
        },
        sassWorkerPool:{
            threads: 2
        }
    },
    output: {
        inlineAssetMaxSize: 5000,
    },
    advanced: {
        sass: {
            includes: [path.join(__appDir, 'node_modules/foundation-sites/scss')]
        },
        urlLoader: {
            processImages: true,
            imageProcessingPlugins:
                [
                    gifSicle(),
                    mozJpeg({quality:85}),
                    optiPng(),
                    svgO()
                ]
        }
    },
};