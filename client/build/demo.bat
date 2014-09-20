
.\lib\closure-library\closure\bin\build\closurebuilder.py ^
  --root=.\lib\closure-library\ ^
  --root=.\src\ ^
  --root=.\demo\ ^
  --namespace="demo" ^
  --output_mode=compiled ^
  --compiler_jar=.\lib\closure-compiler\compiler.jar ^
  --compiler_flags="--compilation_level=SIMPLE_OPTIMIZATIONS" ^
  > .\demo\demo-minified.js