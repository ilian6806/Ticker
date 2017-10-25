# Ticker
Simple interval sync tool

[![Maintainability](https://api.codeclimate.com/v1/badges/c12e5359e9cbe4c9b1ac/maintainability)](https://codeclimate.com/github/ilian6806/Ticker/maintainability) ![](https://img.shields.io/gemnasium/mathiasbynens/he.svg) ![](https://img.shields.io/npm/l/express.svg)

#### Usage:
```javascript
var ticker = new Ticker(1000); // This is the default value

var action = ticker.set(function () { /* do something */ }); // return action id

ticker.clear(action); // remove action by id and stop ticker if needed
ticker.clearAll();    // remove all actions and stop ticker

ticker.start(); // start ticker interval (called automatically with first set call)
ticker.tick();  // call all active actions on root object
ticker.stop();  // stop ticker interval (called automatically with last clear call and all clearAll calls)
```
