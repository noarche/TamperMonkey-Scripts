// ==UserScript==
// @name         Extract Image links from session (remove Duplicate)
// @namespace    https://github.com/noarche/TamperMonkey-Scripts
// @version      0.1
// @description  Scrape IMG URL from visited sites, save as list.txt - Removes duplicate links.
// @author       noarche
// @match        *://*/*
// @grant        GM_download
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    const storageKey = 'collectedLinks';
    let links = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));

    // Collect all the links from the current page
    document.querySelectorAll('a').forEach(a => {
        const href = a.href;
        if (href && (href.endsWith('.jpg') || href.endsWith('.jpeg') || href.endsWith('.png') || href.endsWith('.gif') || href.endsWith('.webp'))) {
            // To ensure we are only collecting valid URLs and filtering based on extensions
            links.add(href);
        }
    });

    // Store the updated set of links in local storage
    localStorage.setItem(storageKey, JSON.stringify([...links]));

    // Provide a button to download the links
    const downloadButton = document.createElement('button');
    downloadButton.innerText = 'Links';
    downloadButton.style.position = 'fixed';
    downloadButton.style.bottom = '10px';
    downloadButton.style.right = '10px';
    downloadButton.style.zIndex = '9999';

    GM_addStyle(`
        button {
            padding: 5px 7px;
            font-size: 12px;
            cursor: pointer;
            background-color: #6781a1;
            color: #FFF;
            border: none;
            border-radius: 5px;
            transition: background-color 1.5s;
        }

        button:hover {
            background-color: #6bb28e;
        }
    `);

    downloadButton.onclick = () => {
        const blob = new Blob([[...links].join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        GM_download({url: url, name: 'links.txt', saveAs: true});
    };

    document.body.appendChild(downloadButton);

})();
