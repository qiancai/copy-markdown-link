# Copy Markdown Link

[Copy Markdown Link](https://chromewebstore.google.com/detail/copy-markdown-link/amekohfcgphhdbmnjklclhhmlklbpbnd) is a Chrome extension designed to help you quickly obtain the markdown link of any TiDB document or section with a single click. This tool is especially useful when you are writing or editing TiDB documents.

## Features

- Navigate to your desired URL and click the extension icon or use the shortcut key to get the markdown link immediately. The default shortcut is `Alt + Q` (`⌃ + Q` for macOS).

  ![Image1](/screenshots/click-extension-icon.png)
  ![Image2](/screenshots/paste-the-link.png)

- If your target URL is for TiDB variables, configuration items, and SQL statements, the extension automatically wraps the linked text in backticks (``).

  For example, when you are viewing <https://docs.pingcap.com/tidb/stable/system-variables#tidb_allow_mpp-new-in-v50> you will get ``[`tidb_allow_mpp`](/system-variables.md#tidb_allow_mpp-new-in-v50)`` from the extension.

- If your target URL is not TiDB documentation, the extension uses the page title as the linked text.

- You can change the shortcut from the browser's extension settings at `chrome://extensions/shortcuts`.