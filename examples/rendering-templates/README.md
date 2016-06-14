## Rendering templates in spirit

spirit does _not_ have a rendering engine or "view engine" by design. This is to be unopinionated, modular, but also stays true to spirit's core design philosophy of not melding HTTP related ideas with your routes.

This example shows a simple example to get you started. It lacks a caching on the templates, but the good news is there is probably a dozen packages on `npm` that are already written for different template engines with caching.

In this example, it uses `jade` as it's templates so to run:
`npm install jade`

__NOTE:__ You can also write a _response middleware_ if you feel you want integration with spirit. But this example won't cover that.
