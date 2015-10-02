
./lib/closure-library/closure/bin/build/closurebuilder.py \
  --root=./lib/closure-library/ \
  --root=./src/core/graphic \
  --namespace="xrx.graphic" \
  --output_mode=compiled \
  --compiler_jar=./lib/closure-compiler/compiler.jar \
  --compiler_flags="--compilation_level=SIMPLE_OPTIMIZATIONS" \
  > ./xrx-minified.js