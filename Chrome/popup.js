// SPDX-License-Identifier: MIT
// Copyright (C) 2021 Roland Csaszar
//
// Project:  notoy-browser_extensions
// File:     popup.js
// Date:     11.Aug.2021
//
//=============================================================================
// `chrome` is unknown to eslint
/* eslint-disable no-undef */

// Unicode regex for 'not a letter'
const unicodeNotWordRegex = /(\P{L})+/giu

// Markdown MIME type.
const markdownMIME = "text/markdown"

// Title input field in the extension's popup.
let titleText = document.getElementById("titleText")

// URL input field in the extension's popup.
let pageURL = document.getElementById("pageURL")

// Description input field in the extension's popup.
let descriptionText = document.getElementById("descriptionText")

// Save button in the extension's popup.
let saveButton = document.getElementById("saveButton")

chrome.storage.sync.get("tabUrl", ({ tabUrl }) => {
    pageURL.value = tabUrl
})

chrome.storage.sync.get("tabTitle", ({ tabTitle }) => {
    titleText.value = tabTitle
})

saveButton.addEventListener("click", async () => {
    const data = getMarkdown(
        pageURL.value,
        titleText.value,
        descriptionText.value
    )
    const dataUrl = URL.createObjectURL(data)
    chrome.downloads.download({
        url: dataUrl,
        filename: titleText.value.replace(unicodeNotWordRegex, "_") + ".md",
        saveAs: true,
    })
})

function getMarkdown(url, title, description) {
    const markdownString = `# ${title}

    [${title}](${url})

    ${description}
    `

    return new Blob([markdownString, "HUGO"], { type: markdownMIME })
}
