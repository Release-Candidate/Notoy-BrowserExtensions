// SPDX-License-Identifier: MIT
// Copyright (C) 2021 Roland Csaszar
//
// Project:  notoy-browser_extensions
// File:     gulpfile.js
// Date:     03.Oct.2021
//
//=============================================================================

// eslint-disable-next-line no-undef
const { series, parallel } = require("gulp")

// eslint-disable-next-line no-undef
const { src, dest } = require("gulp")

// eslint-disable-next-line no-undef
const del = require("delete")

// eslint-disable-next-line no-undef
const zip = require("gulp-zip")

//=============================================================================
// Copy Directories

function copyDir(dirName) {
    return src("./" + dirName + "/**/*")
        .pipe(dest("./Chrome/" + dirName))
        .pipe(dest("./Edge/" + dirName))
        .pipe(dest("./Firefox/" + dirName))
}

function copyImages() {
    return copyDir("images")
}

function copyTranslations() {
    return copyDir("_locales")
}

//=============================================================================
// Zip Directories

function zipDir(dirName) {
    return src("./" + dirName + "/**/*")
        .pipe(zip(dirName + ".zip"))
        .pipe(dest("./"))
}

function zipChrome() {
    return zipDir("Chrome")
}

function zipEdge() {
    return zipDir("Edge")
}

function zipFirefox() {
    return zipDir("Firefox")
}

//=============================================================================
// Delete Directories and Zip Files

function delDirectory(dirName, cb) {
    del([dirName], cb)
}

function delChromeDir(dirName, cb) {
    delDirectory("./Chrome/" + dirName, cb)
}

function delEdgeDir(dirName, cb) {
    delDirectory("./Edge/" + dirName, cb)
}

function delFirefoxDir(dirName, cb) {
    delDirectory("./Firefox/" + dirName, cb)
}

function cleanChrome(cb) {
    delChromeDir("images", cb)
    delChromeDir("_locales", cb)
    del(["Chrome.zip"], cb)
    cb()
}

function cleanEdge(cb) {
    delEdgeDir("images", cb)
    delEdgeDir("_locales", cb)
    del(["Edge.zip"], cb)
    cb()
}

function cleanFirefox(cb) {
    delFirefoxDir("images", cb)
    delFirefoxDir("_locales", cb)
    del(["Firefox.zip"], cb)
    cb()
}

//=============================================================================

// eslint-disable-next-line no-undef
exports.clean = parallel(cleanChrome, cleanEdge, cleanFirefox)

// eslint-disable-next-line no-undef
exports.default = series(
    parallel(copyImages, copyTranslations),
    parallel(zipChrome, zipEdge, zipFirefox)
)
