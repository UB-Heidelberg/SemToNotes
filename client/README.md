# SemToNotes Client

## Usage

Serve `./xrx.api.drawing.min.js` or use unpkg for testing:

```html
<script src="https://unpkg.com/semtonotes-client@0.2.0"></script>
```


## Building

```sh
make build
# or
bash build/deps.sh
bash build/minify.sh
```

## Node compat

NodeJS expects CommonJS `module.exports`. Therefore need to add 

```js
module.exports = xrx
```

after the closure-compiled code.

```
make node
```

does that.
