## spirit API
This covers spirit's exported API. There are only a few functions spirit exports.

- [define](define.md)                  For creating a list (array) of middleware or routes
- [spirit (main handler)](handler.md)  The main incoming request handler
- [site_defaults](site_defaults.md)    Default middleware most people need
- [redirect](redirect.md)              Generating a response helper for redirecting
- [response](response.md)              Generating a general response helper
- [routes](routes.md)                  Routing related functions
  * [route](routes.md#route)
  * [not_found](routes.md#not_found)
  * [resources](routes.md#resources)
  * [get](routes.md#get)
  * [post](routes.md#delete)
  * [put](routes.md#put)
  * [delete](routes.md#delete)
  * [head](routes.md#head)
  * [verb](routes.md#verb)


#### Accessing the API (importing spirit)

##### ES6
From the above listed API, you can choose to import only what you need:
```js
import {define, routes, spirit, response, site_defaults} from "spirit"
```

##### ES5
```js
var spirit = require("spirit")
// and to use the API:
// spirit.define, spirit.routes, spirit.spirit, etc.
```
