As shown previously every route must __always__ be grouped with `define`:

```js
route.define([
  route.get("/", ...)
])
```

Grouped routes can take a path too, which applies to every route inside:

```js
route.define("/users", [
  route.get("/", ...),    // will only match GET /users
  route.post("/", ...)    // will only match POST /users
])
```

### Composing groups

Groups can be composed and nested together to build out a structure:

```js
const books = route.define("/books", [
  // routes for querying a Book database
])

const users = route.define("/users", [
  // routes for querying a User database
])

const api = route.define("/api", [
  books,   // becomes /api/books
  users    // becomes /api/users
])

route.define([
  route.get("/", homepage),
  api
])
```

Composing this way can help us logically separate functionality in our application.

But it can also allow us to __re-use__ these groups and keeping our application DRY.

### Re-using groups

We can already re-use functions in routes (as they are not tied to `req` or `res` and are normal javascript functions), but entire groups of routes can be re-used too.

Remeber middleware in spirit don't just modify a request, but it can also perform operations on a response.

So if we take the above example to __also__ serve pages for our "books" and serve API we can do:

```js
const books = route.define("/books", [
  // routes for querying a Book database
])

const users = route.define("/users", [
  // routes for querying a User database
])

const api = route.define("/api", [
  books,   // becomes /api/books
  users    // becomes /api/users
])

route.define([
  route.get("/", homepage),
  api,
  route.wrap(books, _middleware_that_renders_to_html_)
])
```

In this way we can just re-use our 'books' api to serve two purposes.

When a user accesses "/api/books" they still get API data, and when a user access "/books" they get HTML pages displaying the data from our API.

This allows us to reduce redundancy and not have to write separate routes that call our 'books' api just to render HTML pages out of it. And can be all done in a single middleware.

More on writing middleware in [Writing Middleware](writing-middleware.md).



