//app.js
var tdweapp = require('./utils/tdweapp.js');

App({
    onLaunch: function () {
        console.log('=========app.onLaunch=========');
        let vm = this, num = Math.floor(Math.random() * 2 + 1); // 随机一到2之间的数字
        setTimeout(() => {
            this.plays('/audio/open' + num + '.mp3'); // 随机播放开头语;
        }, 700)

        wx.getSystemInfo({
            success(res) {
                let totalTopHeight = 68, x = 20, y = 69;
                if (res.model.indexOf('iPhone X') !== -1) {
                    totalTopHeight = 88;
                    x = 17.6, y = 93;
                } else if (res.model.indexOf('iPhone') !== -1) {
                    totalTopHeight = 64;
                } else if (res.model.indexOf('iPad') !== -1) {
                    x = 39.9, y = 73.2
                }
                vm.globalData.clientX = x; // 画布x坐标
                vm.globalData.clientY = y; // 画布y坐标
                vm.globalData.statusBarHeight = res.statusBarHeight;
                vm.globalData.titleBarHeight = 44 || totalTopHeight - res.statusBarHeight;
            },
            fail(err) {
                vm.globalData.statusBarHeight = 0;
                vm.globalData.titleBarHeight = 0;
            }
        })
    },

    // 播放背景音乐
    playBg() {
        let e = this.globalData.bgAudio;
        e.loop = true,      // 是否循环播放
            e.autoplay = true,  // 是否自动播放
            e.src = '/audio/bg.mp3',  // 音频资源的地址
            e.play();          // 开始播放
    },

    // 播放点击效果音乐
    clickPlay() {
        let e = wx.createInnerAudioContext();
        e.loop = false,
            e.src = '/audio/click.mp3',
            e.play();
    },

    // 播放普通音乐
    plays(src) {
        let e = this.globalData.audios;
        e.src = src,
            e.loop = false,
            e.startTime = false,
            // e.seek(0),
            e.autoplay = false,
            e.play();
    },

    // 监听小程序启动或切前台
    onShow(e) {
        this.playBg()  // 循环播放背景音乐
    },

    globalData: {
        statusBarHeight: 0, // 顶部状态栏高度
        titleBarHeight: 0,  // 顶部导航栏高度
        bgAudio: wx.createInnerAudioContext(), // 背景音乐
        audios: wx.createInnerAudioContext(),  // 普通音乐
    }
})