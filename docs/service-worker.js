if(!self.define){let e,s={};const r=(r,i)=>(r=new URL(r+".js",i).href,s[r]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=r,e.onload=s,document.head.appendChild(e)}else e=r,importScripts(r),s()})).then((()=>{let e=s[r];if(!e)throw new Error(`Module ${r} didn’t register its module`);return e})));self.define=(i,n)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let c={};const t=e=>r(e,o),l={module:{uri:o},exports:c,require:t};s[o]=Promise.all(i.map((e=>l[e]||t(e)))).then((e=>(n(...e),c)))}}define(["./workbox-6567b62a"],(function(e){"use strict";e.setCacheNameDetails({prefix:"app-lessons"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"css/app.1210c7a4.css",revision:null},{url:"custom-service-worker.js",revision:"e93ce82a978a2822f0bc69efbc68d7f8"},{url:"index.html",revision:"93371eceac5e448ac8a3b77f346313ba"},{url:"js/app.5fcb7622.js",revision:null},{url:"js/chunk-vendors.923143ad.js",revision:null},{url:"manifest.json",revision:"e3b712779c2266f93b420875c24a7697"},{url:"robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"}],{})}));
//# sourceMappingURL=service-worker.js.map