chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: executeScriptInPage
    });
  });

 chrome.commands.onCommand.addListener((command) => {
    if (command === "copy-markdown-link") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: executeScriptInPage
        });
      });
    }
  });

  function executeScriptInPage() {
    // Function to copy text to the clipboard
    function copyToClipboard(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      console.log("Copied to clipboard:", text);
      chrome.runtime.sendMessage({ action: "showCopiedNotification" });
    }

    function getTitle(decodedHashFragment) {
      if (decodedHashFragment === "") {
        // Get the title from the h1 element
        const h1Element = document.querySelector('h1');
        return h1Element ? h1Element.textContent.trim() : "No Title Found";
      } else {
        // Get the title from the corresponding heading element (h2, h3, etc.)
        const headingElement = document.querySelector(`h1${decodedHashFragment}, h2${decodedHashFragment}, h3${decodedHashFragment}, h4${decodedHashFragment}, h5${decodedHashFragment}, h6${decodedHashFragment}`);
        if (headingElement) {
          // Clone the heading element to avoid modifying the original element
          const clonedElement = headingElement.cloneNode(true);

          // Remove the span with the class 'version-mark'
          const versionMarkSpan = clonedElement.querySelector('span.version-mark');
          if (versionMarkSpan) {
            versionMarkSpan.remove();
          }

          return clonedElement.textContent.trim();
        }
        return "No Title Found";
      }
    }

    function getAndCopyUrls() {
      // Extract the URL of the current page
      const pageUrl = window.location.href;
      const pageUrlObj = new URL(pageUrl);
      const decodedHashFragment = decodeURIComponent(pageUrlObj.hash);

      let element;

      if (!pageUrl.includes("docs.pingcap.com/tidbcloud")) {
        const element = document.querySelector('#gatsby-focus-wrapper > div > div > main > div > div.css-1q5cbag > div.MuiBox-root.css-tirkga > div > div > a:nth-child(2)');
      } else {
        const element = document.querySelector('#gatsby-focus-wrapper > div > div > main > div > div.css-1q5cbag > div.MuiBox-root.css-tirkga > div > div > a:nth-child(1)');
      }
      if (element) {
        const elementHref = element.getAttribute('href');
        //console.log(elementHref);
        const elementUrl = new URL(elementHref);

        let relativePath;

        switch (true) {
            case elementHref.includes("github.com/pingcap/docs-tidb-operator"):
                relativePath = elementHref.match(/File:%20\[([^\]]+)\]/);
                if (relativePath) {
                    relativePath = relativePath[1];
                    // Delete the content before the third /
                    const parts = relativePath.split('/');
                    if (parts.length >= 4) {
                        relativePath = '/' + parts.slice(3).join('/');
                    }
                }
                break;
            case elementHref.includes("github.com/pingcap/docs"):
                relativePath = elementHref.match(/File:%20\[([^\]]+)\]/);
                if (relativePath) {
                    // Delete the content before the second /
                    const parts = relativePath[1].split('/');
                    if (parts.length >= 3) {
                        relativePath = '/' + parts.slice(2).join('/');
                    }
                }
                break;
            default:
                const pageTitle = document.title;
                const markdownLink = `[${pageTitle}](${pageUrl})`;
                copyToClipboard(markdownLink);
                return;
        }

        let pageTitle = getTitle(decodedHashFragment);

        const specialFiles = ["tidb-configuration-file.md", "tikv-configuration-file", "pd-configuration-file.md", "system-variables.md","status-variables.md","string-functions.md","tiproxy-configuration.md","tidb-lightning-configuration.md","tiflash-configuration.md","dm-master-configuration-file.md","dm-source-configuration-file.md", "dm-worker-configuration-file.md","task-configuration-file-full.md", "ticdc-changefeed-config.md", "ticdc-server-config.md"];
        const sqlStatementsPath = "/sql-statements/";

        // Check if the conditions are met for wrapping the title with backticks
        const isSpecialFile = specialFiles.some(file => elementUrl.href.includes(file));
        const isSqlStatementFile = elementUrl.pathname.includes(sqlStatementsPath);
        const isTitleSingleWord = !pageTitle.includes(' ');
        const isNotChinese = !/[\u4E00-\u9FFF]/.test(pageTitle);

        if ((isSpecialFile && isTitleSingleWord && isNotChinese) || (isSqlStatementFile && decodedHashFragment === "")) {
          pageTitle = `\`${pageTitle}\``;
        }

        // Create a markdown link with the anchor point
        const markdownLink = `[${pageTitle}](${relativePath}${decodedHashFragment || ''})`;

        // Log the element href and page url
        // console.log("Element Href:", elementHref);
        // console.log("Page URL:", pageUrl);
        // Log the markdown link
        // console.log("Markdown Link:", markdownLink);

        copyToClipboard(markdownLink);
      } else {
        const pageTitle = document.title;
        const markdownLink = `[${pageTitle}](${pageUrl})`;
        copyToClipboard(markdownLink);
      }
    }

    getAndCopyUrls();
  }

//Show a green marker after the markdown link is copied.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "showCopiedNotification") {
        chrome.action.setBadgeText({ text: " " });
        chrome.action.setBadgeBackgroundColor({ color: "#4caf50" });

        setTimeout(() => {
            chrome.action.setBadgeText({ text: "" });
        }, 500);  // The marker disappears after 0.5 second.
    }
});