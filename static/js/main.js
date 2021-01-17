/* echart start */

var dom = hi("#container");
var myChart = echarts.init(dom);
var app = {};
option = null;

var cpu = [];
var io = [];
var mem_user = [];
var mem_sys = [];
var mem_free = [];
var mdate = [];

option = {
    title: {
        text: '',
        subtext: '',
        x: 'center',
        y: '0%'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: true,
            type: 'cross'
        }
    },
    legend: {
        data: ['CPU', 'IO', '内存(空闲)', '内存(系统)', '内存(用户)'],
        left: 10,
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
        }
    },
    axisPointer: {
        link: {
            xAxisIndex: 'all'
        }
    },
    dataZoom: [{
        show: true,
        realtime: true,
        start: 0,
        end: 100,
        xAxisIndex: [0, 1, 2]
    },
    {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 100,
        xAxisIndex: [0, 1, 2]
    },
    {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 100,
        xAxisIndex: [0, 1, 2]
    }
    ],
    grid: [{
        left: 50,
        right: 50,
        height: '21%'
    }, {
        left: 50,
        right: 50,
        top: '38%',
        height: '21%'
    }, {
        left: 50,
        right: 50,
        top: '68%',
        height: '21%'
    }],
    xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisLine: {
            onZero: true
        },
        data: mdate
    },
    {
        gridIndex: 1,
        type: 'category',
        boundaryGap: false,
        axisLine: {
            onZero: true
        },
        data: mdate
    },
    {
        gridIndex: 2,
        type: 'category',
        boundaryGap: false,
        axisLine: {
            onZero: true
        },
        data: mdate
    }
    ],
    yAxis: [{
        name: 'CPU(%)',
        type: 'value'
    },
    {
        gridIndex: 1,
        name: 'IO(/sec)',
        type: 'value',
        inverse: false
    },
    {
        gridIndex: 2,
        name: 'MEM(%)',
        type: 'value',
        inverse: false
    }
    ],
    series: [{
        name: 'CPU',
        type: 'line',
        symbolSize: 8,
        hoverAnimation: true,
        markPoint: {
            data: [{
                type: 'max',
                name: '最大值'
            }]
        },
        markLine: {
            data: [{
                type: 'average',
                name: '平均值'
            }]
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#c2353155'
                }, {
                    offset: 0.34,
                    color: '#c2353133'
                }, {
                    offset: 1,
                    color: '#c2353100'
                }])
            }
        },
        data: cpu
    },
    {
        name: 'IO',
        type: 'line',
        xAxisIndex: 1,
        yAxisIndex: 1,
        symbolSize: 8,
        hoverAnimation: true,
        markPoint: {
            data: [{
                type: 'max',
                name: '最大值'
            }]
        },
        markLine: {
            data: [{
                type: 'average',
                name: '平均值'
            }]
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#2f455455'
                }, {
                    offset: 0.34,
                    color: '#2f455433'
                }, {
                    offset: 1,
                    color: '#2f455400'
                }])
            }
        },
        data: io
    },
    {
        name: '内存(空闲)',
        type: 'line',
        xAxisIndex: 2,
        yAxisIndex: 2,
        symbolSize: 8,
        hoverAnimation: true,
        markPoint: {
            data: [{
                type: 'min',
                name: '最小值'
            }]
        },
        markLine: {
            data: [{
                type: 'average',
                name: '平均值'
            }]
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#61a0a855'
                }, {
                    offset: 0.34,
                    color: '#61a0a833'
                }, {
                    offset: 1,
                    color: '#61a0a800'
                }])
            }
        },
        data: mem_free
    },
    {
        name: '内存(系统)',
        type: 'line',
        xAxisIndex: 2,
        yAxisIndex: 2,
        symbolSize: 8,
        hoverAnimation: true,
        markPoint: {
            data: [{
                type: 'max',
                name: '最大值'
            }]
        },
        markLine: {
            data: [{
                type: 'average',
                name: '平均值'
            }]
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#d4826555'
                }, {
                    offset: 0.34,
                    color: '#d4826533'
                }, {
                    offset: 1,
                    color: '#d4826500'
                }])
            }
        },
        data: mem_sys
    },
    {
        name: '内存(用户)',
        type: 'line',
        xAxisIndex: 2,
        yAxisIndex: 2,
        symbolSize: 8,
        hoverAnimation: true,
        markPoint: {
            data: [{
                type: 'max',
                name: '最大值'
            }]
        },
        markLine: {
            data: [{
                type: 'average',
                name: '平均值'
            }]
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#91c7ae55'
                }, {
                    offset: 0.34,
                    color: '#91c7ae33'
                }, {
                    offset: 1,
                    color: '#91c7ae00'
                }])
            }
        },
        data: mem_user
    }
    ]
};;

