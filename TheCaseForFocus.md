# The Case for a New Focus System

Twenty years ago I wrote my first Web Application. Essentially a message board system it had no semblance to a modern web application, of course, but it contained many of the features we see on modern applications even now. Users could register, login, read messages, post messages, reply, etc. It was written in ColdFusion 1.5 and everything was backed to a Microsoft Access Database; ancient technology by any modern standards.

The reason for this personal memory reflection is to illustrate a specific problem I had back then, a specific problem that we as web developers still face today: Focus.

See, in my nascent Web Application there was a login form: standard username and password and submit button thing we have today. And I wanted the user to be able to type their username, press ENTER to move to the next field, type their password, and press ENTER to submit. This field advancement behavior mimicked they way the logged into their network accounts at the time. This meant turning to JavaScript: a language and concept just in its infancy.

The need was to notice when someone pressed the ENTER key while in the currently focused field. When that occurred, I wanted to advance the focus to next field. Simple, right?

Move the clock forward some twenty years. I am building a web application for my new company and, of course, it has a login form with a username, password, and submit button. And, of course, I want to advance the focus when someone presses ENTER. It should come as no surprise but twenty years later and I have the exact same problem to solve. Instead, the surprising bit is that twenty years later, it still has the same solution:

```JavaScript
var usernameField = form.querySelector("input[type=text]");
var passwordField = form.querySelector("input[type=password]");
usernameField.addEventListener("keyup",function(event){
	if (event.code!=="Enter") return;
	passwordField.focus();
});
```

## The Current Focus API

The history of our current focus system is pretty simple...

In January of 1998 we get the [first formal specification of focus](https://www.w3.org/TR/REC-DOM-Level-1/level-one-html.html#method-focus) in the Document Object Model (DOM) Level 1 Specification.

 * `element.focus()` and `element.blur()` work almost identically the same as they did twenty years ago.  `element.focus()` will request the focus be given to a specific element.  `element.blur()` will move the focus upwards in the DOM to its parent focusable container.

Later we get focus events...

 * `focus` and  `blur` events let one track where the current focus is and respond to changes in the focus. `focusin` and `focusout` are defined around this time as well, but we do not formally get them until much later.

Still later we get a few more small focus additions.

 * `document.hasFocus()` will indicate if a given document has focus either itself or as one of its descendants.

 * `document.activeElement` will return the current element of the document that holds the focus, if any.

Together these represent the state of the current focus system we have today. It's adequate, it gets the job done, but it could be, **it should be** so much more.

## The Problem with Focus Today

There are two very specific problems with our current focus system...

1). **Determining if an element can receive the focus is extremely complicated.**  There are well defined rules in the [WHATWG HTML Specification (section 6.4)](https://html.spec.whatwg.org/multipage/interaction.html#focus) but specifications can be hard to read and getting this right has been a problem for many who have tried.  INPUT tags, Anchor tags, the `tabindex` attrbitues, ARIA attributes, etc., they all contribute to whether or not an element can receive focus; not to mention if an element SHOULD recieve focus.

2). **There is no way to move the focus forward or backward without knowing what element needs to receive the focus.** This is especially becoming more problematic in the age of Web Components. Say, for example, I wanted to write a Web Component for a username field that would advance the focus to the next focusable element when ENTER is pressed.  From the components perspective it knows nothing about what is outside of it, what element receives the focus next. Advancing the focus is entirely impossible without external knowledge.

Both of these problems make working with focus harder than it needs to be.  A modern web developer should not have to go to difficult lengths to do simple, common things. We can do it better.

## Solving Modern Focus

To address focus for modern web development, we need to answer both of these concerns.  We need a means to determine what is focusable and a means to advance to, and fallback from, the actively focused element. Answering these two points is paramount.  If we can add in some other "nice to haves", so much the better.

First and foremost, we need a call to determine if an element is focusable or not.  A call such as `element.isFocusable()` whould work ideally here.  It should respond with a boolean true or false and take into account all of the various ins and outs of whether something can be focused and absolve the developers from having to interpret the specification themselves.

