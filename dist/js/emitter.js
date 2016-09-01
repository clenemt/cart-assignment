'use strict';

var Emitter = function () {
    // eslint-disable-line

    var exports = {

        on: function on(event, fn) {
            this.listeners = this.listeners || {};

            if (event in this.listeners) {
                this.listeners[event].push(fn);
            } else {
                this.listeners[event] = [fn];
            }
            return this;
        },

        trigger: function trigger() {
            var args = arguments,
                event = args[0];

            var slice = Array.prototype.slice;
            this.listeners = this.listeners || {};

            if (event in this.listeners) {
                this.invoke(this.listeners[event], slice.call(args, 1));
            }

            if ('*' in this.listeners) {
                this.invoke(this.listeners['*'], args);
            }
            return this;
        },

        invoke: function invoke(listeners, params) {
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i].apply(this, params);
            }
        },

        off: function off(event, callback) {
            var index;

            if (!event) {
                this.listeners && (this.listeners.length = 0);
            } else if (event in this.listeners) {
                if (callback) {
                    index = this.listeners[event].indexOf(callback);
                    // Remove listener if found
                    if (index >= 0) this.listeners[event].splice(index, 1);
                } else {
                    // Remove all listeners if no callback provided
                    this.listeners[event].length = 0;
                }
            }
            return this;
        }
    };

    return exports;
}();