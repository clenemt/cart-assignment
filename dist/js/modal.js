'use strict';

/* global $ */

var Modal = function () {
    // eslint-disable-line

    var overlay;

    /** Force a browser repaint */
    function reflow(element) {
        return element.offsetHeight;
    }

    function Modal() {
        var msg = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
        var fn = arguments.length <= 1 || arguments[1] === undefined ? $.noop : arguments[1];

        this.options = { msg: msg, fn: fn };
        this.elements = {};
        this.name = 'dialog';
        this.render();
    }

    Modal.prototype.render = function () {
        // Create DOM
        this.elements.container = $.create('<div class="' + this.name + ' ' + this.name + '-closable fade"></div>');
        this.elements.wrapper = $.create('<div class="' + this.name + ' ' + this.name + '-wrapper"></div>');
        this.elements.content = $.create('<div class="' + this.name + '-inner">\n            ' + this.options.msg + '\n            <div class="' + this.name + '-actions">\n                <button class="btn btn-secondary">Cancel</button>\n                <button class="btn btn-primary">Delete</button>\n            </div>\n        </div>');
        this.elements.close = $.create('button', { 'class': 'close' });

        if (!overlay) {
            overlay = {};
            overlay.element = $.create('div', {
                'class': this.name + '-overlay fade'
            });
        }

        $.append(this.elements.wrapper, this.elements.content);
        $.append(this.elements.wrapper, this.elements.close);
        $.append(this.elements.container, this.elements.wrapper);
    };

    Modal.prototype.show = function () {
        var doc = document;

        $.append(doc.body, this.elements.container);
        $.append(doc.body, overlay.element);

        $.addClass(doc.body, this.name + '-open');
        // Force the opacity animation to kick in
        reflow(overlay.element);
        $.addClass(overlay.element, 'in');
        $.addClass(this.elements.container, 'in');

        return this;
    };

    return Modal;
}();