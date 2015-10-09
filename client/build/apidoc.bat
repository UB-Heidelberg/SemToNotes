
.\lib\jsdoc\jsdoc -r -p ^
-d .\apidoc\graphic\full .\src ^
-c .\build\apidoc.conf ^
&& ^
.\lib\jsdoc\jsdoc -r ^
-d .\apidoc\graphic\simple .\src ^
-c .\build\apidoc.conf
