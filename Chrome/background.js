// SPDX-License-Identifier: MIT
// Copyright (C) 2021 Roland Csaszar
//
// Project:  notoy-browser_extensions
// File:     background.js
// Date:     10.Aug.2021
//
//=============================================================================
// `chrome` is unknown to eslint
/* eslint-disable no-undef */

let tabTitle = "Title"
let tabUrl = "about:blank"
let tabText = ""

/**
 * Initialization of the extension.
 */
chrome.runtime.onInstalled.addListener(() => {
    let tabDescription = ""
    let tabKeywords = ""

    chrome.storage.sync.set({ tabUrl })
    chrome.storage.sync.set({ tabTitle })
    chrome.storage.sync.set({ tabDescription })
    chrome.storage.sync.set({ tabKeywords })
    chrome.storage.sync.set({ tabText })
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
            chrome.storage.sync.set({ tabText })

            chrome.scripting.executeScript(
                {
                    target: { tabId: currTab.id },
                    function: getContentInfo,
                },
                () => {
                    if (chrome.runtime.lastError) {
                        let tabDescription = ""
                        let tabKeywords = ""
                        chrome.storage.sync.set({ tabDescription })
                        chrome.storage.sync.set({ tabKeywords })
                    }
                }
            )
        }
    )
})

/**
 * Function that is injected into the current tab to get information about the
 * content, like the description in `<meta name="description" ...>`.
 */
function getContentInfo() {
    let tabDescription = ""
    let tabKeywords = ""

    const desc = document.querySelector('meta[name="description"]')
    if (desc !== null) {
        tabDescription = desc.getAttribute("content")
    }

    const tags = document.querySelector('meta[name="keywords"]')
    if (tags !== null) {
        tabKeywords = tags.getAttribute("content")
    }

    chrome.storage.sync.set({ tabDescription })
    chrome.storage.sync.set({ tabKeywords })
}
