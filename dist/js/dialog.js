'use strict';

/* global $ */

var Dialog = function () {
    // eslint-disable-line

    var overlay;

    /** Force a browser repaint */
    function reflow(element) {
        return element.offsetHeight;
    }

    function Dialog(_ref) {
        var _ref$msg = _ref.msg;
        var msg = _ref$msg === undefined ? '' : _ref$msg;
        var _ref$fn = _ref.fn;
        var fn = _ref$fn === undefined ? $.noop : _ref$fn;

        this.options = { msg: msg, fn: fn };
        this.elements = {};
        this.name = 'dialog';
        this.render();
    }

    Dialog.prototype.render = function () {
        var _this = this;

        // Create DOM
        this.elements.container = $.create('<div class="' + this.name + ' ' + this.name + '-closable fade"></div>');
        this.elements.wrapper = $.create('<div class="' + this.name + ' ' + this.name + '-wrapper"></div>');
        this.elements.content = $.create('<div class="' + this.name + '-inner">\n            ' + this.options.msg + '\n            <div class="' + this.name + '-actions">\n                <button class="btn btn-secondary">Cancel</button>\n                <button class="btn btn-primary">Delete</button>\n            </div>\n        </div>');

        if (!overlay) {
            overlay = {};
            overlay.element = $.create('div', {
                'class': this.name + '-overlay fade'
            });
        }

        $.append(this.elements.wrapper, this.elements.content);
        $.append(this.elements.wrapper, this.elements.close);
        $.append(this.elements.container, this.elements.wrapper);

        $.on(this.elements.content, 'click', function (evt) {
            if ($.hasClass(evt.target, 'btn')) {
                var success = $.hasClass(evt.target, 'btn-primary');
                setTimeout(function () {
                    _this.options.fn(success);
                }, 300);
                _this.hide();
            }
        });
    };

    Dialog.prototype.show = function () {
        var body = document.body;

        $.append(body, this.elements.container);
        $.append(body, overlay.element);

        $.addClass(body, this.name + '-open');
        // Force the opacity animation to kick in
        reflow(overlay.element);
        $.addClass(overlay.element, 'in');
        $.addClass(this.elements.container, 'in');

        return this;
    };

    Dialog.prototype.hide = function () {
        var _this2 = this;

        var body = document.body;

        $.removeClass(this.elements.container, 'in');
        $.removeClass(overlay.element, 'in');

        this.animationTimer = setTimeout(function () {
            $.removeClass(body, _this2.name + '-open');
            $.remove(overlay.element);
            $.remove(_this2.elements.container);
        }, 200);

        return this;
    };

    return Dialog;
}();