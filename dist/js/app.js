'use strict';

/* eslint no-console: 0 */
/* global Upload, Cart, Fancy, $ */

(function () {

    Upload.initialize();
    Cart.initialize();
    Fancy.initialize();

    $.emitter.on('cart.add', function (item, data) {
        // Call data proxy, perform XHR, save on local storage
        console.log('A new item was added:', item);
        console.log('Current data to be saved to the backend:', data);
    });

    $.emitter.on('cart.remove', function (item, data) {
        // Call data proxy, perform XHR, save on local storage
        console.log('An item was removed:', item);
        console.log('Current data to be saved to the backend:', data);
    });

    $.emitter.on('cart.change', function (item, data) {
        // Call data proxy, perform XHR, save on local storage
        console.log('An item quantity was changed:', item);
        console.log('Current data to be saved to the backend:', data);
    });
})();