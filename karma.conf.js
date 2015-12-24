module.exports = function(config) {
    config.set({
        basePath: '../',

        files: [
            'dist/main.js',
            'test/unit/main.js'
        ],

        exclude: [],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['PhantomJS'],

        plugins: [
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-ie-launcher'
        ],

        junitReporter: {
            outputFile: 'unit.xml',
            suite: 'unit'
        },
        colors: true
    });
};
