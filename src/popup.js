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
  const copyStorage = {
    get: cb => chrome.storage.sync.get(["copy"], result => cb(result.copy)),
    set: (value, cb) => chrome.storage.sync.set({ copy: value }, () => cb())
  };

  const textInput = document.getElementById("mansion-poem-textinput");
  const nameInput = document.getElementById("mansion-poem-nameinput");
  const copyInput = document.getElementById("mansion-poem-copyinput");
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

    const copy = copyInput.value;
    copyStorage.set(copy, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, {
          type: "COPY_CHANGE",
          payload: { copy }
        });
      });
    });
  });

  function setupText(initialValue) {
    textInput.value = initialValue;
  }
  function setupName(initialValue) {
    nameInput.value = initialValue;
  }
  function setupCopy(initialValue) {
    copyInput.value = initialValue;
  }

  function restore() {
    textStorage.get(text => {
      if (!text) {
        textStorage.set("真に安らげる場所がここにはある", () => setupText(""));
      } else {
        setupText(text);
      }
    });
    nameStorage.get(name => {
      if (!name) {
        nameStorage.set("メゾン・ポエム", () => setupName(""));
      } else {
        setupName(name);
      }
    });
    copyStorage.get(copy => {
      if (!copy) {
        copyStorage.set("2020年2月30日モデルルームオープン", () =>
          setupCopy("")
        );
      } else {
        setupCopy(copy);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", restore);
})();
