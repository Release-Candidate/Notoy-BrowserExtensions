// SPDX-License-Identifier: MIT
// Copyright (C) 2021 Roland Csaszar
//
// Project:  notoy-browser_extensions
// File:     background.js
// Date:     10.Aug.2021
//
//=============================================================================

let tabTitle = "Title"
let tabUrl = "about:blank"

chrome.runtime.onInstalled.addListener(() => {
    // Init goes here
})

chrome.tabs.onActivated.addListener(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([currTab]) => {
        tabTitle = currTab.title
        tabUrl = currTab.url

        chrome.storage.sync.set({ tabUrl })
        chrome.storage.sync.set({ tabTitle })
    })
})
