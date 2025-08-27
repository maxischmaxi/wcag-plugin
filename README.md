# WCAG Plugin for chrome

This is a Chrome extension that helps developers ensure their web applications meet the Web Content Accessibility Guidelines (WCAG).
The extension provides tools to analyze web pages for accessibility issues and offers suggestions for improvements.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/maxischmaxi/wcag-plugin.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" using the toggle in the top right corner.
4. Click on "Load unpacked" and select the cloned repository folder.
5. The WCAG Plugin should now appear in your list of extensions.

## Usage

1. Open your web application in Chrome.
2. Open the developer tools by right-clicking on the page and selecting "Inspect" or by pressing `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac).
3. Navigate to the "A11y Audit" tab in the developer tools.
4. Click on "Run Audit" to analyze the current page for accessibility issues.
5. Review the results and follow the suggestions in the `Console` tab to improve accessibility.
