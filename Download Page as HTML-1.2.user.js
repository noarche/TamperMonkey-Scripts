// ==UserScript==
// @name         Download Page as HTML
// @namespace    https://github.com/noarche/
// @version      1.2
// @description  Adds a button to download the current page as a complete HTML file with all images embedded.
// @author       noarche
// @match        *://*/*
// @grant        GM_addStyle
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
    button.innerHTML = 'Save.Page';
    button.className = 'download-button';

    // Add button to the document
    document.body.appendChild(button);

    // Function to download the page as an HTML file with images embedded
    button.addEventListener('click', async () => {
        const title = document.title.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize the title
        const timestamp = new Date().toISOString().split('T')[0]; // Human-readable date (YYYY-MM-DD)
        const filename = `${title}_${timestamp}.html`;

        // Replace all images with data URLs
        const images = document.querySelectorAll('img');
        for (let img of images) {
            try {
                const response = await fetch(img.src);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    img.src = reader.result;
                };
                reader.readAsDataURL(blob);
            } catch (error) {
                console.error('Failed to convert image:', img.src, error);
            }
        }

        // Remove all script tags to avoid issues with offline viewing
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => script.remove());

        // Wait a moment to ensure all images are converted
        setTimeout(() => {
            const doctype = new XMLSerializer().serializeToString(document.doctype);
            const htmlContent = document.documentElement.outerHTML;
            const blob = new Blob([doctype + htmlContent], {type: 'text/html'});

            // Create a link and trigger the download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
        }, 3000); // Wait 3 seconds for images to process
    });
})();
