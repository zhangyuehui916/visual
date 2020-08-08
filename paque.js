let requests = require('requests')
let fs = require('fs')
let path = require('path')
const cheerio = require('cheerio')
    //getTimelineService1
const express = require('express')
const app = express();
//app.use(express.static('visual'))
app.get('/login', (req, res) => {
    // app.use(express.static('visual'))
    //console.log(req)
    requests('https://ncov.dxy.cn/ncovh5/view/pneumonia?from=timeline&isappinstalled=0')
        .on('data', function(chunk) {
            let window = {} //node.js中没有window对象，所以需要自定义一个
            const $ = cheerio.load(chunk) // 仿照jquery
            eval($("#getAreaStat").html()) // eval执行括号内的js语句，给自定义window增加getAreaStat属性

            fs.writeFile(path.resolve(__dirname, './visual/js', 'data.json'),
                JSON.stringify(window.getAreaStat) // 转换JSON格式
                , () => {
                    console.log("data.json保存成功")
                })
            eval($("#getListByCountryTypeService2true").html()) // eval执行括号内的js语句，给自定义window增加getAreaStat属性

            fs.writeFile(path.resolve(__dirname, './visual/js', 'data2.json'),
                JSON.stringify(window.getListByCountryTypeService2true) // 转换JSON格式
                , () => {
                    console.log("data2.json保存成功")
                })
            eval($("#getTimelineService1").html())
            fs.writeFile(path.resolve(__dirname, './visual/js', 'news.json'),
                JSON.stringify(window.getTimelineService1) // 转换JSON格式
                , () => {
                    console.log("data2.json保存成功")
                })
        })
        .on('end', function(err) {
            if (err) return console.log('connection closed due to errors', err);
            console.log('end');
        });
    res.send(index.html);

});
//app.use(express.static('visual'))
app.listen(8087, () => {
    console.log('服务器已开启......');
})