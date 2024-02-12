// ==UserScript==
// @name         Download Large Images as ZIP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Save large images to a ZIP and download on button click
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js
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

    console.log(`[Image ZIP Downloader] Found ${imageLinks.size} images.`);

    // Create a button to trigger the download
    const downloadButton = document.createElement('button');
    downloadButton.innerText = 'Download Large Images as ZIP';
    downloadButton.style.position = 'fixed';
    downloadButton.style.bottom = '50px';
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

    downloadButton.onclick = async () => {
        const zip = new JSZip();

        for (let link of imageLinks) {
            await new Promise(resolve => {
                let img = new Image();
                img.onload = function() {
                    if (img.width > 300) {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: link,
                            responseType: "arraybuffer",
                            onload: (response) => {
                                if (response.status === 200) {
                                    zip.file(link.split('/').pop(), response.response);
                                    console.log(`[Image ZIP Downloader] Added ${link} to ZIP.`);
                                } else {
                                    console.error(`[Image ZIP Downloader] Failed to fetch ${link}. Status: ${response.status}`);
                                }
                                resolve();
                            },
                            onerror: (error) => {
                                console.error(`[Image ZIP Downloader] Error fetching ${link}.`, error);
                                resolve();
                            }
                        });
                    } else {
                        console.log(`[Image ZIP Downloader] Skipped ${link} as it's less than 500px wide.`);
                        resolve();
                    }
                };
                img.onerror = function() {
                    console.error(`[Image ZIP Downloader] Error loading ${link} for size check.`);
                    resolve();
                };
                img.src = link;
            });
        }

        const content = await zip.generateAsync({ type: "blob" });
        const blobURL = URL.createObjectURL(content);
        console.log(`[Image ZIP Downloader] Triggering ZIP download.`);
        GM_download(blobURL, "large_images.zip");
    };

    document.body.appendChild(downloadButton);
})();
