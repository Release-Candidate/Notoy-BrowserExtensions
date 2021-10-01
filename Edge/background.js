// SPDX-License-Identifier: MIT
// Copyright (C) 2021 Roland Csaszar
//
// Project:  notoy-chrome_extensions
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

    chrome.storage.local.set({ tabUrl })
    chrome.storage.local.set({ tabTitle })
    chrome.storage.local.set({ tabDescription })
    chrome.storage.local.set({ tabKeywords })
    chrome.storage.local.set({ tabText })

    chrome.tabs.query({ active: true, currentWindow: true }, ([currTab]) => {
        getTabInformation(currTab)
    })
})

/**
 * Function that does the main work, gets the current tab's URL and title text
 * and injects the function `getContentInfo` in the current tab to get the
 * tab's content info.
 * Called when the current tab has changed.
 */
chrome.tabs.onActivated.addListener(() => {
    chrome.tabs.query(
        { active: true, lastFocusedWindow: true },
        ([currTab]) => {
            getTabInformation(currTab)
        }
    )
})

/**
 * Function that does the main work, gets the current tab's URL and title text
 * and injects the function `getContentInfo` in the current tab to get the
 * tab's content info.
 * Called when the current tab has been updated, like the URL has changed.
 */
chrome.tabs.onUpdated.addListener(() => {
    chrome.tabs.query(
        { active: true, lastFocusedWindow: true },
        ([currTab]) => {
            getTabInformation(currTab)
        }
    )
})

/**
 * Sets the storage from data of the given current tab.
 * @param {*} currTab The current tab to get the information about.
 */
function getTabInformation(currTab) {
    tabTitle = currTab.title
    tabUrl = currTab.url

    chrome.storage.local.set({ tabUrl })
    chrome.storage.local.set({ tabTitle })
    chrome.storage.local.set({ tabText })

    chrome.tabs.executeScript(
        currTab.id,
        {
            file: "./inject.js",
        },
        () => {
            if (chrome.runtime.lastError) {
                let tabDescription = ""
                let tabKeywords = ""
                chrome.storage.local.set({ tabDescription })
                chrome.storage.local.set({ tabKeywords })
            }
        }
    )
}
