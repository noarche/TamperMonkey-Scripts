// ==UserScript==
// @name         Link Filter and Downloader
// @namespace    http://github.com/noarche/
// @version      0.1
// @description  Parse, filter, and download links from the webpage
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Array to store the links
    let links = new Set();

    // Function to filter and accumulate links
    function filterLinks() {
        const allLinks = document.querySelectorAll('a[href]');
        allLinks.forEach(link => {
            const href = link.href;
            if (href.includes('.com/users/')) {
                links.add(href);
            }
        });
    }

    // Function to download the links as a text file
    function downloadLinks() {
        const sortedLinks = Array.from(links).sort();
        const blob = new Blob([sortedLinks.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'links.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Add the "Download Links" button to the page
    function addButton() {
        const button = document.createElement('button');
        button.innerText = 'Download Links';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', () => {
            downloadLinks();
        });
        document.body.appendChild(button);
    }

    // Run the functions
    filterLinks();
    addButton();
})();
