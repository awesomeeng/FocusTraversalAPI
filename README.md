# Focus Traversal API

A polyfill for the Focus Traversal API proposed to the [W3C](https://www.w3.org) here: [Focus Traversal API](https://discourse.wicg.io/t/proposal-focus-traversal-api/3427). This work is based on and includes the [Tabbable Library by David Clark](https://github.com/davidtheclark/tabbable).

An EXPLAINER is provided for a more detailed overview on why this is needed. You can read it here: [EXPLAINER](./EXPLAINER.md)

## Features

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

> `window.focusManager.focus(element,focusOption)` - Focus on the given element. Functionally the same as `element.focus()`. Returns void.

> `window.focusManager.forward(focusOption)` - Move the focus to the next focusable element.  Returns void.

> `window.focusManager.backward(focusOption)` - Move the focus to the previous focusable element.  Returns void.

> `window.focusManager.next(element)` - Returns the element that would revieve the focus if `window.focusManager.forward()` was called when the given element has the focus.  If no element is given, the currently focused element is used.

> `window.focusManager.previous(element)` - Returns the element that would revieve the focus if `window.focusManager.backward()` was called when the given element has the focus.  If no element is given, the currently focused element is used.

> `window.focusManager.orderedElements(container)` - Returns an array of all focusable elements in the order that focus traversal would occur. If container is provided and a valid HTMLElement, this would limit the results to only the children of the given container. If no container is provided, the current document is used as the container.

> `window.focusManager.first(container)` - Returns the first element that would recieve focus for the given container, or the current document if no container is provided.

> `window.focusManager.last(container)` - Returns the first element that would recieve focus for the given container, or the current document if no container is provided.

## Issues

If you would like to comment on the proposal, please [open an issue](https://github.com/awesomeeng/FocusTraversalAPI/issues).

## License

The proposal and the polyfill library are available under the MIT License.
