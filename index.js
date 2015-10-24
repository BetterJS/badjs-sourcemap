/* global __dirname, module, Buffer */
var fs = require('fs');
var Stream = require('stream');
var request = require('request');
var archiver = require('archiver');
var BufferHelper = require('bufferhelper');

var format_match = function(match) {
	return Array.isArray(match) ? match.slice(0) :
		typeof match === 'string' ? [match] :
		['**/*.map'];
};

// exports
module.exports = function(config, callback) {
	var options = {
		src: {
			src: format_match(config.match),
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

	var output_buffer = new BufferHelper();
	var output = new Stream();
	output.writable = true;
	output.bytes = 0;

	output.write = function(buffer) {
		output.bytes += buffer.length;
		output_buffer.concat(buffer);
	};

	output.end = function(buffer) {
		output.writable = false;
		buffer && output.write(buffer);
		var data = output_buffer.toBuffer(buffer);

		request.post({
			url: options.server,
			formData: {
				zip: data
			}
		}, function(err, httpResponse, body) {
			err ? console.error('Upload failed:', err) :
				console.log('Upload successful! Server responded with:', body);
			typeof callback === 'function' && callback(err, httpResponse, body);
		});
	};

	archive.pipe(output);

	archive.bulk([options.src]).finalize();
};