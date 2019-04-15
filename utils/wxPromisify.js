var app = getApp();

/**
 * wxPromisify
 * @fn 传入的函数，如wx.request、wx.download
 */
function wxPromisify(fn) {
   return function (obj = {}) {
      return new Promise((resolve, reject) => {
         obj.success = function (res) {
            resolve(res)
         }

         obj.fail = function (res) {
            reject(res)
         }

         fn(obj) //执行函数，obj为传入函数的参数
      })
   }
}

/**
 * GET方式请求
 * @param: 请求参数
 * @flg:   1: 代表请求的是iptlUrl普通接口 2：代表请求的是commonApiUrl通用接口
 */
function requstGet(param, flg = 1) {
   return requst(param, flg, 'GET')
}

/**
 * POST方式请求
 * @param: 请求参数
 * @flg:   1: 代表请求的是iptlUrl普通接口 2：代表请求的是commonApiUrl通用接口
 */
function requstPost(param, flg = 1) {
   return requst(param, flg, 'POST')
}

/**
 * 小程序请求
 * @param： 请求参数
 * @flg:    1: 代表请求的是iptlUrl普通接口 2：代表请求的是commonApiUrl通用接口
 * @method: 请求类型  GET：POST
 */
function requst(param = {}, flg = 1, method) {
   let header = method == 'POST' ? 'application/x-www-form-urlencoded' : 'application/json';
   return new Promise((resolve, reject) => {
      wx.request({
         url: flg == 1 ? app.globalData.iptlUrl : app.globalData.commonApiUrl,
         data: param,
         header: {
            'content-type': header,
         },
         method: method,
         success: (res) => {
            console.log('op=' + param.op + ' 的请求结果：', res);
            resolve(res);
         },
         fail: (res) => {
            reject('request请求错误：', res.data)
         }
      })
   })
}

/**
 * 小程序登录
 * @return： ture或false
 */
function login() {
   return new Promise((resolve, reject) => {
      let openid = wx.getStorageSync('openid');
      let sessionid = wx.getStorageSync('sessionid');
      if (sessionid != undefined && openid != undefined && sessionid != "" && openid != "") {
         // 检查登录状态是否过期。
         wx.checkSession({
            success: function () {
               // session_key 未过期，并且在本生命周期一直有效
               wx.login({
                  success: (res) => {
                     let data = {
                        op: 'onlogin',
                        code: res.code
                     };
                     requstGet(data, 2).then(res => {
                        if (res.data.status == 1) {
                           app.globalData.openid = res.data.openid;
                           app.globalData.sessionid = res.data.sessionid;
                           wx.setStorageSync("openid", res.data.openid);
                           wx.setStorageSync("sessionid", res.data.sessionid);
                           resolve(true);
                        } else {
                           console.log(res.data.msg);
                           resolve(false);
                        }
                     }).catch(res => {
                        console.log('小程序登陆接口调用失败：', res);
                        resolve(false);
                     })
                  },
                  fail: (res) => {
                     reject('登陆请求错误：', res.data);
                  }
               })
            },
            fail: function () {
               // session_key 已经失效，需要重新执行登录流程
               wx.login({
                  success: (res) => {
                     let data = {
                        op: 'onlogin',
                        code: res.code
                     };
                     requstGet(data, 2).then(res => {
                        if (res.data.status == 1) {
                           app.globalData.openid = res.data.openid;
                           app.globalData.sessionid = res.data.sessionid;
                           wx.setStorageSync("openid", res.data.openid);
                           wx.setStorageSync("sessionid", res.data.sessionid);
                           resolve(true);
                        } else {
                           console.log(res.data.msg);
                           resolve(false);
                        }
                     }).catch(res => {
                        console.log('小程序登陆接口调用失败：', res);
                        resolve(false);
                     })
                  },
                  fail: (res) => {
                     reject('登陆请求错误：', res.data);
                  }
               })
            }
         })

      } else {
         wx.login({
            success: (res) => {
               let data = {
                  op: 'onlogin',
                  code: res.code
               };
               requstGet(data, 2).then(res => {
                  if (res.data.status == 1) {
                     app.globalData.openid = res.data.openid;
                     app.globalData.sessionid = res.data.sessionid;
                     wx.setStorageSync("openid", res.data.openid);
                     wx.setStorageSync("sessionid", res.data.sessionid);
                     resolve(true);
                  } else {
                     console.log(res.data.msg);
                     resolve(false);
                  }
               }).catch(res => {
                  console.log('小程序登陆接口调用失败：', res);
                  resolve(false);
               })
            },
            fail: (res) => {
               reject('登陆请求错误：', res.data);
            }
         })
      }
   })

}

