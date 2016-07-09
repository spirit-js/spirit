var core = require("./lib/core/core")
var p_utils = require("./lib/core/promise_utils")

var node_adapter = require("./lib/http/node_adapter")
var response = require("./lib/http/response")
var response_map = require("./lib/http/response-map")

var resp = response
resp.is_Response = response_map.is_Response

module.exports = {
  compose: core.compose,
  utils: p_utils,

  node: {
    adapter: node_adapter.adapter,
    response: resp,
    Response: response_map.Response
  }
}
