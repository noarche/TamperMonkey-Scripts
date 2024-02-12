// ==UserScript==
// @name         Save Links from Webpages
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Save links from all websites visited
// @author       You
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
        if (href && href.startsWith('http')) {  // To ensure we are only collecting valid URLs
            links.add(href);
        }
    });

    // Store the updated set of links in local storage
    localStorage.setItem(storageKey, JSON.stringify([...links]));

    // Provide a button to download the links
    const downloadButton = document.createElement('button');
    downloadButton.innerText = 'Download Links';
    downloadButton.style.position = 'fixed';
    downloadButton.style.bottom = '10px';
    downloadButton.style.right = '10px';
    downloadButton.style.zIndex = '9999';

    GM_addStyle(`
        button {
            padding: 5px 15px;
            font-size: 14px;
            cursor: pointer;
            background-color: #007BFF;
            color: #FFF;
            border: none;
            border-radius: 5px;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #0056b3;
        }
    `);

    downloadButton.onclick = () => {
        const blob = new Blob([[...links].join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        GM_download({url: url, name: 'links.txt', saveAs: true});
    };

    document.body.appendChild(downloadButton);

})();
