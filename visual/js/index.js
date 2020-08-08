// $.ajax({
//     url: 'http://192.168.12.144:8087/getData',
//     type:'get',
//     success:function(res){

//     }
// })

//  头部时间
(function() {
    var showTime = document.querySelector('.showTime');

    function time(obj) {
        return obj < 10 ? '0' + obj : obj;
    }

    function timerun() {
        var mydata = new Date();

        var year = mydata.getFullYear();
        var month = mydata.getMonth() + 1;
        var day = mydata.getDate();
        var hour = mydata.getHours();
        var min = mydata.getMinutes();
        var sec = mydata.getSeconds();
        var wee = mydata.getDay();
        var week = '';
        switch (wee) {
            case 0:
                week = '星期日';
                break;
            case 1:
                week = '星期一';
                break;
            case 2:
                week = '星期二';
                break;
            case 3:
                week = '星期三';
                break;
            case 4:
                week = '星期四';
                break;
            case 5:
                week = '星期五';
                break;
            case 6:
                week = '星期六';
                break;
        }
        showTime.innerHTML = `现在是 ${year} 年 ${time(month)} 月 ${time(day)} 日 ${time(hour)}:${time(min)}:${time(sec)}  ${week}`;

    };
    setInterval(timerun, 1000);

})();
// 死亡，确诊总人数
(function() {
    var le = document.querySelector('.le');
    var right = document.querySelector('.rig');
    // console.log(le, right);
    var xhr = new XMLHttpRequest();
    xhr.open('get', './js/data2.json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var backData = JSON.parse(xhr.response);
            // console.log(backData)
            var num = 0;
            var die = 0;
            for (var i of backData) {
                // console.log(i);
                num += i.confirmedCount;
                die += i.deadCount;
            }
            le.innerHTML = num;
            right.innerHTML = die;

        }
    }
    xhr.send();

})();


// 第一个图形
(function() {

    var myChart = echarts.init(document.getElementById('panel1'));
    var dataAxis = [];
    var data = [];
    var xhr = new XMLHttpRequest();
    xhr.open('get', './js/data.json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var backData = JSON.parse(xhr.response);
            //console.log(backData)
            for (var i of backData) {
                // console.log(i.provinceName)
                if (i.provinceName != '湖北省' && i.provinceName != '香港') {
                    dataAxis.push(i.provinceName);
                    data.push(i.confirmedCount)
                }
            }
            fn1()
        }
    }
    xhr.send();

    function fn1() {
        var yMax = Math.max(...data);
        // console.log(data, 'kkk')
        var dataShadow = [];
        for (var i = 0; i < data.length; i++) {
            dataShadow.push(yMax);
        }
        option = {
            title: {
                text: '中国疫情数据',
                // 标题居中
                left: 'center',
                textStyle: {
                    //标题颜色
                    color: '#ffffff'
                },
                // subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
            },
            tooltip: {
                // trigger:'item';
                show: true
            },
            grid: {
                left: '0%',
                right: '10px',
                top: '15%',
                bottom: '4%',
                containLabel: true
            },
            xAxis: {
                data: dataAxis,
                axisLabel: {
                    inside: true,
                    textStyle: {
                        color: '#fff'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                z: 20
            },
            yAxis: {
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#999'
                    }
                }
            },
            dataZoom: [{
                type: 'inside'
            }],
            series: [{ // For shadow
                    type: 'bar',
                    itemStyle: {
                        color: 'rgba(0,0,0,0.05)'
                    },
                    barGap: '-100%',
                    barCategoryGap: '40%',
                    data: dataShadow,
                    animation: false
                },
                {
                    type: 'bar',
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, [
                                { offset: 0, color: '#83bff6' },
                                { offset: 0.5, color: '#188df0' },
                                { offset: 1, color: '#188df0' }
                            ]
                        )
                    },
                    emphasis: {
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1, [
                                    { offset: 0, color: '#2378f7' },
                                    { offset: 0.7, color: '#2378f7' },
                                    { offset: 1, color: '#83bff6' }
                                ]
                            )
                        }
                    },
                    data: data
                }
            ]
        };

        // Enable data zoom when user click bar.
        var zoomSize = 6;
        myChart.on('click', function(params) {
            console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
            myChart.dispatchAction({
                type: 'dataZoom',
                startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
            });
        });
        myChart.setOption(option);
        window.addEventListener("resize", function() {
            myChart.resize();
        });
    }

})();

