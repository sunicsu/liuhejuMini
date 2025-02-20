//获取应用实例
const app = getApp()
const cookieUtil = require('../../utils/cookie/Cookie.js')
Page({
  data: {
    list: []
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
      url: getApp().globalData.baseUrl + '/orders/4',
      method: 'GET',
      header: header,
      success: function(res) {
        wx.hideToast();
        // that.setData({
        //    list: res.data
        // })
        let dataList = res.data; //获取到数据
        if (dataList.length == 0) {
          wx.hideLoading()
          setTimeout(function(){
            wx.showToast({
            title: '您还至今没有下单呢!快下单品尝吧',
            icon: 'none',
            duration: 3000
          })
          },500)
        } else {
          dataList.forEach((item) => {
            item.order_time = item.order_time.substring(0, 10); //要截取时间的字符串
          })
          that.setData({
            list: dataList //数据源
          })
        }
      console.log('get list', that.data.list)
      },
    })
  },
  onShow: function () {
    this.onReady()//再次加载，实现返回上一页页面刷新
  },
  
})
