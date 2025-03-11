//获取应用实例
const app = getApp()
const cookieUtil = require('../../utils/cookie/Cookie.js')
Page({
  data: {
    totalprice: 0,
    showLogin: false,
    // showSummary:true,
    username:'',
    password:'',
    hotdish: []
  },
 
  onLoad: function () {

  },
  onReady() {
    var that = this
    var value = cookieUtil.getCookieFromStorage('cookie')
    console.log('get cookie', value)
    var header = {}
    header.Cookie = value
    wx.request({
      url: getApp().globalData.baseUrl + '/today_orders/4',
      method: 'GET',
      header: header,
      success: function(res) {
        console.log('got res',res)
        // wx.hideToast();
        that.setData({
          totalprice: res.data
        })

      console.log('get totalprice', that.data.totalprice)
      },
    })

  },
  onShow: function () {
    this.onReady()//再次加载，实现返回上一页页面刷新
  },

  // login.js

  onUsernameInput(e) {
    this.setData({
      username: e.detail.value
    });
  },

  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },

  onLoginTap() {
    var that = this
    const { username, password } = this.data;
    if (!username || !password) {
      wx.showToast({
        title: '请输入用户名和密码',
        icon: 'none'
      });
      return;
    }

    wx.request({
      url: getApp().globalData.baseUrl + '/boss/session', // 后台验证接口
      method: 'POST',
      data: {
        username,
        password
      },
      success(res) {
        // console.log('got res',res)
        if (res.data == 'Log In') {
          wx.showToast({
            title: '身份确认成功！将显示财务汇总。',
            icon: 'none'
          });
          that.setData({
            showLogin: !that.data.showLogin,
            // showSummary: false
          })
        } else {
          // 登录失败，显示错误信息
          wx.showToast({
            title: '用户名、密码错误！',
            icon: 'none'
          });
        }
      },
      fail(err) {
        // 请求失败，显示错误信息
        wx.showToast({
          title: '请求失败，请稍后再试',
          icon: 'none'
        });
      }
    });
  },
  weekly_dish_sales(){
    var that = this
    var value = cookieUtil.getCookieFromStorage('cookie')
    console.log('get cookie', value)
    var header = {}
    header.Cookie = value
    wx.request({
      url: getApp().globalData.baseUrl + '/weekly_dish_sales/',
      method: 'GET',
      header: header,
      success: function(res) {
        console.log('got res',res.data)
        // wx.hideToast();
        that.setData({
          hotdish: res.data
        })
        // console.log('got res',that.data)
      },
    })
  }
});