//第二个图 //河南省
(function() {
    var myChart = echarts.init(document.getElementById('panel2'));

    var xhr = new XMLHttpRequest();
    xhr.open('get', './js/data.json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var backData = JSON.parse(xhr.response);
            // console.log(backData)
            var arr1 = []; // 城市名
            var arr2 = []; // 累计确诊人数
            for (var i of backData) {
                if (i.provinceName == '河南省') {
                    // console.log(i.cities);
                    for (var j of i.cities) {
                        // console.log(j);
                        arr1.push(j.cityName);
                        arr2.push(j.confirmedCount)
                    }
                }
            };
            //console.log(arr1, arr2);
            fn(arr1, arr2)
        }
    }
    xhr.send();

    function fn(arr1, arr2) {

        option = {
            title: {
                text: '河南省新冠肺炎疫情数据',
                left: 'center',
                textStyle: {
                    //标题颜色
                    color: '#ffffff'
                },
            },
            color: ['#2f89cf'],
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '0%',
                right: '10px',
                right: '0%',
                bottom: '4%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: arr1,
                axisTick: {
                    alignWithLabel: true
                },
                //修改x周的颜色
                axisLabel: {
                    color: '#ffffff',
                    fontSize: "16"
                },
                //不显示x州的样式
                axisLine: {
                    show: false
                }
            }],
            yAxis: [{
                    type: 'value',
                    axisLabel: {
                        color: '#ffffff',
                        fontSize: "16"
                    },
                    axisLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,.1)",
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,.1)"
                        }
                    }
                },

            ],
            series: [{
                name: '确诊人数',
                type: 'bar',
                // 修改柱子宽度
                barWidth: '35%',
                data: arr2,
                itemStyle: {
                    // 修改柱子圆角
                    barBorderRadius: 5
                }
            }]
        };



        myChart.setOption(option);
        window.addEventListener("resize", function() {
            myChart.resize();
        });
    }


})();

