PYTHON = python

.PHONY: build
build: xrx.api.drawing.min.node.js

.PHONY: node
node: xrx.api.drawing.min.node.js

deps.js:
	cd src && $(PYTHON) ../lib/closure-library/closure/bin/build/depswriter.py --root_with_prefix=". ../../../../src" > "$@"

xrx.api.drawing.min.js: deps.js
	$(PYTHON) ./lib/closure-library/closure/bin/build/closurebuilder.py \
	  --root=./lib/closure-library/ \
	  --root=./src \
	  --namespace="xrx.api.drawing" \
	  --output_mode=compiled \
	  --compiler_jar=./lib/closure-compiler/compiler.jar \
	  --compiler_flags="--compilation_level=SIMPLE_OPTIMIZATIONS" \
	  > "$@"

xrx.api.drawing.min.node.js: xrx.api.drawing.min.js
	cp "$<" "$@"
	echo 'module.exports = xrx; module.exports.goog = goog' >> "$@"

xrx.demo.min.js:
	python ./lib/closure-library/closure/bin/build/closurebuilder.py \
	  --root=./lib/closure-library/ \
	  --root=./src \
	  --namespace="xrx.demo" \
	  --output_mode=compiled \
	  --compiler_jar=./lib/closure-compiler/compiler.jar \
	  --compiler_flags="--compilation_level=SIMPLE_OPTIMIZATIONS" \
	  > "$@"
