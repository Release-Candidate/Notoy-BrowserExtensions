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

// Valid document formats to save.
const formats = {
    MARKDOWN: "markdown",
    ORG_MODE: "orgMode",
    TEXT: "text",
}

// File suffixes of the document formats.
const fileSuffix = {
    MARKDOWN: ".md",
    ORG_MODE: ".org",
    TEXT: ".txt",
}

// MIME type of the various document formats.
const mimeTypes = {
    MARKDOWN: "text/markdown",
    ORG_MODE: "text/org",
    TEXT: "text/plain",
}

// File type, MIME type and suffix needed to generate the document.
const fileInfo = {
    MARKDOWN: {
        type: formats.MARKDOWN,
        suffix: fileSuffix.MARKDOWN,
        mime: mimeTypes.MARKDOWN,
    },
    ORG_MODE: {
        type: formats.ORG_MODE,
        suffix: fileSuffix.ORG_MODE,
        mime: mimeTypes.ORG_MODE,
    },
    TEXT: {
        type: formats.TEXT,
        suffix: fileSuffix.TEXT,
        mime: mimeTypes.TEXT,
    },
}

// The format of the document to generate.
let documentFormat = fileInfo.MARKDOWN

// Unicode regex for 'not a letter'
const unicodeNotWordRegex = /(\P{L})+/giu

// Title input field in the extension's popup.
let titleText = document.getElementById("titleText")
titleText.addEventListener("input", async () => {
    chrome.storage.sync.set({ tabTitle: titleText.value })
})

// URL input field in the extension's popup.
let pageURL = document.getElementById("pageURL")

// Keywords input field in the extension's popup.
let keyWords = document.getElementById("keyWords")
keyWords.addEventListener("input", async () => {
    chrome.storage.sync.set({ tabKeywords: keyWords.value })
})

// Description input field in the extension's popup.
let descriptionText = document.getElementById("descriptionText")
descriptionText.addEventListener("input", async () => {
    chrome.storage.sync.set({ tabDescription: descriptionText.value })
})

// Description input field in the extension's popup.
let longText = document.getElementById("longText")
longText.addEventListener("input", async () => {
    chrome.storage.sync.set({ tabText: longText.value })
})

// Save button in the extension's popup.
let saveButton = document.getElementById("saveButton")

chrome.storage.sync.get("tabUrl", ({ tabUrl }) => {
    pageURL.value = tabUrl
})

chrome.storage.sync.get("tabTitle", ({ tabTitle }) => {
    titleText.value = tabTitle
})

chrome.storage.sync.get("tabKeywords", ({ tabKeywords }) => {
    keyWords.value = tabKeywords
})

chrome.storage.sync.get("tabDescription", ({ tabDescription }) => {
    descriptionText.value = tabDescription
})

chrome.storage.sync.get("tabText", ({ tabText }) => {
    longText.value = tabText
})

chrome.storage.sync.get("optionFormat", ({ optionFormat }) => {
    switch (optionFormat) {
        case formats.MARKDOWN:
            documentFormat = fileInfo.MARKDOWN
            break

        case formats.ORG_MODE:
            documentFormat = fileInfo.ORG_MODE
            break

        // Fall through
        case formats.TEXT:
        default:
            documentFormat = fileInfo.TEXT
    }
})

// Download the data.
saveButton.addEventListener("click", async () => {
    const tabData = {
        url: pageURL.value,
        title: titleText.value,
        keywords: keyWords.value,
        description: descriptionText.value,
        text: longText.value,
        format: documentFormat,
    }

    const data = getData(tabData)
    const dataUrl = URL.createObjectURL(data)
    chrome.downloads.download({
        url: dataUrl,
        filename:
            titleText.value.replace(unicodeNotWordRegex, "_") +
            tabData.format.suffix,
        saveAs: true,
    })
})

/**
 * Return the given data as  formatted 'Blob', depending on the format of the
 * given data - `tabData.format`.
 *
 * @param {*} tabData  The data to put into the document.
 * @returns The given data as a formatted `Blob`, suitable to download.
 */
function getData(tabData) {
    let documentString = ""

    switch (tabData.format) {
        case fileInfo.MARKDOWN:
            documentString = getMarkdown(tabData)
            break

        case fileInfo.ORG_MODE:
            documentString = getOrgMode(tabData)
            break

        // Fall through
        case fileInfo.TEXT:
        default:
            documentString = getPlainText(tabData)
    }

    return new Blob([documentString], { type: tabData.format.mime })
}

/**
 * Return the given `tabData` as a Markdown formatted `Blob` with MIME
 * 'text/markdown'.
 *
 * @param {*} tabData The data to put into the Markdown document.
 * @returns The given data as a Markdown formatted `Blob`, suitable to download.
 */
function getMarkdown(tabData) {
    return `# ${tabData.title}

Keywords: ${tabData.keywords}

${tabData.description}
[${tabData.title}](${tabData.url})

${tabData.text}
`
}

/**
 * Return the given `tabData` as a Org-Mode formatted `Blob` with MIME
 * 'text/markdown'.
 *
 * @param {*} tabData The data to put into the Org-Mode document.
 * @returns The given data as a Org-Mode formatted `Blob`, suitable to download.
 */
function getOrgMode(tabData) {
    return `#+title:  ${tabData.title}
#+date:   ${getDateString()}

* ${tabData.title}

Keywords: ${tabData.keywords}

${tabData.description}
[[${tabData.url}][${tabData.title}]]

${tabData.text}
`
}

/**
 * Return the given `tabData` as a 'plain text' formatted `Blob` with MIME
 * 'text/markdown'.
 *
 * @param {*} tabData The data to put into the 'plain text' document.
 * @returns The given data as a 'plain text' formatted `Blob`, suitable to download.
 */
function getPlainText(tabData) {
    return `${tabData.title}

${getDateString()}

Keywords: ${tabData.keywords}

${tabData.description}
${tabData.url}

${tabData.text}
`
}

/**
 * Return the current date in ISO format, "YYYY-MM-DD".
 *
 * @returns The current date in ISO format, "YYYY-MM-DD".
 */
function getDateString() {
    function pad0s(n) {
        // eslint-disable-next-line no-magic-numbers
        return n < 10 ? "0" + n : n
    }
    const today = new Date()

    return (
        today.getFullYear() +
        "-" +
        // eslint-disable-next-line no-magic-numbers
        pad0s(today.getMonth() + 1) +
        "-" +
        pad0s(today.getDate())
    )
}
