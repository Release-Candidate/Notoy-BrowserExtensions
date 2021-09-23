// SPDX-License-Identifier: MIT
// Copyright (C) 2021 Roland Csaszar
//
// Project:  notoy-browser_extensions
// File:     background.js
// Date:     10.Aug.2021
//
//=============================================================================
/* eslint-disable no-undef */

let tabTitle = "Title"
let tabUrl = "about:blank"

/**
 * Function that is injected into the current tab to get information about the
 * content, like the description in `<meta name="description" ...>`.
 */
function getContentInfo() {
    let descriptionText = ""
    let keyWords = ""

    const desc = document.querySelector('meta[name="description"]')
    if (desc !== null) {
        descriptionText = desc.getAttribute("content")
    }

    const tags = document.querySelector('meta[name="keywords"]')
    if (tags !== null) {
        keyWords = tags.getAttribute("content")
    }

    chrome.storage.sync.set({ descriptionText })
    chrome.storage.sync.set({ keyWords })
}

/**
 * Initialization of the extension.
 */
chrome.runtime.onInstalled.addListener(() => {
    // Init goes here
})

/**
 * Function that does the main work, gets the current tab's URL and title text
 * and injects the function `getContentInfo` in the current tab to get the
 * tab's content info.
 */
chrome.tabs.onActivated.addListener(() => {
    chrome.tabs.query(
        { active: true, lastFocusedWindow: true },
        ([currTab]) => {
            tabTitle = currTab.title
            tabUrl = currTab.url

            chrome.storage.sync.set({ tabUrl })
            chrome.storage.sync.set({ tabTitle })

            chrome.scripting.executeScript(
                {
                    target: { tabId: currTab.id },
                    function: getContentInfo,
                },
                () => {
                    if (chrome.runtime.lastError) {
                        let descriptionText = ""
                        let keyWords = ""
                        chrome.storage.sync.set({ descriptionText })
                        chrome.storage.sync.set({ keyWords })
                    }
                }
            )
        }
    )
})
