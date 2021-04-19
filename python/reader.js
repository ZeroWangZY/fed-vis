let fs = require('fs')
fs.readFile('data/odmap.json', 'utf8', function (err, data) {
    if (err) console.log(err);
    let test1 = JSON.parse(data); //读取的值
    console.log(test1)
});