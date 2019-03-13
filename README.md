# Focus Traversal API

A polyfill for the Focus Traversal API proposed to the [W3C](https://www.w3.org) here: [Focus Traversal API](https://discourse.wicg.io/). This work is based on and includes the [Tabbable Library by David Clark](https://github.com/davidtheclark/tabbable).

## Usage

Install from npm...

```
npm install focustraversalapi
```

Copy the polyfill into your own project...

```shell
cp @awesomeeng/webfocusapi/focus-traversal-api-polyfill.min.js .
```

Include in your index.html...

```
<script src="./focus-traversal-api-polyfill.min.js" type="text/javascript"></script>
```

You may now use the focusManager as described in the section below.

## API Documentation

> `window.focusManager.currentlyFocused`
 - Contains the element currently holding the focus, if any.

> `window.focusManager.previouslyFocused` - Contains the element that held the focus prior to the current focus, if any.

> `window.focusManager.history` - An array of the last n historical focus holders.

> `window.focusManager.historyLimit` - A number indicating how may focus history events should be retained. Defaults to 50.

> `window.focusManager.focus(element)` - Focus on the given element. Functionally the same as `element.focus()`. Returns void.

> `window.focusManager.forward()` - Move the focus to the next focusable element.  Returns void.

> `window.focusManager.backward()` - Move the focus to the previous focusable element.  Returns void.

> `window.focusManager.next(element)` - Returns the element that would revieve the focus if `window.focusManager.forward()` was called when the given element has the focus.  If no element is given, the currently focused element is used.

> `window.focusManager.previous(element)` - Returns the element that would revieve the focus if `window.focusManager.backward()` was called when the given element has the focus.  If no element is given, the currently focused element is used.

> `window.focusManager.orderedElements()` - Returns an array of all focusable elements in the order that focus traversal would occur

## Browser Compatable

This polyfill should be compatable with all modern browsers including Internet Explorer 9 and beyond.

## Issues

If you would like to comment on the proposal, please [open an issue](https://github.com/awesomeeng/WebFocusAPI/issues).

## License

The proposal and the polyfill library are available under the MIT License.
