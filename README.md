# Focus Traversal API

The Focus Traversal API is a proposed change to the W3C/wHATWG HTML Specification for making working with Browser UI Focus more useful and more powerful.  The proposal has been brought to the [W3C WICG](https://discourse.wicg.io/t/proposal-focus-traversal-api/3427) and the [WHATWG](https://github.com/whatwg/html/issues/4784) for discussion and hopefully implementation and is currently in the discussion phase within both communities. If you would like more details about the proposal, an EXPLAINER is provided at: [EXPLAINER](./EXPLAINER.md)

Additionally, a polyfill for the proposed additions can be found here to allow the community to try and demonstrate the usefulness of Focus Traversal and we encourage everyone to give it a try.

Also, we are always looking for people to get involved with the Focus Traversal API and proposal. Please consider helping us by spreading the word, commenting on the proposal, or participating in this repo!

Check out our [GETTING INVOLVED page](./GET_INVOLVED.md) for more details on how you can help!

## Focus Traversal API Features

 - Implements proposed Focus Traversal API standard.
 - Programatically move the focus forward or backwards.
 - Identify the next and previous items to receive focus.
 - Supports handling focus in Shadow DOM hidden components.
 - History of the last n focus holders.
 - Works on all modern browsers including Internet Explorer 9 or later.

## Usage

Install from npm...

```
npm install focus-traversal-api-polyfill
```

Copy the polyfill into your own project...

```shell
cp focus-traversal-api-polyfill/focus-traversal-api-polyfill.min.js .
```

Include in your index.html...

```
<script src="./focus-traversal-api-polyfill.min.js" type="text/javascript"></script>
```

You may now use the focusManager as described in the section below.

## API Documentation

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

> `window.focusManager.list(container)` - Returns an array of all focusable elements in the order that focus traversal would occur. If container is provided and a valid HTMLElement, this would limit the results to only the children of the given container. If no container is provided, the current document is used as the container.

> `window.focusManager.first(container)` - Returns the first element that would receive focus for the given container, or the current document if no container is provided.

> `window.focusManager.last(container)` - Returns the first element that would receive focus for the given container, or the current document if no container is provided.

> `window.focusManager.parent(element)` - returns the first focusable ancestor of the given element.

> `window.focusManager.child(element)` - returns the first focusable descendant of the given element. The same as `first(element)`.

> `window.focusManager.order(element,element,element,etc)` - Programatically set the traversal order of one or more elements. Given an array of elements (or multiple arguments) order them in the order they are given.

> `window.focusManager.trap()` - Trap focus within a given element(s), such that any focus event outside and of the given element(s) descendants will refocus the last focused element within the element's descendants. Traps calls stack, such that the latest trap always wins, but removing a trap will set th enext prior trap running.

> `window.focusManager.untrap()` - Removes a trap.

> `window.focusManager.proxy(source,target)` - When the given source element receives the focus, forward that focus immediately to the target element.

> `window.focusManager.unproxy(source,target)` - Removes a proxy.

## Issues

If you would like to comment on the proposal, please [open an issue](https://github.com/awesomeeng/FocusTraversalAPI/issues).

## License

The proposal and the polyfill library are available under the MIT License.