Second, a means to move the focus forward or backward from some given element without knowing what is before or after it.  This can take a form such as `focusManager.forward()` or `focusManager.backward()`. Additionally, while we are at it, a means to identify what is the next or previous focus of any given element should be easy to determine.  Something like `focusManager.next(element)` or `focusManager.previous(element)` that will return the next or previous element that could receive the focus.

A handful of other convience methods are also extremely easy to do once we have `element.isFocusable()`. A means to get all of the focusable elements of the container, for example, with `focusManager.list(element)`.  Or even more simple would be to have a way to find what was last focused prior to the current focus such as `focusManager.previouslyFocused` or a history of focus changes such as `focusManager.history`.

All of these new focus requirements are geared at making focus easier to use and easier to understand.  This in turn lends itself to creating more consistency for the users, which means easier and more understandable user interfaces and happier customers for everyone.

With these new APIs, moving focus goes from the code we showed you above to

```javascript
form.querySelector("input[type=text]").addEventListener("keyup",function(event){
	if (event.code!=="Enter") return;
	focusManager.forward();
});
```

It's not a huge reduction in lines of code, but it is vastly superior in complexity of understanding. And that should be the goal of any new system.

## Making It Happen

So, how do we make focus better, how do we make the things we discussed here a reality for all?

To address the problems of focus once and for all requires a change to the HTML specification that is managed by the W3C. Unless you are one of the big three browser creators, the process to enact change within the standards is very difficult. Fortunately, the W3C knows that this can be difficult and it created the Web Incubator Community Group or WICG. This is an online community dedicated to discussing and promoting new ideas for the W3C to consider. The WICG was created specifically for "everyday citizens" to propose and discuss changes to the W3C standards.

To that end the FocusTraversal API, which encapsualtes all of the focus related features offered in this article, was [proposed to the WICG](https://discourse.wicg.io/t/proposal-focus-traversal-api/3427) on March 13, 2019.

But the WICG is a very tiny microcosm and not a lot of people know it exists, even within the W3C standards body.  The WICG is the starting point for any [proposal](https://discourse.wicg.io/t/proposal-focus-traversal-api/3427), but to really enact change you need community support.  And this is where you can help: the FocusTraversal API proposal will never be realized without a lot more support.  It needs further discussion in WICG; it needs outside promotion on twitter, reddit, and the like; and it needs participation and issues on Github.

We have gotten the ball rolling. We have written the [PROPOSAL](https://discourse.wicg.io/t/proposal-focus-traversal-api/3427) and a more detailed [EXPLAINER](https://github.com/awesomeeng/FocusTraversalAPI/blob/master/EXPLAINER.md). We have written a [POLYFILL](https://github.com/awesomeeng/FocusTraversalAPI) to demonstrate the ideas. Yet writing these thing is the easy part; spreading the word is the challenge.  If you want to help, and we are begging for help here, we need more engagement. We need discussion about the [proposal](https://discourse.wicg.io/t/proposal-focus-traversal-api/3427) on the WICG Discourse board; we need [participation in the Github](https://github.com/awesomeeng/FocusTraversalAPI) with issues and pulls and comments; and we need help spreading the word on twitter and reddit and blogs and the like.

So, if you are willing to help, and we hope you are, please get involved, please spread the word, and please help us make focus easier to use for everyone.

## More Information

 - PROPOSAL: [https://discourse.wicg.io/t/proposal-focus-traversal-api/3427](https://discourse.wicg.io/t/proposal-focus-traversal-api/3427)

 - EXPLAINER: [https://github.com/awesomeeng/FocusTraversalAPI/blob/master/EXPLAINER.md](https://github.com/awesomeeng/FocusTraversalAPI/blob/master/EXPLAINER.md)

 - POLYFILL: [https://github.com/awesomeeng/FocusTraversalAPI](https://github.com/awesomeeng/FocusTraversalAPI)

 - GITHUB: [https://github.com/awesomeeng/FocusTraversalAPI](https://github.com/awesomeeng/FocusTraversalAPI)
