// SPDX-License-Identifier: MIT
// Copyright (C) 2021 Roland Csaszar
//
// Project:  notoy-browser_extensions
// File:     popup.js
// Date:     20.Aug.2021
//
//=============================================================================

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
    descriptionText.value = "BLASD"

    const data = new Blob(["array of", " parts of ", "text file"], { type: "text/plain" });
    const dataUrl = URL.createObjectURL(data);
    chrome.downloads.download({
        url: dataUrl,
        filename: titleText.value + ".txt",
        saveAs: true,
    });
})
