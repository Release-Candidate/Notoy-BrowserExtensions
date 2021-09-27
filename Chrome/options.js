// SPDX-License-Identifier: MIT
// Copyright (C) 2021 Roland Csaszar
//
// Project:  notoy-browser_extensions
// File:     options.js
// Date:     16.Sep.2021
//
//=============================================================================
// eslint doesn't know `chrome`
/* eslint-disable no-undef */

// Valid document formats to save.
const formats = {
    MARKDOWN: "markdown",
    ORG_MODE: "orgMode",
    TEXT: "text",
}

chrome.storage.sync.get("optionFormat", ({ optionFormat }) => {
    let markdownCheck = document.getElementById("markdown")
    let orgModeCheck = document.getElementById("orgMode")
    let textCheck = document.getElementById("text")
    switch (optionFormat) {
        case formats.ORG_MODE:
            markdownCheck.checked = false
            orgModeCheck.checked = true
            textCheck.checked = false
            break

        case formats.TEXT:
            markdownCheck.checked = false
            orgModeCheck.checked = false
            textCheck.checked = true
            break

        // Fall through
        case formats.MARKDOWN:
        default:
            markdownCheck.checked = true
            orgModeCheck.checked = false
            textCheck.checked = false
    }
})

let formatParent = document.getElementById("formatParent")
formatParent.addEventListener("change", async (event) => {
    const optionFormat = event.target.value
    chrome.storage.sync.set({ optionFormat })
})

let useTimestamp = document.getElementById("timestampInput")
chrome.storage.sync.get("optionTimestamp", ({ optionTimestamp }) => {
    useTimestamp.checked = optionTimestamp
})
useTimestamp.addEventListener("click", async (event) => {
    const optionTimestamp = event.target.checked
    chrome.storage.sync.set({ optionTimestamp })
})

let useYamlFrontMatter = document.getElementById("yamlFrontMatter")
chrome.storage.sync.get("optionYaml", ({ optionYaml }) => {
    useYamlFrontMatter.checked = optionYaml
})
useYamlFrontMatter.addEventListener("click", async (event) => {
    const optionYaml = event.target.checked
    chrome.storage.sync.set({ optionYaml })
})

let previewPart = document.getElementById("preview")
previewPart.innerHTML = `<p># Release-Candidate/Notoy-BrowserExtensions</p>
                <p>2021-09-29</p>
                <p>Keywords: #notoy</p>
                <p>
                    Browser extensions to save the current pages URL with
                    comments to a Markdown, Org-Mode or plain text file and/or
                    communicate with the Notoy note app -
                    Release-Candidate/Notoy-BrowserExtensions: Browser
                    extensions to save the current pages URL with comments to a
                    Markdown, Org-Mode or plain text file and/or communicate
                    with the Notoy note app
                    <br />
                    [https://github.com/Release-Candidate/Notoy-BrowserExtensions](https://github.com/Release-Candidate/Notoy-BrowserExtensions)
                </p>
                <p>
                    This is the long text for the example.
                    <br />
                    I don't have much to say.
                </p>`
