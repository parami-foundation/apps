#!/bin/bash

rm -rf dist

yarn build
if [ $? -eq 0 ]; then
    cd dist
    cp index.html 404.html
    git init .
    git branch -M gh-pages
    if [ "$1" = "staging" ]; then
        echo "deploying to apps-staging"
        git remote add origin git@github.com:parami-protocol/apps-staging.git
    else
        echo "deploying to apps"
        git remote add origin git@github.com:parami-protocol/apps.git
    fi
    git add -f .
    git commit -m "Deploy"
    git push -f origin gh-pages
    cd ..
    echo "Deploy success"
else
    echo "build failed"
fi

