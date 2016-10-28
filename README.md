# PyxLog
Simple and pretty logging

## Install

```bash
$ npm i --save pyx-log # To save a dependency
$ npm i --save-dev pyx-log # To save as dev dependency
```

## Usage

```javascript
/**
 * Run this like so:
 * $ node example.js
 * Then run in debug mode like so:
 * $ DEBUG_MODE=true node example.js
 */

const PyxLog = require('./index');
const me = PyxLog.create('Me');
const world = PyxLog.create('World');

me.header('Initializing World Domination');
// ... code that starts world domination ...
me.log('Worlds: 1');
me.debug('Is world worth dominating?', true);
world.header('Initializing World Domination Defence Measures');
me.alert('WORLD IS RESISTING');
me.header('Initializing Offencive Measures');
me.beSilent();
for (let i = 0; i < 100; i += 1) {
	me.log('FIRE!');
}
me.beNormal();
world.log('...');
world.debug('Is world over?', '???');
```

## Output

![PyxLog Output](https://raw.githubusercontent.com/boxman0617/pyx-log/master/pyx-log-output.png)

## License
MIT © [Alan Tirado](https://www.npmjs.com/~boxman0617)
