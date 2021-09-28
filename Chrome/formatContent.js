// SPDX-License-Identifier: MIT
// Copyright (C) 2021 Roland Csaszar
//
// Project:  notoy-browser_extensions
// File:     formatContent.js
// Date:     27.Sep.2021
//
//=============================================================================

// Valid document formats to save.
// eslint-disable-next-line no-unused-vars
const formats = {
    MARKDOWN: "markdown",
    ORG_MODE: "orgMode",
    TEXT: "text",
}

/**
 * Return the given `tabData` as a Markdown formatted string
 *
 * @param {*} tabData The data to put into the Markdown document.
 * @returns The given data as a Markdown formatted string.
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
    return `${getYamlFrontMatter({ title, keywords, addYaml })}# ${title}

${getTimestamp(addTimestamp)}Keywords: ${keywords}

${description}
[${title}](${url})

${text}
`
}

/**
 * Return the given `tabData` as a Org-Mode formatted string.
 *
 * @param {*} tabData The data to put into the Org-Mode document.
 * @returns The given data as a Org-Mode formatted string.
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

${getTimestamp(addTimestamp)}Keywords: ${keywords}

${description}
[[${url}][${title}]]

${text}
`
}

/**
 * Return the given `tabData` as a 'plain text' formatted string.
 *
 * @param {*} tabData The data to put into the 'plain text' document.
 * @returns The given data as a 'plain text' formatted string.
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
    return `${getYamlFrontMatter({ title, keywords, addYaml })}${title}

${getTimestamp(addTimestamp)}Keywords: ${keywords}

${description}
${url}

${text}
`
}

/**
 * Return the given comma separated keywords as a YAML list of keywords.
 * @param {*} keywords The string containing the comma separated keywords.
 * @returns `keywords` as a YAML list of keywords.
 */
function getKeywordsYAML(keywords) {
    return keywords.replace(/^|(\s*,\s*)/gu, "\n  - ")
}

/**
 * Return the YAML front matter containing the given title and comma separated
 * keywords if `addYaml` is `true` and the empty string else.
 * @param {*} title The title to set.
 * @param {*} keywords The keywords to use as a comma separated list.
 * @param {*} addYaml If this is `true`, the filled YAML front matter is
 *            returned. If this is `false`, the empty string ("") is returned.
 * @returns The YAML front matter containing the given title and comma separated
 * keywords if `addYaml` is `true` and the empty string else.
 */
function getYamlFrontMatter({ title, keywords, addYaml }) {
    const yamlString = `---
title: "${title}"
author:
  -
keywords: ${getKeywordsYAML(keywords)}
---`
    return addYaml ? yamlString + "\n\n" : ""
}

/**
 * Returns the current date as string or an empty string.
 *
 * @param {*} addTimestamp If this is `true`, a date string is returned, else
 * the empty string.
 * @returns The current date as string, if `addTimestamp` is `true`, the empty
 * string ("") else.
 */
function getTimestamp(addTimestamp) {
    return addTimestamp ? getDateString() + "\n\n" : ""
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
