/**
 * Windows: Please do not use trailing comma as windows will fail with token error
 */
const { series, rimraf,  } = require('nps-utils');

// const npsUtils = require('nps-utils');
 
// const { rimraf,  series } = npsUtils;

module.exports = {
    scripts: {
        default: 'nps start',
        /**
         * Starts the builded app from the dist directory.
         */
        start: {
            script: 'cross-env NODE_ENV=development node dist/app.js',
            description: 'Starts the builded app',
        },
        /**
         * Serves the current app and watches for changes to restart it
         */
        serve: {
            inspector: {
                script: series(
                    'apidoc -i src -o src/public/apidoc',
                    'nodemon --watch src --watch .env --inspect'
                ),
                description: 'Serves the current app and watches for changes to restart it, you may attach inspector to it.'
            },
            script: series(
                'apidoc -i src -o src/public/apidoc',
                'nodemon --watch src --watch .env'
            ),
            description: 'Serves the current app and watches for changes to restart it'
        },
        /**
         * Generate the api documentation
         */
        generateapidoc: {
            script: series(
                'apidoc -i src -o src/public/apidoc'
            ),
            description: 'Setup`s the development environment(npm & database)'
        },
        /**
         * Builds the app into the dist directory
         */
        build: {
            script: series(
                'nps lint',
                'nps clean.dist',
                'nps transpile',
                'nps generateapidoc',
                'nps copy',
                'nps copy.tmp',
                'nps clean.tmp'
            ),
            description: 'Builds the app into the dist directory'
        },
        /**
         * Runs TSLint over your project
         */
        lint: {
            script: tslint(`./src/**/*.ts`),
            hiddenFromHelp: true
        },
        /**
         * Transpile your app into javascript
         */
        transpile: {
            script: `tsc --project ./tsconfig.build.json`,
            hiddenFromHelp: true
        },
        /**
         * Clean files and folders
         */
        clean: {
            default: {
                script: series(
                    `nps clean.dist`
                ),
                description: 'Deletes the ./dist folder'
            },
            dist: {
                script: rimraf('./dist'),
                hiddenFromHelp: true
            },
            tmp: {
                script: rimraf('./.tmp'),
                hiddenFromHelp: true
            }
        },
        /**
         * Copies static files to the build folder
         */
        copy: {
            default: {
                script: series(
                    `nps copy.public`,
                    `nps copy.apidoc`
                ),
                hiddenFromHelp: true
            },
            apidoc: {
                script: copyDir(
                    './src/public/',
                    './dist/public/'
                ),
                hiddenFromHelp: true
            },
            public: {
                script: copy(
                    './src/public/*',
                    './dist'
                ),
                hiddenFromHelp: true
            },
            tmp: {
                script: copyDir(
                    './.tmp/src',
                    './dist'
                ),
                hiddenFromHelp: true
            }
        },
    }
};

function copy(source, target) {
    return `copyfiles --up 1 ${source} ${target}`;
}

function copyDir(source, target) {
    return `ncp ${source} ${target}`;
}

function tslint(path) {
    return `tslint -c ./tslint.json ${path} --format stylish`;
}
