var core = require("./lib/core/core")
var p_utils = require("./lib/core/promise_utils")

//-- spirit.node
var node_adapter = require("./lib/http/node_adapter")
var response = require("./lib/http/response")
var response_map = require("./lib/http/response-class")
var node = response
node.adapter = node_adapter.adapter
node.Response = response_map.Response
///////// setup node camelCase aliases
node.isResponse = node.is_response
node.makeStream = node.make_stream
node.fileResponse = node.file_response
node.errResponse = node.err_response

//-- spirit.utils (Internal API but exported)
// no camelCase aliases!
node.utils = require("./lib/http/utils")
node.utils.is_Response = response_map.is_Response
node.utils.callp_response = p_utils.callp_response

module.exports = {
  compose: core.compose,
  callp: p_utils.callp,
  is_promise: p_utils.is_promise, // exported but not documented

  node: node
}
