// ==UserScript==
// @name            YouTube Screenshot Button
// @namespace       https://criskkky.carrd.co/
// @version         1.0.0
// @description     Adds a button to take a screenshot of the current video frame on YouTube.
// @description:es  Añade un botón para tomar una captura de pantalla del fotograma actual del vídeo en YouTube.
// @description:pt  Adiciona um botão para tirar uma captura de tela do fotograma atual do vídeo no YouTube.
// @description:fr  Ajoute un bouton pour prendre une capture d'écran de l'image vidéo actuelle sur YouTube.
// @description:it  Aggiunge un pulsante per scattare uno screenshot del fotogramma video corrente su YouTube.
// @description:uk  Додає кнопку для знімка поточного кадру відео на YouTube.
// @description:ru  Добавляет кнопку для снятия скриншота текущего кадра видео на YouTube.
// @description:ro  Adaugă un buton pentru a face un screenshot al cadrului video curent de pe YouTube.

// @author          https://criskkky.carrd.co/
// @supportURL      https://github.com/criskkky/YT-SS-Button/issues
// @icon            https://raw.githubusercontent.com/criskkky/YT-SS-Button/main/static/icon.svg
// @copyright       https://github.com/criskkky/

// @grant           none
// @match           *://*.youtube.com/*
// ==/UserScript==

(function () {
    'use strict';

    let controls = null;

    function addScreenshotButton() {
        if (!controls) {
            controls = document.querySelector('.ytp-right-controls');
        }

        if (!controls || document.querySelector('.ytp-screenshot-button')) {
            return;
        }

        const screenshotButton = document.createElement('button');
        screenshotButton.className = 'ytp-button ytp-screenshot-button';
        screenshotButton.setAttribute('title', 'Take screenshot');
        screenshotButton.style.position = 'relative';
        screenshotButton.style.bottom = '12px';
        screenshotButton.style.width = '44px';

        const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute('viewBox', '0 0 487 487');
        svgElement.setAttribute('width', '24');
        svgElement.setAttribute('height', '24');
        svgElement.setAttribute('fill', '#ffffff');

        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', 'M308.1,277.95c0,35.7-28.9,64.6-64.6,64.6s-64.6-28.9-64.6-64.6s28.9-64.6,64.6-64.6S308.1,242.25,308.1,277.95z M440.3,116.05c25.8,0,46.7,20.9,46.7,46.7v122.4v103.8c0,27.5-22.3,49.8-49.8,49.8H49.8c-27.5,0-49.8-22.3-49.8-49.8v-103.9 v-122.3l0,0c0-25.8,20.9-46.7,46.7-46.7h93.4l4.4-18.6c6.7-28.8,32.4-49.2,62-49.2h74.1c29.6,0,55.3,20.4,62,49.2l4.3,18.6H440.3z M97.4,183.45c0-12.9-10.5-23.4-23.4-23.4c-13,0-23.5,10.5-23.5,23.4s10.5,23.4,23.4,23.4C86.9,206.95,97.4,196.45,97.4,183.45z M358.7,277.95c0-63.6-51.6-115.2-115.2-115.2s-115.2,51.6-115.2,115.2s51.6,115.2,115.2,115.2S358.7,341.55,358.7,277.95z');
        svgElement.appendChild(pathElement);
        screenshotButton.appendChild(svgElement);

        screenshotButton.addEventListener('click', () => {
            const video = document.querySelector('video');
            if (video) captureFrame(video);
        });

        controls.insertBefore(screenshotButton, controls.firstChild);
    }

    function captureFrame(video) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const videoTitle = document.title.replace(/\s-\sYouTube$/, '').trim();
        const filename = `${videoTitle}.png`;

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = filename;
        link.click();
    }

    function handleFullscreenChange() {
        const screenshotButton = document.querySelector('.ytp-screenshot-button');
        if (screenshotButton) {
            const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
            screenshotButton.style.bottom = isFullscreen ? '15px' : '12px';
        }
    }

    function initialize() {
        document.addEventListener('yt-navigate-finish', () => {
            if (window.location.href.includes('watch?v=')) {
                addScreenshotButton();
            }
        });

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        // Initial setup
        if (window.location.href.includes('watch?v=')) {
            addScreenshotButton();
        }
    }

    initialize();
})();
