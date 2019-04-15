// pages/details/details.js
const app = getApp()
// const regeneratorRuntime = require('../../utils/runtime.js'); //使用ES7语法async await必须要引入的文件

Page({
    data: {
        statusBarHeight: app.globalData.statusBarHeight, // 顶部状态栏高度
        titleBarHeight: app.globalData.titleBarHeight,   // 导航栏高度
        canvasWidth: 0, // 画布宽高
        imgUrl: '', // 图片地址
        imgid: 0,      // 图片id
        colordata: [
            {
                color: "#ff0000",
                audioUrl: "/audio/color/red.mp3",
                path: '../../image/color/ff0000.png'
            }, {
                color: "#ff8a00",
                audioUrl: "/audio/color/orange.mp3",
                path: '../../image/color/ff8a00.png'
            }, {
                color: "#fff45c",
                audioUrl: "/audio/color/yellow.mp3",
                path: '../../image/color/fff45c.png'
            }, {
                color: "#a1ed00",
                audioUrl: "/audio/color/green.mp3",
                path: '../../image/color/a1ed00.png'
            }, {
                color: "#0084ff",
                audioUrl: "/audio/color/blue.mp3",
                path: '../../image/color/0084ff.png'
            }, {
                color: "#ff97a3",
                audioUrl: "/audio/color/pink.mp3",
                path: '../../image/color/ff97a3.png'
            }, {
                color: "#ff008e",
                audioUrl: "/audio/click.mp3",
                path: '../../image/color/ff008e.png'
            }, {
                color: "#c400fd",
                audioUrl: "/audio/color/purple.mp3",
                path: '../../image/color/c400fd.png'
            }, {
                color: "#cc89ff",
                audioUrl: "/audio/click.mp3",
                path: '../../image/color/cc89ff.png'
            }, {
                color: "#00ffd8",
                audioUrl: "/audio/click.mp3",
                path: '../../image/color/00ffd8.png'
            }, {
                color: "#8bddff",
                audioUrl: "/audio/click.mp3",
                path: '../../image/color/8bddff.png'
            }, {
                color: "#009944",
                audioUrl: "/audio/color/dark green.mp3",
                path: '../../image/color/009944.png'
            },
            {
                color: "#7f4620",
                audioUrl: "/audio/color/brown.mp3",
                path: '../../image/color/7f4620.png'
            }, {
                color: "#595959",
                audioUrl: "/audio/color/grey.mp3",
                path: '../../image/color/595959.png'
            }, {
                color: "#000000",
                audioUrl: "/audio/color/black.mp3",
                path: '../../image/color/000000.png'
            }, {
                color: "#0000ff",
                audioUrl: "/audio/color/red.mp3",
                path: '../../image/color/0000ff.png'
            },
        ],
        pen: 8, // 画笔粗细默认值 
        color: '#ff0000', // 画笔颜色默认值
        operation: [0, 1, 0, 0],
    },
    startX: 0, // 保存X坐标轴变量
    startY: 0, // 保存y坐标轴变量
    isClear: false, // 是否启用橡皮擦标记

    onLoad: function (options) {
        this.setCanvaswh();
        this.setData({
            imgUrl: options.imgUrl,
            imgid: options.imgid
        })
    },

    // 设置画布宽高度
    setCanvaswh() {
        let that = this;
        wx.getSystemInfo({
            success(res) {
                that.setData({
                    canvasWidth: res.windowWidth * 0.9,
                })
            }
        })
    },

    //手指触摸动作开始
    touchStart(e) {
        //得到触摸点的坐标
        this.startX = e.changedTouches[0].clientX - app.globalData.clientX;
        this.startY = e.changedTouches[0].clientY - app.globalData.clientY;
        this.context = wx.createCanvasContext('myCanvas')
        if (this.isClear) { //判断是否启用的橡皮擦功能 ture表示清除 false表示画画
            this.context.setStrokeStyle('#ffffff') //设置线条样式 此处设置为画布的背景颜色 橡皮擦原理就是：利用擦过的地方被填充为画布的背景颜色一致 从而达到橡皮擦的效果 
            this.context.setLineCap('round') //设置线条端点的样式
            this.context.setLineJoin('round') //设置线条的交点样式
            this.context.setLineWidth(14) //设置线条宽度
            this.context.save(); //保存当前坐标轴的缩放、旋转、平移信息
            this.context.beginPath() //开始一个路径
            this.context.fill(); //对当前路径进行填充
            this.context.restore(); //恢复之前保存过的坐标轴的缩放、旋转、平移信息
        } else {
            this.context.setStrokeStyle(this.data.color)
            this.context.setLineWidth(this.data.pen)
            this.context.setLineCap('round') // 让线条圆润 
            this.context.beginPath()
        }
    },

    //手指触摸后移动
    touchMove: function (e) {
        let startX1 = e.changedTouches[0].clientX - app.globalData.clientX;
        let startY1 = e.changedTouches[0].clientY - app.globalData.clientY;
        if (this.isClear) { //判断是否启用的橡皮擦功能 ture表示清除 false表示画画
            this.context.save(); //保存当前坐标轴的缩放、旋转、平移信息
            this.context.moveTo(this.startX, this.startY); //把路径移动到画布中的指定点，但不创建线条
            this.context.lineTo(startX1, startY1); //添加一个新点，然后在画布中创建从该点到最后指定点的线条
            this.context.stroke(); //对当前路径进行描边
            this.context.restore(); //恢复之前保存过的坐标轴的缩放、旋转、平移信息
            this.startX = startX1;
            this.startY = startY1;
        } else {
            this.context.moveTo(this.startX, this.startY)
            this.context.lineTo(startX1, startY1)
            this.context.stroke()
            this.startX = startX1;
            this.startY = startY1;
        }

        //只是一个记录方法调用的容器，用于生成记录绘制行为的actions数组。context跟<canvas/>不存在对应关系，一个context生成画布的绘制动作数组可以应用于多个<canvas/>
        wx.drawCanvas({
            canvasId: 'myCanvas',
            reserve: true,
            actions: this.context.getActions() // 获取绘图动作数组
        })
    },

    //手指触摸动作结束
    touchEnd: function () { },

    //启动橡皮擦方法
    clearCanvas: function (e) {
        wx.showToast({
            title: '选择橡皮擦',
            icon: 'none'
        })
        let operation = this.data.operation;
        !operation[3] && app.plays(e.currentTarget.dataset.audio);
        this.isClear = this.isClear ? false : true;
        this.setData({ operation: [0, 0, 0, 1] })
    },

    // 更改画笔颜色
    color(e) {
        this.isClear = false;
        let color = e.currentTarget.dataset.color, auido = e.currentTarget.dataset.auido, choose = e.currentTarget.dataset.choose, colordata = this.data.colordata, operation = this.data.operation;
        !choose && app.plays(auido);
        for (let i in colordata) {
            colordata[i].choose = color == colordata[i].color ? true : false;
        }
        let pen = this.data.pen;
        if (operation[3]) {
            operation[1] = 1, operation[3] = 0;
            pen = 8;
        }
        this.setData({
            colordata: colordata,
            color: color,
            operation: operation,
            pen: pen
        })
    },

    // 更改画笔大小 / 清空画布
    colorSelect(e) {
        let name = e.currentTarget.dataset.name, idx = e.currentTarget.dataset.idx, audio = e.currentTarget.dataset.audio;
        if (name === 'empty') {
            wx.showToast({
                title: "清空成功",
                icon: "none"
            });
            app.plays(audio);
            if (this.startX !== 0) {
                let canvasWidth = this.data.canvasWidth;
                const ctx = wx.createCanvasContext('myCanvas')
                ctx.rect(0, 0, canvasWidth, canvasWidth)
                ctx.setFillStyle("white")
                ctx.fill()
                ctx.draw();
            }
        } else {
            this.isClear = false;
            let operation = this.data.operation;
            for (let i in operation) {
                if (i == idx) {
                    !operation[i] && app.plays(audio);
                    operation[i] = 1;
                } else {
                    operation[i] = 0;
                }
            }
            this.setData({ pen: parseInt(name), operation: operation })
        }
    },

    // 回到首页
    home() {
        app.clickPlay();
        let pages = getCurrentPages();
        let lastpage = pages[pages.length - 2];
        lastpage.setData({
            boxFlg: false,
            isShare: false
        })
        app.td_app_sdk.event({
            id: 'go_back',
            label: '涂鸦页-点击房子按钮'
        });
        wx.navigateBack()
    },

    // 保存图片
    save(e) {
        let that = this, rightdata = wx.getStorageSync('rightdata'), imgid = this.data.imgid;
        wx.showLoading({
            title: '保存图片中...',
        })
        // 下载文件资源到本地
        wx.downloadFile({
            url: that.data.imgUrl,
            success(res) {
                if (res.statusCode === 200) {
                    const ctx = wx.createCanvasContext('myCanvas');
                    ctx.drawImage(res.tempFilePath, 0, 0, that.data.canvasWidth, that.data.canvasWidth);
                    that.setData({
                        showImg: true
                    })
                    ctx.draw(true, setTimeout(() => {
                        // 把当前画布指定区域的内容导出生成指定大小的图片。在draw()回调里调用该方法才能保证图片导出成功。
                        wx.canvasToTempFilePath({
                            x: 0,
                            y: 0,
                            width: that.data.canvasWidth,
                            height: that.data.canvasWidth,
                            canvasId: 'myCanvas',
                            success(result) {
                                // 保存文件到本地
                                wx.saveFile({
                                    tempFilePath: result.tempFilePath,
                                    success(a) {
                                        app.clickPlay();
                                        let src = a.savedFilePath; // 需要保存的文件的临时路径
                                        console.log('=====涂鸦后的图片=====', src);
                                        wx.hideLoading();
                                        for (let i in rightdata) {
                                            if (imgid == rightdata[i].id) {
                                                rightdata[i].saveImg = src;
                                                break;
                                            }
                                        }
                                        wx.setStorageSync('rightdata', rightdata);
                                        app.td_app_sdk.event({
                                            id: 'go_save',
                                            label: '涂鸦页-点击保存按钮'
                                        });
                                        wx.redirectTo({
                                            url: "/pages/end/end?imgUrl=" + src
                                        });
                                    },
                                    fail(err) {
                                        wx.showToast({
                                            title: err,
                                            icon: "none"
                                        })
                                    }
                                });
                            }
                        })
                    }, 400));

                }
            },
            fail(m) {
                wx.showToast({
                    title: m,
                })
            }
        })
    },

    // 图片加载成功
    imgBindload: function () {
        wx.hideLoading();
    },

    // 图片加载失败
    imgBinderror: function () {
        wx.hideLoading();
    },

    onShareAppMessage: function () {
        return {
            title: '我家宝宝最爱的创意涂鸦，快让你家宝宝也试试吧！~',
            path: '/pages/index/index?TDChannelId=detailsShare',
            imageUrl: '../../image/share.png'
        }
    }
})