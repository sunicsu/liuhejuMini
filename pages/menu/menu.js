//menu.js
//获取应用实例
//const app = getApp()

Page({
  data: {
    /*motto: 'ChickenDinner8！',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'), */
    menu: [],
    shopping: [],
    totalPrice: 0,
    totalNum: '0',
    showCartDetail: false,
    navLeftItems: [],  
    navRightItems: [],  
    curNav: 1,  
    curIndex: 0  
  },
  //事件处理函数
  /*bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },*/
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    // var listChild1 = list.List[0];
    var that = this;
    // 获取可视区高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          // list: listChild1,
          winHeight: res.windowHeight,
        })
      }
    })
  },
  onLoad: function () {
    let tableInfo = wx.getStorageSync('tableInfo')
    this.setData({
      tableInfo: tableInfo
    })
    console.log('load tableInfo', this.data.tableInfo)
    wx.showToast({
      title: '正在全力加载中',
      icon: 'loading',
      duration: 3000000
    })
    // request get Goodscetogory
    var that = this
    wx.request({
      url: 'http://127.0.0.1:8000/api/CategoryViewset',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        wx.hideToast();
        // console.log('get CategoryViewset', res)
        that.setData({
           navLeftItems: res.data
        })
      },
    })
    // get goods
    wx.request({
      url: 'http://127.0.0.1:8000/api/menu/' + this.data.tableInfo.restaurantId.toString(),
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        wx.hideToast();
        // console.log('get menu', res)
        that.setData({
          menu: res.data.foods
          // navLeftItems: res.data
          // navRightItems: res.data
        })
        for (var i = 0; i < that.data.menu.length; i++) {
          //that.data.menu[i].index = i.toString();
          var param = {}
          var string = 'menu[' + i + '].index'
          param[string] = i
          that.setData(param)
          string = 'menu[' + i + '].num'
          param[string] = 0
          that.setData(param)
        }
        //console.log('set menu', that.data.menu)
      },

      /*fail: function(res) {
        console.log('failed to load!')
      }*/
    })
  },

  //事件处理函数  
  switchRightTab: function(e) {  
    var that = this
    var id = e.target.id;
    var category_id =id+1
    console.log(typeof id)
    console.log(id)
    // get category dish
    wx.request({
      url: 'http://127.0.0.1:8000/api/get_category_dish/' + this.data.tableInfo.restaurantId.toString() + '/' + category_id,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        wx.hideToast();
        // console.log('get menu', res)
        that.setData({
          menu: res.data.foods
        })
      },
    })
    this.setData({
      // 动态把获取到的 id 传给 scrollTopId
      scrollTopId: id,
      // 左侧点击类样式
      curNav:id
    })
  },
  
  //保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。
  to_comment:function() {
    wx.navigateTo({
      url: '../comment/comment',
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

  to_submit: function () {
    if (this.data.totalNum != '0') {
      wx.setStorageSync('data', this.data.menu)
      wx.setStorageSync('totalPrice', this.data.totalPrice)
      wx.setStorageSync('totalNum', this.data.totalNum)

      wx.navigateTo({
        url: '../submit/submit',
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
    } else {
      wx.showModal({
        content: '小主还没点餐呢',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('去点餐')
          }
        }
      });
    }
    
  },

  // 将菜品加入购物车
  addDish: function(event) {  
    var newMenu = this.data.menu
    var obj = this.data.menu[event.target.dataset.index]
    newMenu[event.target.dataset.index].num++
    this.setData ({menu:newMenu})
    this.setData({ totalPrice: this.data.totalPrice + parseFloat(obj.price) })
    this.setData({ totalNum: parseInt(this.data.totalNum) + 1 })
    console.log('count ', obj.num)
  },
  // 将菜品从购物车删除
  removeDish: function(event) {
    var newMenu = this.data.menu
    var obj = this.data.menu[event.target.dataset.index]
    newMenu[event.target.dataset.index].num--
    this.setData ({menu:newMenu})
    this.setData({ totalPrice: this.data.totalPrice - parseFloat(obj.price) })
    this.setData({ totalNum: parseInt(this.data.totalNum) - 1 })
  },
  showCartDetail: function () {
    this.setData({
      showCartDetail: !this.data.showCartDetail
    });
  },
  hideCartDetail: function () {
    this.setData({
      showCartDetail: false
    });
  },
  tapAddCart: function (event) {
    this.addDish(event)
  },
  tapMinusCart: function (event) {
    this.removeDish(event)
    if (!this.data.totalNum) {
      this.setData({showCartDetail : !this.data.showCartDetail})
    }
  }

})