var init = hi('#recent').value;
var hostname = init.split(':')[0];
var co_date = init.split(':')[1];

var aitem = hi('.aitem');
for (var i = 0; i < aitem.length; i++) {
    if (aitem[i].getAttribute('item-data') == init) {
        aitem[i].parentNode.classList.add('highlight');
        var ggf = aitem[i].parentNode.parentNode.parentNode;
        ggf.classList.remove('hide');
        ggf.parentNode.setAttribute('tag', 'unfold');

    }
}

ajax({
    type: "post",
    url: "/data",
    data: { 'hostname': hostname, 'co_date': co_date },
    success: function (res) {
        res = JSON.parse(res)
        for (var i = 0; i < res.length; i++) {
            cpu.push(res[i].cpu)
            io.push(res[i].io)
            mem_free.push(res[i].mem_free)
            mem_user.push(res[i].mem_user)
            mem_sys.push(res[i].mem_sys)
            mdate.push(res[i].time)
        }

        myChart.setOption({
            series: [{
                data: cpu
            },
            {
                data: io
            }, {
                data: mem_free
            }, {
                data: mem_sys
            }, {
                data: mem_user
            }
            ],
            xAxis: [{
                data: mdate
            }, {
                data: mdate
            }, {
                data: mdate
            }]
        });

    }
});

if (option && typeof option === "object") {
    myChart.setOption(option, true);
    window.onresize = function () {
        myChart.resize();
    }
}
/* echart end */

/* menu start*/
var nav = hi('.nav-title');
for (var i = 0; i < nav.length; i++) {
    nav[i].addEventListener("click", function () {
        if (this.parentNode.getAttribute('tag') == 'fold') {
            this.nextElementSibling.classList.remove('hide')
            this.parentNode.setAttribute('tag', 'unfold')
        } else {
            this.nextElementSibling.classList.add('hide')
            this.parentNode.setAttribute('tag', 'fold')
        }
    })
}
/* menu end*/

/*select data start*/
var items = hi('.litem');
for (var i = 0; i < items.length; i++) {
    items[i].addEventListener("click", function () {
        for (var j = 0; j < items.length; j++) {
            items[j].classList.remove('highlight');
        }
        this.classList.add('highlight');
        var data = this.children[0].getAttribute('item-data').split(':')
        hostname = data[0]
        co_date = data[1]
        ajax({
            type: "post",
            url: "/data",
            data: { 'hostname': hostname, 'co_date': co_date },
            success: function (res) {
                cpu = [];
                io = [];
                mem_free = [];
                mem_user = [];
                mem_sys = [];
                mdate = [];
                res = JSON.parse(res)
                for (var i = 0; i < res.length; i++) {
                    cpu.push(res[i].cpu)
                    mem_free.push(res[i].mem_free)
                    mem_user.push(res[i].mem_user)
                    mem_sys.push(res[i].mem_sys)
                    io.push(res[i].io)
                    mdate.push(res[i].time)
                }
                myChart.setOption({
                    series: [{
                        data: cpu
                    },
                    {
                        data: io
                    }, {
                        data: mem_free
                    }, {
                        data: mem_sys
                    }, {
                        data: mem_user
                    }
                    ],
                    xAxis: [{
                        data: mdate
                    }, {
                        data: mdate
                    }, {
                        data: mdate
                    }]
                });

            }
        });

    })
}
/*select data end*/

