(function (){
	if (typeof window==="undefined" || window.focusManager) return;

	const tabbable = (function() {
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

		let target = next();
		if (target && target!==currentFocus) target.focus();
	};

	var backward = function() {
		if (!currentFocus) return;

		let target = previous();
		if (target && target!==currentFocus) target.focus();
	};

	var next = function(element) {
		if (!element) element = currentFocus;
		if (!element || !(element instanceof Element)) return null;

		let elements = orderedElements();
		let index = elements.indexOf(element);
		return elements[index+1];
	};

	var previous = function(element) {
		if (!element) element = currentFocus;
		if (!element || !(element instanceof Element)) return null;

		let elements = orderedElements();
		let index = elements.indexOf(element);
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
