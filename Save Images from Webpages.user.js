// ==UserScript==
// @name         Save Images from Webpages
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Store images in memory and download on button click
// @author       You
// @match        *://*/*
// @grant        GM_download
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    let imageLinks = new Set();

    // Monitor for all images on the page and store their URLs
    document.querySelectorAll('img').forEach(img => {
        const src = img.src;
        if (src && src.startsWith('http')) {
            imageLinks.add(src);
        }
    });

    // Create a button to trigger the download
    const downloadButton = document.createElement('button');
    downloadButton.innerText = 'Download Stored Images';
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
        imageLinks.forEach(link => {
            GM_download(link, link.split('/').pop());
        });
    };

    document.body.appendChild(downloadButton);

})();
