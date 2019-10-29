(function (){
	var first = function first(element,delveShadow) {
		if (!element) throw new Error("Invalid element.");
		return element.firstElementChild || delveShadow && element.shadowRoot && element.shadowRoot.firstElementChild || null;
	};
	var down = first;

	var last = function last(element,delveShadow) {
		if (!element) throw new Error("Invalid element.");
		return delveShadow && element.shadowRoot && element.shadowRoot.lastElementChild || element.lastElementChild || null;
	};
	var downLast = last;

	var up = function up(element,delveShadow) {
		if (!element) throw new Error("Invalid element.");
		return element.parentElement || delveShadow && element.parentNode instanceof DocumentFragment && element.parentNode.host || null;
	};

	var top = function top(element,delveShadow) {
		if (!element) throw new Error("Invalid element.");
		while(true) {
			var e = up(element,delveShadow);
			if (!e) break;
			element = e;
		}
		return element;
	};

	var bottom = function bottom(element,delveShadow) {
		if (!element) throw new Error("Invalid element.");
		while (true) {
			var e = down(element,delveShadow);
			if (!e) break;
			element = e;
		}
		return element;
	};

	var bottomLast = function bottomLast(element,delveShadow) {
		if (!element) throw new Error("Invalid element.");
		while (true) {
			var e = downLast(element,delveShadow);
			if (!e) break;
			element = e;
		}
		return element;
	};

	var next = function next(element,delveShadow) {
		if (!element) throw new Error("Invalid element.");

		var c = element.firstElementChild || null;
		if (c) return c;

		var sc = delveShadow && element.shadowRoot && element.shadowRoot.firstElementChild || null;
		if (sc) return element.shadowRoot.firstElementChild;

		var sib = element.nextElementSibling || null;
		if (sib) return sib;

		var e = element;
		while (e = up(e,delveShadow)) {
			if (!e || e===element) return null;

			var sib = e.nextElementSibling;
			if (sib) return sib;
		}
	};

	var prev = function prev(element,delveShadow) {
		if (!element) throw new Error("Invalid element.");

		var sib = element.previousElementSibling;
		if (sib) return bottomLast(sib,delveShadow);

		var sc = delveShadow && !element.parentElement && element.parentNode && element.parentNode instanceof DocumentFragment && element.parentNode.host || null;
		if (sc && sc.lastElementChild) return bottom(sc.lastElementChild,delveShadow);

		var u = up(element,delveShadow);
		return u;
	};

	var descendants = function descendants(element,delveShadow) {
		if (!element) throw new Error("Invalid element.");

		var desc = [];

		var children = Array.prototype.slice.call(element.children);
		children.forEach(function(c){
			desc = desc.concat(c,descendants(c,delveShadow));
		});

		if (delveShadow && element.shadowRoot) {
			var shadows = Array.prototype.slice.call(element.shadowRoot.children);
			shadows.forEach(function(c){
				desc = desc.concat(c,descendants(c,delveShadow));
			});
		}

		return desc;
	};

	var ancestors = function ancestors(element,delveShadow) {
		if (!element) throw new Error("Invalid element.");

		var ansc = [];
		var e = element;
		while (e) {
			e = up(e,delveShadow);
			if (!e) break;
			ansc.push(e);
		}
		return ansc;
	};

	var forwardList = function forwardList(element,delveShadow) {
		if (!element) throw new Error("Invalid element.");
		var elements = [];

		var e = element;
		while (e = next(e,delveShadow)) {
			if (!e || e===element || !contains(element,e,delveShadow)) break;
			elements.push(e);
		}
		return elements;
	};

	var backwardList = function backwardList(element,delveShadow) {
		if (!element) throw new Error("Invalid element.");
		return forwardList(element,delveShadow).reverse();
	};

	var contains = function contains(container,element,delveShadow) {
		if (!container && !(container instanceof HTMLElement)) return false;
		if (!element && !(element instanceof HTMLElement)) return false;

		if (!delveShadow) return container.contains(element);

		var ancs = ancestors(element,true);
		return ancs.indexOf(container)>-1;
	};

	var dom = {
		first: first,
		last: last,
		up: up,
		down: first,
		downLast: last,
		next: next,
		forward: next,
		prev: prev,
		previous: prev,
		backward: prev,
		top: top,
		bottom: bottom,
		bottomLast: bottomLast,
		descendants: descendants,
		ancestors: ancestors,
		forwardList: forwardList,
		backwardList: backwardList,
		contains: contains
	};

	// can be used in node, mostly for testing
	if (typeof module!=="undefined" && module && module.exports) {
		module.exports = dom;
	}

	// creates window.DOMTraversal for usage in browsers.
	if (typeof window!=="undefined" && window) {
		window.DOMTraversal = window.DOMTraversal || dom;
	}
})();
// requires DOMTraversal.

