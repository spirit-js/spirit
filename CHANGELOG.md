= v0.1.2
#### Release Date: 08-18-2016

#### Added:
- Response.cookie

#### Removed:
- Response.location

#### Bug Fixes:
- Response.attachment wasn’t returning itself (this)
- When production ENV was set and an error occured in which http adapter had to handle, it would strip the body but not it’s Content-Length. This would make it seem like the request froze (or client froze).
