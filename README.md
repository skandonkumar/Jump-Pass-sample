This is a test project to illustrate the problem we are having with the Cortex scanner.

Setup:
1. Clone this repo
2. cd testScanner
3. npm install
4. npm run dev

Goal: make sure the camera is released if the user leaves the scanner page without clicking the Cancel button

Steps to reproduce the back bug:
1. Open a browser to localhost:3000. 
- Observe that the scanner is not running.
2. Click the "Scanner page" link 
- camera is now running
3. Click the browser back button.  This will trigger the scanner component 'return' function (line 25-33).
- Observe the crash in the browser developer console

- It appears that the the stopCamera logic is not handling an exception.