/* MaskAndTip start */
function MaskAndTip(isVisible) {
    var mask = hi('#mask')
    var tip = hi('#tip')
    if (isVisible == true) {
        mask.style.zIndex = 998;
        mask.style.backgroundColor = '#00000066';
        mask.style.filter = 'blur(200px)';
        tip.style.zIndex = 999;
    } else {
        mask.style.zIndex = -1;
        mask.style.backgroundColor = '#fff';
        mask.style.filter = 'blur(0px)';
        tip.style.zIndex = -2;
    }
}
/* MaskAndTip end */

/*Local start */
hi('#local-sub').addEventListener('click', function () {
    var src = hi('#src')
    if (!src.value) {
        src.style.backgroundColor = "#f4433626";
        src.placeholder = "路径不能为空";
    } else {
        MaskAndTip(true)
        ajax({
            type: "post",
            url: "/local",
            data: {
                'src': src.value
            },
            success: function (res) {
                //console.log(res)
                if (res == 'ok') {
                    //src.value = ''
                    MaskAndTip(false)
                    location.reload()
                }
            }
        });
    }
})
/*Local end */

/*Remote start */
var reg =
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$$/
hi('#get').addEventListener('click', function () {
    var ip = hi('#ip');
    var port = hi('#port');
    var path = hi('#path');
    var username = hi('#username');
    var password = hi('#password');
    var warning = hi('#warning');
    warning.innerText = '';
    if (!ip.value || !reg.test(ip.value)) {
        ip.style.backgroundColor = "#f4433626";
        ip.placeholder = "IP不能为空";
    }
    if (!port.value) {
        port.style.backgroundColor = "#f4433626";
        port.placeholder = "端口不能为空";
    }
    if (!path.value) {
        path.style.backgroundColor = "#f4433626";
        path.placeholder = "路径不能为空";
    }
    pathReg = /.*\;.*|.*\|.*|.*\&.*|.*shutdown.*|.*reboot.*|.*rm.*|.*>.*|.*mv.*|.*mkfs.*|.*dd.*|.*\\x.*/
    if (pathReg.test(path.value)) {
        path.style.backgroundColor = "#f4433626";
        path.value = ''
        path.placeholder = "路径不合法";
    }
    if (!username.value) {
        username.style.backgroundColor = "#f4433626";
        username.placeholder = "用户名不能为空";
    }
    if (!password.value) {
        password.style.backgroundColor = "#f4433626";
        password.placeholder = "口令不能为空";
    }
    if (ip.value && port.value && path.value && username.value && password.value) {
        var data = Base64.encode(Base64.encode(ip.value) +
            ':' + Base64.encode(port.value) +
            ':' + Base64.encode(path.value) +
            ':' + Base64.encode(username.value) +
            ':' + Base64.encode(password.value))
        //console.log(data)
        MaskAndTip(true)
        ajax({
            type: "post",
            url: "/remote",
            data: {
                'key': data
            },
            success: function (res) {
                //console.log(res)
                MaskAndTip(false)
                switch (res) {
                    case 'ok':
                        location.reload()
                        break;
                    case 'cmd_err':
                        warning.style.color = "#f44336";
                        warning.innerText = '路径获取失败';
                        path.style.backgroundColor = "#f4433626";
                        break;
                    case 'in_err':
                        warning.style.color = "#f44336";
                        warning.innerText = '路径包含敏感字符';
                        path.style.backgroundColor = "#f4433626";
                        break;
                    case 'ssh_err':
                        warning.style.color = "#f44336";
                        warning.innerText = '登录失败，请核查信息';
                        ip.style.backgroundColor = "#f4433626";
                        port.style.backgroundColor = "#f4433626";
                        username.style.backgroundColor = "#f4433626";
                        password.style.backgroundColor = "#f4433626";
                        break;
                    case 'op_err':
                        warning.style.color = "#f44336";
                        warning.innerText = 'nmon文件打开错误';
                        break;
                    case 'an_err':
                        warning.style.color = "#f44336";
                        warning.innerText = 'nmon文件分析错误'
                        break;
                    case 'fail':
                        warning.style.color = "#f44336";
                        warning.innerText = '未知错误'
                        break;
                    default:
                        MaskAndTip(false)

                }
            }
        });

    }
})
/*Remote end */


