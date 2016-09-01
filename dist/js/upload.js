'use strict';

/* global $ */

var Upload = function ($) {
    // eslint-disable-line

    function generate() {
        return $.random(0, 9) + '.' + $.random(0, 9) + ' ✕ ' + $.random(0, 9) + '.' + $.random(0, 9) + ' ✕ ' + $.random(0, 9) + '.' + $.random(0, 9) + ' cm';
    }

    var exports = {
        initialize: function initialize() {
            this.$form = $.find('#file-upload');
            this.$input = $.first(this.$form);

            this._attachEvents();
        },
        _attachEvents: function _attachEvents() {
            // A new file was uploaded
            $.on(this.$input, 'change', function () {
                var items = [];

                if (this.files) {
                    items = Array.prototype.map.call(this.files, function () {
                        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                        var name = _ref.name;
                        var size = _ref.size;
                        var type = _ref.type;

                        return { name: name, size: size, type: type, dim: generate(), quantity: 1 };
                    });

                    $.emitter.trigger('input.add', items);
                }
            });

            // Handle file input removal
            $.emitter.on('input.remove', function () {
                // TODO
            });
        }
    };

    return exports;
}($);