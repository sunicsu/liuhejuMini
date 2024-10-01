// app.js
// const ERequest = require('./utils/util.js').ERequest;
const cookieUtil = require('./utils/cookie/Cookie.js')
App({
  onLaunch() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    let postBody = {}
        
    let login = function() {
        return new Promise(function(resolve, reject){
          
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          // postBody.code = res.code;
          // postBody.appId = getApp().globalData.appId;
          // console.log(res);
          var code = res.code
          var appId = getApp().globalData.appId
          // var nickname = getApp().globalData.userInfo.nickName
          wx.request({
            url: getApp().globalData.baseUrl + '/buyer/session',
            method: 'POST',
            data: {
              code: code,
              appId: appId,
              // nickname: nickname
            },
            header: {
              'content-type': 'application/json'
            },
            success: function(res){
              wx.showToast({
                title: '授权成功'
              })
              var cookie = cookieUtil.getSessionIDFromResponse(res)
              cookieUtil.setCookieToStorage(cookie)
              console.log(cookie)
            }
          })
          resolve();
           }
          })
        })
      }        
  
  // 获取用户信息
  let getSetting = function() {
    // return new Promise(function(resolve, reject){
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                getApp().globalData.userInfo = res.userInfo
                wx.setStorageSync('userInfo', res.userInfo)
                console.log(res);
                postBody.nickname = res.userInfo.nickName;
                postBody.avatar = res.userInfo.avatarUrl;
                // postBody.appId = res.userInfo.appId;
                // resolve();

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (getApp().userInfoReadyCallback) {
                  getApp().userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })
    // })
  }
  Promise
    .all([login(), getSetting()])
    .then(function() {
      console.log(postBody);
      wx.request({
        url: getApp().globalData.baseUrl + '/buyer/session',
        method: 'POST',
        data: postBody,
        success: res => {
          console.log(res);
        }
      })
    })

  },
  globalData: {
    userInfo: null,
    appId: "wx6b2174da78c30a9f",
    // baseUrl: "http://127.0.0.1:8000/api",
    // url: 'http://127.0.0.1:8000',
    baseUrl: "https://wx.91htwh.top/api",
    url: 'https://wx.91htwh.top',
  }
})
