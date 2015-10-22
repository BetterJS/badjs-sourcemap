require('./index')({
	from: './example',
	to: '7.url.cn',
	match: '**/*.map',
	server: 'http://localhost/upload'
});