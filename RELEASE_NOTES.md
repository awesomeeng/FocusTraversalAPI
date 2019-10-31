# AwesomeComponenets Release Notes

#### **Version 2.0.3**

 - Fixes bug in `untrap()` that would cause an exception if called with no traps set.


#### **Version 2.0.2**

 - Adds the `parent()` and `child()` methods.

#### **Version 2.0.1**

 - Moved jsdom to devDependencies.

#### **Version 2.0.0**

 - Adds `order()` method to programatically set the focus order of one or elements.
 - Adds `trap()` and `untrap()` to control trapping focus into a given container.
 - Adds `proxy()` and `unproxy()` to easily forward focus from one element to another.
 - Renamed `orderedElements()` to `list()`.
 - Fixes a bug in traversal that was preventing shadow elements from traversing backwards correctly.
 - DOMTraversal code broken out into a separate file and refactored. (This will move to a future project at some point.)
 - Lots of bug fixes around focus and shadowroot behaviors.
 - Revised next() and previous() behavior.
 - Removed dependency on Tabable.

#### **Version 1.2.0**

 - Adds focusOption argument to focusManager.focus(), focusManager.forward() and focusManager.backward to align with element.focus.

 - Adds container constraint to focusManager.orderedElements().

 - Adds focusManager.first() and focusManager.last() for finding the first focusable or last focusable in a given container.

#### **Version 1.1.0**

 - Adds support for focus traversal into and out of a Shadow DOM element.

#### **Version 1.0.1**

 - Adds Minified version.

#### **Version 1.0.0**

 - Initial release.
