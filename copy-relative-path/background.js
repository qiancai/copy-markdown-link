chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: executeScriptInPage
    });
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
    }
  
    function getTitle(decodedHashFragment) {
      if (decodedHashFragment === "") {
        // Get the title from the h1 element
        const h1Element = document.querySelector('h1');
        return h1Element ? h1Element.textContent.trim() : "No Title Found";
      } else {
        // Get the title from the corresponding heading element (h2, h3, etc.)
        const headingElement = document.querySelector(decodedHashFragment);
        if (headingElement) {
          // Clone the heading element to avoid modifying the original element
          const clonedElement = headingElement.cloneNode(true);
  
          // Remove the span with the class 'version-mark'
          const versionMarkSpan = clonedElement.querySelector('span.version-mark');
          if (versionMarkSpan) {
            versionMarkSpan.remove();
          }
  
          // Get the text content and trim any trailing whitespace
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
  
      // Find the first element with the specific class
      const element = document.querySelector('a.MuiTypography-root.MuiTypography-body1.css-1pgvqdl');
      if (element) {
        const elementHref = element.href;
        const elementUrl = new URL(elementHref);
        const relativePath = elementUrl.pathname.replace(/^\/pingcap\/docs(-cn)?\/blob\/[^\/]+/, '') + (decodedHashFragment || '');
  
        // Get the title based on the decoded hash fragment
        let pageTitle = getTitle(decodedHashFragment);
  
        // List of specific files to check against
        const specialFiles = ["tidb-configuration-file.md", "tikv-configuration-file", "pd-configuration-file.md", "system-variables.md","status-variables.md"];
  
        // Check if the conditions are met for wrapping the title with backticks
        if (specialFiles.some(file => elementUrl.href.includes(file)) && !pageTitle.includes(' ')) {
          pageTitle = `\`${pageTitle}\``
        }
  
        // Create the markdown link
        const markdownLink = `[${pageTitle}](${relativePath})`;
  
        // Log the element href and page url
        // console.log("Element Href:", elementHref);
        // console.log("Page URL:", pageUrl);
        // Log the markdown link
        // console.log("Markdown Link:", markdownLink);
  
        copyToClipboard(markdownLink);
      } else {
        console.error('Element not found');
      }
    }
  
    getAndCopyUrls();
  }
  