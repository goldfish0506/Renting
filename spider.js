var request = require("request");
var cheerio = require("cheerio");
var Story = require('./models/story')

var FETCH_URLS = [
    "http://www.douban.com/group/beijingzufang/discussion",
    // "http://www.douban.com/group/fangzi/discussion",
    // "http://www.douban.com/group/262626/discussion",
    // "http://www.douban.com/group/276176/discussion",
    // "http://www.douban.com/group/26926/discussion",
    // "http://www.douban.com/group/sweethome/discussion",
    // "http://www.douban.com/group/242806/discussion",
    // "http://www.douban.com/group/257523/discussion",
    // "http://www.douban.com/group/279962/discussion",
    // "http://www.douban.com/group/334449/discussion"
];

var FETCH_PAGE_NUM = 15;
var CURRENT_PAGE = 0;
var CURRENT_GROUP = 0;
var RES = [];

var pageRequest = function (groupURL, callback) {

    if (CURRENT_PAGE >= FETCH_PAGE_NUM) {
        callback(true);
        return;
    }
    var url = groupURL + "?start" + CURRENT_PAGE * 25;
    var req = request(groupURL, {timeout: 10000, pool: false});
    req.setMaxListeners(50);
    req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
       .setHeader('accept', 'text/html,application/xhtml+xml');

    req.on('error', function(err) {
        console.log("error fetch page " + CURRENT_PAGE);
        CURRENT_PAGE++;
        pageRequest(groupURL, callback);
    });

    req.on('response', function(res) {

        res.on('data', function (chunk) {
            var data;
            data += chunk;
            // console.log(data);
            var $ = cheerio.load(data);
            var links = $("table.olt td.title a");
            links.map(function (i, link) {
                var obj = {
                    href: $(link).attr('href'),
                    title: $(link).attr('title'),
                    id: $(link).attr('href').split('/')[5]
                }
                RES.push(obj);
                // console.log(obj);
            });
        });
        res.on('end',function(){
            console.log("finished page " + CURRENT_PAGE);
            CURRENT_PAGE++;
            pageRequest(groupURL, callback);
        });
    });
};

var beginFetch = function () {

    if (CURRENT_GROUP >= FETCH_URLS.length) {
        console.log("finished all fetch task");
        CURRENT_PAGE = 0;
        saveAll(RES);
        return;
    } else {
        var group_url = FETCH_URLS[CURRENT_GROUP]
        console.log("start fetch " + group_url);
        pageRequest(group_url, function (finished){
            // 一个小组抓完之后启动另一个 清零CURRENT_PAGE
            if (finished) {
                CURRENT_PAGE = 0;
                CURRENT_GROUP++;
                beginFetch();
            };
        });
    }

};

var saveAll = function(dataArr) {

    // 也可使用此方法进行批量添加，但一旦出错，整批数据无效
    // Story.create(dataArr, function (error) {

    //     if (error) {
    //         console.log("DB saveAll error------>", error);
    //         return;
    //     }
    //     console.log(dataArr.length + " datas have saved!");
    // });

    var notCompleteLen = dataArr.length;
    var errLength = 0, saveLength = 0;
    dataArr.forEach(function (data, index) {

        var story = new Story({
            url: data.href,
            title: data.title,
            id: data.id
        }).save(function (err) {
            if (!--notCompleteLen) {
                console.log(errLength + " ignored!");
                console.log(saveLength + " saved!");
                showAll();
            }

            if (err) {
                errLength++;
                return;
            }

            saveLength++;
        });

    })
}

exports.fetch = function () {
    beginFetch();
};
