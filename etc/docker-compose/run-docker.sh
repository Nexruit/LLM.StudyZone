#!/bin/bash

if [[ ! -d certs ]]
then
    mkdir certs
    cd certs/
    if [[ ! -f localhost.pfx ]]
    then
        dotnet dev-certs https -v -ep localhost.pfx -p 3785646d-789b-43b4-8512-c9d661fde730 -t
    fi
    cd ../
fi

docker-compose up -d
