var $ = (function () { // eslint-disable-line

    var rSimpleSelector = /^[\w-_]*$/,
        rSimpleHtml = /<|&#?\w+;/,
        rSingleTag = /^[\w-]+$/,
        rNotWhite = /\S+/g,
        rHyphen = /-(.)/g,
        rUpper = /([A-Z])/g,
        rReturn = /[\t\r\n\f]/g,
        rTrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

    var ie = document.addEventListener,
        addEvent = ie ? 'addEventListener' : 'attachEvent',
        removeEvent = ie ? 'removeEventListener' : 'detachEvent',
        prefix = ie ? '' : 'on',
        cssNumber = {
            'animation-iteration-count': true,
            'column-count': true,
            'fill-opacity': true,
            'flex-grow': true,
            'flex-shrink': true,
            'font-weight': true,
            'line-height': true,
            'opacity': true,
            'order': true,
            'orphans': true,
            'widows': true,
            'z-index': true,
            'zoom': true
        };

    /* A small emitter logic */
    var Emitter = (function () {

        var exports = {

            on: function (event, fn) {
                this.listeners = this.listeners || {};

                if (event in this.listeners) {
                    this.listeners[event].push(fn);
                } else {
                    this.listeners[event] = [fn];
                }
                return this;
            },

            trigger: function () {
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

            invoke: function (listeners, params) {
                for (var i = 0, len = listeners.length; i < len; i++) {
                    listeners[i].apply(this, params);
                }
            },

            off: function (event, callback) {
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
    }());

    /* Helper function for assign & extend */
    function createAssigner (inherited) {

        return function () {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if (typeof target === 'boolean') {
                deep = target;
                target = arguments[i] || {};
                i++;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== 'object' && typeof target !== 'function') {
                target = {};
            }

            for (; i < length; i++) {

                // Only non-null/undefined values supported
                if ((options = arguments[i]) == null) continue;

                for (name in options) {

                    if (inherited || $.has(options, name)) {

                        src = target[name];
                        copy = options[name];

                        // Avoid circular dependencies
                        if (target === copy) continue;

                        // Recurse if we're merging plain objects or arrays
                        if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {

                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && $.isArray(src) ? src : [];
                            } else {
                                clone = src && $.isPlainObject(src) ? src : {};
                            }

                            target[name] = $.extend(deep, clone, copy);
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            return target;
        };
    }

    /* Helper for building DOM nodes */
    function buildFragment (html, context, isText) {
        var element, tmp,
            elements = [],
            i = 0,
            fragment = context.createDocumentFragment();

        if (!html) return;

        if (isText || !rSimpleHtml.test(html)) {
            // Convert non-html into a text element
            elements.push(context.createTextNode(html));
        } else {
            // Convert html into DOM nodes
            tmp = fragment.appendChild(context.createElement('div'));
            tmp.innerHTML = html;

            // Get all created valid html elements
            Array.prototype.push.apply(elements, tmp.childNodes);

            // Make elements orphaned
            tmp.textContent = '';
        }

        // Remove div from fragment
        fragment.textContent = '';

        while (element = elements[i++]) {
            fragment.appendChild(element);
        }

        // Return the top level element if lonely
        if (fragment.childNodes.length === 1) {
            fragment = fragment.childNodes[0];
        }

        return fragment;
    }

    /** Bulletproof removeProperty */
    function removeStyle (element, key) {
        return ('removeProperty' in element.style) ? element.style.removeProperty(key) : element.style.removeAttribute(key);
    }

    /** Add 'px' value in case it is needed for that css prop */
    function maybeAddPx (name, value) {
        return (typeof value === 'number' && !cssNumber[$.hyphenate(name)]) ? value + 'px' : value;
    }

    function getClass (element) {
        return element.getAttribute && element.getAttribute('class') || '';
    }

    var $ = {

        noop: function () {},

        assign: createAssigner(),

        extend: createAssigner(true),

        clone: function () {

            var src = arguments[0],
                deep = false;

            // Handle a deep copy situation
            if ($.type(src) === 'boolean') {
                deep = src;
                src = arguments[1];
            }

            return $.extend(deep, {}, src);
        },

        type: function (obj) {
            if (obj == null) return obj + '';
            return typeof obj;
        },

        has: function (obj, key) {
            return obj != null && hasOwnProperty.call(obj, key);
        },

        isArray: Array.isArray,

        toArray: function (arr) {
            return [].slice.call(arr);
        },

        isPlainObject: function (obj) {
            if ($.type(obj) !== 'object' || obj.nodeType || $.isWindow(obj)) return false;
            if (obj.constructor && !$.has(obj.constructor.prototype, 'isPrototypeOf')) return false;
            return true;
        },

        isWindow: function (obj) {
            return obj != null && obj === obj.window;
        },

        ownerDocument: function (element) {
            return (element && element.ownerDocument) || document;
        },

        hyphenate: function (string) {
            return string.replace(rUpper, '-$1').toLowerCase();
        },

        capitalize: function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },

        camelize: function (string) {
            return string.replace(rHyphen, function (_, chr) {
                return chr.toUpperCase();
            });
        },

        trim: function (string) {
            return string == null ? '' : (string + '').replace(rTrim, '');
        },

        random: function (min, max) {
            if (max == null) {
                max = min;
                min = 0;
            }
            return min + Math.floor(Math.random() * (max - min + 1));
        },

        on: function (element, eventName, handler, capture, one) {
            var events = eventName;

            function autoRemove (handler, capture) {
                return function rm (e) {
                    $.off(e.currentTarget, e.type, rm, capture);
                    return handler.apply(this, arguments);
                };
            }

            if (typeof eventName === 'string') {
                events = {};
                events[eventName] = handler;
            }

            // Add events from object like eventName/handler
            for (var event in events) {
                if ($.has(events, event) && events[event]) {
                    element[addEvent](prefix + event, one ? autoRemove(events[event], capture) : events[event], capture || false);
                }
            }
        },

        off: function (element, eventName, handler, capture) {
            var events = eventName;

            if (typeof eventName === 'string') {
                events = {};
                events[eventName] = handler;
            }

            // Remove events from object like eventName/handler
            for (var event in events) {
                if ($.has(events, event) && events[event]) {
                    element[removeEvent](prefix + event, events[event], capture || false);
                }
            }
        },

        findAll: function (element, selector, one) {
            var doc = $.ownerDocument(element),
                method = one ? 'querySelector' : 'querySelectorAll',
                type, found;

            if ($.type(element) === 'string') {
                selector = element;
                element = doc;
            }

            type = selector.charAt(0);
            selector = selector.slice(1);

            if (rSimpleSelector.test(selector)) {
                if (type === '#') {
                    found = doc.getElementById(selector);
                    found = one ? found : found ? [found] : [];
                } else if (type === '.') {
                    element.getElementsByClassName || (element = doc);
                    found = element.getElementsByClassName(selector);
                    one && (found = found[0]);
                } else {
                    element.getElementsByTagName || (element = doc);
                    found = element.getElementsByTagName(type + selector);
                    one && (found = found[0]);
                }
            } else {
                element[method] || (element = doc);
                found = element[method](type + selector);
            }

            return found ? (one ? found : $.toArray(found)) : (one ? null : []);
        },

        find: function (element, selector) {
            return $.findAll(element, selector, true);
        },

        first: function (element) {
            var found = false;
            element = element.firstChild;
            while (!found && element) {
                if (element.nodeType === 1) found = true;
                else element = element.nextSibling;
            }
            return element;
        },

        children: function (element, selector) {
            var children = $.toArray(element.children);
            return selector ? children.filter(function (child) {
                return $.matches(child, selector);
            }) : children;
        },

        attr: function (element, attr, value) {
            var attrs = attr,
                type = element.nodeType;

            // Avoid text, comment and attribute nodes
            if (type === 3 || type === 8 || type === 2) return;

            if (typeof attr === 'string') {
                if (value === undefined) {
                    // Returning the prop for ease of use
                    // But we do not allow editing props
                    return element.getAttribute(attr) || element[attr];
                } else {
                    // Prepare for below for in
                    attrs = {};
                    attrs[attr] = value;
                }
            }

            // Add/remove attributes
            for (var key in attrs) {
                if ($.has(attrs, key)) {
                    if (attrs[key] == null) {
                        element.removeAttribute(key);
                    } else {
                        element.setAttribute(key, attrs[key]);
                    }
                }
            }

            return element;
        },

        parent: function (element, selector) {
            var found = false;
            while (!found && (element = element.parentNode)) {
                if (element.nodeType === 1 && (!selector || $.matches(element, selector))) {
                    found = true;
                } else if (element.nodeType === 11 || element.nodeType === 9) {
                    // Break for document fragment and document
                    element = null;
                    found = true;
                }
            }

            return element;
        },

        remove: function (element) {
            var parent = $.parent(element);
            return parent && parent.removeChild(element);
        },

        append: function () {
            var target = arguments[0],
                length = arguments.length,
                element, i = 1;

            // Iterate for each next object in argument list
            for (; i < length; i++) {
                if ((element = arguments[i]) == null) continue;
                element = $.create(true, element);
                element && target.appendChild(element);
            }
            return target;
        },

        create: function () {
            var args = arguments,
                tag = args[0],
                props = args[1],
                length = args.length,
                doc = document,
                preventTag, element, node, i = 1;

            // Prevent tag creation if boolean as first argument
            if (typeof tag === 'boolean') {
                preventTag = tag;
                tag = args[1];
                props = args[2];
                i++;
            }

            // Break fast if node, no support for adding props/elements this way
            if (tag && tag.nodeType) return tag;
            // Break fast if not valid string or empty
            if (!tag || typeof tag !== 'string') return;

            // Create DOM from html string
            if (tag[0] === '<' && tag[tag.length - 1] === '>' && tag.length >= 3) {
                element = buildFragment(tag, doc);
            }

            // When preventTag is set to `true` this is done to avoid
            // confusing single word with node tags
            // e.g. parsing $.create('test') into '<test></test>'
            else if (!preventTag && rSingleTag.test(tag)) {
                // Create DOM from tag name
                element = doc.createElement(tag);

                // Handles $.create(elem, {...})
                if (element && $.isPlainObject(props)) {
                    // Avoid modifying the passed option object
                    props = $.clone(props);
                    i++;

                    // Handles { css: '...' }
                    if (props.css) {
                        $.css(element, props.css);
                        delete props.css;
                    }

                    // Handles { html: '...' }
                    if (props.html) {
                        $.append(element, buildFragment(props.html, doc));
                        delete props.html;
                    }

                    // Handles { text: '...' }
                    if (props.text) {
                        $.append(element, buildFragment(props.text, doc, true));
                        delete props.text;
                    }

                    // Handles the norma props
                    $.attr(element, props);
                }
            } else {
                return buildFragment(tag, doc);
            }

            if (element) {
                // Iterate for each next object in argument list
                for (; i < length; i++) {
                    if ((node = args[i]) == null) continue;
                    $.append(element, $.create(true, node));
                }
                return element;
            }
        },

        hasClass: function (element, className) {
            var cur = ' ' + getClass(element) + ' ';
            className = ' ' + className + ' ';
            if (cur.replace(rReturn, ' ').indexOf(className) > -1) return true;
            return false;
        },

        addClass: function (element, value) {
            var classes = value.match(rNotWhite) || [],
                curValue, cur, finalValue;

            curValue = getClass(element);
            cur = (' ' + curValue + ' ').replace(rReturn, ' ');

            if (cur) {
                classes.forEach(function (cls) {
                    if (cur.indexOf(' ' + cls + ' ') < 0) cur += cls + ' ';
                });

                finalValue = $.trim(cur);
                if (curValue !== finalValue) {
                    element.setAttribute('class', finalValue);
                }
            }
        },

        removeClass: function (element, value) {
            var classes = value.match(rNotWhite) || [],
                curValue, cur, finalValue;

            if (!value) {
                element.className = '';
            } else {
                curValue = getClass(element);
                cur = (' ' + curValue + ' ').replace(rReturn, ' ');

                if (cur) {
                    classes.forEach(function (cls) {
                        // Remove *all* instances
                        while (cur.indexOf(' ' + cls + ' ') > -1) {
                            cur = cur.replace(' ' + cls + ' ', ' ');
                        }
                    });

                    finalValue = $.trim(cur);
                    if (curValue !== finalValue) {
                        element.setAttribute('class', finalValue);
                    }
                }
            }

            return element;
        },

        toggleClass: function (element, className, state) {
            (state === undefined ? !$.hasClass(element, className) : state) ?
              $.addClass(element, className) : $.removeClass(element, className);
        },

        css: function (element, prop, value) {
            var props = prop,
                css = '';

            if (typeof prop === 'string') {
                if (value === undefined) {
                    // Only the compute value is wanted
                    return getComputedStyle(element).getPropertyValue($.hyphenate(prop)) ||
                        element.style[$.camelize(prop)];
                } else {
                    props = {};
                    props[prop] = value;
                }
            }

            // Add/remove css props
            for (var key in props) {
                if ($.has(props, key)) {
                    if (!props[key] && props[key] !== 0) {
                        removeStyle(element, $.hyphenate(key));
                    } else {
                        css += $.hyphenate(key) + ':' + maybeAddPx(key, props[key]) + ';';
                    }
                }
            }

            element.style.cssText += ';' + css;
            return element;
        },

        matches: (function () {
            var body = document.body,
                nativeMatch = body.matches ||
                body.matchesSelector       ||
                body.webkitMatchesSelector ||
                body.mozMatchesSelector    ||
                body.msMatchesSelector;

            return function matches (element, selector) {
                if (!selector || !element || element.nodeType !== 1) return false;
                return nativeMatch.call(element, selector);
            };
        }())
    };

    // Our singleton emitter
    $.emitter = (function () {
        return $.extend({}, Emitter);
    }());

    return $;
}());
