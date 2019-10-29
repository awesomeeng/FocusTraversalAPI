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

		var sc = delveShadow && element.shadowRoot && element.shadowRoot.lastElementChild || null;
		if (sc) return bottom(sc,delveShadow);

		var u = up(element,delveShadow);
		return u;
	};

	var descendants = function descendants(element,delveShadow) {
		if (!element) throw new Error("Invalid element.");

		var desc = [];

		let children = Array.prototype.slice.call(element.children);
		children.forEach(function(c){
			desc = desc.concat(c,descendants(c,delveShadow));
		});

		if (delveShadow && element.shadowRoot) {
			let shadows = Array.prototype.slice.call(element.shadowRoot.children);
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
			if (!e || e===element || !element.contains(e)) break;
			elements.push(e);
		}
		return elements;
	};

	var backwardList = function backwardList(element,delveShadow) {
		if (!element) throw new Error("Invalid element.");
		return forwardList(element,delveShadow).reverse();
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
		backwardList: backwardList
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
