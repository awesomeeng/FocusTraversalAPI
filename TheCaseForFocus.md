# The Case for a Revised Focus System

Twenty years ago or so I wrote my frist Web Application. Essentially a message board system it had no sembelence to a modern web application, of course, but it contained many of the features we see on modern applications even now.  Users could register and login, post and read each others postings, reply, etc. It was written in ColdFusion 1.5 and everything was backed to a Microsfot Access Database; ancient technology by any modern standards.

The reason for this personal memory reflection is to illustarate a specific problem I had back then, a specific problem that we as web developers still face today: **Focus**.

See, in my nascent Web Application there was a login form: standard username and password and submit button thing we have today. And I wanted the users to be able to type their username, press ENTER, type their password, and press ENTER to login.  This behavior mimiced they way the logged into their network accounts at the time. This meant turning to JavaScript: a language and concept just in it infancy.

The need was to notice when someone pressed the ENTER key while in the currently focused field. When that occured, we wanted to advance the focus to next field. Simple, right?

Move the clock forward some twenty years.  I am building a web application for my new company and, of course, it has a login form with a username, password, and submit button.  And, of course, I want to advance the focus when someone presses ENTER.  It should come to no surprise but twenty plus years later and I have the exact same problem to solve. Instead, the surprising bit is that twenty years later, it still has the same solution:

```JavaScript
var usernameField = form.querySelector("input[type=text]");
var passwordField = form.querySelector("input[type=password]");
usernameField.addEventListener("keyup",function(event){
	if (event.code!=="Enter") return;
	passwordField.focus();
});
```

## Focus Today

In January of 1998 we get the [first formal specification of focus](https://www.w3.org/TR/REC-DOM-Level-1/level-one-html.html#method-focus) in the Document Object Model (DOM) Level 1 Specification.

 * `element.focus()` and `element.blur()` work almost identically the same as they did twenty years ago.  `element.focus()` will request the focus be given to a specific element.  `element.blur()` will move the focus upwards in the DOM to its parent focusable container.

Later we get focus events...

 * `focus` and  `blur` events all let one track where the current focus is and respond to changes in the focus. `focusin` and `focusout` are defined around this time as well, but we do not formally get them until much later.

Still later we get a few more small focus additions.

 * `document.hasFocus()` will indicate if a given document has focus either itself or as one of its descendants.

 * `document.activeElement` will return the current element of the document that holds the focus, if any.

Together these represent the state of the current focus system we have today. It's adequate, it gets the job done, but it could be, **it should be** so much more.

## The Problem with Focus

There are two very specific problems with focus today...

1). **Determining if an element can receive the focus is extremely complicated.**  There are well defined rules in the [WHATWG HTML Specification (section 6.4)](https://html.spec.whatwg.org/multipage/interaction.html#focus) but specifications can be hard to read and getting this right has been a problem for many, many who have tried.  INPUT tags, Anchor tags, tabindex attrbitues, ARIA attributes, etc., they all contribute to whether or not an element can receive focus; not to mention if an element SHOULD recieve focus.

2). **There is no way to move the focus forward or backward without knowing what element needs to receive the focus.** This is especially becoming more problematic in the age of Web Components. Say, for example, I wanted to write a Web Component for each field of my Login form that would advance the focus to the next focusable element when ENTER is pressed.  From the components perspective it knows nothing about what receives the focus next. Advancing the focus is entirely impossible without external knowledge.

Both of these problems make working with focus harder than it needs to be.  A modern web developer should not have to go to difficult lengths to do simple, common things. We can do it better.

## Solving Modern Focus

To address focus for modern web development, we need to answer both of these concerns.  We need a means to determine what is focusable and a means to advance to, and fallback from, the actively focused element. Answering these two points is paramount.  If we can add in some other "nice to haves", so much the better.

First and foremost, we need a call to determine if an element is focusable or not.  A call such as `element.isFocusable()` whould work ideally here.  It should respond with a boolean true or false and take into account all of the various ins and outs of whether something can be focused and absolve the developers from having to interpret the specification themselves.

Second, a means to move the focus forward or backward from some given element without knowing what is before or after it.  This can take a form such as `focusManager.forward()` or `focusManager.backward()`. Additionally, while we are at it, a means to identify what is the next or previous focus of any given element should be eashy to determine.  Something like `focusManager.next(element)` or `focusManager.previous(element)` that will return the next or previous element that could receive the focus.

A handful of other convience methods are also extremely easy to do once we have `element.isFocusable()`. A means to get all of the focusable elements of the container, for example, with `focusManager.orderedElements(element)`.  Or even more simple would be to have a way to find what was last focused prior to the current focus such as `focusManager.previouslyFocused` or a history of focus changes such as focusManager.history.

All of these new focus requirements are geared at making focus easier to use and easier to understand.  This in turn lends itself to creating more consistency for the users, which means easier to use and understand interfaces and happier customers for everyone.

With these new APIs, moving focus goes from the code we showed you above to

```javascript
form.querySelector("input[type=text]").addEventListener("keyup",function(event){
	if (event.code!=="Enter") return;
	focusTraversal.forward();
});
```

It's not a huge reduction in lines of code, but it is vastly superior in complexity of understanding. And that should be the goal of any new system.

## Making It Happen

So, how do we make focus better, how do we make the things we discussed here a reality for all?

It begins with the WICG, the W3C's Web Incubator Community Group. This is an online community dedicated to discussing and promoting new ideas for the W3C to consider. The FocusTraversal API, which encapsualtes all of these focus related features, was proposed to the WICG and can be found here: [https://discourse.wicg.io/t/proposal-focus-traversal-api/3427](https://discourse.wicg.io/t/proposal-focus-traversal-api/3427)

Also, an explainer was written and contains most of the same requirements as this article.  It can be found here: [https://github.com/awesomeeng/FocusTraversalAPI/blob/master/EXPLAINER.md](https://github.com/awesomeeng/FocusTraversalAPI/blob/master/EXPLAINER.md).

Finally, a polyfill of these features has already been implemented for you to play with and start using.  It can be found here: [https://github.com/awesomeeng/FocusTraversalAPI](https://github.com/awesomeeng/FocusTraversalAPI)

All of these avenues for a better focus system need your input. They need your help to understand edge cases and they need your support to spread the word and gain traction.  Without your involvement, focus will remain were it is, languishing in the basement of other twenty year old systems. Let's make it better, let's change the web for everyone.

Please, login to the WICG [discourse](https://discourse.wicg.io/t/proposal-focus-traversal-api/3427) and offer a comment, suggest a feature, or even just give us a thumbs up or a star. Tweet about the proposal if you can. Everything helps.
