'use strict';

/* global $, Dialog */

var Cart = function ($, Dialog) {
    // eslint-disable-line

    var id = 0,
        items = [];

    function buildItem(item) {
        return $.create('<div id="' + item.id + '" class="cart-item">\n            <img class="cart-img" src="img/preview.png">\n            <div class="cart-actions">\n                <div class="cart-close"><span class="close"></div>\n                <div class="cart-quantity">\n                    <label for="quantity-' + item.id + '">Quantity:</label>\n                    <input class="form-control" type="number" min="1" max="10" value="' + item.quantity + '" name="quantity-' + item.id + '" id="quantity-' + item.id + '">\n                </div>\n            </div>\n            <h4 class="cart-title">' + item.name + '</h4>\n            <span class="cart-dim">' + item.dim + '</span>\n        </div>');
    }

    var exports = {
        initialize: function initialize() {
            // Store ref to cart body
            this.$cart = $.find('.cart-body');

            this._attachEvents();
        },
        _attachEvents: function _attachEvents() {
            var _this = this;

            // A new cart item was added
            $.emitter.on('input.add', function (item) {
                _this.add(item);
            });

            // Handle close logic
            $.on(this.$cart, 'click', function (evt) {
                var target = evt.target,
                    item;

                if ($.hasClass(target, 'close')) {
                    item = $.parent(target, '.cart-item');

                    new Dialog({
                        msg: '<p>Are you sure you want to delete this item?</p>',
                        fn: function fn(success) {
                            success && item && _this.remove(item.id);
                        }
                    }).show();
                }
            });

            // Handle change logic
            $.on(this.$cart, 'change', function (evt) {
                var target = evt.target,
                    item = $.parent(target, '.cart-item');

                if (item) _this.change(item.id, target.value);
            });
        },
        add: function add(item) {
            var _this2 = this;

            // Always play with arrays
            if (!$.isArray(item)) {
                item = [item];
            }

            // Create and store the item
            item.forEach(function (item) {
                item.id = 'cart-item-' + id++;
                item.$el = buildItem(item);

                $.append(_this2.$cart, item.$el);
                items.push(item);
                $.emitter.trigger('cart.add', item, _this2.serialize());
            });
        },
        remove: function remove(item) {
            item = this.get(item, true);

            // Remove DOM and stored ref
            if (item !== null && item !== -1) {
                $.remove(items[item].$el);
                item = items.splice(item, 1)[0];
                $.emitter.trigger('cart.remove', item, this.serialize());
            }
        },
        change: function change(item, quantity) {
            item = this.get(item);

            if (item !== null && item.quantity !== +quantity) {
                item.quantity = +quantity;
                $.emitter.trigger('cart.change', item, this.serialize());
            }
        },
        get: function get(id, getIndex) {
            var index = -1;
            items.some(function (item, i) {
                if (item.id === id) {
                    index = i;
                    return;
                }
            });
            return index !== -1 ? getIndex ? index : items[index] : null;
        },
        serialize: function serialize() {
            return items.map(function (item) {
                item = $.clone(item);
                delete item.$el;
                return item;
            });
        }
    };

    return exports;
}($, Dialog);