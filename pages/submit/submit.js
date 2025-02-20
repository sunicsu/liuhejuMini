// pages/submit/submit.js
// const ERequest = require('../../utils/util.js').ERequest;
var app = getApp()
const cookieUtil = require('../../utils/cookie/Cookie.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'), 
    order:[],
    notes: '',
    mobile: '',
    totalPrice: '',
    customer_id: '',
    hidePhoneNum: false,
    status: true,
    maxWord: 50,
    currentWord: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    let id = wx.getStorageSync('tableInfo').table_id
    let ordercategory = wx.getStorageSync('tableInfo').orderCategory
    let menu = wx.getStorageSync('cartDish' + id)
    // debugger;
    this.setData({
      //order: menu
      order: menu.filter( (res) => res.num > 0)

    })
    let totalPrice = wx.getStorageSync('totalPrice')
    if (ordercategory == 1) {
      this.setData({
        hidePhoneNum: true,
        status: false
      })
    }
    this.setData({
      totalPrice: totalPrice
    })
    let customer_id = wx.getStorageSync('customer_id')
    this.setData({
      customer_id: customer_id
    })
    let totalNum = wx.getStorageSync('totalNum')
    this.setData({
      totalNum: totalNum
    })
    console.log('load data', this.data)
    

  },

  // 修改包间状态
  changeStatus: function(tableId) {
    var grid = app.globalData.grids
    for (var i=0; i<grid.length; i++) {
      if (grid[i].tableId == tableId){
        grid[i].status = 'false'
      }
    }
    app.globalData.grids = grid
    console.log('get grids', app.globalData.grids)
  },


  // 备注内容
  inputNotes: function(e) {
    var that = this;
    var value = e.detail.value;
    var wordLength = parseInt(value.length); 
    if (that.data.maxWord < wordLength) {
      return ;
    }
    that.setData({
      notes: e.detail.value,
      currentWord: wordLength 
    });
  }, 
  // 联系方式
  inputMobile: function(e) {
    const phoneNumber = e.detail.value;
    if (e.detail.value.trim() == 0) {
      wx.showToast({
        title: '联系电话为空了',
        icon: 'loading',
        duration: 3000
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
      this.setData({ 
        mobile: phoneNumber,
        status: true,
      })
    } else if (!/^1[3456789]\d{9}$/.test(phoneNumber)) {
        // 手机号格式不正确，提示用户
        wx.showToast({
          title: '手机号不正确！',
          icon: 'none',
          duration: 3000
        });
        this.setData({ 
          mobile: phoneNumber,
          status: true,
        })
  } else {
      this.setData({ 
        mobile: e.detail.value,
        status: false,
    }) 
    }

  },
 
  submitOrder: function () {
    var that = this
    var value = cookieUtil.getCookieFromStorage('cookie')
    console.log('get cookie', value)
    var header = {}
    header.Cookie = value
    wx.showToast({
      title: '订单提交中',
      icon: 'loading',
      duration: 300000
    })

    let tableInfo = wx.getStorageSync('tableInfo')
    this.setData({
      tableInfo: tableInfo
    })
    console.log('load tableInfo', this.data.tableInfo)
    let postBody = {}
    let newNote = {notes: this.data.notes}
    let getmobile = {mobile: this.data.mobile}
    let nickname = {nickname: getApp().globalData.userInfo.nickName}
    // 增加备注,moblie
    postBody = {foods: that.data.order}
    postBody.notes = newNote
    postBody.mobile = getmobile
    postBody.nickname = nickname
    console.log('postBody', postBody);

    wx.request({
      url: app.globalData.baseUrl + '/restaurant/orders/'+this.data.tableInfo.restaurantId.toString()+'/'+this.data.tableInfo.table_id.toString(),
      method: 'POST',
      data: postBody,
      header: header,
      success: res => {
        wx.hideToast();
        console.log('submit success', res);
        wx.navigateTo({
          url: '../payment/payment',
          success: function (res) {
            console.log('succeed to payment page')
          }
        })
      }
    })
  },

  limitWord:function(e){
    var that = this;
    var value = e.detail.value;
    //解析字符串长度转换成整数。
    var wordLength = parseInt(value.length); 
    if (that.data.maxWord < wordLength) {
      return ;
    }
    that.setData({
      currentWord: wordLength 
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      grids: app.globalData.grids
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})