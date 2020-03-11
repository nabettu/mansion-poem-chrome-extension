"use strict";

import "./popup.css";

(function() {
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions
  const textStorage = {
    get: cb => chrome.storage.sync.get(["text"], result => cb(result.text)),
    set: (value, cb) => chrome.storage.sync.set({ text: value }, () => cb())
  };
  const nameStorage = {
    get: cb => chrome.storage.sync.get(["name"], result => cb(result.name)),
    set: (value, cb) => chrome.storage.sync.set({ name: value }, () => cb())
  };

  const textInput = document.getElementById("mansion-poem-textinput");
  const nameInput = document.getElementById("mansion-poem-nameinput");
  const submitButton = document.getElementById("mansion-poem-submit");

  submitButton.addEventListener("click", () => {
    const text = textInput.value;
    textStorage.set(text, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, {
          type: "TEXT_CHANGE",
          payload: { text }
        });
      });
    });

    const name = nameInput.value;
    nameStorage.set(name, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, {
          type: "NAME_CHANGE",
          payload: { name }
        });
      });
    });
  });

  function setupText(initialValue = "ポエムポエム") {
    textInput.value = initialValue;
  }
  function setupName(initialValue = "メゾン・ポエム") {
    nameInput.value = initialValue;
  }

  function restore() {
    textStorage.get(text => {
      if (typeof text === "undefined") {
        textStorage.set("", () => setupText(""));
      } else {
        setupText(text);
      }
    });
    nameStorage.get(name => {
      if (typeof name === "undefined") {
        nameStorage.set("", () => setupName(""));
      } else {
        setupName(name);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", restore);
})();
