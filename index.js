const chalk = require('chalk');

/**
 * Simple and pretty logging
 * @example
 * const me = require('pyx-me').create('MyLog');
 */
class PyxLog {
	constructor(name) {
		/**
		 * Name of the logger instance.
		 * @name PyxLog#_name
		 * @type {string}
		 * @instance
		 * @private
		 */
		this._name = name;
		/**
		 * Mode of logger. Determines if logger is silent or not.
		 * @name PyxLog#_mode
		 * @type {number}
		 * @instance
		 * @default 1
		 * @private
		 */
		this._mode = 1;
		/**
		 * The name of the logger wrapped with chalk.
		 * @name PyxLog#_prettyName
		 * @type {string}
		 * @instance
		 * @private
		 */
		this._prettyName = chalk.bold.blue(`[${this._name}]`);
	}

	/**
	 * This silences the logger; once this method is called,
	 * no more output will be coming from the logger until
	 * {@link beNormal} is called or the debug option is enabled
	 * @public
	 */
	beSilent() {
		this._mode = 0;
	}

	/**
	 * This is the default state of the logger; This
	 * will set the logger back to normal _mode
	 * if it was originally put to silent _mode by calling
	 * {@link beSilent}
	 * @public
	 */
	beNormal() {
		this._mode = 1;
	}

	/**
	 * Outputs a header me including the name of the logger.
	 * Good for breaks in logic or initializing messages.
	 * #note: Passed through the {@link _runThisInMode} method
	 * @param {string} msg - String that will be embedded in the header
	 * @public
	 */
	header(msg) {
		this._runThisInMode(() => {
			console.log(`${chalk.bold(`===> ${msg}`)} ${this._prettyName}`);
		});
	}

	/**
	 * Outputs regular me messages.
	 * Good for data logs or simple messages.
	 * #note: Passed through the {@link _runThisInMode} method
	 * @param {...*} msg - Array of values (string or other) that will be printed out on the screen
	 * @public
	 */
	log(...msg) {
		this._runThisInMode(() => {
			if (msg.length > 1) {
				console.log(`${this._prettyName} =>`);
				for (const m of msg) {
					console.log(`     ${(typeof m === 'string') ? m : JSON.stringify(m)}`);
				}
				console.log(`${this._prettyName} <=`);
			} else {
				const m = msg[0];
				console.log(`     ${(typeof m === 'string') ? m : JSON.stringify(m)} ${this._prettyName}`);
			}
		});
	}

	/**
	 * Outputs debug me messages.
	 * Good for debugging of code while coding or as extra me information to debug reoccurring bugs.
	 * #note: This method only prints out if the `DEBUG_MODE` env variable is set and ignores _mode
	 * @param {...*} msg - Array of values (string or other) that will be printed out on the screen
	 * @public
	 */
	debug(...msg) {
		if (typeof process.env.DEBUG_MODE !== 'undefined') {
			const mainMsg = msg.shift();
			console.log(`${chalk.bold.yellow('D')}${chalk.bold.white(` => ${mainMsg}`)} ${this._prettyName}`);
			if (msg.length > 0) {
				msg.forEach((m) => {
					console.log(m);
				});
				console.log(`${chalk.bold.white(`===# `)}${chalk.bold.yellow('DEBUG')} ${this._prettyName}`);
			}
		}
	}

	/**
	 * Outputs alert me messages.
	 * Good for errors or warnings.
	 * #note: Passed through the {@link _runThisInMode} method
	 * @param {string} msg - String that will be embedded in the alert
	 * @public
	 */
	alert(msg) {
		this._runThisInMode(() => {
			console.log(`${chalk.bold.red('A')}${chalk.bold.white(` => ${msg} `)}${chalk.bold.red('!!!!')} ${this._prettyName}`);
		});
	}

	/**
	 * Runs an action based on _mode
	 * @see _mode
	 * @param {function} actionCb - Function that will be called if on normal _mode (1)
	 * @private
	 */
	_runThisInMode(actionCb) {
		if (this._mode === 1) {
			actionCb();
		}
	}

	/**
	 * Static instance generator.
	 * Creates a new instance of the PyxLog logger.
	 * @param {string} name - Name of the logger.
	 * @return {PyxLog}
	 * @public
	 * @static
	 */
	static create(name) {
		return new PyxLog(name);
	}
}

module.exports = PyxLog;