//第三个图
(function() {
    var myChart = echarts.init(document.querySelector('#panel3'));
    option = {
        title: {
            text: '全国新冠肺炎新增确诊病例',
            left: 'center',
            textStyle: {
                //标题颜色
                color: '#ffffff'
            },
        },
        xAxis: {
            type: 'category',
            data: ['07-21', '07-24', '07-27', '07-30', '08-02'],
            axisLabel: {
                color: '#ffffff',
                fontSize: "16"
            },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#ffffff',
                fontSize: "16"
            },
        },
        series: [{
            data: [60, 150, 140, 220, 150],
            type: 'line'
        }]
    };

    myChart.setOption(option);
    window.addEventListener("resize", function() {
        myChart.resize();
    });
})();
//第五一个
(function() {
    var myChart = echarts.init(document.getElementById('panel4'));
    var xhr = new XMLHttpRequest();
    xhr.open('get', './js/data2.json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var backData = JSON.parse(xhr.response);
            // console.log(backData[0]);
            var arr1 = []; //国家
            var arr2 = []; // 确诊人数
            var arr3 = []; // 死亡人数
            var arr4 = []; //病死率
            for (var i = 0; i < 10; i++) {
                // console.log(backData[i]);
                arr1.push(backData[i].provinceName)
                arr2.push(backData[i].confirmedCount)
                arr3.push(backData[i].deadCount);
                arr4.push(backData[i].deadRate);
            }
            fn2(arr1, arr2, arr3, arr4);
        }
    }
    xhr.send();

    function fn2(arr1, arr2, arr3, arr4) {
        // console.log(arr1, arr2, arr3, arr4);
        var data = [
            [arr2[0], arr3[0], arr4[0]],
            [arr2[1], arr3[1], arr4[1]],
            [arr2[2], arr3[2], arr4[2]],
            [arr2[3], arr3[3], arr4[3]],
            [arr2[4], arr3[4], arr4[4]],
            [arr2[5], arr3[5], arr4[5]],
            [arr2[6], arr3[6], arr4[6]],
            [arr2[7], arr3[7], arr4[7]],
            [arr2[8], arr3[8], arr4[8]],
            [arr2[9], arr3[9], arr4[9]]

        ];
        var cities = arr1;
        var barHeight = 50;
        option = {
            title: {
                text: '全球疫情数据',
                textStyle: {
                    //标题颜色
                    color: '#ffffff'
                },
            },
            // legend: {
            //     show: true,
            //     data: ['确诊人数', '死亡人数'],
            // },
            grid: {
                top: 100
            },
            angleAxis: {
                type: 'category',
                data: cities,
                // 坐标轴线颜色
                axisLine: {
                    lineStyle: {
                        color: '#ffffff'
                    }
                }
            },
            tooltip: {
                show: true,
                // 提示框浮层内容格式器
                formatter: function(params) {
                    var id = params.dataIndex;
                    return cities[id] + '<br>确诊：' + data[id][0] + '<br>死亡：' + data[id][1] + '<br>致死率：' + data[id][2] + '%';
                }
            },
            radiusAxis: {
                axisLine: {
                    lineStyle: {
                        color: 'pink'
                    }
                }
            },
            polar: {},
            series: [{
                    type: 'bar',
                    itemStyle: {
                        color: 'red'
                    },
                    data: data.map(function(d) {
                        return d[0];
                    }),
                    coordinateSystem: 'polar',
                    stack: '',
                    silent: true
                },
                {
                    type: 'bar',
                    itemStyle: {
                        color: 'red'
                    },
                    data: data.map(function(d) {
                        return d[1] - d[0];
                    }),
                    coordinateSystem: 'polar',
                    //name: '价格范围',
                    stack: '',
                    silent: true
                },
                {
                    type: 'bar',
                    itemStyle: {
                        color: 'red'
                    },
                    data: data.map(function(d) {
                        return d[2] - barHeight;
                    }),
                    coordinateSystem: 'polar',
                    stack: '',
                    silent: true,
                    z: 10
                },
                {
                    type: 'bar',
                    itemStyle: {
                        color: 'red'
                    },
                    data: data.map(function(d) {
                        return barHeight * 2;
                    }),
                    coordinateSystem: 'polar',
                    // name: '均值',
                    stack: '',
                    barGap: '-100%',
                    z: 10
                }
            ]
        };


        myChart.setOption(option);
        window.addEventListener("resize", function() {
            myChart.resize();
        });
    }



})();
//最后一个
(function() {
    var myChart = echarts.init(document.querySelector('#last'));

    var xhr = new XMLHttpRequest();
    xhr.open('get', './js/data2.json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var backData = JSON.parse(xhr.response);
            // console.log(backData)
            var northAmerica = 0; //北美洲确诊人数
            var southAmerica = 0; //南美洲确诊人数
            var Asian = 0; //亚洲确诊人数
            var africa = 0; //非洲确诊人数
            var europe = 0; //欧洲确诊人数
            var oceania = 0; //大洋洲
            for (var i in backData) {
                if (backData[i].continents == "北美洲") {
                    // console.log(backData[i]);
                    northAmerica += backData[i].deadCount;

                };
                if (backData[i].continents == "南美洲") {
                    southAmerica += backData[i].deadCount;

                };
                if (backData[i].continents == "亚洲") {
                    Asian += backData[i].deadCount;

                };
                if (backData[i].continents == "非洲") {
                    africa += backData[i].deadCount;

                };
                if (backData[i].continents == "欧洲") {
                    europe += backData[i].deadCount;

                };
                if (backData[i].continents == "大洋洲") {
                    oceania += backData[i].deadCount;

                };

            }
            fn(northAmerica, southAmerica, Asian, africa, europe, oceania);
        }
    }
    xhr.send();

    function fn(northAmerica, southAmerica, Asian, africa, europe, oceania) {
        var option = {
            color: [
                "#006cff",
                "#60cda0",
                "#ed8884",
                "#ff9f7f",
                "#0096ff",
                "#9fe6b8",
                "#32c5e9",
                "#1d9dff"
            ],
            title: {
                text: '全球各大洲死亡人数统计',
                left: 'center',
                textStyle: {
                    color: '#ffffff'
                }
            },
            tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                bottom: "0%",
                itemWidth: 10,
                itemHeight: 10,
                textStyle: {
                    color: "rgba(255,255,255,.5)",
                    fontSize: "12"
                }
            },
            series: [{
                name: "地区分布",
                type: "pie",
                radius: ["10%", "70%"],
                center: ["50%", "50%"],
                roseType: "radius",
                // 图形的文字标签
                label: {
                    fontSize: 10
                },
                // 链接图形和文字的线条
                labelLine: {
                    // length 链接图形的线条
                    length: 6,
                    // length2 链接文字的线条
                    length2: 8
                },

                data: [
                    { value: northAmerica, name: "北美洲" },
                    { value: southAmerica, name: "南美洲" },
                    { value: Asian, name: "亚洲" },
                    { value: africa, name: "非洲" },
                    { value: europe, name: "欧洲" },
                    { value: oceania, name: "大洋洲" }
                ]
            }]
        };

        myChart.setOption(option);
        window.addEventListener("resize", function() {
            myChart.resize();
        });
    }

})();





