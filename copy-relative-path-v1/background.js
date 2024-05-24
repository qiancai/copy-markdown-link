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
      console.log("The relative path is copied to clipboard:",text);
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

        // Log the element href and page url
        //console.log("Element Href:", elementHref);
        //console.log("Page URL:", pageUrl);
        // Log the relative path
        //console.log("Relative Path:", relativePath);

        copyToClipboard(relativePath);
      } else {
        console.error('Element not found');
      }
    }

    getAndCopyUrls();
  }