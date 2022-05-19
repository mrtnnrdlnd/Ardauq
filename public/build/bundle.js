
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var Direction;
    (function (Direction) {
        Direction[Direction["up"] = 0] = "up";
        Direction[Direction["right"] = 1] = "right";
        Direction[Direction["down"] = 2] = "down";
        Direction[Direction["left"] = 3] = "left";
    })(Direction || (Direction = {}));

    class UnitBlock {
        constructor(position, color, connected) {
            this.position = position;
            if (color != undefined) {
                this.color = color;
            }
            if (connected != undefined) {
                this.connected = connected;
            }
        }
    }

    class MultiBlock {
        constructor() {
            this.position = { x: 0, y: 0 };
            this._orientation = 0;
            this._blocks = [];
        }
        get blocks() {
            if (this._orientation == undefined) {
                return this._blocks[0];
            }
            return this._blocks[this._orientation];
        }
        set blocks(blocks) {
            this._blocks[this._orientation] = blocks;
        }
        rotateClockwise() {
            if (this._orientation < Object.keys(this._blocks).length - 1) {
                this._orientation++;
            }
            else {
                this._orientation = 0;
            }
        }
        rotateCounterClockwise() {
            if (this._orientation <= 0) {
                this._orientation = Object.keys(this._blocks).length - 1;
            }
            else {
                this._orientation--;
            }
        }
        rotateTwice() {
            if (this._orientation < Object.keys(this._blocks).length - 2) {
                this._orientation += 2;
            }
            else if (this._orientation >= 2) {
                this._orientation -= 2;
            }
        }
        init(blockOrientations, color) {
            let connectedTo;
            blockOrientations.forEach((orientation, index) => {
                this._blocks.push([]);
                orientation.forEach(position => {
                    connectedTo = [];
                    if (orientation.filter(p => p.x == position.x && p.y == position.y - 1).length > 0) {
                        connectedTo.push(Direction.up);
                    }
                    if (orientation.filter(p => p.x == position.x + 1 && p.y == position.y).length > 0) {
                        connectedTo.push(Direction.right);
                    }
                    if (orientation.filter(p => p.x == position.x && p.y == position.y + 1).length > 0) {
                        connectedTo.push(Direction.down);
                    }
                    if (orientation.filter(p => p.x == position.x - 1 && p.y == position.y).length > 0) {
                        connectedTo.push(Direction.left);
                    }
                    this._blocks[index].push(new UnitBlock(position, color, connectedTo));
                });
            });
        }
    }

    /* src\lib\components\UnitBlockComponent.svelte generated by Svelte v3.46.4 */
    const file$3 = "src\\lib\\components\\UnitBlockComponent.svelte";

    // (11:4) {#if !block.connected.includes(Direction.up)}
    function create_if_block_3(ctx) {
    	let line;

    	const block_1 = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "x1", "0");
    			attr_dev(line, "y1", "1");
    			attr_dev(line, "x2", /*size*/ ctx[3]);
    			attr_dev(line, "y2", "1");
    			attr_dev(line, "class", "svelte-1z5l5j");
    			add_location(line, file$3, 11, 8, 345);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size*/ 8) {
    				attr_dev(line, "x2", /*size*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(11:4) {#if !block.connected.includes(Direction.up)}",
    		ctx
    	});

    	return block_1;
    }

    // (14:4) {#if !block.connected.includes(Direction.right)}
    function create_if_block_2(ctx) {
    	let line;
    	let line_x__value;
    	let line_x__value_1;

    	const block_1 = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "x1", line_x__value = /*size*/ ctx[3] - 1);
    			attr_dev(line, "y1", "0");
    			attr_dev(line, "x2", line_x__value_1 = /*size*/ ctx[3] - 1);
    			attr_dev(line, "y2", /*size*/ ctx[3]);
    			attr_dev(line, "class", "svelte-1z5l5j");
    			add_location(line, file$3, 14, 8, 459);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size*/ 8 && line_x__value !== (line_x__value = /*size*/ ctx[3] - 1)) {
    				attr_dev(line, "x1", line_x__value);
    			}

    			if (dirty & /*size*/ 8 && line_x__value_1 !== (line_x__value_1 = /*size*/ ctx[3] - 1)) {
    				attr_dev(line, "x2", line_x__value_1);
    			}

    			if (dirty & /*size*/ 8) {
    				attr_dev(line, "y2", /*size*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(14:4) {#if !block.connected.includes(Direction.right)}",
    		ctx
    	});

    	return block_1;
    }

    // (17:4) {#if !block.connected.includes(Direction.down)}
    function create_if_block_1(ctx) {
    	let line;
    	let line_y__value;
    	let line_y__value_1;

    	const block_1 = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "x1", /*size*/ ctx[3]);
    			attr_dev(line, "y1", line_y__value = /*size*/ ctx[3] - 1);
    			attr_dev(line, "x2", "0");
    			attr_dev(line, "y2", line_y__value_1 = /*size*/ ctx[3] - 1);
    			attr_dev(line, "class", "svelte-1z5l5j");
    			add_location(line, file$3, 17, 8, 586);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size*/ 8) {
    				attr_dev(line, "x1", /*size*/ ctx[3]);
    			}

    			if (dirty & /*size*/ 8 && line_y__value !== (line_y__value = /*size*/ ctx[3] - 1)) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty & /*size*/ 8 && line_y__value_1 !== (line_y__value_1 = /*size*/ ctx[3] - 1)) {
    				attr_dev(line, "y2", line_y__value_1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(17:4) {#if !block.connected.includes(Direction.down)}",
    		ctx
    	});

    	return block_1;
    }

    // (20:4) {#if !block.connected.includes(Direction.left)}
    function create_if_block(ctx) {
    	let line;

    	const block_1 = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "x1", "1");
    			attr_dev(line, "y1", /*size*/ ctx[3]);
    			attr_dev(line, "x2", "1");
    			attr_dev(line, "y2", "0");
    			attr_dev(line, "class", "svelte-1z5l5j");
    			add_location(line, file$3, 20, 8, 713);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size*/ 8) {
    				attr_dev(line, "y1", /*size*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block.name,
    		type: "if",
    		source: "(20:4) {#if !block.connected.includes(Direction.left)}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$3(ctx) {
    	let g;
    	let rect;
    	let rect_fill_value;
    	let show_if_3 = !/*block*/ ctx[0].connected.includes(Direction.up);
    	let if_block0_anchor;
    	let show_if_2 = !/*block*/ ctx[0].connected.includes(Direction.right);
    	let if_block1_anchor;
    	let show_if_1 = !/*block*/ ctx[0].connected.includes(Direction.down);
    	let if_block2_anchor;
    	let show_if = !/*block*/ ctx[0].connected.includes(Direction.left);
    	let g_transform_value;
    	let if_block0 = show_if_3 && create_if_block_3(ctx);
    	let if_block1 = show_if_2 && create_if_block_2(ctx);
    	let if_block2 = show_if_1 && create_if_block_1(ctx);
    	let if_block3 = show_if && create_if_block(ctx);

    	const block_1 = {
    		c: function create() {
    			g = svg_element("g");
    			rect = svg_element("rect");
    			if (if_block0) if_block0.c();
    			if_block0_anchor = empty();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			if (if_block3) if_block3.c();
    			attr_dev(rect, "width", /*size*/ ctx[3]);
    			attr_dev(rect, "height", /*size*/ ctx[3]);
    			attr_dev(rect, "fill", rect_fill_value = /*block*/ ctx[0].color);
    			add_location(rect, file$3, 9, 4, 230);
    			attr_dev(g, "transform", g_transform_value = "translate(" + /*x*/ ctx[1] + " " + /*y*/ ctx[2] + ")");
    			add_location(g, file$3, 8, 0, 190);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, rect);
    			if (if_block0) if_block0.m(g, null);
    			append_dev(g, if_block0_anchor);
    			if (if_block1) if_block1.m(g, null);
    			append_dev(g, if_block1_anchor);
    			if (if_block2) if_block2.m(g, null);
    			append_dev(g, if_block2_anchor);
    			if (if_block3) if_block3.m(g, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 8) {
    				attr_dev(rect, "width", /*size*/ ctx[3]);
    			}

    			if (dirty & /*size*/ 8) {
    				attr_dev(rect, "height", /*size*/ ctx[3]);
    			}

    			if (dirty & /*block*/ 1 && rect_fill_value !== (rect_fill_value = /*block*/ ctx[0].color)) {
    				attr_dev(rect, "fill", rect_fill_value);
    			}

    			if (dirty & /*block*/ 1) show_if_3 = !/*block*/ ctx[0].connected.includes(Direction.up);

    			if (show_if_3) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					if_block0.m(g, if_block0_anchor);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*block*/ 1) show_if_2 = !/*block*/ ctx[0].connected.includes(Direction.right);

    			if (show_if_2) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					if_block1.m(g, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*block*/ 1) show_if_1 = !/*block*/ ctx[0].connected.includes(Direction.down);

    			if (show_if_1) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					if_block2.m(g, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*block*/ 1) show_if = !/*block*/ ctx[0].connected.includes(Direction.left);

    			if (show_if) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block(ctx);
    					if_block3.c();
    					if_block3.m(g, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (dirty & /*x, y*/ 6 && g_transform_value !== (g_transform_value = "translate(" + /*x*/ ctx[1] + " " + /*y*/ ctx[2] + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UnitBlockComponent', slots, []);
    	let { block } = $$props;
    	let { x } = $$props;
    	let { y } = $$props;
    	let { size } = $$props;
    	const writable_props = ['block', 'x', 'y', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UnitBlockComponent> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('block' in $$props) $$invalidate(0, block = $$props.block);
    		if ('x' in $$props) $$invalidate(1, x = $$props.x);
    		if ('y' in $$props) $$invalidate(2, y = $$props.y);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ Direction, block, x, y, size });

    	$$self.$inject_state = $$props => {
    		if ('block' in $$props) $$invalidate(0, block = $$props.block);
    		if ('x' in $$props) $$invalidate(1, x = $$props.x);
    		if ('y' in $$props) $$invalidate(2, y = $$props.y);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [block, x, y, size];
    }

    class UnitBlockComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { block: 0, x: 1, y: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UnitBlockComponent",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*block*/ ctx[0] === undefined && !('block' in props)) {
    			console.warn("<UnitBlockComponent> was created without expected prop 'block'");
    		}

    		if (/*x*/ ctx[1] === undefined && !('x' in props)) {
    			console.warn("<UnitBlockComponent> was created without expected prop 'x'");
    		}

    		if (/*y*/ ctx[2] === undefined && !('y' in props)) {
    			console.warn("<UnitBlockComponent> was created without expected prop 'y'");
    		}

    		if (/*size*/ ctx[3] === undefined && !('size' in props)) {
    			console.warn("<UnitBlockComponent> was created without expected prop 'size'");
    		}
    	}

    	get block() {
    		throw new Error("<UnitBlockComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<UnitBlockComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<UnitBlockComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<UnitBlockComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<UnitBlockComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<UnitBlockComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<UnitBlockComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<UnitBlockComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\lib\components\MultiBlockComponent.svelte generated by Svelte v3.46.4 */
    const file$2 = "src\\lib\\components\\MultiBlockComponent.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (8:4) {#each block.blocks as unitBlock}
    function create_each_block$1(ctx) {
    	let unitblockcomponent;
    	let current;

    	unitblockcomponent = new UnitBlockComponent({
    			props: {
    				x: /*unitBlock*/ ctx[2].position.x * /*size*/ ctx[1],
    				y: /*unitBlock*/ ctx[2].position.y * /*size*/ ctx[1],
    				size: /*size*/ ctx[1],
    				block: /*unitBlock*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block_1 = {
    		c: function create() {
    			create_component(unitblockcomponent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(unitblockcomponent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const unitblockcomponent_changes = {};
    			if (dirty & /*block, size*/ 3) unitblockcomponent_changes.x = /*unitBlock*/ ctx[2].position.x * /*size*/ ctx[1];
    			if (dirty & /*block, size*/ 3) unitblockcomponent_changes.y = /*unitBlock*/ ctx[2].position.y * /*size*/ ctx[1];
    			if (dirty & /*size*/ 2) unitblockcomponent_changes.size = /*size*/ ctx[1];
    			if (dirty & /*block*/ 1) unitblockcomponent_changes.block = /*unitBlock*/ ctx[2];
    			unitblockcomponent.$set(unitblockcomponent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(unitblockcomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(unitblockcomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(unitblockcomponent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(8:4) {#each block.blocks as unitBlock}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$2(ctx) {
    	let g;
    	let g_transform_value;
    	let current;
    	let each_value = /*block*/ ctx[0].blocks;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block_1 = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "transform", g_transform_value = "translate(" + /*block*/ ctx[0].position.x * /*size*/ ctx[1] + " " + /*block*/ ctx[0].position.y * /*size*/ ctx[1] + ") ");
    			add_location(g, file$2, 6, 0, 162);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*block, size*/ 3) {
    				each_value = /*block*/ ctx[0].blocks;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(g, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*block, size*/ 3 && g_transform_value !== (g_transform_value = "translate(" + /*block*/ ctx[0].position.x * /*size*/ ctx[1] + " " + /*block*/ ctx[0].position.y * /*size*/ ctx[1] + ") ")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MultiBlockComponent', slots, []);
    	let { block } = $$props;
    	let { size } = $$props;
    	const writable_props = ['block', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MultiBlockComponent> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('block' in $$props) $$invalidate(0, block = $$props.block);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ UnitBlockComponent, block, size });

    	$$self.$inject_state = $$props => {
    		if ('block' in $$props) $$invalidate(0, block = $$props.block);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [block, size];
    }

    class MultiBlockComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { block: 0, size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MultiBlockComponent",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*block*/ ctx[0] === undefined && !('block' in props)) {
    			console.warn("<MultiBlockComponent> was created without expected prop 'block'");
    		}

    		if (/*size*/ ctx[1] === undefined && !('size' in props)) {
    			console.warn("<MultiBlockComponent> was created without expected prop 'size'");
    		}
    	}

    	get block() {
    		throw new Error("<MultiBlockComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<MultiBlockComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<MultiBlockComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<MultiBlockComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    class IBlock extends MultiBlock {
        constructor() {
            super();
            let blockOrientation = [
                [
                    { x: 0, y: 1 },
                    { x: 1, y: 1 },
                    { x: 2, y: 1 },
                    { x: 3, y: 1 }
                ],
                [
                    { x: 1, y: 0 },
                    { x: 1, y: 1 },
                    { x: 1, y: 2 },
                    { x: 1, y: 3 }
                ]
            ];
            let color = "#a4c639";
            this.init(blockOrientation, color);
        }
    }

    class LBlock extends MultiBlock {
        constructor() {
            super();
            let blockOrientation = [
                [
                    { x: 0, y: 2 },
                    { x: 0, y: 1 },
                    { x: 1, y: 1 },
                    { x: 2, y: 1 },
                ],
                [
                    { x: 0, y: 0 },
                    { x: 1, y: 0 },
                    { x: 1, y: 1 },
                    { x: 1, y: 2 }
                ],
                [
                    { x: 2, y: 1 },
                    { x: 2, y: 2 },
                    { x: 1, y: 2 },
                    { x: 0, y: 2 }
                ],
                [
                    { x: 0, y: 0 },
                    { x: 0, y: 1 },
                    { x: 0, y: 2 },
                    { x: 1, y: 2 }
                ]
            ];
            let color = "#9966cc";
            this.init(blockOrientation, color);
        }
    }

    class OBlock extends MultiBlock {
        constructor() {
            super();
            let blockOrientation = [
                [
                    { x: 1, y: 1 },
                    { x: 1, y: 2 },
                    { x: 2, y: 1 },
                    { x: 2, y: 2 }
                ]
            ];
            let color = "#ffbf00";
            this.init(blockOrientation, color);
        }
    }

    class SBlock extends MultiBlock {
        constructor() {
            super();
            let blockOrientation = [
                [
                    { x: 2, y: 1 },
                    { x: 1, y: 1 },
                    { x: 1, y: 2 },
                    { x: 0, y: 2 }
                ],
                [
                    { x: 2, y: 2 },
                    { x: 2, y: 1 },
                    { x: 1, y: 1 },
                    { x: 1, y: 0 }
                ]
            ];
            let color = "#e32636";
            this.init(blockOrientation, color);
        }
    }

    class ZBlock extends MultiBlock {
        constructor() {
            super();
            let blockOrientation = [
                [
                    { x: 0, y: 1 },
                    { x: 1, y: 1 },
                    { x: 1, y: 2 },
                    { x: 2, y: 2 }
                ],
                [
                    { x: 2, y: 0 },
                    { x: 2, y: 1 },
                    { x: 1, y: 1 },
                    { x: 1, y: 2 }
                ]
            ];
            let color = "#ff69b4";
            this.init(blockOrientation, color);
        }
    }

    class TBlock extends MultiBlock {
        constructor() {
            super();
            let blockOrientation = [
                [
                    { x: 0, y: 1 },
                    { x: 1, y: 1 },
                    { x: 2, y: 1 },
                    { x: 1, y: 2 },
                ],
                [
                    { x: 1, y: 0 },
                    { x: 1, y: 1 },
                    { x: 1, y: 2 },
                    { x: 0, y: 1 }
                ],
                [
                    { x: 0, y: 1 },
                    { x: 1, y: 1 },
                    { x: 2, y: 1 },
                    { x: 1, y: 0 }
                ],
                [
                    { x: 1, y: 0 },
                    { x: 1, y: 1 },
                    { x: 1, y: 2 },
                    { x: 2, y: 1 }
                ]
            ];
            let color = "#5d8aa8";
            this.init(blockOrientation, color);
        }
    }

    class JBlock extends MultiBlock {
        constructor() {
            super();
            let blockOrientation = [
                [
                    { x: 0, y: 1 },
                    { x: 1, y: 1 },
                    { x: 2, y: 1 },
                    { x: 2, y: 2 },
                ],
                [
                    { x: 1, y: 0 },
                    { x: 1, y: 1 },
                    { x: 1, y: 2 },
                    { x: 0, y: 2 }
                ],
                [
                    { x: 2, y: 1 },
                    { x: 1, y: 1 },
                    { x: 0, y: 1 },
                    { x: 0, y: 0 }
                ],
                [
                    { x: 1, y: 2 },
                    { x: 1, y: 1 },
                    { x: 1, y: 0 },
                    { x: 2, y: 0 }
                ]
            ];
            let color = "#cd9575";
            this.init(blockOrientation, color);
        }
    }

    class BlockFactory {
        static GenerateRandomBlock() {
            switch (Math.floor(Math.random() * 7)) {
                case 0: return new IBlock();
                case 1: return new LBlock();
                case 2: return new ZBlock();
                case 3: return new SBlock();
                case 4: return new OBlock();
                case 5: return new TBlock();
                case 6: return new JBlock();
            }
            return {};
        }
    }

    class GameHandler {
        constructor(width, height) {
            this._multiBlocks = [];
            this._gameOver = false;
            this._score = 0;
            this._paused = true;
            this._gameGrid = Array.apply(null, Array(height)).map(() => {
                return Array.apply(null, Array(width)).map(() => {
                    return { occupied: false };
                });
            });
        }
        get paused() {
            return this._paused;
        }
        set paused(paused) {
            this._paused = paused;
        }
        get gameOver() {
            return this._gameOver;
        }
        get score() {
            return this._score;
        }
        get gameGrid() {
            return this._gameGrid;
        }
        get activeBlock() {
            return this._activeBlock;
        }
        get multiBlocks() {
            return this._multiBlocks;
        }
        rotateBlock(rotation) {
            switch (rotation) {
                case 90:
                    this._activeBlock.rotateClockwise();
                    break;
                case -90:
                    this._activeBlock.rotateCounterClockwise();
                    break;
                case 180:
                    this._activeBlock.rotateTwice();
                    break;
                case -180:
                    this._activeBlock.rotateTwice();
                    break;
            }
        }
        rotateActiveBlock(rotation) {
            if (!this._paused) {
                this.rotateBlock(rotation);
                if (this.onInvalidPosition(this._activeBlock)) {
                    this.rotateBlock(-rotation);
                }
            }
        }
        moveActiveBlockX(steps) {
            if (!this._paused) {
                this._activeBlock.position.x += steps;
                if (this.onInvalidPosition(this._activeBlock)) {
                    this._activeBlock.position.x -= steps;
                }
            }
        }
        moveActiveBlockY(steps) {
            if (!this._paused) {
                this._activeBlock.position.y += steps;
            }
        }
        moveBlockY(multiBlock, steps) {
            multiBlock.position.y += steps;
        }
        dropBlock() {
            return __awaiter(this, void 0, void 0, function* () {
                this._paused = true;
                this.fallDown();
                yield new Promise(r => setTimeout(r, 10));
                let rows = this.removeFullRows();
                let accRows = rows.length;
                while (rows.length > 0) {
                    this.reconstructAllMultiBlocksAbove(this.gameGrid.length);
                    yield new Promise(r => setTimeout(r, 100));
                    this.applyGravity();
                    yield new Promise(r => setTimeout(r, 200));
                    rows = this.removeFullRows();
                    accRows += rows.length;
                }
                if (accRows > 0) {
                    // console.log (accRows);
                    this._score += Math.pow(accRows, 2);
                }
                this._paused = false;
                this.newPiece();
            });
        }
        fallDown(multiBlock) {
            if (multiBlock == undefined) {
                multiBlock = this._activeBlock;
            }
            while (!this.hasReachedStop(multiBlock)) {
                this.moveBlockY(multiBlock, 1);
            }
            let multiBlockToSave = new MultiBlock();
            multiBlockToSave.blocks = [];
            multiBlock.blocks.forEach(block => {
                block.position.x = block.position.x + multiBlock.position.x;
                block.position.y = block.position.y + multiBlock.position.y;
                multiBlockToSave.blocks.push(block);
            });
            this._multiBlocks.push(multiBlockToSave);
            this.saveToGrid(multiBlockToSave);
        }
        removeRow(rowNumber) {
            for (let column = 0; column < this._gameGrid[0].length; column++) {
                this._gameGrid[rowNumber][column] = { occupied: false };
                let slotAbove = this._gameGrid[rowNumber - 1][column];
                if (slotAbove.occupied) {
                    slotAbove.block.connected = slotAbove.block.connected.filter(d => d != Direction.down);
                }
                if (rowNumber < this._gameGrid.length - 1) {
                    let slotBelow = this._gameGrid[rowNumber + 1][column];
                    if (slotBelow.occupied) {
                        slotBelow.block.connected = slotBelow.block.connected.filter(d => d != Direction.up);
                    }
                }
            }
        }
        removeFullRows() {
            let rowIndices = [];
            for (let rowIndex = 0; rowIndex < this._gameGrid.length; rowIndex++) {
                if (!this._gameGrid[rowIndex].map(slot => slot.occupied).includes(false)) {
                    this.removeRow(rowIndex);
                    rowIndices.push(rowIndex);
                }
            }
            return rowIndices;
        }
        onInvalidPosition(multiBlock) {
            if (multiBlock == undefined) {
                multiBlock = this._activeBlock;
            }
            let multiBlockPosition = { x: multiBlock.position.x, y: multiBlock.position.y };
            let unitBlockPosition;
            for (let block of multiBlock.blocks) {
                unitBlockPosition = { x: multiBlockPosition.x + block.position.x, y: multiBlockPosition.y + block.position.y };
                if (unitBlockPosition.x < 0) {
                    return true;
                }
                if (unitBlockPosition.x > this._gameGrid[0].length - 1) {
                    return true;
                }
                if (this._gameGrid[unitBlockPosition.y][unitBlockPosition.x].occupied) {
                    return true;
                }
            }
            return false;
        }
        hasReachedStop(multiBlock) {
            if (multiBlock == undefined) {
                multiBlock = this._activeBlock;
            }
            let multiBlockPosition = { x: multiBlock.position.x, y: multiBlock.position.y };
            let unitBlockPosition;
            for (let block of multiBlock.blocks) {
                unitBlockPosition = { x: multiBlockPosition.x + block.position.x, y: multiBlockPosition.y + block.position.y };
                if (unitBlockPosition.y > this._gameGrid.length - 1) {
                    multiBlock.position.y--;
                    return true;
                }
                if (this._gameGrid[unitBlockPosition.y][unitBlockPosition.x].occupied) {
                    multiBlock.position.y--;
                    return true;
                }
            }
            return false;
        }
        saveToGrid(multiBlock) {
            if (multiBlock == undefined) {
                multiBlock = this._activeBlock;
            }
            let row;
            let column;
            multiBlock.blocks.forEach(unitBlock => {
                row = multiBlock.position.y + unitBlock.position.y;
                column = multiBlock.position.x + unitBlock.position.x;
                unitBlock.position = { x: column, y: row };
                this._gameGrid[row][column] = {
                    occupied: true,
                    block: unitBlock
                };
            });
        }
        newPiece() {
            this._activeBlock = BlockFactory.GenerateRandomBlock();
            this._activeBlock.position = { x: 2, y: 0 };
            this._activeBlock.blocks.forEach(block => {
                if (this._gameGrid[this._activeBlock.position.y + block.position.y][this._activeBlock.position.x + block.position.x].occupied) {
                    this._gameOver = true;
                }
            });
        }
        applyGravity() {
            let stillFalling = true;
            while (stillFalling) {
                stillFalling = false;
                this._multiBlocks.forEach((multiBlock, i) => {
                    multiBlock.blocks.forEach(block => {
                        this._gameGrid[block.position.y][block.position.x].occupied = false;
                    });
                    this.fallDown(multiBlock);
                    if (multiBlock.position.y > 0) {
                        multiBlock.position.y = 0;
                        stillFalling = true;
                    }
                });
            }
        }
        reconstructAllMultiBlocksAbove(row) {
            this._multiBlocks = [];
            let positions = this._gameGrid.flat(1)
                .filter(slot => slot.occupied)
                .map(slot => slot.block.position)
                .filter(position => position.y < row);
            let skip = [];
            for (const position of positions) {
                if (skip.includes(position)) {
                    continue;
                }
                let multiBlock = this.multiBlockAtPosition(position);
                this._multiBlocks.push(multiBlock);
                multiBlock.blocks.forEach(b => {
                    skip.push(b.position);
                });
            }
        }
        multiBlockAtPosition(position) {
            let multiBlock = new MultiBlock();
            let unitBlock;
            unitBlock = this._gameGrid[position.y][position.x].block;
            multiBlock.blocks = this.addAdjecentBlocks(unitBlock);
            return multiBlock;
        }
        addAdjecentBlocks(unitBlock) {
            let nrOfAddedBlocks = 1;
            let addedBlocks;
            let unitBlocks = [unitBlock];
            let adjecentSlot;
            while (nrOfAddedBlocks > 0) {
                addedBlocks = unitBlocks.filter((_, i) => i >= unitBlocks.length - nrOfAddedBlocks);
                nrOfAddedBlocks = 0;
                addedBlocks.forEach(unitBlock => {
                    Object.entries(unitBlock.connected).forEach(direction => {
                        adjecentSlot = this.getAdjecentSlot(unitBlock.position, direction[1]);
                        if (adjecentSlot.occupied && !unitBlocks.includes(adjecentSlot.block)) {
                            unitBlocks.push(adjecentSlot.block);
                            nrOfAddedBlocks++;
                        }
                    });
                });
            }
            return unitBlocks;
        }
        getAdjecentSlot(position, direction) {
            let adjecentPosition = { x: position.x, y: position.y };
            switch (direction) {
                case Direction.up:
                    adjecentPosition.y--;
                    break;
                case Direction.right:
                    adjecentPosition.x++;
                    break;
                case Direction.down:
                    adjecentPosition.y++;
                    break;
                case Direction.left:
                    adjecentPosition.x--;
                    break;
            }
            return this._gameGrid[adjecentPosition.y][adjecentPosition.x];
        }
    }

    /* src\lib\GameArea.svelte generated by Svelte v3.46.4 */

    const { console: console_1, window: window_1 } = globals;
    const file$1 = "src\\lib\\GameArea.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    // (90:4) {#each gameHandler.activeBlock.blocks as block}
    function create_each_block_1(ctx) {
    	let rect;
    	let rect_x_value;
    	let rect_y_value;
    	let rect_height_value;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "x", rect_x_value = (/*gameHandler*/ ctx[0].activeBlock.position.x + /*block*/ ctx[19].position.x) * /*blockSize*/ ctx[3]);
    			attr_dev(rect, "y", rect_y_value = (/*gameHandler*/ ctx[0].activeBlock.position.y + /*block*/ ctx[19].position.y) * /*blockSize*/ ctx[3]);
    			attr_dev(rect, "width", /*blockSize*/ ctx[3]);
    			attr_dev(rect, "height", rect_height_value = /*gameHandler*/ ctx[0].gameGrid.length * /*blockSize*/ ctx[3]);
    			attr_dev(rect, "fill", "#F3F3F3");
    			attr_dev(rect, "class", "svelte-10qn2sf");
    			add_location(rect, file$1, 90, 8, 3297);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*gameHandler*/ 1 && rect_x_value !== (rect_x_value = (/*gameHandler*/ ctx[0].activeBlock.position.x + /*block*/ ctx[19].position.x) * /*blockSize*/ ctx[3])) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty & /*gameHandler*/ 1 && rect_y_value !== (rect_y_value = (/*gameHandler*/ ctx[0].activeBlock.position.y + /*block*/ ctx[19].position.y) * /*blockSize*/ ctx[3])) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (dirty & /*gameHandler*/ 1 && rect_height_value !== (rect_height_value = /*gameHandler*/ ctx[0].gameGrid.length * /*blockSize*/ ctx[3])) {
    				attr_dev(rect, "height", rect_height_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(90:4) {#each gameHandler.activeBlock.blocks as block}",
    		ctx
    	});

    	return block;
    }

    // (94:4) {#each gameHandler.multiBlocks as multiBlock}
    function create_each_block(ctx) {
    	let multiblockcomponent;
    	let current;

    	multiblockcomponent = new MultiBlockComponent({
    			props: {
    				block: /*multiBlock*/ ctx[16],
    				size: /*blockSize*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(multiblockcomponent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(multiblockcomponent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const multiblockcomponent_changes = {};
    			if (dirty & /*gameHandler*/ 1) multiblockcomponent_changes.block = /*multiBlock*/ ctx[16];
    			multiblockcomponent.$set(multiblockcomponent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(multiblockcomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(multiblockcomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(multiblockcomponent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(94:4) {#each gameHandler.multiBlocks as multiBlock}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let t0_value = /*gameHandler*/ ctx[0].score + "";
    	let t0;
    	let t1;
    	let div9;
    	let div5;
    	let div2;
    	let t2_value = (/*gameHandler*/ ctx[0].paused ? "Unpause" : "Pause") + "";
    	let t2;
    	let t3;
    	let div3;
    	let t5;
    	let div4;
    	let t7;
    	let div8;
    	let svg;
    	let each0_anchor;
    	let multiblockcomponent;
    	let t8;
    	let div6;
    	let t10;
    	let div7;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*gameHandler*/ ctx[0].activeBlock.blocks;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	multiblockcomponent = new MultiBlockComponent({
    			props: {
    				block: /*gameHandler*/ ctx[0].activeBlock,
    				size: /*blockSize*/ ctx[3]
    			},
    			$$inline: true
    		});

    	let each_value = /*gameHandler*/ ctx[0].multiBlocks;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div9 = element("div");
    			div5 = element("div");
    			div2 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div3 = element("div");
    			div3.textContent = "rotate";
    			t5 = space();
    			div4 = element("div");
    			div4.textContent = "drop";
    			t7 = space();
    			div8 = element("div");
    			svg = svg_element("svg");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			each0_anchor = empty();
    			create_component(multiblockcomponent.$$.fragment);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			div6 = element("div");
    			div6.textContent = "left";
    			t10 = space();
    			div7 = element("div");
    			div7.textContent = "right";
    			attr_dev(div0, "class", "score svelte-10qn2sf");
    			add_location(div0, file$1, 73, 24, 2523);
    			attr_dev(div1, "class", "containing svelte-10qn2sf");
    			add_location(div1, file$1, 73, 0, 2499);
    			attr_dev(div2, "class", "button svelte-10qn2sf");
    			add_location(div2, file$1, 77, 8, 2703);
    			set_style(div3, "margin-top", "250px");
    			attr_dev(div3, "class", "button svelte-10qn2sf");
    			add_location(div3, file$1, 80, 8, 2864);
    			attr_dev(div4, "class", "button svelte-10qn2sf");
    			add_location(div4, file$1, 83, 8, 3008);
    			attr_dev(div5, "class", "left svelte-10qn2sf");
    			add_location(div5, file$1, 76, 4, 2675);
    			set_style(svg, "--game-width", /*areaWidth*/ ctx[1] * /*blockSize*/ ctx[3] + "px");
    			set_style(svg, "--game-height", /*areaHeight*/ ctx[2] * /*blockSize*/ ctx[3] + "px");
    			attr_dev(svg, "class", "svelte-10qn2sf");
    			add_location(svg, file$1, 88, 0, 3142);
    			attr_dev(div6, "class", "button svelte-10qn2sf");
    			add_location(div6, file$1, 97, 8, 3773);
    			attr_dev(div7, "class", "button svelte-10qn2sf");
    			add_location(div7, file$1, 100, 8, 3887);
    			attr_dev(div8, "class", "right svelte-10qn2sf");
    			add_location(div8, file$1, 87, 4, 3121);
    			attr_dev(div9, "class", "containing svelte-10qn2sf");
    			set_style(div9, "--block-size", /*blockSize*/ ctx[3]);
    			set_style(div9, "--nr-of-columns", /*areaWidth*/ ctx[1]);
    			add_location(div9, file$1, 74, 0, 2575);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div5);
    			append_dev(div5, div2);
    			append_dev(div2, t2);
    			append_dev(div5, t3);
    			append_dev(div5, div3);
    			append_dev(div5, t5);
    			append_dev(div5, div4);
    			append_dev(div9, t7);
    			append_dev(div9, div8);
    			append_dev(div8, svg);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(svg, null);
    			}

    			append_dev(svg, each0_anchor);
    			mount_component(multiblockcomponent, svg, null);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}

    			append_dev(div8, t8);
    			append_dev(div8, div6);
    			append_dev(div8, t10);
    			append_dev(div8, div7);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "keydown", /*handleKeydown*/ ctx[4], false, false, false),
    					listen_dev(div2, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(div3, "click", /*click_handler_1*/ ctx[6], false, false, false),
    					listen_dev(div4, "click", /*click_handler_2*/ ctx[7], false, false, false),
    					listen_dev(div6, "click", /*click_handler_3*/ ctx[8], false, false, false),
    					listen_dev(div7, "click", /*click_handler_4*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*gameHandler*/ 1) && t0_value !== (t0_value = /*gameHandler*/ ctx[0].score + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*gameHandler*/ 1) && t2_value !== (t2_value = (/*gameHandler*/ ctx[0].paused ? "Unpause" : "Pause") + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*gameHandler, blockSize*/ 9) {
    				each_value_1 = /*gameHandler*/ ctx[0].activeBlock.blocks;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(svg, each0_anchor);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			const multiblockcomponent_changes = {};
    			if (dirty & /*gameHandler*/ 1) multiblockcomponent_changes.block = /*gameHandler*/ ctx[0].activeBlock;
    			multiblockcomponent.$set(multiblockcomponent_changes);

    			if (dirty & /*gameHandler, blockSize*/ 9) {
    				each_value = /*gameHandler*/ ctx[0].multiBlocks;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(svg, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(multiblockcomponent.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(multiblockcomponent.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div9);
    			destroy_each(each_blocks_1, detaching);
    			destroy_component(multiblockcomponent);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GameArea', slots, []);

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	let areaWidth = 8;
    	let areaHeight = 20;
    	let blockSize = 30;
    	let gameHandler = new GameHandler(areaWidth, areaHeight);
    	gameHandler.newPiece();
    	let key;

    	function handleKeydown(event) {
    		return __awaiter(this, void 0, void 0, function* () {
    			key = event.key;

    			if (key === 'd') {
    				gameHandler.rotateActiveBlock(90);
    			}

    			if (key === 's') {
    				gameHandler.rotateActiveBlock(180);
    			}

    			if (key === 'a') {
    				gameHandler.rotateActiveBlock(-90);
    			}

    			if (key === 'ArrowLeft') {
    				gameHandler.moveActiveBlockX(-1);
    			}

    			if (key === 'ArrowRight') {
    				gameHandler.moveActiveBlockX(+1);
    			}

    			if (key === "ArrowDown") {
    				timer = 0;
    				yield gameHandler.dropBlock();
    			}
    		});
    	}

    	function update(progress) {
    		gameHandler.moveActiveBlockY(1);

    		if (gameHandler.hasReachedStop()) {
    			gameHandler.dropBlock();
    		}
    	}

    	let timer = 0;

    	function loop(timestamp) {
    		var progress = timestamp - lastRender;

    		if (!gameHandler.gameOver) {
    			$$invalidate(0, gameHandler);

    			if (!gameHandler.paused) {
    				timer += progress;

    				if (timer > 500) {
    					update();
    					timer = 0;
    				}
    			}

    			lastRender = timestamp;
    			window.requestAnimationFrame(loop);
    		} else {
    			console.log("game over");
    		}
    	}

    	var lastRender = 0;
    	window.requestAnimationFrame(loop);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<GameArea> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, gameHandler.paused = !gameHandler.paused, gameHandler);
    	const click_handler_1 = () => gameHandler.rotateActiveBlock(90);
    	const click_handler_2 = () => gameHandler.dropBlock();
    	const click_handler_3 = () => gameHandler.moveActiveBlockX(-1);
    	const click_handler_4 = () => gameHandler.moveActiveBlockX(1);

    	$$self.$capture_state = () => ({
    		__awaiter,
    		MultiBlockComponent,
    		GameHandler,
    		areaWidth,
    		areaHeight,
    		blockSize,
    		gameHandler,
    		key,
    		handleKeydown,
    		update,
    		timer,
    		loop,
    		lastRender
    	});

    	$$self.$inject_state = $$props => {
    		if ('__awaiter' in $$props) __awaiter = $$props.__awaiter;
    		if ('areaWidth' in $$props) $$invalidate(1, areaWidth = $$props.areaWidth);
    		if ('areaHeight' in $$props) $$invalidate(2, areaHeight = $$props.areaHeight);
    		if ('blockSize' in $$props) $$invalidate(3, blockSize = $$props.blockSize);
    		if ('gameHandler' in $$props) $$invalidate(0, gameHandler = $$props.gameHandler);
    		if ('key' in $$props) key = $$props.key;
    		if ('timer' in $$props) timer = $$props.timer;
    		if ('lastRender' in $$props) lastRender = $$props.lastRender;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		gameHandler,
    		areaWidth,
    		areaHeight,
    		blockSize,
    		handleKeydown,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4
    	];
    }

    class GameArea extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameArea",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let gamearea;
    	let current;
    	gamearea = new GameArea({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(gamearea.$$.fragment);
    			attr_dev(main, "class", "svelte-l97o18");
    			add_location(main, file, 3, 0, 78);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(gamearea, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(gamearea.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(gamearea.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(gamearea);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ GameArea });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        // props: {
        // 	name: 'turd'
        // }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
