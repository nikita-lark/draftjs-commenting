# Draft.js Example App #

A rich text editor which is built on top of the [Draft.js](https://github.com/facebook/draft-js) editor and has commenting functionality.

## Demo

[https://lark.ee/draftjs-comments](https://lark.ee/draftjs-comments)

## Features
- It is possible to add comments to the editable content.
- It is possible to comment on any kind of text blocks (paragraphs, lists etc).
- Comments are removed automatically if the corresponding text is removed.
- It is possible to locate the commented text.
- Implements [Material Design](https://material.io/)
- The UI is responsive.

## Usage

Install the dependencies.
```
npm install
or
yarn install
```

Start the server.

```
npm run start
```

Go to the webpage.
```
open http://localhost:8080
```

## Dependencies

* [React](https://facebook.github.io/react/) 
* [Draft.js](https://draftjs.org/)
* [Material UI](http://www.material-ui.com/#/)
* [babel-loader](https://github.com/babel/babel-loader)
* [webpack](https://webpack.github.io/)
* [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
