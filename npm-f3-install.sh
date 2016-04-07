#!/bin/bash

#
# Author:       SuperPaintman <SuperPaintmanDeveloper@gmail.com>
# 

###
# Constants
###
RETVAL=0

CCYAN="\033[0;36m"
CGREEN="\033[0;32m"
CBLUE="\033[0;34m"
CGRAY="\033[1;30m"
CNC="\033[0m"

###
# Packages
###
node_script_dependencies=$(cat <<EOF
'use strict';
var p = require('./package.json');

var deps = [];
for (var packageName in p.dependencies) {
    var pachageV = p.dependencies[packageName];
    deps.push(packageName + "@" + pachageV);
}

console.log(deps.join(';'));
EOF
)

node_script_devDependencies=$(cat <<EOF
'use strict';
var p = require('./package.json');

var deps = [];
for (var packageName in p.devDependencies) {
    var pachageV = p.devDependencies[packageName];
    deps.push(packageName + "@" + pachageV);
}

console.log(deps.join(';'));
EOF
)

node_dependencies_str=$(node -e "$node_script_dependencies")
node_devDependencies_str=$(node -e "$node_script_devDependencies")

###
# LazyInstall
# 
# params:
#   $1 {String} - array of packages joined with ";"
###
npm_f3_install () {
    dependencies=$1

    array=(${dependencies//;/ })
    for element in "${array[@]}"
    do
        echo -e "  ${CBLUE}Pachage${CNC}: $element"
        npm install --verbose "$element"
    done
}

case "$1" in
    production)
        echo -e "${CCYAN}Start installing production dependencie${CNC}"
        npm_f3_install ${node_dependencies_str}
        ;;
    development)
        echo -e "${CCYAN}Start installing development dependencie${CNC}"
        npm_f3_install ${node_devDependencies_str}
        ;;
    all|"")
        echo -e "${CCYAN}Start installing all dependencie${CNC}"
        npm_f3_install ${node_dependencies_str}
        npm_f3_install ${node_devDependencies_str}
        ;;
    *)
        echo -e "${CCYAN}Usage${CNC}: $0 {development|production|all} (or null)"
        echo -e "${CCYAN}Example${CNC}:"
        echo -e "  ${CGREEN}$0${CNC} production     ${CGRAY}# install npm production dependencies${CNC}"
        echo -e "  ${CGREEN}$0${CNC} development    ${CGRAY}# install npm development dependencies${CNC}"
        echo -e "  ${CGREEN}$0${CNC} all            ${CGRAY}# install npm all dependencies${CNC}"
        echo -e "  ${CGREEN}$0${CNC}                ${CGRAY}# install npm all dependencies${CNC}"
        exit 1
        ;;
esac

exit $RETVAL
