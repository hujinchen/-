//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')

Page({
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight,
        rightdata: [
            {
                'id': 1,
                'img': 'https://wx-xcx-tools.amijiaoyu.com/DressupPrincess/spring/4.png?t=1',
                'saveImg': null,
                'isLocked': false,
                'tdname': 'spring_click',
            }
        ],
        config: config,
        boxFlg: false,  // 是否显示分享弹框
        imgContent: '', // 分享显示的图片
        imgid: 1,       // 分享显示的图片的id
        isShare: false,  // 当前是否已分享
    },

    onLoad: function () {
        let data = wx.getStorageSync('rightdata');
        let rightdata = data == '' || data == null || data == undefined ? [] : data;
        if (rightdata.length == 0) {
            for (let i in config) {
                for (let x in config[i].list) {
                    config[i].list[x].tdname = config[i].tdName;
                    rightdata.push(config[i].list[x]);
                }
            }
        }
        config[0].choose = true;
        this.setData({ config: config, rightdata: rightdata, load: true });
        wx.setStorageSync('rightdata', rightdata);
    },

    // 点击左边分类
    leftClass(e) {
        let item = e.currentTarget.dataset.item, tdname = item.tdName, audio = item.audioUrl, choose = item.choose, config = this.data.config;
        !choose && app.plays(audio); // 播放
        for (let i in config) {
            config[i].choose = tdname == config[i].tdName ? true : false;
        }
        this.setData({ config: config, tdName: tdname })

        app.td_app_sdk.event({
            id: item.name,
            label: '首页-点击左边分类',
            params: {
                tdName: item.tdName,
                img: item.coverImg
            }
        });
    },

    // 点击右边具体内容
    details(e) {
        let item = e.currentTarget.dataset.item;
        if (item.isLocked) {
            app.plays('/audio/lock.mp3');
            this.setData({
                boxFlg: true,
                imgContent: item.img,
                imgid: item.id
            })
        } else {
            app.td_app_sdk.event({
                id: item.id,
                label: '首页-点击右边已解锁的图',
                params: {
                    tdName: item.tdname,
                    img: item.img
                }
            });
            app.clickPlay();
            wx.navigateTo({
                url: '../details/details?imgid=' + item.id + '&imgUrl=' + item.img,
            })
        }
    },

    useless() { },

    // 关闭分享弹框
    mask() {
        app.clickPlay();
        this.setData({ boxFlg: false, isShare: false })
    },

    onShow: function () {
        // 分享时停留时间大于3秒的话，才算分享成功 
        if (this.data.times && new Date().getTime() - this.data.times >= 3000) {
            // 自定义事件统计追踪
            app.td_app_sdk.event({
                id: this.data.imgContent, // 解锁的图片
                label: '首页-分享解锁成功-免费领取按钮',
            });

            // 分享事件调用
            app.td_app_sdk.share({
                title: '我家宝宝最爱的创意涂鸦，快让你家宝宝也试试吧！',
                path: '/pages/index/index'
            });
            let rightdata = this.data.rightdata, imgid = this.data.imgid;
            for (let i in rightdata) {
                if (imgid == rightdata[i].id) {
                    rightdata[i].isLocked = false;
                    break;
                }
            }
            wx.setStorageSync('rightdata', rightdata);
            this.setData({
                isShare: true,
                rightdata: rightdata,
                times: 0
            });
            setTimeout(() => {
                app.clickPlay();
                wx.navigateTo({
                    url: '../details/details?imgid=' + this.data.imgid + '&imgUrl=' + this.data.imgContent,
                })
            }, 1000)
        }

        if (this.data.times && new Date().getTime() - this.data.times < 3000) {
            app.td_app_sdk.event({
                id: this.data.imgContent, // 解锁的图片
                label: '首页-分享解锁失败-免费领取按钮',
            });
        }
    },

    onShareAppMessage: function (e) {
        if (e.from == 'button') {
            app.clickPlay();
            this.setData({ times: new Date().getTime() })
        }
        return {
            title: '我家宝宝最爱的创意涂鸦，快让你家宝宝也试试吧！',
            path: '/pages/index/index?TDChannelId=indexShare',
            imageUrl: '../../image/share.png'
        }
    }
})
