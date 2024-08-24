// ==UserScript==
// @name         Download Page as HTML
// @namespace    https://github.com/noarche/
// @version      1.3
// @description  Adds a button to download the current page as a complete HTML file with all images and resources embedded.
// @author       noarche
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(function() {
    'use strict';

    // Apply custom styles to the button
    GM_addStyle(`
        .download-button {
            padding: 2px 2px;
            font-size: 10px;
            cursor: pointer;
            background-color: #343b65;
            color: #FFF;
            border: none;
            border-radius: 2px;
            transition: background-color 2.5s;
            position: fixed;
            bottom: 2px;
            right: 2px;
            z-index: 1000;
        }

        .download-button:hover {
            background-color: #6bb28e;
        }
    `);

    // Create a button element
    const button = document.createElement('button');
    button.innerHTML = 'Save Page';
    button.className = 'download-button';

    // Add button to the document
    document.body.appendChild(button);

    // Function to convert a URL to a data URL
    const urlToDataURL = (url) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                onload: (response) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(response.response);
                },
                onerror: reject
            });
        });
    };

    // Function to replace URLs with data URLs for images, stylesheets, and other resources
    const replaceResourceURLs = async () => {
        const resources = document.querySelectorAll('img, link[rel="stylesheet"], script[src]');
        for (let resource of resources) {
            try {
                const originalURL = resource.src || resource.href;
                const dataURL = await urlToDataURL(originalURL);

                if (resource.tagName.toLowerCase() === 'img') {
                    resource.src = dataURL;
                } else if (resource.tagName.toLowerCase() === 'link') {
                    resource.href = dataURL;
                } else if (resource.tagName.toLowerCase() === 'script') {
                    resource.src = dataURL;
                }
            } catch (error) {
                console.error('Failed to convert resource:', resource, error);
            }
        }
    };

    // Function to download the page as an HTML file
    const downloadPage = async () => {
        const title = document.title.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize the title
        const timestamp = new Date().toISOString().split('T')[0]; // Human-readable date (YYYY-MM-DD)
        const filename = `${title}_${timestamp}.html`;

        await replaceResourceURLs();

        const doctype = new XMLSerializer().serializeToString(document.doctype);
        const htmlContent = document.documentElement.outerHTML;
        const blob = new Blob([doctype + htmlContent], { type: 'text/html' });

        // Create a link and trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
    };

    // Add the event listener to the button
    button.addEventListener('click', downloadPage);
})();