/**
 * 小程序获取用户信息
 * @param:  用户点击按钮后的回调参数
 * @return： ture或false
 */
function getUserInfo(param) {
   return new Promise((resolve, reject) => {
      let that = this, detail = param.detail;
      // 用户点击允许授权
      if (detail.errMsg == 'getUserInfo:ok') {
         app.globalData.userInfo = detail.userInfo;
         var xx = wx.getStorageSync('userInfo');
         if (xx != undefined && xx != "") {
            resolve(true);
         } else {
            wx.setStorageSync('userInfo', detail.userInfo);
            login().then(res => {
               if (res) {
                  let data = {
                     op: 'getUserInfo',
                     encryptedData: detail.encryptedData,
                     iv: detail.iv,
                     sessionid: wx.getStorageSync('sessionid')
                  };
                  requstGet(data, 2).then(res => {
                     resolve(true);
                  }).catch(res => {
                     console.log('获取用户信息接口调用失败：', res);
                     resolve(false);
                     requstGet(data, 2).then(res => {
                        resolve(true);
                     }).catch(res => {
                        console.log('获取用户信息接口调用失败：', res);
                        resolve(false);
                     });
                  });
               }
            })
         }
      } else {
         resolve(false); // 用户点击拒绝授权
      }
   })
}

/**
 * 小程序获取用户微信授权手机号
 * @param:  用户点击按钮后的回调参数
 * @return： 成功：phoneNumber 用户的手机号码  失败：false
 */
function getPhoneNumber(param) {
   return new Promise((resolve, reject) => {
      let that = this, detail = param.detail;
      // 用户点击允许授权
      if (detail.errMsg == "getPhoneNumber:ok") {
         login().then(res => {
            if (res) {
               let data = {
                  op: 'getPhoneNumber',
                  encryptedData: detail.encryptedData,
                  iv: detail.iv,
                  sessionid: wx.getStorageSync('sessionid')
               };
               requstGet(data, 2).then(res => {
                  if (res.data.status == 1) {
                     let phoneNumber = res.data.getPhoneNumber.phoneNumber;
                     resolve(phoneNumber); //返回电话号码
                  } else {
                     resolve(false);
                  }
               })
            }
         })
      } else {
         resolve(false); // 用户点击拒绝授权
      }
   })
}

/**
 * 小程序群验证
 * @res: 分享成功的回调信息
 * @flg: 标志位 1：两小时后失效  2：30分钟后失效
 */
function GroupValidation(res, flg) {
   return new Promise((resolve, reject) => {
      if (res.shareTickets) {
         wx.getShareInfo({
            shareTicket: res.shareTickets[0],
            success: function (res1) {
               //两小时后失效
               if (flg == 1) {
                  requstGet('/step/getOpenGid', {
                     encryptedData: res1.encryptedData,
                     iv: res1.iv,
                     shareBackflag: true
                  }).then(res => {
                     if (res.data.status == 0) {
                        resolve(true);
                     } else {
                        wx.showToast({
                           title: res.data.msg,
                           icon: 'none'
                        })
                        resolve(false);
                     }
                  })
               }
               //30分钟后失效
               else if (flg == 2) {
                  requstGet('/step/getZhuanPanOpenGid', {
                     encryptedData: res1.encryptedData,
                     iv: res1.iv
                  }).then(res => {
                     if (res.data.status == 0) {
                        resolve(true);
                     } else {
                        wx.showToast({
                           title: res.data.msg,
                           icon: 'none'
                        })
                        resolve(false);
                     }
                  })
               }
            },
            fail: function (res) {
               console.log("获取转发信息失败:", res);
               resolve(false);
            }
         })
      } else {
         wx.showToast({
            title: '请分享到群',
            icon: 'none'
         })
         resolve(false);
      }
   })
}

module.exports = {
   wxPromisify: wxPromisify,
   login: login,
   getUserInfo: getUserInfo,
   getPhoneNumber: getPhoneNumber,
   GET: requstGet,
   POST: requstPost,
   group: GroupValidation
}