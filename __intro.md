## Introduction
What makes spirit unique from other web libraries or frameworks is it's separation of http code and regular javascript (your actual code).

No more hard coding `req` and `res` objects into your web application. This makes your code more reusuable, testable, and more isomorphic.

There are no such things as "route handlers". You simply define routes, which are a way of describing how to _call_ your regular javascript function in the context of a web request.

Routes are thought of as definitions more than they are a logic, they also can be composed and _re-used_ on top of each other.

Also middleware in spirit can act on __both__ the input (request) and the output (response) of a web request. This makes transforming both input and output much easier.

Handling errors in spirit are not a burden like in other libraries, they can actually be used as an integral part of your web app and simplify your code.

### spirit components

- `spirit` is a small library for composing functions and creating abstractions. Abstractions are defined in a "spirit adapter". Currently it comes with 1 builtin, the node adapter (`spirit.node`) for use with node.js's http modules. Eventually there will be another one written for spirit to run in the browser. 

- `spirit-router` is a library for routing and creating routes.

- `spirit-common` is a library that provides many common http related middleware. It's purpose is to make bootstrapping a multitude of middleware that everyone will need easier.

- Additionally there is `spirit-express`, which is a library for converting most Express middleware to work in spirit.













