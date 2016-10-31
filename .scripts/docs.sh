#!/usr/bin/env bash

commandToRun=$1

case "$commandToRun" in
    "dev")
        npm run docs-compile && http-server docs/
        ;;
    "compile")
        ./node_modules/.bin/jsdoc -R README.md \
            -t node_modules/jaguarjs-jsdoc/ \
            -c jsdoc-config.json \
            -a all \
            -d docs index.js
        ;;
    *)
        echo "No scripts to run..."
        exit 1
esac
