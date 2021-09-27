// SPDX-License-Identifier: MIT
// Copyright (C) 2021 Roland Csaszar
//
// Project:  notoy-browser_extensions
// File:     formatContent.js
// Date:     27.Sep.2021
//
//=============================================================================

/**
 * Return the given `tabData` as a Markdown formatted `Blob` with MIME
 * 'text/markdown'.
 *
 * @param {*} tabData The data to put into the Markdown document.
 * @returns The given data as a Markdown formatted `Blob`, suitable to download.
 */
// eslint-disable-next-line no-unused-vars
function getMarkdown({
    url,
    title,
    keywords,
    description,
    text,
    addTimestamp,
    addYaml,
} = {}) {
    return `YAML: ${addYaml}

# ${title}

Date: ${addTimestamp}

Keywords: ${keywords}

${description}
[${title}](${url})

${text}
`
}

/**
 * Return the given `tabData` as a Org-Mode formatted `Blob` with MIME
 * 'text/markdown'.
 *
 * @param {*} tabData The data to put into the Org-Mode document.
 * @returns The given data as a Org-Mode formatted `Blob`, suitable to download.
 */
// eslint-disable-next-line no-unused-vars
function getOrgMode({
    url,
    title,
    keywords,
    description,
    text,
    addTimestamp,
} = {}) {
    return `#+title:  ${title}
#+date:   ${getDateString()}

* ${title}

Date: ${addTimestamp}

Keywords: ${keywords}

${description}
[[${url}][${title}]]

${text}
`
}

/**
 * Return the given `tabData` as a 'plain text' formatted `Blob` with MIME
 * 'text/markdown'.
 *
 * @param {*} tabData The data to put into the 'plain text' document.
 * @returns The given data as a 'plain text' formatted `Blob`, suitable to download.
 */
// eslint-disable-next-line no-unused-vars
function getPlainText({
    url,
    title,
    keywords,
    description,
    text,
    addTimestamp,
    addYaml,
} = {}) {
    return `YAML: ${addYaml}

${title}

Date: ${addTimestamp}

${getDateString()}

Keywords: ${keywords}

${description}
${url}

${text}
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
