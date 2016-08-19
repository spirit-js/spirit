## v0.2.0
#### Release Date: - In Progress -
The API has underwent minor changes:
- `spirit.is_promise` is still there, but no longer covered under docs (considered internal api)
- _All_ API under `spirit.node.utils` is now considered internal, they are still documented however
- `spirit.node.is_Response` has moved to `spirit.node.utils.is_Response`

The reason for the change is to slim down the public API to only the essentials. The functions affected were all utility functions (and simple in functionality) and mostly used internally, but was and still is provided as a convienance.


## v0.1.2
#### Release Date: 08-18-2016
- Added Response.cookie
- Removed Response.location
- Fix Response.attachment wasn’t returning itself (this)
- Fix When production ENV was set and an error occured in which http adapter had to handle, it would strip the body but not it’s Content-Length. This would make it seem like the request froze (or client froze).
