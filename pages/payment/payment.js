// pages/payment/payment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPrice: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let totalPrice = wx.getStorageSync('totalPrice')
    this.setData({
      totalPrice: parseFloat(totalPrice)
    })
  },

  toPay: function(){
    wx.showToast({
      title: '功能正在开发中',
      icon: 'loading',
      duration: 3000
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  //点击支付按钮进行支付
  // payclick: function () {
  //   var t = this;
  //   wx.login({
  //   //获取code换取openID
  //   success: function (res) {
  //     //code = res.code //返回code
  //     console.log("获取code");
  //     console.log(res.code);
  //     var opid = t.getOpenId(res.code);
  //     }
  //   })
  //   },
  //   //获取openID
  //   getOpenId: function (code) {
  //     var that = this;
  //     wx.request({
  //     url: "https://api.weixin.qq.com/sns/jscode2session?appid=你的appid&secret=AppSecret(小程序密钥)&js_code=" + code + "&grant_type=authorization_code",
  //     data: {},
  //     method: 'GET',
  //     success: function (res) {
  //       console.log("获取openid")
  //       console.log(res)
  //       that.setData({
  //         openid: res.data.openid,
  //         session_key: res.data.session_key
  //       })
  //       that.generateOrder(res.data.openid)
  //   },
  //   fail: function () {
  //   // fail
  //   },
  //   complete: function () {
  //   // complete
  //   }
  //   })
  //   },
    //生成商户订单
    generateOrder: function (openid) {
      var that = this
      wx.request({
        url: 'http://localhost:25492/wx/getda',//后台请求地址
        method: 'GET',
        data: {
          gfee: '商品价钱',
          gname: '商品名称',
          openId: openid
          //（商品价钱和商品名称根据自身需要是否传值, openid为必传）
        },
        success: function (res) {
          console.log("后台获取数据成功");
          console.log(res);
          var param = { "timeStamp": res.data.timeStamp, "package": res.data.package, "paySign": res.data.paySign, "signType": "MD5", "nonceStr": res.data.nonceStr };
            //发起支付
          that.pay(param);
        },
        fail: function (res) {
          console.log("向后台发送数据失败")
        }
      })
    },
    //支付
    pay: function (param) {
      var that = this;
      console.log("发起支付")
      console.log(param)
      wx.requestPayment({
        timeStamp: param.timeStamp,
        nonceStr: param.nonceStr,
        package: param.package,
        signType: param.signType,
        paySign: param.paySign,
        success: function (res) {
          console.log("success");
          console.log(res);
        },
        fail: function (res) {
          console.log("fail")
          console.log(res);
        },
        complete: function (res) {
          console.log("complete");
          console.log(res)
        }
      })
    },


  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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