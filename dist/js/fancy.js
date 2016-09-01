'use strict';

/* global $ */

var Fancy = function () {
    // eslint-disable-line

    var exports = {
        initialize: function initialize() {
            var print = $.find('.tag'),
                units = $.find('.cart-units');

            $.emitter.on('cart.add', function () {
                print.innerHTML = ++print.innerHTML;
            });

            $.emitter.on('cart.remove', function () {
                var inner = --print.innerHTML;
                print.innerHTML = inner < 1 ? '' : inner;
            });

            $.on(units, 'click', function (evt) {
                var isActive;

                if ($.hasClass(evt.target, 'btn')) {
                    isActive = $.hasClass(evt.target, 'active');
                    $.children($.first(units)).forEach(function (child) {
                        $.removeClass(child, 'active');
                    });
                    !isActive && $.addClass(evt.target, 'active');
                }
            });
        }
    };

    return exports;
}();