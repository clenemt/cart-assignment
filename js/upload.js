/* global $ */

var Upload = (function ($) { // eslint-disable-line

    function generate () {
        return $.random(0, 9) + '.' + $.random(0, 9) + ' ✕ '
            + $.random(0, 9) + '.' + $.random(0, 9) + ' ✕ '
            + $.random(0, 9) + '.' + $.random(0, 9) + ' cm';
    }

    var exports = {
        initialize () {
            this.$form = $.find('#file-upload');
            this.$input = $.first(this.$form);

            this._attachEvents();
        },

        _attachEvents () {
            // A new file was uploaded
            $.on(this.$input, 'change', function () {
                var items = [];

                if (this.files) {
                    items = Array.prototype.map.call(this.files, ({ name, size, type } = {}) => {
                        return { name, size, type, dim: generate(), quantity: 1 };
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
}($));
