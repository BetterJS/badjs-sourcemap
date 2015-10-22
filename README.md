# badjs-sourcemap
> 发布 sourcemap 文件到指定服务器 [参考](https://github.com/BetterJS/badjs-sourcemap-server)

### 配置说明
```
	npm install badjs-sourcemap
```
```javascript
	// example
	var publish = require('badjs-sourcemap');
	publish({
		from: './example', // 要发送的文件目录
		to: 'localhost', // 在 sourcemap 文件服务器上保存的目录
		match: '**/*.map', // 符合指定规则的文件
		server: 'http://localhost/upload' // sourcemap 文件服务器接受数据的接口
	});
```

> tips：功能上来说，支持简单文件备份（会生存一个 zip 包通过 http post 到服务器），并不局限于 sourcemap 文件

相关链接：https://github.com/BetterJS/badjs-sourcemap