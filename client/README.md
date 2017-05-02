# SemToNotes Client

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
