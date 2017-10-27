# Image Cropper [![Build Status](https://travis-ci.org/Kylar101/image-cropper.svg?branch=master)](https://travis-ci.org/Kylar101/image-cropper)
> A tool that helps users get the images that they want to CCQ Standard Sizes

## Project Owner

**Ben Lowbridge**

*benlowbridge@cancerqld.org.au*

## Getting Started

### What you need to know before running the code

- Good understanding of Javascript and jQuery
- Basic HTML & CSS knowledge

## Helpful Links
- [Bootstrap Native](http://thednp.github.io/bootstrap.native/)
- [Cropper Documentation](https://www.npmjs.com/package/cropper)
- [JQuery Documentation](https://api.jquery.com/)
- [BrowserWindow Documentation](https://electron.atom.io/docs/all/)
    - [WebContents Documentation](https://electron.atom.io/docs/api/web-contents/)

### Before running the code

Run the following the a console:
```shell
npm install
```

### How to run the code

Run the following in a console:

```shell
gulp serve
```

## How to test everything is working

* Upload an image
* Select several sizes
* Click "export"

If each image exports, it is working as expected.

## Deployment

Comment out the following lines:

`./src/index.html`

```html
<script>require('electron-connect').client.create()</script>
```
`./index.js`:
```javascript
var client = require('electron-connect').client;

mainWindow.webContents.openDevTools();

client.create(mainWindow);
```

Run the following in a console:

```shell
 gulp build
 npm run build
```


## Built using

- HTML5
- CSS
- Javascript
- Electron
