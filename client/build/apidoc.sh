#!/bin/bash
rm -rf out
/usr/lib/jvm/default-java/bin/java -Xmx1024m -jar ./lib/dossier/dossier.jar -c ./lib/dossier/config.json
