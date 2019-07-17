# Focus Traversal API

This is a proposed feature that would allow an author to better understand and manipulate the Focus system within a web page.  This includes support for computing the next and previous Focus targets for any given element, moving the focus forward or backward programatically from an element without knowing the next focus target, and other focus related features.

## The Problem

The current system for programmatically manipulating focus within a web page leaves a lot to be desired. A single element can request the focus with the `focus()` method but that is the extent of the programatic focus navigation options.  Advancing the focus to the next focusable element or the previous focusable element involves a complex dance of DOM traversal and guess work as to what elements can receive focus or not.  Most solutions to manipulating focus are complicated; the very simple need to manipulate focus in a meaningful and accessable manner is significantly lacking.

#### Focusable

A big part of the problem is how one determines if an element is "focusable" or not and can receive focus.  There are very complex rules associated with this process as outlined in section 5.4.2 of the [W3C HTML Standard (as of 5.3 Working Draft, 18 October 2018)](https://www.w3.org/TR/2018/WD-html53-20181018/editing.html#data-model). These rules are fairly stable, but could change and expecting userland modules to keep in sync or even be in sync currently is unrealistic.

#### Moving Focus Programatically

In order to move focus from any given element to the next (or prior) focusable element is complicated. One would need to walk the DOM in a forward manner (down to lowest leaf of next sibling, then next sibling, then parent, etc). For each element, one would need to apply the rules for what is focusable.  If the element is focusable, move the focus there.  If not, move to the next element.

This is not an easy process for users.  Many userland modules and frameworks attempt to solve this problem, but as stated above there is a an unrealistic expectation of these modules to stay in concert with the focusable rules.

## The Focus Traversal API

This proposal introduces the concepts of a Focus Traversal API to solve these problems. This API exists as an additional set of behaviours over and above what can be done with the existing focus system.

### The `window.focusManager` Object

This proposal suggests the creating of a top level `window` property called `focusManager` which will be used to expose a series of properties and methods for working with Focus traversal.

#### Focusable

To address the complexity with determining if an element is focusable or not it is porposed to create `focusManager.isFocusable(element)` which will return true if the given element is able to receive the focus according to the Focus rules laid out in section 5.4.2 of the [W3C HTML Standard (as of 5.3 Working Draft, 18 October 2018)](https://www.w3.org/TR/2018/WD-html53-20181018/editing.html#data-model).

#### Next/Previous Focus

Moving the focus forward or backward is a key operation for developers and the Focus Traversal API seeks to ease this process greatly with the `focusManager.next(element)` and the `focusManager.previous(element)` methods.  These functions will return the next (or previous) element that meets the `focusManager.isFocusable()` condition, or null if there are no next or previous elements that meet the requirement.

#### Forward/Backward Focus Traversal

A method to allow users to programatically move the focus forward or backward without having to manually compute the next or previous focus is highly desireable. `focusManager.forward()` takes the currently focused element and computes the next element that meets the `focusManager.isFocusable()` condition, and advances the focus to that element using `element.focus()`. `focusManager.backward()` is similar but it computes the pervious element that meets the `focusManager.isFocusable()` condition and moves the focus to that element using `element.focus()`.

#### Other Features

As part of this proposal some additional conveinience methods and properties are offered in an attempt to centralize and organize the focus system.

`window.focusManager.currentlyFocused` - Contains the element currently holding the focus, if any.

`window.focusManager.previouslyFocused` - Contains the element that held the focus prior to the current focus, if any.

`window.focusManager.history` - An array of the last n historical focus holders. It is recommended this be capped at some number like 50 or 100 to prevent unnecessary memory leakage.

`window.focusManager.hasFocus(element)` - Returns true if the given element currently has the focus.  Functionally equivelent to `window.focusManager.currentlyFocused === element`.

`window.focusManager.focus(element,focusOption)` - Focus on the given element. Functionally the same as `element.focus()`. Returns void.

`window.focusManager.orderedElements()` - Returns an array of all focusable elements in the order that focus traversal would occur.

### Special Considerations

Some special cases occur to which this specification must be mindful:

 - ShadowDOM: It is proposed that the Focus Management API also delve into ShadowDOM elements when computing the next or previous focus. If an element has an attached ShadowDOM, it must be traversed in accordance with its contents and any `<slot>` elements.

 - In especially large DOM trees computing the next focus, previous focus, or the `orderedElements()` list could be significantly slow.  It is recommended that these functions be asyncrounous and return a Promise instead of syncronously blocking.

## Benefits

The benefits of adopting this proposal include easing developer efforts in regard to Focus, more consistent behavior between web pages and applications, and increasing performance.  No longer would developers be forced to rely on third party focus libraries nor forced to compute what is or is not focused manually thus reducing their exposure to errors and inconsistency.

## Concerns

Largely, this proposal should not impact any existing systems as it is an addition to instead of a replacement or removal.  Some consideration should be made to extract out the rule system for determining the focus-ability of an element into a common space if not already done so by implementors.

Also, this proposal is currently unsure about how this would interact with an `<iframe>` or anything that contains its own document structure.

## Proposed API

> `window.focusManager.currentlyFocused` - Contains the element currently holding the focus, if any.

> `window.focusManager.previouslyFocused` - Contains the element that held the focus prior to the current focus, if any.

> `window.focusManager.history` - An array of the last n historical focus holders.

> `window.focusManager.historyLimit` - A number indicating how may focus history events should be retained. Defaults to 50.

> `window.focusManager.isFocusable(element)` - Returns true if the given element can receive focus.

> `window.focusManager.hasFocusable(element)` - Returns true if the given element currently has the focus.

> `window.focusManager.focus(element,focusOption)` - Focus on the given element. Functionally the same as `element.focus()`. Returns void.

> `window.focusManager.forward(focusOption)` - Move the focus to the next focusable element.  Returns void.

> `window.focusManager.backward(focusOption)` - Move the focus to the previous focusable element.  Returns void.

> `window.focusManager.next(element)` - Returns the element that would receive the focus if `window.focusManager.forward()` was called when the given element has the focus.  If no element is given, the currently focused element is used.

> `window.focusManager.previous(element)` - Returns the element that would receive the focus if `window.focusManager.backward()` was called when the given element has the focus.  If no element is given, the currently focused element is used.

> `window.focusManager.orderedElements(container)` - Returns an array of all focusable elements in the order that focus traversal would occur. If container is provided and a valid HTMLElement, this would limit the results to only the children of the given container. If no container is provided, the current document is used as the container.

> `window.focusManager.first(container)` - Returns the first element that would receive focus for the given container, or the current document if no container is provided.

> `window.focusManager.last(container)` - Returns the first element that would receive focus for the given container, or the current document if no container is provided.

## Status

This proposal is currently in the proposal phase and collecting suggestions and feedback.  To date no comments have been surfaced against the idea and community interest is positive.

## Polyfill

An example implementation of the above as well as this document can be found at [https://github.com/awesomeeng/FocusTraversalAPI](https://github.com/awesomeeng/FocusTraversalAPI).

## Illustrative User Issues

 - https://stackoverflow.com/questions/7208161/focus-next-element-in-tab-index
 - https://stackoverflow.com/questions/3639908/retrieving-previously-focused-element

## Similar Works

 - https://github.com/davidtheclark/tabbable - A very popular library for getting a list of all the elements in a element that can receive the focus.