(function (){
	if (typeof window==="undefined" || window.focusManager) return;

	var DT = window.DOMTraversal;

	// array helpers
	var flatten = function flatten(array) {
		if (!array) throw new Error("Missing array.");
		if (!(array instanceof Array)) array = Array.prototype.slice.call(array);

		return array.reduce((array,x)=>{
			if (x instanceof Array) {
				this.flatten(x).forEach((x)=>{
					array.push(x);
				});
			}
			else {
				array.push(x);
			}
			return array;
		},[]);
	};

	var history = [];
	var historyLimit = 50;
	var previousFocus = null;
	var currentFocus = document.activeElement || null;
	var traps = [];
	var proxies = [];
	var pending = null;
	var id = 1000000;

	/**
	 * Returns true if a given element can receive the focus at this particular moment.
	 *
	 * Computation of what can and cannot receive the focus is a very complex thing.  There is
	 * a very helpful chart at https://allyjs.io/data-tables/focusable.html that really
	 * highlights the complexity of the issue.  THe focus-traversal-api-polyfill does its
	 * best general case to get it right, but does not solve all use cases at this time.  It
	 * is the hope of this module that browser manufacturers will implement the proposed
	 * specification described at https://github.com/awesomeeng/FocusTraversalAPI in which
	 * they will expose the internal isFocusable() method and we can all use the built-in
	 * browser implementation and just get it right.
	 *
	 * In the meantime, this polyfill implementation is doing the best it can. Please let
	 * us know if you find edge cases that dont work.
	 *
	 * If the given element is null or undefined or not otherwise an instance of
	 * HTMLElement, this function will always return false.
	 *
	 * @param  {HTMLElement}  element
	 * @return {Boolean}
	 */
	var isFocusable = function isFocusable(element) {
		if (!element) return false;
		if (!(element instanceof HTMLElement)) return false;

		// these rules apply to the element and all its ancestors...
		var all = DT.ancestors(element,true).reverse();
		for (var i=0;i<all.length;i++) {
			var e = all[i];
			if (!e) continue;
			if (!(e instanceof HTMLElement)) continue;

			// if "inert", not focusable. Note, that inert isn't actually an HTML standard.
			var inert = e.inert || false;
			if (inert===true) return false;

			var styles = window.getComputedStyle(e);

			// if style.display = none, not focusable.
			var disp = styles.display;
			if (disp==="none") return false;

			// if style.visibility = hidden, not focusable.
			var viz = styles.visibility;
			if (viz==="hidden") return false;

			// if style.opacity <= 0, not focusable.
			var op = styles.opacity;
			op = op && parseInt(op) || 1;
			if (op<=0) return false;
		}

		// if tabindex is -1, no focusable.
		var ti = element.getAttribute("tabindex") || null;
		ti = ti && +ti;
		if (ti!==null && ti<0) return false;
		if (ti!==null && ti>=0) return true;

		// anything disabled is not focusable
		var dis = element.hasAttribute("disabled",null);
		if (dis) return false;

		// Some elements by their very nature are focusable...
		var tn = element.tagName;
		if (tn==="BUTTON" || tn==="INPUT" || tn==="SELECT" || tn==="TEXTAREA") return true;
		if (tn==="A" && (element.hasAttribute("href") || element.hasAttribute("xlink:href"))) return true;
		if (tn==="AUDIO" && element.hasAttribute("controls")) return true;
		if (tn==="VIDEO" && element.hasAttribute("controls")) return true;

		// Any element that is contenteditable is focusable.
		var ce = element.getAttribute("contenteditable");
		if (ce!==null && ce===true) return true;

		return false;
	};

	/**
	 * Sets the focus to the given element. This is functionally equivalent to doing
	 * `element.focus()`. If no element is given, nothing will happen.
	 *
	 * Note that the browser does not garauntee that the focus will
	 * be set to the given element; this is is purely a request.
	 *
	 * @param  {HTMLElement} element
	 * @param  {Object} focusOption
	 * @return {void}
	 */
	var focus = function focus(element,focusOption,immediately) {
		if (!element || !(element instanceof Element)) return;
		if (typeof focusOption==="boolean") {
			immediately = focusOption;
			focusOption = null;
		}

		if (pending) clearTimeout(pending);
		pending = null;

		if (immediately===true) {
			element.focus(focusOption||{});
		}
		else {
			pending = setTimeout(function(){
				element.focus(focusOption||{});
			},0);
		}
	};

	/**
	 * Returns true if the given element currently has the focus. This is functionally
	 * equivalent to `document.activeElement===element;`.
	 *
	 * @param  {HTMLElement}  element
	 * @return {Boolean}
	 */
	var hasFocus = function hasFocus(element) {
		if (!element || !(element instanceof Element)) return false;
		return currentFocus===element;
	};

	/**
	 * Returns an array of all focusable elements within the given container.  If no
	 * container is provided `document.body` is assumed.
	 *
	 * Note that in very large DOM structures this can be a significantly expensive call.
	 *
	 * @param  {HTMLElement|null} container
	 * @return {Array}
	 */
	var list = function list(container){
		return DT.forwardList(container||document.body,true).filter(function(e){
			return isFocusable(e);
		});
	};

	/**
	 * Returns the first focusable element in the given container. If no container is
	 * provided `document.body` is assumed.
	 *
	 * @param  {HTMLElement|null} container
	 * @return {HTMLElement|null}
	 */
	var first = function first(container){
		container = container || document.body;
		var e = DT.bottom(container,true);
		if (!e) return;
		if (isFocusable(e)) return e;
		e = next(e);
		if (DT.contains(container,e,true)) return e;
		return null;
	};

	/**
	 * Returns the last focusable element in the given container. If no container is
	 * provided `document.body` is assumed.
	 *
	 * @param  {HTMLElement|null} container
	 * @return {HTMLElement|null}
	 */
	var last = function last(container) {
		container = container || document.body;
		var e = DT.bottomLast(container,true);
		if (!e) return;
		if (isFocusable(e)) return e;
		e = previous(e);
		if (DT.contains(container,e,true)) return e;
		return null;
	};

	/**
	 * Moves the focus forward to the next focusable element.
	 *
	 * @param  {Object|null} focusOption
	 * @return {void}
	 */
	var forward = function forward(focusOption) {
		if (!currentFocus) return;

		var target = next();
		if (target && target!==currentFocus) focus(target,focusOption||{});
	};

	/**
	 * Moves the focus backward to the previous focusable element.
	 *
	 * @param  {Object|null} focusOption
	 * @return {void}
	 */
	var backward = function backward(focusOption) {
		if (!currentFocus) return;

		var target = previous();
		if (target && target!==currentFocus) focus(target,focusOption||{});
	};

	/**
	 * Returns the next focusable element, but does not move the focus to
	 * that element. If no element is provided, the currently focused
	 * element is assumed.
	 *
	 * @param  {HTMLElement|null}   element
	 * @return {HTMLElement|null}
	 */
	var next = function next(element) {
		if (!element) element = currentFocus;
		if (!element || !(element instanceof Element)) return null;

		while (element) {
			element = DT.forward(element,true);
			if (element && isFocusable(element)) break;
		}

		for (var i=0;i<proxies.length;i++) {
			let p = proxies[i];
			if (p.source===element) {
				element = p.target;
				break;
			}
		}

		return element;
	};

	/**
	 * Returns the previous focusable element, but does not move the focus to
	 * that element. If no element is provided, the currently focused
	 *
	 * @param  {HTMLElement|null}   element
	 * @return {HTMLElement|null}
	 */
	var previous = function previous(element) {
		if (!element) element = currentFocus;
		if (!element || !(element instanceof Element)) return null;

		while (element) {
			element = DT.backward(element,true);
			if (element && isFocusable(element)) break;
		}

		for (var i=0;i<proxies.length;i++) {
			let p = proxies[i];
			if (p.source===element) {
				element = previous(p.source);
				break;
			}
		}

		return element;
	};

	/**
	 * Traps the focus within a given container. If the focus attempts to
	 * leave the given container, focus is returned to the element that
	 * last held the focus.
	 *
	 * If the given container doesn't have any focusable elements, this
	 * call will not result in setting the focus trap.
	 *
	 * A `trap()` is removed by calling `untrap()` with the same container
	 * argument.
	 *
	 * `trap()` cascades, so calling it multiple times causes the
	 * trap to narrow. Removing a trap will place the browser back into
	 * the prior trap state.
	 *
	 * @param  {HTMLElement} container
	 * @return {void}
	 */
	var trap = function trap(container) {
		if (!container) return;
		if (!(container instanceof HTMLElement)) return;

		var existing = traps.map(function(detail){
			return detail.container;
		});
		if (existing.indexOf(container)>-1) return;

		var detail = {
			container: container,
			last: first(container),
			blur: null
		};
		traps.unshift(detail);

		focus(detail.last);
	};

	/**
	 * Stops trapping focus.
	 *
	 * @param  {HTMLElement} container
	 * @return {void}
	 */
	var untrap = function untrap(container) {
		if (!container) return;
		if (!(container instanceof HTMLElement)) return;

		if (traps.length<1) return;

		var isfirst = traps[0].container===container;
		traps = traps.filter(function(detail){
			return detail.container!==container;
		});
		if (isfirst) focus(traps[0].last);
	};

	/**
	 * Order one or more elements using the tabindex attribute. The order
	 * the elements are given to this function is the order the will occur. This
	 * will overwrite any existing tabindex on all elements given.
	 *
	 * If you give a number as one of the arguments, that number will be used
	 * as the tabindex for the next element, and then incremented, and used
	 * for the next element and so on.  If no number is given as the first
	 * argument, an internal counter will be used instead.
	 *
	 * @param  {Array|HTMLElement|Number} element
	 * @return {void}
	 */
	var order = function order(/*element,element,element,etc*/) {
		var pos = null;
		var elements = flatten(arguments);
		elements.forEach(function(e){
			if (typeof e==="number") {
				pos = e;
				return;
			}
			else if (e instanceof HTMLElement) {
				let n = id++;
				if (pos!==null) n = pos++;
				e.setAttribute("tabindex",""+n);
			}
		});
	};

	/**
	 * Sets the given source element to proxy any focus it receives to the
	 * target element. If the source element given is not focusable, it will
	 * be made focusable.  The target element must be focusable.
	 *
	 * @param  {HTMLElement} source
	 * @param  {HTMLElement} target
	 * @return {void}
	 */
	var proxy = function proxy(source,target) {
		if (!source) return;
		if (!(source instanceof HTMLElement)) return;
		if (!target) return;
		if (!(target instanceof HTMLElement)) return;
		if (!isFocusable(target)) return;

		// clear any existing proxy
		unproxy(source,target);

		var ti = source.getAttribute("tabindex") || null;
		ti = ti && parseInt(ti) || null;
		if (ti===null || ti<0) source.setAttribute("tabindex",0);

		proxies.push({
			source: source,
			target: target,
			sourceTabIndex: ti
		});

		if (currentFocus===source) focus(target);
	};

	/**
	 * Removes an existing proxy.
	 *
	 * @param  {HTMLElement} source
	 * @param  {HTMLElement} target
	 * @return {void}
	 */
	var unproxy = function unproxy(source,target) {
		proxies = proxies.filter(function(p){
			if (p.source===source && p.target===target) {
				if (p.sourceTabIndex!==null) source.setAttribute("tabindex",p.sourceTabIndex);
				else source.removeAttribute("tabindex");
				return false;
			}
			return true;
		});
	};

	document.addEventListener("DOMContentLoaded",function(){
		document.addEventListener("focus",function(event){
			var target = event.target;
			if (event.composedPath) {
				var path = event.composedPath();
				if (path.length>0) target = path[0];
			}

			currentFocus = target;

			var trap = traps[0] || null;
			if (trap) trap.last = target;

			history.unshift(target);
			if (historyLimit>-1) history = history.slice(0,historyLimit);

			for (var i=0;i<proxies.length;i++) {
				let p = proxies[i];
				if (p.source===target) {
					focus(p.target);
					return;
				}
			}
		},true);
		document.addEventListener("blur",function(event){
			var target = event.target;
			if (event.composedPath) {
				var path = event.composedPath();
				if (path.length>0) target = path[0];
			}

			var related = event.relatedTarget;
			if (related) {
				var trap = traps[0] || null;
				if (trap && trap.last) {
					var anc = DT.ancestors(related,true);
					if (anc.indexOf(trap.container)<0) {
						focus(trap.last);
						return;
					}
				}
			}

			previousFocus = target;
		},true);
		document.addEventListener("keyup",function(event){
			if (event.shiftKey && event.keyCode===9) {
				var source = currentFocus;
				for (var i=0;i<proxies.length;i++) {
					let p = proxies[i];
					if (p.source===source || p.target===source) {
						focus(previous(p.source));
						event.preventDefault();
						return;
					}
				}
			}
		},true);
	});

	window.focusManager = {
		isFocusable: isFocusable,
		focus: focus,
		hasFocus: hasFocus,
		list: list,
		first: first,
		last: last,
		forward: forward,
		backward: backward,
		next: next,
		previous: previous,
		trap: trap,
		untrap: untrap,
		order: order,
		proxy: proxy,
		unproxy: unproxy
	};
	Object.defineProperty(window.focusManager,"currentlyFocused",{
		get: function() {
			return currentFocus;
		}
	});
	Object.defineProperty(window.focusManager,"previouslyFocused",{
		get: function() {
			return previousFocus || null;
		}
	});
	Object.defineProperty(window.focusManager,"history",{
		get: function() {
			return [].concat(history);
		}
	});
	Object.defineProperty(window.focusManager,"historyLimit",{
		get: function() {
			return historyLimit;
		},
		set: function(n) {
			n = parseInt(n);
			if (isNaN(n)) return;
			if (n<-1) return;
			historyLimit = n;

			if (historyLimit>-1) history = history.slice(0,historyLimit);
		}
	});
})();
