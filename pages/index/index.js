// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
//获取应用实例
const app = getApp()
const cookieUtil = require('../../utils/cookie/Cookie.js')

Page({
  data: {
    motto: 'ChickenDinner8！',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    book: '预订',
    grids: [] //包间数据
    
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  
  onLoad: function () {
  
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onReady() {
    var that = this
    wx.request({
      url: 'http://127.0.0.1:8000/api/TableViewset',
      method: 'GET',
      // header: header,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        wx.hideToast();
        that.setData({
           grids: res.data
        })
      },
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  to_menu: function () {
    wx.scanCode({
      scanType: 'qrCode',
      success: (res) => {
        console.log(res.result);
        wx.setStorageSync('tableInfo', JSON.parse(res.result));
        wx.navigateTo({
          url: '../menu/menu',
          success: function (res) {
            // success
          },
          fail: function () {
            // fail
          },
          complete: function () {
            // complete
          }
        })
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },
  to_menu_trick(event) {
    let id = event.currentTarget.dataset.id
    let status = event.currentTarget.dataset.status
    wx.setStorageSync('tableInfo', {
      "restaurantId": 4,
      "tableId": id,
      "status": status
    });
    // debugger;
    wx.navigateTo({
      url: '../menu/menu',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    });
  }
})
