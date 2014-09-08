
./lib/closure-library/closure/bin/build/closurebuilder.py \
  --root=./lib/closure-library/ \
  --root=./src/ \
  --namespace="stn" \
  --output_mode=compiled \
  --compiler_jar=./lib/closure-compiler/compiler.jar \
  > ./stn-minified.js