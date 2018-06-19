const Configuration = require('log4js/lib/configuration');
const log4js = require('log4js');
const stdout = require('log4js/lib/appenders/stdout');
const file = require('log4js/lib/appenders/file');
const dateFile = require('log4js/lib/appenders/dateFile');

// noinspection JSUnresolvedVariable
// noinspection JSUnusedGlobalSymbols
Configuration.prototype.loadAppenderModule = (type) => {
    switch (type) {
        case 'stdout':
            return stdout;
        case 'file':
            return file;
        case 'dateFile':
            return dateFile;
    }
};
log4js.configure({
    appenders: {
        out: {type: 'stdout'},
        app: {
            type: 'dateFile',
            filename: 'logs/Example.log',
            compress: true,
        },
        error: {
            type: 'dateFile',
            filename: 'logs/error.log',
            compress: true,
        }
    },
    categories: {
        Error: {
            appenders: ['error', 'out'],
            level: 'trace'
        },
        default: {
            appenders: ['app', 'out'],
            level: 'debug',
        },
    },
});
module.exports = log4js;
