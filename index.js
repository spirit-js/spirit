var core = require("./lib/core/core")
var p_utils = require("./lib/core/promise_utils")

var node_adapter = require("./lib/http/node_adapter")
var response = require("./lib/http/response")
var response_map = require("./lib/http/response-class")


var node = response
node.adapter = node_adapter.adapter
node.Response = response_map.Response
node.is_Response = response_map.is_Response
node.isResponse = response_map.is_Response

node.utils = require("./lib/http/utils")
node.utils.resolve_response = p_utils.resolve_response
node.utils.resolveResponse = p_utils.resolve_response

module.exports = {
  compose: core.compose,
  callp: p_utils.callp,

  is_promise: p_utils.is_promise,
  isPromise: p_utils.is_promise,

  node: node
}
