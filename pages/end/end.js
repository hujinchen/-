// pages/end/end.js
const app = getApp();

Page({
    data: {
        statusBarHeight: app.globalData.statusBarHeight, // 顶部状态栏高度
        titleBarHeight: app.globalData.titleBarHeight,   // 导航栏高度
        canvasWidth: 0, // 图片宽高
        imgUrl: null,   // 图片地址
        shareImg: null, // 分享图
        hide: false
    },

    onLoad: function (options) {
        let num = Math.floor(Math.random() * 3 + 1); // 随机一到3之间的数字
        app.plays('/audio/end' + num + '.mp3'); // 随机播放结束语
        this.setCanvaswh();
        this.setData({
            imgUrl: options.imgUrl || "../../image/draw/2.png",
        })
    },

    onReady: function () {
        this.drawShareImg();
    },

    // 绘制分享图
    drawShareImg: function (t) {
        let that = this, ctx = wx.createCanvasContext("canvas");
        ctx.drawImage("../../image/shareBg.png", 0, 0, 200, 150);
        ctx.drawImage(this.data.imgUrl, 50, 25, 100, 100);
        ctx.draw(true, setTimeout(() => {
            wx.canvasToTempFilePath({
                canvasId: 'canvas',
                x: 0,
                y: 0,
                width: 200,
                height: 150,
                success(res) {
                    that.setData({
                        shareImg: res.tempFilePath
                    })
                }
            })
        }, 400));
    },

    // 设置画布宽高度
    setCanvaswh() {
        let that = this;
        wx.getSystemInfo({
            success(res) {
                that.setData({ canvasWidth: res.windowWidth * 0.9 })
            }
        })
    },

    // 在玩一次
    gohomo() {
        let pages = getCurrentPages();
        let lastpage = pages[pages.length - 2];
        let config = lastpage.data.config;
        for (let i in config) {
            config[i].choose = false;
        }
        config[0].choose = true;
        lastpage.setData({
            config: config
        })
        app.td_app_sdk.event({
            id: 'end-goplay',
            label: '结束页-再玩一下-按钮'
        });
        app.clickPlay();
        wx.redirectTo({
            url: '/pages/index/index',
        })
    },

    onShow: function () {
        // 分享时停留时间大于3秒的话，才算分享成功 
        if (this.data.times && new Date().getTime() - this.data.times >= 3000) {
            app.td_app_sdk.event({
                id: 'end-success',
                label: '结束页-分享成功-炫耀一下-按钮'
            });

            app.td_app_sdk.share({
                title: '快来看看我家宝宝的涂鸦作品吧~',
                path: '/pages/end/end'
            });
            this.setData({ hide: true, times: 0 });
        } else {
            // 分享失败
            app.td_app_sdk.event({
                id: 'end-fail',
                label: '结束页-分享失败-炫耀一下-按钮'
            });
        }
    },

    onShareAppMessage: function (e) {
        let imageUrl = '', title = '';
        this.setData({ times: new Date().getTime() });
        if (e.from == 'button') {
            app.clickPlay();
            imageUrl = this.data.shareImg
            title = '我家宝宝最爱的创意涂鸦，快让你家宝宝也试试吧！~'
        } else {
            imageUrl = '../../image/share.png'
            title = '快来看看我家宝宝的涂鸦作品吧~'
        }
        return {
            title: title,
            path: '/pages/index/index?TDChannelId=endShare',
            imageUrl: imageUrl
        }
    }
})