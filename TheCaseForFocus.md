# The Case for a Revised Focus System

In 1996, I wrote my frist Web Application. Essentially a message board system, it had no sembelence to a modern web application, of course, but it contained many of the features we see on modern applications even now.  Users could register and login, post and read each others postings, reply, etc. It was written in ColdFusion 1.5 and everything was backed to a Microsfot Access Database.

The reason for this personal memory reflection is to illustarate a specific problem I had back then, a specific problem that we as web developers still face today: focus.

See, in my 1994 Web Application there was a login form; standard username and password and submit button thing we have today. And I wanted the users to be able to type their username, press return, type their password, and press return to login.  This behavior mimiced they way the logged into their network accounts at the time. This mean turning to JavaScript a language and concept just in it infancy.

The need was to notice when someone pressed the return key while in the currently focused field. When that occured, we wanted to advance the focus to next field. Simple, right?

Move the clock forward some 23 years.  I am building a web application for my new company and, of course, it has a login form with a username, password, and submit button.  And, of course, I want to advance the focus when someone presses return.  It should come to no surprise, but twenty three years later and I have the exact same problem to solve.

The surprising bit, is that twenty three years later, it still has the same solution, albiet in slightly different language:

```JavaScript
let usernameField = form.querySelector("input[type=text]");
let passwordField = form.querySelector("input[type=password]");
usernameField.addEventListener("keyup",function(event){
	if (event.code!=="Enter") return;
	passwordField.focus();
});
```

## Focus Today

The way we deal with focus in the browser has not changed significantly in about twenty years.

	element.focus()` and `element.blur()` work almost identically the same as they did twenty years ago.  `element.focus()` will request the focus be given to a specific element.  `element.blur()` will move the focus upwards in the DOM to its parent focusable container.

	`document.hasFocus()` will indicate if a given document has focus either itself or as one of its children.

	`document.activeElement` will return the current element of the document that holds the focus, if any.

	`focus`, `blur`, `focusin` and `focusout` events all let one track where the current focus is and respond to changes in the focus.

Together these represent the state of the current focus system we have today. It's adequate, it gets the job done, but it could be, it should be so much more.

## The Problem with Focus

So Focus today is okay, but there are some real limitations with it.

1). Determining if an element can receive the focus is extremely complicated.  There are well defined rules in the [WHATWG HTML Specification (section 6.4)](https://html.spec.whatwg.org/multipage/interaction.html#focus) but specifications can be hard to read and getting this right has been a problem for many systems.

2). There is no way to move the focus forward or backward without knowing what element needs to receive the focus. This is especially becoming more problematic in the age of Web Components. Say, for example, I wanted to write Web Components for each of my fields in my Login form that would advance the focus to the next focusable element when return is pressed.  From the components perspective it knows nothing about what receives the focus next; advancing the focus is entirely impossible without external knowledge.

3). Focus Trapping is a technique wherein focus is limited to only a certain set of elements in a given container. For example,, in a dialog form, focus trapping is used to keep the focus cycling within that dialog and not moving out to other fields outside of the dialog. Currently, computing which fields within the container can be focused is impossible without, as stated above, understanding what is focusable.


## Solutions
