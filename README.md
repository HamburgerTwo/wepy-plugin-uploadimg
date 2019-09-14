# wepy-plugin-uploadimg
>A plugin for wepy is used to upload images to sever and replace the link to url

## Install

```js
yarn add wepy-plugin-uploadimg --dev

config: {
  debugMode: false,
  delDistImg: true,
  limit: 1024,
  time: false,
  host: 'xxx',
  password: 'xxx',
  username: 'xxx',
  url: 'http://...',
  dirPath: '...',
}

useage 


import it and use nodejs use like


const UploadImg = require('./node_modules/wepy-plugin-uploadimg').default;

const uploadImgInstanse = new UploadImg({
  config: {
    ...
  },
});
uploadImgInstanse.UploadResoureFile();
