(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define('Ticker', factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(root);
    } else {
        root.Ticker = factory(root);
    }
})(this, function (root) {

    'use strict';

    // constants
    var DEFAULT_TIME = 1000;

    // local references
    var set = root.setInterval;
    var clear = root.clearInterval;

    // main variables
    var isTicking = false;
    var intervalId = null;
    var actions = {};
    var lastActionId = 0;


    /**
     * Main constructor
     */
    var Ticker = function (time) {
        this.time = is.number(time) ? time : DEFAULT_TIME;
    };


    /**
     * Call all active actions on root object
     */
    Ticker.prototype.tick = function () {
        for (var id in actions) {
            if (actions.hasOwnProperty(id) && is.func(actions[id])) {
                actions[id].call(root);
            }
        }
    };


    /**
     * Set new action do be executed on tick
     */
    Ticker.prototype.set = function (func) {

        if (is.not.func(func)) {
            return showError(new ArgumentException('First argument must be of type function.'));
        }

        actions[++lastActionId] = func;

        if (! isTicking) {
            this.start();
        }

        return lastActionId;
    };


    /**
     * Remove action by id from execution queue
     */
    Ticker.prototype.clear = function (id) {

        if (is.not.number(id)) {
            return showError(new ArgumentException('First argument must be of type integer.'));
        }

        var success = !!actions.hasOwnProperty(id);
        delete actions[id];

        if (! Object.keys(actions).length) {
            this.stop();
        }

        return success;
    };


    /**
     * Remove all active actions
     */
    Ticker.prototype.clearAll = function () {
        actions = {};
        this.stop();
    };


    /**
     * Start ticker
     */
    Ticker.prototype.start = function () {

        if (isTicking) {
            return;
        }

        intervalId = set.call(root, this.tick, this.time);
        isTicking = true;

        return intervalId;
    };


    /**
     * Stop ticker
     */
    Ticker.prototype.stop = function () {

        clear(intervalId);
        isTicking = false;

        return intervalId;
    };


    /**
     * Get debug info
     */
    Ticker.prototype.debug = function () {

        var debugInfo = {
            isTicking: isTicking,
            actions: {}
        };

        for (var id in actions) {
            if (actions.hasOwnProperty(id) && is.func(actions[id])) {
                debugInfo.actions[id] = actions[id].toString();
            }
        }

        return debugInfo;
    };


    /**
     * Basic type checker
     */
    var is = {
        number: function (p) {
            return (typeof p).toLowerCase() === 'number';
        },
        string: function (p) {
            return (typeof p).toLowerCase() === 'string';
        },
        array: function (p) {
            return p instanceof Array;
        },
        object: function (p) {
            return (typeof p).toLowerCase() === 'object' && p.constructor === Object;
        },
        func: function (p) {
            return !!(p && p.constructor && p.call && p.apply);
        },
        htmlElement: function (p) {
            return p instanceof HTMLElement;
        },
        undefined: function (p) {
            return [undefined, null, 'undefined', 'null'].indexOf(p) > -1;
        },
        not: {}
    };

    // add negative checks
    for (var type in is) {
        if (is.hasOwnProperty(type) && type !== 'not') {
            is.not[type] = new Function('p', 'return ! (' + is[type] + ')(p)');
        }
    }


    /**
     * Exceptions
     */
    function showError(e) {
        console.error(
            '[Ticker]' +
            (
                (e.constructor && e.constructor.name)
                    ? '[' + e.constructor.name + ']'
                    : ''
            ) +
            ': ' + e.message
        );
        if (e.stack && e.stack.split) {
            console.log(e.stack.split('\n').slice(1).join('\n'));
        }
    }

    function ArgumentException(m) {
        this.message = m;
    }

    return Ticker;
});