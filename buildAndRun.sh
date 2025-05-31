#!/bin/bash
docker build . -f node.dockerfile -t mr_lvl5_m3_back

docker run --rm -it -p 4000:4000 mr_lvl5_m3_back