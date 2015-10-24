console.time('Publish time: ');
require('./index')({
	from: 'example',
	to: '7.url.cn',
	match: '**/*.map',
	server: 'http://localhost/upload'
}, function(data) {
	console.timeEnd('Publish time: ');
});