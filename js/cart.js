/* global $, Dialog */

var Cart = (function ($, Dialog) { // eslint-disable-line

    var id = 0,
        items = [];

    function buildItem (item) {
        return $.create(`<div id="${item.id}" class="cart-item">
            <img class="cart-img" src="img/preview.png">
            <div class="cart-actions">
                <div class="cart-close"><span class="close"></div>
                <div class="cart-quantity">
                    <label for="quantity-${item.id}">Quantity:</label>
                    <input class="form-control" type="number" value="${item.quantity}" name="quantity-${item.id}" id="quantity-${item.id}">
                </div>
            </div>
            <h4 class="cart-title">${item.name}</h4>
            <span class="cart-dim">${item.dim}</span>
        </div>`);
    }

    var exports = {

        initialize () {
            // Store ref to cart body
            this.$cart = $.find('.cart-body');

            this._attachEvents();
        },

        _attachEvents () {
            // A new cart item was added
            $.emitter.on('input.add', (item) => {
                this.add(item);
            });

            // Handle close logic
            $.on(this.$cart, 'click', (evt) => {
                var target = evt.target,
                    item;

                if ($.hasClass(target, 'close')) {
                    item = $.parent(target, '.cart-item');

                    new Dialog({
                        msg: '<p>Are you sure you want to delete this item?</p>',
                        fn: (success) => {
                            success && item && this.remove(item.id);
                        }
                    }).show();
                }
            });

            // Handle change logic
            $.on(this.$cart, 'change', (evt) => {
                var target = evt.target,
                    item = $.parent(target, '.cart-item');

                if (item) this.change(item.id, target.value);
            });
        },

        add (item) {
            // Always play with arrays
            if (!$.isArray(item)) {
                item = [item];
            }

            // Create and store the item
            item.forEach((item) => {
                item.id = 'cart-item-' + id++;
                item.$el = buildItem(item);

                $.append(this.$cart, item.$el);
                items.push(item);
                $.emitter.trigger('cart.add', item, this.serialize());
            });
        },

        remove (item) {
            item = this.get(item, true);

            // Remove DOM and stored ref
            if (item !== null && item !== -1) {
                $.remove(items[item].$el);
                item = items.splice(item, 1)[0];
                $.emitter.trigger('cart.remove', item, this.serialize());
            }
        },

        change (item, quantity) {
            item = this.get(item);

            if (item !== null && item.quantity !== +quantity) {
                item.quantity = +quantity;
                $.emitter.trigger('cart.change', item, this.serialize());
            }
        },

        get (id, getIndex) {
            var index = -1;
            items.some((item, i) => {
                if (item.id === id) {
                    index = i;
                    return;
                }
            });
            return index !== -1 ? (getIndex ? index : items[index]) : null;
        },

        serialize () {
            return items.map((item) => {
                item = $.clone(item);
                delete item.$el;
                return item;
            });
        }
    };

    return exports;
}($, Dialog));
