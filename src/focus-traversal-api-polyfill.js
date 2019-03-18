(function (){
	if (typeof window==="undefined" || window.focusManager) return;

	var toArray = function(a) {
		return Array.prototype.slice.call(a);
	};


	//
	//                        A
	//                       / \
	//                      B   G
	//                     / \   \
	//                    C   F   H
	//                   / \
	//                  D   E
	//
	// GIVEN A, NEXT = D
	// GIVEN D, NEXT = E
	// GIVEN E, NEXT = C
	// GIVEN C, NEXT = F
	// GIVEN F, NEXT = B
	// GIVEN B, NEXT = H
	// GIVEN H, NEXT = G
	// GIVEN G, NEXT = A
	//
	// X = descend
	// IF X==Y, next
	// IF X==null, up
	// ELSE descend

	var dom = {};
	dom.first = function(element,delveShadow) {
		if (!element && !(element instanceof Node)) throw new Error("Invalid element.");
		return element.firstElementChild || delveShadow && element.shadowRoot && element.shadowRoot.firstElementChild || null;
	};
	dom.last = function(element,delveShadow) {
		if (!element && !(element instanceof Node)) throw new Error("Invalid element.");
		return delveShadow && element.shadowRoot && element.shadowRoot.lastElementChild || element.lastElementChild || null;
	};
	dom.up = function(element,delveShadow) {
		if (!element && !(element instanceof Node)) throw new Error("Invalid element.");
		return element.parentElement || delveShadow && element.parentNode instanceof DocumentFragment && element.parentNode.host || null;
	};
	dom.down = function(element,delveShadow) {
		if (!element && !(element instanceof Node)) throw new Error("Invalid element.");
		return dom.first(element,delveShadow);
	};
	dom.next = function(element,delveShadow) {
		if (!element && !(element instanceof Node)) throw new Error("Invalid element.");
		return element.nextElementSibling || delveShadow && element.shadowRoot && element.shadowRoot.firstElementChild || null;
	};
	dom.prev = function(element,delveShadow) {
		if (!element && !(element instanceof Node)) throw new Error("Invalid element.");
		return element.previousElementSibling && delveShadow && element.parentNode instanceof DocumentFragment && element.parentNode.host && element.parentNode.host.lastElementChild || null;
	};
	dom.ascend = function(element,delveShadow) {
		if (!element && !(element instanceof Node)) throw new Error("Invalid element.");
		while(dom.up(element,delveShadow)) element = dom.up(element,delveShadow);
		return element;
	};
	dom.descend = function(element,delveShadow) {
		if (!element && !(element instanceof Node)) throw new Error("Invalid element.");
		while (dom.down(element,delveShadow)) element = dom.down(element,delveShadow);
		return element;
	};
	dom.deepest = dom.descend;
	dom.forward = function(element,delveShadow) {
		if (!element && !(element instanceof Node)) throw new Error("Invalid element.");

		console.log(1,element);
		var next = dom.next(element,delveShadow);
		console.log(2,next);

		if (next) {
			console.log(3);
			return dom.descend(next,delveShadow) || next;
		}
		else {
			console.log(4);
			return dom.up(element,delveShadow);
		}
	};
	dom.descendants = function(element,delveShadow) {
		if (!element && !(element instanceof Node)) throw new Error("Invalid element.");
		var desc = [];
		var e = dom.deepest(element,delveShadow);
		while (e && e!==element) {
			desc.push(e);
			e = dom.forward(e,delveShadow);
		}
		return desc;
	};
	dom.ancestors = function(element,delveShadow) {
		if (!element && !(element instanceof Node)) throw new Error("Invalid element.");
		var ansc = [];
		let e = element;
		while (e) {
			console.log(1,e);
			ansc.unshift(e);
			e = dom.up(e,delveShadow);
			if (!e || e===document.body.parentElement) break;
		}
		return ansc;
	}
	window.glendom = dom;

	var tabbable = (function() {
		// Tabbable from David Clark.
		// https://github.com/davidtheclark/tabbable
		//
		// The MIT License (MIT)
		//
		// Copyright (c) 2015 David Clark
		//
		// Permission is hereby granted, free of charge, to any person obtaining a copy
		// of this software and associated documentation files (the "Software"), to deal
		// in the Software without restriction, including without limitation the rights
		// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		// copies of the Software, and to permit persons to whom the Software is
		// furnished to do so, subject to the following conditions:
		//
		// The above copyright notice and this permission notice shall be included in all
		// copies or substantial portions of the Software.
		//
		// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		// SOFTWARE.

		var candidateSelectors = [
			"input",
			"select",
			"textarea",
			"a[href]",
			"button",
			"[tabindex]",
			"audio[controls]",
			"video[controls]",
			'[contenteditable]:not([contenteditable="false"])'
		];
		var candidateSelector = candidateSelectors.join(",");

		var matches =
		typeof Element === "undefined" ? function() {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

		function tabbable(el, options) {
			options = options || {};

			var regularTabbables = [];
			var orderedTabbables = [];

			var candidates = el.querySelectorAll(candidateSelector);

			if (options.includeContainer) {
				if (matches.call(el, candidateSelector)) {
					candidates = Array.prototype.slice.apply(candidates);
					candidates.unshift(el);
				}
			}

			var i, candidate, candidateTabindex;
			for (i = 0; i < candidates.length; i++) {
				candidate = candidates[i];

				if (!isNodeMatchingSelectorTabbable(candidate)) continue;

				candidateTabindex = getTabindex(candidate);
				if (candidateTabindex === 0) {
					regularTabbables.push(candidate);
				} else {
					orderedTabbables.push({
						documentOrder: i,
						tabIndex: candidateTabindex,
						node: candidate
					});
				}
			}

			var tabbableNodes = orderedTabbables.sort(sortOrderedTabbables).map(function(a) {
				return a.node;
			}).concat(regularTabbables);

			return tabbableNodes;
		}

		tabbable.isTabbable = isTabbable;
		tabbable.isFocusable = isFocusable;

		function isNodeMatchingSelectorTabbable(node) {
			if (
				!isNodeMatchingSelectorFocusable(node) ||
				isNonTabbableRadio(node) ||
				getTabindex(node) < 0
			) {
				return false;
			}
			return true;
		}

		function isTabbable(node) {
			if (!node) throw new Error("No node provided");
			if (matches.call(node, candidateSelector) === false) return false;
			return isNodeMatchingSelectorTabbable(node);
		}

		function isNodeMatchingSelectorFocusable(node) {
			if (node.disabled || isHiddenInput(node) || isHidden(node)) {
				return false;
			}
			return true;
		}

		var focusableCandidateSelector = candidateSelectors.concat("iframe").join(",");
		function isFocusable(node) {
			if (!node) throw new Error("No node provided");
			if (matches.call(node, focusableCandidateSelector) === false) return false;
			return isNodeMatchingSelectorFocusable(node);
		}

		function getTabindex(node) {
			var tabindexAttr = parseInt(node.getAttribute("tabindex"), 10);
			if (!isNaN(tabindexAttr)) return tabindexAttr;
			// Browsers do not return `tabIndex` correctly for contentEditable nodes;
			// so if they don't have a tabindex attribute specifically set, assume it's 0.
			if (isContentEditable(node)) return 0;
			return node.tabIndex;
		}

		function sortOrderedTabbables(a, b) {
			return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
		}

		function isContentEditable(node) {
			return node.contentEditable === "true";
		}

		function isInput(node) {
			return node.tagName === "INPUT";
		}

		function isHiddenInput(node) {
			return isInput(node) && node.type === "hidden";
		}

		function isRadio(node) {
			return isInput(node) && node.type === "radio";
		}

		function isNonTabbableRadio(node) {
			return isRadio(node) && !isTabbableRadio(node);
		}

		function getCheckedRadio(nodes) {
			for (var i = 0; i < nodes.length; i++) {
				if (nodes[i].checked) {
					return nodes[i];
				}
			}
		}

		function isTabbableRadio(node) {
			if (!node.name) return true;
			// This won't account for the edge case where you have radio groups with the same
			// in separate forms on the same page.
			var radioSet = node.ownerDocument.querySelectorAll(
				'input[type="radio"][name="' + node.name + '"]'
			);
			var checked = getCheckedRadio(radioSet);
			return !checked || checked === node;
		}

		function isHidden(node) {
			// offsetParent being null will allow detecting cases where an element is invisible or inside an invisible element,
			// as long as the element does not use position: fixed. For them, their visibility has to be checked directly as well.
			return (
				node.offsetParent === null ||
				getComputedStyle(node).visibility === "hidden"
			);
		}

		return tabbable;
	})();

	var history = [];
	var historyLimit = 50;
	var currentFocus = null;
	var previousFocus = null;

	var focus = function(element) {
		if (!element || !(element instanceof Element)) return;
		element.focus();
	};

	var hasFocus = function(element) {
		if (!element || !(element instanceof Element)) return false;
		return currentFocus===element;
	};

	var orderedElements = function(){
		return tabbable(document.body);
	};

	var forward = function() {
		if (!currentFocus) return;

		var target = next();
		if (target && target!==currentFocus) target.focus();
	};

	var backward = function() {
		if (!currentFocus) return;

		var target = previous();
		if (target && target!==currentFocus) target.focus();
	};

	var next = function(element) {
		if (!element) element = currentFocus;
		if (!element || !(element instanceof Element)) return null;

		var elements = orderedElements();
		var index = elements.indexOf(element);
		return elements[index+1];
	};

	var previous = function(element) {
		if (!element) element = currentFocus;
		if (!element || !(element instanceof Element)) return null;

		var elements = orderedElements();
		var index = elements.indexOf(element);
		return elements[index-1];
	};

	document.addEventListener("DOMContentLoaded",function(){
		document.addEventListener("focus",function(event){
			history.unshift(event.target);
			if (historyLimit>-1) history = history.slice(0,historyLimit);
			if (currentFocus) previousFocus = currentFocus;

			currentFocus = event.target;
		},true);
		document.addEventListener("blur",function(){
			previousFocus = currentFocus;
			currentFocus = null;
		},true);
	});

	window.focusManager = {
		focus: focus,
		hasFocus: hasFocus,
		forward: forward,
		backward: backward,
		next: next,
		previous: previous,
		orderedElements: orderedElements
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
