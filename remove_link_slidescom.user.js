// ==UserScript==
// @name         Slides . com remove link from free plan
// @namespace    https://slides.com/
// @version      0.1
// @description
// @match        https://slides.com/*
// @author       gjanssens
// @license      MIT; http://opensource.org/licenses/MIT
// @copyright
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  document.querySelector('.button.cta.made-with-slides').style.display = 'none';
})();