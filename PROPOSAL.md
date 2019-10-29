# Focus Traversal API

The current system for programmatically manipulating focus within a web page leaves a lot to be desired. A single element can request the focus with the `focus()` method but that is the extent of the programatic focus navigation options.  Advancing the focus to the next focusable element or the previous focusable element involves a complex dance of DOM traversal and guess work as to what elements can recieve focus or not.  Most solutions to manipulating focus are complicated; the very simple need to manipulate focus in a meaningful and accessalbe manner is significantly lacking.

## Proposed

The creation of a unified Focus Traversal API that makes understanding, manipulating, and traversing the focus simple.  This must include the ability to assign the focus, move the focus forward and backward, and understand both the next and previous focusable elements.

A rough example of this API might be the following:

`window.focusManager.currentlyFocused` - Contains the element currently holding the focus, if any.

`window.focusManager.previouslyFocused` - Contains the element that held the focus prior to the current focus, if any.

`window.focusManager.history` - An array of the last n historical focus holders.

`window.focusManager.isFocusable(element)` - Returns true if the given element can receive the focus.

`window.focusManager.hasFocus(element)` - Returns true if the given element currently has the focus.  Functionally equivelent to `window.focusManager.currentlyFocused===element`.

`window.focusManager.focus(element)` - Focus on the given element. Functionally the same as `element.focus()`. Returns void.

`window.focusManager.forward()` - Move the focus to the next focusable element.  Returns void.

`window.focusManager.backward()` - Move the focus to the previous focusable element.  Returns void.

`window.focusManager.next(element)` - Returns the element that would revieve the focus if `window.focusManager.forward()` was called when the given element has the focus.  If no element is given, the currently focused element is used.

`window.focusManager.previous(element)` - Returns the element that would revieve the focus if `window.focusManager.backward()` was called when the given element has the focus.  If no element is given, the currently focused element is used.

`window.focusManager.list()` - Returns an array of all focusable elements in the order that focus traversal would occur.

`window.focusManager.order(element,element,element,etc)` - Programatically set the traversal order of one or more elements. Given an array of elements (or multiple arguments) order them in the order they are given.

`window.focusManager.trap()` - Trap focus within a given element, such that any focus event outside of the element's descendants will refocus the last focused element within the element's descendants. Traps calls stack, such that the latest trap always wins, but removing a trap will set th enext prior trap running.

`window.focusManager.untrap()` - Removes a trap.

`window.focusManager.proxy(source,target)` - When the given source element receives the focus, forward that focus immediately to the target element.

`window.focusManager.unproxy(source,target)` - Removes a proxy.

## Illustrative User Issues

 - https://stackoverflow.com/questions/7208161/focus-next-element-in-tab-index
 - https://stackoverflow.com/questions/3639908/retrieving-previously-focused-element

## Example Polyfill

An example implementation of the above as well as this document can be found at https://github.com/awesomeeng/FocusTraversalAPI.

## Similar Works

https://github.com/davidtheclark/tabbable - A very popular library for getting a list of all the elements in a element that can recieve the focus.
