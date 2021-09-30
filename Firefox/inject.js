// SPDX-License-Identifier: MIT
// Copyright (C) 2021 Roland Csaszar
//
// Project:  notoy-browser_extensions
// File:     inject.js
// Date:     30.Sep.2021
//
//=============================================================================
// Eslint doesn't know `browser`.
/* eslint-disable no-undef */

/* Script may be injected more than once, so don't use `let` or `const` :( */

tabDescription = ""
tabKeywords = ""

desc = document.querySelector('meta[name="description"]')
if (desc !== null) {
    tabDescription = desc.getAttribute("content")
}

tags = document.querySelector('meta[name="keywords"]')
if (tags !== null) {
    tabKeywords = tags.getAttribute("content")
}

browser.storage.sync.set({ tabDescription })
browser.storage.sync.set({ tabKeywords })
