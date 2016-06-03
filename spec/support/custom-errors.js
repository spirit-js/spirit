/*
 * Custom error types for tests
 */


// When a function was not expected to be called
class CallError extends Error {
  constructor(message) {
    super()
    this.name = "CallError"
    this.message = message
  }
}

module.exports = CallError
