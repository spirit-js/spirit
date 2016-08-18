Properties:

- [status](#properties)
- [headers](#properties)
- [body](#properties)

Methods:

- [field](#field)
- [get](#get)
- [set](#set)

- [status_](#status_)
- [body_](#body_)
- [type](#type)
- [len](#len)
- [cookie](#cookie)
- [attachment](#attachment)


# Response

A Response is a helper class for creating a response map. It satisfies the requirements of a response map, providing the properties or keys `{ status, headers, body }`, but it also provides chainable helpers for common tasks.

Normally you do not need to create objects with Response directly. A Response usually comes from functions such as [spirit.node.response](node.md#response), [spirit.node.file_response](node.md#file_response), [spirit.node.redirect](node.md#redirect) etc, which set up additional properties for you.

When working with a Response directly, it does not provide any special setup except that the `status` property always defaults to 200.

When you pass an argument to the Response constructor, the argument is then set as it's body.

For example:

```js
const resp = new Response("hi")
// resp = {
//   status: 200,
//   headers: {},
//   body: "hi"
// }
```

[Source: src/http/response-class.js](../../src/http/response-class.js)

## Properties
Response only has 3 properties, which are the same 3 properties needed to satisfy a response map.

* status {Number} The status code for this response
* headers {object} A key, value object for response headers. All headers should be unique regardless of case.
* body {undefined|string|buffer|stream} The body of the response. Must be either be (or eventually be) undefined, string, buffer or a stream.



## Methods

#### field

Static method.

field is used internally to resolve header names without relying on knowing the case used. It should be rarely needed to be called directly.

Looks up `key` from `response`. Specifically response.headers. Expects `response` to be a valid response map.

The `key` can be case insensitive, and will return the header matching the key in it's original case.

##### Arguments
* response {response map} An object that conforms to a response map (which Response is)
* key {string} case insensitive string used to look up a header field in response

##### Return
{*} The header field that matches _key_ in _response_'s headers or undefined if it doesn't exist.


-------------------------------------------


#### get

Can be a static method, as well as an instance method.

When used as an instance method, ignore the first parameter `response` as it will always refer to `this`.

Gets the header value of `key` from `response`, where `key` is the header field name and `response` is a valid response map.

`key` is case insensitive.

Example as instance method:
```js
const resp = new Response()
resp.headers["ABC"] = "123" // assign a header

resp.get("abc") // #=> "123"
```

Example as static method:
```js
const resp = { status: 200, headers: { ABC: "123" } }
Response.get(resp, "abc") // #=> "123"
```

Of course you get a header's values simply by referring to the properties on response, `resp.headers["abc"]`, which is the same thing as this method but `get()` is case insensitive.


##### Arguments
* response {response map} An object that conforms to a response map (which Response is)
* key {string} case insensitive string representing the header field in a response

##### Return
{*} The value of the `key` in `response`'s headers or undefined if it doesn't exist.


-------------------------------------------


#### set

Can be a static method, as well as an instance method.

When used as an instance method, ignore the first parameter `response` as it will always refer to `this`.

`key` is a header field name that exists in `response`, it is case insensitive. It sets `value` for `key`. It will override an existing value if one already exists.

Example as instance method:
```js
const resp = new Response()

resp.set("http-header", "value")
// #=> { status: 200, headers: { http-header: "value" } }
```

Example as static method:
```js
const resp = { status: 200, headers: { a: "a" } }

Response.set(resp, "a", "b")
// #=> { status: 200, headers: { a: "b" } }
```

Of course one can always set a header, by just setting a property on a response:
```js
const resp = new Response()
resp.headers["abc"] = "123"
```
The difference is `set()` is case insensitive, and a chainable method.


##### Arguments
* response {response map} An object that conforms to a response map (which Response is)
* key {string} Case insensitive string representing the header field in a response
* value {string} A string representing the header value for the header field (`key`)

##### Return
{Response | response} The Response is returned when it's an instance method, or the passed in `response` is returned when a static method


-------------------------------------------


#### status_

Sets the status of the response. The trailing _ in it's name is to denote it's a chainable method as oppose to the the property "status".

```js
const resp = new Response()
resp.status = 123 // using the property to set the status code
resp.status_(123) // using this chainable method to set the status code
```

##### Arguments
* status {number} The status code to set the response to

##### Return
{Response}


-------------------------------------------


#### body_

Sets the body of the response. The trailing _ in it's name is to denote it's a chainable method as oppose to the the property "body".

When using `body_`, it will __always__ modify the Content-Length header to be the size of the new body being set when the new body is a string or buffer.

And in the event it cannot calculate one, it will remove the Content-Length (more specifically Content-Length will be undefined).

```js
const resp = new Response("first body")
// => { status: 200, headers: {}, body: "first body" }

// using the property
resp.body = "second body"
// => { status: 200, headers: {}, body: "second body" }

// using body_()
resp.body_("third body")
// => { status: 200, headers: { Content-Length: 10 }, body: "third body" }
```

##### Arguments
* body {undefined|string|buffer|stream} The body of the response

##### Return
{Response}


-------------------------------------------


#### type

Sets the Content-Type header of the response. 

The `value` passed in will be looked up with the npm library [mime](https://www.npmjs.com/package/mime#mimelookuppath). So using shorthand mime types is ok.

If the mime library fails to find a type, it will set `value` as-is as the Content-Type.

For "text/*" content types, a utf-8 charset are automatically added.

If `value` is `undefined`, it will clear the current value (effectively removing the header).

```js
const resp = new Response()

resp.type("txt") 
// => { status: 200, headers: { Content-Type: "text/plain; charset=utf-8" } }

resp.type("json")
// => { status: 200, headers: { Content-Type: "application/json" } }

resp.type("meow")
// => { status: 200, headers: { Content-Type: "meow" } }
```


##### Arguments
* value {string|undefined} Value to set Content-Type headers, either short-hand or literally.

##### Return
{Response}


-------------------------------------------


#### len

Sets the Content-Length header of the response to the specified `value`. 

```js
const resp = new Response()
resp.len(123)
// #=> { status: 200, headers: { Content-Length: 123 } }
```

NOTE: It does not take into account the body, or calculates the body's size. It literally sets `value` for Content-Length. If you prefer to have the Content-Length set based on the response body's size, see [body_](#body_), which will automatically set it for you whenever possible.

If `value` is `undefined` or `0`, it will clear the current value (effectively removing the header).

##### Arguments
* value {number|undefined} The value to set for Content-Length header

##### Return
{Response}


-------------------------------------------


#### cookie

Sets a single cookie for the response. If multiple cookies need to be set, call it multiple times.

The `value` is encoded by default with encodeURIComponent.

The `options` argument is optional and is an object that can have the following properties:
* path {string}           restrict the cookie to a specific path
* domain {string}         restrict the cookie to a specific domain
* httponly {boolean}      restrict the cookie to HTTP if true (not accessible via e.g. JavaScript)
* maxage {string|number}  the number of seconds until the cookie expires
* secure {boolean}        restrict the cookie to HTTPS URLs if true
* expires {Date}          a specific date and time the cookie expires
* encode {function}       a _optional_ function to use for encoding `value`, by default it uses encodeURIComponent

```js
const resp = new Response()
// #=> { status: 200, headers: {} }

resp.cookie("ash", "pikachu")
// #=> { status: 200, headers: { Set-Cookie: [ "ash=pikachu" ] } }

resp.cookie("brock", "onyx", { expires: 3600 })
// #=> { status: 200, headers: { Set-Cookie: [ "ash=pikachu", "brock=onyx; Expires=3600" ] } }
```

It's important to note Set-Cookie is an an array.

To clear (or remove) a cookie that's been set, `value` should be `undefined`, or simply omit a `value`.

Continuing the example above:
```js
resp.cookie("ash")
#=> { status: 200, headers: { Set-Cookie: [ "brock=onyx; Expires=3600" ] } }
```
Which removes the "ash=pikachu" cookie, leaving only the "brock-onyx" cookie.

It should also be noted the `name` __and__ `options.path` are both used for removing cookies, so they must match the cookie exactly.

Also note that duplicate cookies will all be sent to the client, most clients will take the last cookie sent as the correct cookie to store if there are duplicates.

##### Arguments
* name {string} The cookie name, or that is the key associated with `value`.
* value {string|undefined} Optional. If skipped, it becomes undefined. The value associated with `name` for the cookie.
* options {object} Optional. A object of optional values to set for the cookie (see description above).

##### Return
{Response}


-------------------------------------------


#### attachment

It will set Content-Disposition to be an attachment using the value of `filename` as it's file name.

Setting this header will notify a client (browser) to download the response body as a file with the file name `filename`.

If you prefer to not have a file name, use an empty string `attachment("")`.

If `filename` is `undefined`, ex: `attachment()`, it will clear the current value (effectively removing the header).

Example:
```js
new Response("hello world").attachment("hello.txt")
```
Sending this response back to a client (browser) will have the client download a file named "hello.txt" with "hello world" as it's file content.

##### Arguments
* filename {string|undefined} The filename for the attachment

##### Return
{Response}
