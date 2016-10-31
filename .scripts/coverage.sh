#!/usr/bin/env bash

commandToRun=$1

case "$commandToRun" in
    "analyze")
        istanbul cover _mocha ./index.js -- -u exports -R spec test
        ;;
    "check")
        istanbul check-coverage --statements 100 --branches 100 --functions 100 --lines 100
        ;;
    "codacy-check")
        istanbul check-coverage --statements 100 --branches 100 --functions 100 --lines 100 $CIRCLE_ARTIFACTS/**/coverage*.json
        ;;
    "dev")
        npm run coverage
        http-server ./coverage/lcov-report/
        ;;
    "codacy")
        istanbul cover _mocha ./index.js \
            --dir $CIRCLE_ARTIFACTS \
            --report lcovonly \
            -- \
            -R spec test && \
            npm run coverage-codacy-check && \
            cat $CIRCLE_ARTIFACTS/lcov.info | \
            ./node_modules/.bin/codacy-coverage && \
            echo "Codacy has been updated!"
        ;;
    "lint")
        ./node_modules/eslint/bin/eslint.js ./index.js
        ;;
    *)
        echo "No scripts to run..."
        exit 1
esac
