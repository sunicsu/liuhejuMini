//获取应用实例
const app = getApp()
const cookieUtil = require('../../utils/cookie/Cookie.js')

Page({
  data: {

  },
 
  onLoad: function () {
  },
  onReady() {
  },
  onShow: function () {
    this.onReady()//再次加载，实现返回上一页页面刷新
  },
  //分享给微信用户
  onShareAppMessage(){
      wx.showShareMenu({  // 显示打开
      withShareTicket:true,
      menu:['shareAppMessage','shareTimeline']
    })
    return {
      title:'',
      imageUrl:''
    }
  },
  // 分享到朋友圈 
  onShareTimeline(){
    return {
      title:'',    
      imageUrl:''
    }
  },
  toOrder: function() {
    wx.switchTab({
      url: '/pages/index/index',
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
})
