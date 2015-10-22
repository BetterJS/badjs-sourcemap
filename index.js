/* global __dirname, module, Buffer */
var fs = require('fs');
var Stream = require('stream');
var request = require('request');
var archiver = require('archiver');
var BufferHelper = require('bufferhelper');

var get_match = function(match) {
	if (Array.isArray(match)) {
		return match.slice(0);
	}
	if (typeof match === 'string') {
		return [match];
	}
	return ['**/*.map'];
};

// exports
module.exports = function(config) {

	var options = {
		src: {
			src: get_match(config.match),
			cwd: config.from,
			dest: config.to,
			expand: true
		},
		server: config.server
	};

	var archive = archiver('zip');

	archive.on('error', function(err) {
		throw err;
	});

	var output = new Stream;
	var output_buffer = new BufferHelper();
	output.writable = true;
	output.bytes = 0;

	output.write = function(buffer) {
		output.bytes += buffer.length;
		output_buffer.concat(buffer);
	};

	output.end = function(buffer) {
		buffer && output.write(buffer);
		output.writable = false;
		var data = output_buffer.toBuffer(buffer);

		request.post({
			url: options.server,
			formData: {
				zip: data
			}
		}, function optionalCallback(err, httpResponse, body) {
			if (err) {
				return console.error('upload failed:', err);
			}
			console.log('Upload successful!  Server responded with:', body);
		});
	};

	archive.pipe(output);

	archive.bulk([options.src]).finalize();
};