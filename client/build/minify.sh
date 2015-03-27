
./lib/closure-library/closure/bin/build/closurebuilder.py \
  --root=./lib/closure-library/ \
  --root=./src/ \
  --namespace="xrx" \
  --output_mode=compiled \
  --compiler_jar=./lib/closure-compiler/compiler.jar \
  --compiler_flags="--compilation_level=SIMPLE_OPTIMIZATIONS" \
  > ./xrx-minified.js