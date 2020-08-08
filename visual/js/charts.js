var ch = document.getElementById('#charts');
var news = document.querySelector('.news')
var xhr = new XMLHttpRequest();
xhr.open('get', './js/news.json');
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        var backData = JSON.parse(xhr.response);
        //  console.log(backData);
        var obj = { data: backData }
        var resHtml = template('temp-li', obj);
        // console.log(resHtml);
        news.innerHTML = resHtml;
        news.innerHTML += resHtml;
        //  console.log(news.scrollHeight, news.offsetHeight, news.scrollTop);
        var newsScrollHeight = news.scrollHeight;

        setInterval(function() {
            var newsScrollTop = news.scrollTop;
            if (newsScrollTop >= newsScrollHeight * 0.5) {
                news.scrollTop = 0;
            }
            // console.log(newsScrollTop, newsScrollHeight);

            news.scrollTop += 2;

        }, 100)
    }
}
xhr.send();