/**
 * Expose `LCov`.
 */

exports = module.exports = LCov;

/**
 * Initialize a new LCOV reporter.
 * File format of LCOV can be found here: http://ltp.sourceforge.net/coverage/lcov/geninfo.1.php
 * The reporter is built after this parser: https://raw.github.com/SonarCommunity/sonar-javascript/master/sonar-javascript-plugin/src/main/java/org/sonar/plugins/javascript/coverage/LCOVParser.java
 *
 * @param {Runner} runner
 * @api public
 */

function LCov(runner) {
    runner.on('end', function () {
        // In a browser context, coverage will be in window.$jscoverage.
        var g = typeof(global) != 'undefined' ? global : window;
        var cov = g._$jscoverage || {};

        var keys = Object.keys(cov).forEach(function (key, index) {
            if (cov[key]) {
                var data = cov[key];
                reportFile(key, data);
            }
        });
    });
}

function reportFile(filename, data) {
    process.stdout.write('SF:' + filename + '\n');
    data.source && data.source.forEach(function (line, num) {
        num++;

        if (data[num] !== undefined) {
            process.stdout.write('DA:' + num + ',' + data[num] + '\n');
        }
    });

    process.stdout.write('end_of_record\n');
}
