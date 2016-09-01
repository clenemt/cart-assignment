/* global $ */

var Dialog = (function () { // eslint-disable-line

    var overlay;

    /** Force a browser repaint */
    function reflow (element) { return element.offsetHeight; }

    function Dialog ({ msg='', fn=$.noop }) {
        this.options = { msg, fn };
        this.elements = {};
        this.name = 'dialog';
        this.render();
    }

    Dialog.prototype.render = function () {
        // Create DOM
        this.elements.container = $.create(`<div class="${this.name} ${this.name}-closable fade"></div>`);
        this.elements.wrapper = $.create(`<div class="${this.name} ${this.name}-wrapper"></div>`);
        this.elements.content = $.create(`<div class="${this.name}-inner">
            ${this.options.msg}
            <div class="${this.name}-actions">
                <button class="btn btn-secondary">Cancel</button>
                <button class="btn btn-primary">Delete</button>
            </div>
        </div>`);

        if (!overlay) {
            overlay = {};
            overlay.element = $.create('div', {
                'class': this.name + '-overlay fade'
            });
        }

        $.append(this.elements.wrapper, this.elements.content);
        $.append(this.elements.wrapper, this.elements.close);
        $.append(this.elements.container, this.elements.wrapper);

        $.on(this.elements.content, 'click', (evt) => {
            if ($.hasClass(evt.target, 'btn')) {
                var success = $.hasClass(evt.target, 'btn-primary');
                setTimeout(() => { this.options.fn(success); }, 300);
                this.hide();
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
        var body = document.body;

        $.removeClass(this.elements.container, 'in');
        $.removeClass(overlay.element, 'in');

        this.animationTimer = setTimeout(() => {
            $.removeClass(body, this.name + '-open');
            $.remove(overlay.element);
            $.remove(this.elements.container);
        }, 200);

        return this;
    };

    return Dialog;
}());
