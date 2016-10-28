const PyxLog = require('../index');

require('chai').should();

function captureStream(stream) {
	const oldWrite = stream.write;
	let buf = '';
	stream.write = (chunk, encoding, cb) => {
		buf += chunk.toString();
		if ({}.hasOwnProperty.call(process.env, 'TEST_OUTPUT')) {
			oldWrite.apply(stream, [chunk, encoding, cb]);
		}
	};

	return {
		unhook: () => {
			stream.write = oldWrite;
		},
		captured: () => {
			return buf;
		},
		clear: () => {
			buf = '';
		}
	};
}

function featureTests(log, shouldOrNot, testFn) {
	return () => {
		let stream;
		describe('log', () => {
			describe('.header()', () => {
				it(`${shouldOrNot} console.log a header`, () => {
					const testHeader = 'hello world!';
					const output = `\u001b[1m===> hello world!\u001b[22m \u001b[1m\u001b[34m[${log._name}]\u001b[39m\u001b[22m\n`;
					stream = captureStream(process.stdout);
					log.header(testHeader);
					const buf = stream.captured();
					stream.unhook();
					testFn(buf, output);
				});
			});
			describe('.log()', () => {
				it(`${shouldOrNot} console.log a log message`, () => {
					const testMessage = 'hello world!';
					const output = `     ${testMessage} \u001b[1m\u001b[34m[${log._name}]\u001b[39m\u001b[22m\n`;
					stream = captureStream(process.stdout);
					log.log(testMessage);
					const buf = stream.captured();
					stream.unhook();
					testFn(buf, output);
				});
				it(`${shouldOrNot} be able to handle multiple strings`, () => {
					const messages = ['Hello', 'I', 'am', 'a', 'test!'];
					const output = `     ["Hello","I","am","a","test!"] \u001b[1m\u001b[34m[${log._name}]\u001b[39m\u001b[22m\n`;
					stream = captureStream(process.stdout);
					log.log(messages);
					const buf = stream.captured();
					stream.unhook();
					testFn(buf, output);
				});
				it(`${shouldOrNot} be able to handle multiple strings`, () => {
					const messages = ['Multiple types', { a: 'b', c: 123 }, 123456, true];
					const output = `\u001b[1m\u001b[34m[${log._name}]\u001b[39m\u001b[22m =>\n     Multiple types\n     {"a":"b","c":123}\n     123456\n     true\n\u001b[1m\u001b[34m[${log._name}]\u001b[39m\u001b[22m <=\n`;
					stream = captureStream(process.stdout);
					log.log(...messages);
					const buf = stream.captured();
					stream.unhook();
					testFn(buf, output);
				});
			});
			describe('.debug()', () => {
				afterEach(() => {
					delete process.env.DEBUG_MODE;
				});
				it('should NOT console.log a debug message if process.env.DEBUG_MODE is not set', () => {
					const testMessage = 'hello world!';
					stream = captureStream(process.stdout);
					log.debug(testMessage);
					const buf = stream.captured();
					stream.unhook();
					testFn(buf, null, true);
				});
				it('should console.log a debug message when process.env.DEBUG_MODE is set to something', () => {
					process.env.DEBUG_MODE = 'true';
					const testMessage = 'hello world!';
					const output = `\u001b[1m\u001b[33mD\u001b[39m\u001b[22m\u001b[1m\u001b[37m => ${testMessage}\u001b[39m\u001b[22m \u001b[1m\u001b[34m[${log._name}]\u001b[39m\u001b[22m\n`;
					stream = captureStream(process.stdout);
					log.debug(testMessage);
					const buf = stream.captured();
					stream.unhook();
					testFn(buf, output);
				});
				it(`should be able to handle multiple strings`, () => {
					process.env.DEBUG_MODE = 'true';
					const messages = ['Hello', 'I', 'am', 'a', 'test!'];
					const output = `\u001b[1m\u001b[33mD\u001b[39m\u001b[22m\u001b[1m\u001b[37m => Hello\u001b[39m\u001b[22m \u001b[1m\u001b[34m[${log._name}]\u001b[39m\u001b[22m\nI\nam\na\ntest!\n\u001b[1m\u001b[37m===# \u001b[39m\u001b[22m\u001b[1m\u001b[33mDEBUG\u001b[39m\u001b[22m \u001b[1m\u001b[34m[${log._name}]\u001b[39m\u001b[22m\n`;
					stream = captureStream(process.stdout);
					log.debug(...messages);
					const buf = stream.captured();
					stream.unhook();
					testFn(buf, output);
				});
				it('should be able to handle multiple types', () => {
					process.env.DEBUG_MODE = 'true';
					const messages = ['Multiple types', { a: 'b', c: 123 }, 123456, true];
					const output = `\u001b[1m\u001b[33mD\u001b[39m\u001b[22m\u001b[1m\u001b[37m => Multiple types\u001b[39m\u001b[22m \u001b[1m\u001b[34m[${log._name}]\u001b[39m\u001b[22m\n{ a: 'b', c: 123 }\n123456\ntrue\n\u001b[1m\u001b[37m===# \u001b[39m\u001b[22m\u001b[1m\u001b[33mDEBUG\u001b[39m\u001b[22m \u001b[1m\u001b[34m[${log._name}]\u001b[39m\u001b[22m\n`;
					stream = captureStream(process.stdout);
					log.debug(...messages);
					const buf = stream.captured();
					stream.unhook();
					testFn(buf, output);
				});
			});
			describe('.alert()', () => {
				it(`${shouldOrNot} console.log an alert message`, () => {
					const testMessage = 'ALERT! EVERYTHING IS ON FIRE!';
					const output = `\u001b[1m\u001b[31mA\u001b[39m\u001b[22m\u001b[1m\u001b[37m => ${testMessage} \u001b[39m\u001b[22m\u001b[1m\u001b[31m!!!!\u001b[39m\u001b[22m \u001b[1m\u001b[34m[${log._name}]\u001b[39m\u001b[22m\n`;
					stream = captureStream(process.stdout);
					log.alert(testMessage);
					const buf = stream.captured();
					stream.unhook();
					testFn(buf, output);
				});
			});
		});
	};
}

describe('# Health Tests', () => {
	describe('PyxLog.create()', () => {
		it('should generate a new instance of PyxLog with a name', () => {
			const testName = 'test';
			const log = PyxLog.create(testName);
			log.should.be.an('object');
			log.should.have.property('_name');
			log._name.should.equal(testName);
		});
	});
});
describe('# Feature Tests', featureTests(PyxLog.create('features'), 'should', (buf, output, not = false) => {
	if (not === false) {
		buf.should.not.be.empty;
		buf.should.equal(output);
	} else {
		buf.should.be.empty;
	}
}));
describe('# Feature Tests while programatically silent', () => {
	const log = PyxLog.create('features-silent');
	log.beNormal();
	log._mode.should.equal(1);
	log.beSilent();
	log._mode.should.equal(0);
	featureTests(log, 'should not', (buf, output, not = false) => {
		if (process.env.DEBUG_MODE === 'true') {
			if (not === false) {
				buf.should.not.be.empty;
				buf.should.equal(output);
			} else {
				buf.should.be.empty;
			}
		} else {
			buf.should.be.empty;
		}
	})();
});
