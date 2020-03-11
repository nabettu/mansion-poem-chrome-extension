"use strict";

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

const POEM_TEXT_ID = "mansion-poem-text";
const POEM_NAME_ID = "mansion-poem-name";
const POEM_IMG_ID = "mansion-poem-img";

const img = document.createElement("img");
img.setAttribute("id", POEM_IMG_ID);
img.setAttribute(
  "style",
  `position: fixed;
  bottom: 87px;
  width: 250px;
  height: 500px;
  right: calc(50% - 125px);
  pointer-events: none;`
);
img.setAttribute("src", "https://i.imgur.com/3svC537.png");
document.body.appendChild(img);

const text = document.createElement("p");
text.setAttribute("id", POEM_TEXT_ID);
text.setAttribute(
  "style",
  `position: fixed;
color: #fff;
-webkit-text-stroke: black 1px;
font-size: 62px;
text-shadow: #000 3px 3px 10px, #000 -3px -3px 10px;
top: 60px;
left: 12%;
width: 76%;
pointer-events: none;
font-family: serif;
font-weight: bold;
text-align: center;`
);
document.body.appendChild(text);

const name = document.createElement("p");
name.setAttribute("id", POEM_NAME_ID);
name.setAttribute(
  "style",
  `position: fixed;
color: #fff;
padding: 4px 20px;
background-color: #B60808;
border: solid #fff 2px;
font-size: 33px;
bottom: 160px;
left: calc(50% + 20px);
pointer-events: none;
font-family: serif;
font-weight: bold;
text-align: center;`
);
document.body.appendChild(name);

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request.payload);
  if (request.type === "TEXT_CHANGE") {
    document.getElementById(POEM_TEXT_ID).innerHTML = request.payload.text;
  }
  if (request.type === "NAME_CHANGE") {
    document.getElementById(POEM_NAME_ID).innerHTML = request.payload.name;
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});
