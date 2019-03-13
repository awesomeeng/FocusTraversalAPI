# Focus Traversal API

The current system for programmatically manipulating focus within a web page leaves a lot to be desired. A single element can request the focus with the `focus()` method but that is the extent of the programatic focus navigation options.  Advancing the focus to the next focusable element or the previous focusable element involves a complex dance of DOM traversal and guess work as to what elements can recieve focus or not.  Most solutions to manipulating focus are complicated; the very simple need to manipulate focus in a meaningful and accessalbe manner is significantly lacking.

## Proposed

The creation of a unified Focus Traversal API that makes understanding, manipulating, and traversing the focus simple.  This must include the ability to assign the focus, move the focus forward and backward, and understand both the next and previous focusable elements.

A rough example of this API might be the following:

`window.focusManager.currentlyFocused` - Contains the element currently holding the focus, if any.

`window.focusManager.previouslyFocused` - Contains the element that held the focus prior to the current focus, if any.

`window.focusManager.history` - An array of the last n historical focus holders.

`window.focusManager.hasFocus(element)` - Returns true if the given element currently has the focus.  Functionally equivelent to `window.focusManager.currentlyFocused===element`.

`window.focusManager.focus(element)` - Focus on the given element. Functionally the same as `element.focus()`. Returns void.

`window.focusManager.forward()` - Move the focus to the next focusable element.  Returns void.

`window.focusManager.backward()` - Move the focus to the previous focusable element.  Returns void.

`window.focusManager.next(element)` - Returns the element that would revieve the focus if `window.focusManager.forward()` was called when the given element has the focus.  If no element is given, the currently focused element is used.

`window.focusManager.previous(element)` - Returns the element that would revieve the focus if `window.focusManager.backward()` was called when the given element has the focus.  If no element is given, the currently focused element is used.

`window.focusManager.orderedElements()` - Returns an array of all focusable elements in the order that focus traversal would occur.

## Illustrative User Issues

 - https://stackoverflow.com/questions/7208161/focus-next-element-in-tab-index
 - https://stackoverflow.com/questions/3639908/retrieving-previously-focused-element

## Example Polyfill

An example implementation of the above as well as this document can be found at https://github.com/awesomeeng/FocusTraversalAPI.

## Similar Works

https://github.com/davidtheclark/tabbable - A very popular library for getting a list of all the elements in a element that can recieve the focus.
