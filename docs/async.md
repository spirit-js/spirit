Our examples so far have been synchrounous, but in a real world application you will want to do asynchrounous tasks, such as querying a database or reading a file.

This can be accomplished by returning a Promise of the value.

Most libraries support Promises, such as Mongoose:
```js
const db = (title) => {
  return Books.findOne({ name: title })
}

route.define([
  route.get("/api/books/:title", ["title"], db)
])
```
When you have a Promise already, you can just return it.

Of course if you there are more things to do, you can `then` it and handle any errors with `catch` like normal:

```js
const db = (title) => {
  return Books.findOne({ name: title })
      .then((book) => {
        // do something with book / modify it
        return book
      }).catch((err) => {
        return "There was an error"
      })
}

route.define([
  route.get("/api/books/:title", ["title"], db)
])
```

Your `db()` function has nothing to do with http, it's simply a database query function, which can re-used elsewhere in your application.

### Wrapping Callbacks
If a library you are using doesn't support Promises, you can always it as a Promise.

For example let's take node.js's `fs` library:

```js
const readfile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("my-file.txt", (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

route.define([
  route.get("/read-file", [], readfile)
])
```

This isn't special to spirit, our `readfile()` is just writing javascript. The only thing http related is where we defined our route.

There are libraries that automatically wrap other libraries's API to be a Promise. One library that does this for us is [bluebird](https://www.npmjs.com/package/bluebird).

> bluebird is recommended when creating Promises, though not required. You can always use the native Promise implementation that node.js already supports.

### Async / Await

It's worth mentioning you can use ES7 async/await too when working with Promises.

There is nothing inherently special about using async/await with spirit, or Promises in general. So you would set it up and write it as as normal. Setting it up (via babeljs) is outside the scope of this guide.

