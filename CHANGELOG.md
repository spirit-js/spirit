## v0.6.0
#### Release Date: 03-29-2017
- http request map properly sets it's .url to _exclude_ the query string
- request map .path added for the full url including query string
- Promise warnings regarding async error handling have been fixed. `resolve_response` has been removed. `callp_response` added, which are similar.
##### spirit-router -> v0.5.0
- spirit-router support for .url change, routes will __no__ longer support query string matches (this was unintentional). Please see [issue](https://github.com/spirit-js/spirit-router/issues/5)
- spirit-router supports defining routes with regex `.get(/[a-z]{1,3}/, ...)`

## v0.4.0
#### Release Date: 11-03-2016
- Response#type will auto convert body to JSON when type is “json”
- spirit-router -> v0.4.0
- spirit-router not_found now goes through render() process
- spirit-router not_found optionally takes a 'method' argument

## v0.3.0
#### Release Date: 09-19-2016
- spirit.node.adapter now automatically sets Content-Length response header when none is set (for string / buffer bodies). It is recommended to let the adapter do this instead of setting the Content-Length manually.

## v0.2.2
#### Release Date: 09-12-2016
- `spirit.node.adapter` now also accepts a single function as it's middleware argument

## v0.2.0
#### Release Date: 08-29-2016
- API has underwent minor changes:
  - `spirit.is_promise` is still there, but no longer covered under docs (considered internal api)
  - _All_ API under `spirit.node.utils` is now considered internal, they are still documented however
  - `spirit.node.is_Response` has moved to `spirit.node.utils.is_Response`
  - `spirit.node.middlewares` are moved to `spirit-common`.

The reason for the change is to slim down the public API to only the essentials. The functions affected were all utility functions (and simple in functionality) and mostly used internally, but was and still is provided as a convenience.

- `**` spirit.node.adapter initialized middlewares on every request, this wasn't intended, it's been changed.

- `**` spirit.compose didn't pass arguments (other than the first) along to the next middleware, this wasn't intended, it's been changed.

- New module for bootstrapping common middleware `spirit-common`, instead of pulling in 3, 4, 5 middleware all the time, just pull in one which sets it all up.

`**` These changes are not considered a bug as all previous versions supported this, so no patch for v0.1.x. Instead it's considered a breaking change and added to v0.2.0.

Other official spirit libraries are updated to support this release (they are scheduled to be released after this spirit release):
- spirit-router -> v0.2.x
- spirit-express -> v0.2.x
- spirit-common -> v0.1.x (first version)

## v0.1.2
#### Release Date: 08-18-2016
- Added Response.cookie
- Removed Response.location
- Fix Response.attachment wasn’t returning itself (this)
- Fix When production ENV was set and an error occured in which http adapter had to handle, it would strip the body but not it’s Content-Length. This would make it seem like the request froze (or client froze).