(function() {
    var myChart = echarts.init(document.getElementById('charts'));

    var xhr = new XMLHttpRequest();
    xhr.open('get', './js/data.json');
    xhr.onreadystatechange = function() {

        if (xhr.readyState == 4 && xhr.status == 200) {
            var arr = [];
            var backData = JSON.parse(xhr.response);
            //console.log(backData)
            for (var i of backData) {
                var obj = {};
                obj.name = i.provinceShortName;
                obj.value = i.currentConfirmedCount;
                // obj.die = i.confirmedCount;
                arr.push(obj);
            }
            //  console.log(arr);
            fn(arr)
        }
    }
    xhr.send();

    function fn(arr) {
        window.dataList = arr;
        option = {
            tooltip: {
                show: true,
                //triggerOn: "click",
                formatter: function(e, t, n) {
                    return .5 == e.value ? e.name + "：有疑似病例" : e.seriesName + "<br />" + e.name + "：" + e.value;
                }
            },
            visualMap: {
                min: 0,
                max: 1000,
                left: 26,
                bottom: 40,
                showLabel: !0,
                text: ["高", "低"],
                textStyle: {
                    color: '#fff'
                },
                pieces: [{
                    gt: 500,
                    label: "> 200 人",
                    color: "#7f1100"
                }, {
                    gte: 10,
                    lte: 100,
                    label: "10 - 200 人",
                    color: "#ff5428"
                }, {
                    gte: 1,
                    lt: 10,
                    label: "1 - 9 人",
                    color: "#ff8c71"
                }, {
                    gt: 0,
                    lt: 1,
                    label: "疑似",
                    color: "#ffd768"
                }, {
                    value: 0,
                    color: "#ffffff"
                }],
                show: !0
            },
            geo: {
                map: "china",
                roam: !1,
                scaleLimit: {
                    min: 1,
                    max: 2
                },
                zoom: 1.23,
                top: 120,
                label: {
                    normal: {
                        show: !0,
                        fontSize: "14",
                        color: "rgba(0,0,0,0.7)"
                    }
                },
                itemStyle: {
                    normal: {
                        //shadowBlur: 50,
                        //shadowColor: 'rgba(0, 0, 0, 0.2)',
                        borderColor: "rgba(0, 0, 0, 0.2)"
                    },
                    emphasis: {

                        areaColor: "#f2d5ad",
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        borderWidth: 0
                    }
                }
            },
            series: [{
                name: "现存确诊病例",
                type: "map",
                geoIndex: 0,
                data: window.dataList
            }]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function() {
            myChart.resize();
        });
    }
})();