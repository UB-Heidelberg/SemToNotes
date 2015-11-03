
.\lib\jsdoc\jsdoc -r -p ^
-d .\apidoc\drawing\full .\src ^
-c .\build\apidoc.conf ^
&& ^
.\lib\jsdoc\jsdoc -r ^
-d .\apidoc\drawing\simple .\src ^
-c .\build\apidoc.conf
