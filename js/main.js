/*
    @module main
 */

var animation = require('./animation.js');
var parser = require('./parser.js');

function main() {
    var an = animation.Animation();
    var p = parser.Parser();

    return {
        init: function() {
            an.init();
        },
        run_user_script: function(script) {
            reset_all();
            p.parse_functions(script);
            an.run_user_script(p.go_to("Main", []));
        },
        stop_user_script: function() {
            an.stop_user_script();
        },
        reset_me: function() {
            an.reset_me();
        },
        reset_all: function() {
            an.reset_all();
        }
    };
}

module.exports = main;
