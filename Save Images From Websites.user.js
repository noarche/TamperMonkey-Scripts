// ==UserScript==
// @name         Save Images From Websites
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Save images larger than 400x400 px from websites
// @author       You
// @match        *://*/*
// @grant        GM_download
// ==/UserScript==

(function() {
    'use strict';

    // This function will check the actual dimensions of the image.
    function checkImageSize(url) {
        const img = new Image();
        img.onload = function() {
            if (this.width > 400 && this.height > 400) {
                GM_download(url, "image." + getFileExtension(url));
            }
        };
        img.src = url;
    }

    // Extract the file extension from the image URL.
    function getFileExtension(url) {
        const matches = url.match(/\.(jpg|jpeg|png|webp)$/i);
        return matches ? matches[1] : '';
    }

    // This is the main function.
    function downloadLargeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            const src = img.src;
            if ([".jpg", ".jpeg", ".png", ".webp"].includes(getFileExtension(src))) {
                checkImageSize(src);
            }
        });
    }

    // Run the script after the page is fully loaded.
    window.addEventListener('load', () => {
        // Button to initiate the download process (to prevent automatic downloading on every page load)
        const button = document.createElement('button');
        button.textContent = "Download Images";
        button.style.position = "fixed";
        button.style.bottom = "10px";
        button.style.right = "10px";
        button.style.zIndex = "9999";
        button.addEventListener('click', downloadLargeImages);

        document.body.appendChild(button);
    });

})();
