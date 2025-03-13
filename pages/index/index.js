// index.js
//获取应用实例
const app = getApp()
const cookieUtil = require('../../utils/cookie/Cookie.js')

Page({
  data: {
    // motto: 'ChickenDinner8！',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    book: '预订',
    hideNumModal: true,
    hideGridsModal:false,
    hideScanModal: true,
    peploenum: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
    table_name: '',
    table_station: '',
    scrollViewTitle: ['在线预订','现场桌台扫码'],
    currentIndex: 0,
    orderCategory: 0, //0: book, 1: scan
    grids: [] //包间数据
    
    
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  
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
      url: getApp().globalData.baseUrl + '/TableViewset',
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
  onShow: function () {
    this.onReady()//再次加载，实现返回上一页页面刷新
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  to_scan: function () {
    wx.scanCode({
      scanType: 'qrCode',
      success: (res) => {
        console.log(res.result);
        let decodedData = JSON.parse(res.result.slice(1)); // 解析JSON字符串为对象
        console.log(decodedData);
        let id = decodedData.table_id;
        let station = decodedData.station;
        let status = decodedData.status;
        let table_name = decodedData.table_name;
        this.setData({hideNumModal: false, table_name: table_name, table_station: station, orderCategory: 1});
        wx.setStorageSync('tableInfo', {
          "restaurantId": 4,
          "table_id": id,
          "table_name": table_name,
          "station": station,
          "status": status,
          "orderCategory": this.data.orderCategory
          });
      
        // this.select_num();  
         debugger; 
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },
  to_menu_trick(event) {
    let id = event.currentTarget.dataset.id;
    let status = event.currentTarget.dataset.status;
    let table_name = event.currentTarget.dataset.tablename;
    let station = event.currentTarget.dataset.station;
    this.setData({hideNumModal: false, table_name: table_name, table_station: station, orderCategory: 0})
    wx.setStorageSync('tableInfo', {
      "restaurantId": 4,
      "table_id": id,
      "table_name": table_name,
      "station": station,
      "status": status,
      "orderCategory": this.data.orderCategory
    });
   },
  select_num: function (event) {
    this.setData({hideNumModal: true})
    let people_num = parseInt(event.currentTarget.dataset.peploenum)
    let id = wx.getStorageSync('tableInfo').table_id
    let cart = cart ? cart : wx.getStorageSync('cartDish'+ id) || []
    let index = cart.findIndex(v => v.food_name === "小料、筷子")
    //debugger
    if(index === -1) { 
      //The food_id is 159 in the Online environment, otherwise it is 46 in the development environment.
      cart.push({food_id: 159, food_name: "小料、筷子", price: 6, num: people_num, checked: true})
      wx.setStorageSync('cartDish' + id, cart)
    } else {
      cart[index].num = people_num
      wx.setStorageSync('cartDish' + id, cart)
    }
    // debugger
    wx.navigateTo({
      url: '../menu/menu',
      success: function (res) {
        // success
        wx.hideLoading()
        // setTimeout(function(){
        //   wx.showToast({
        //   title: '您将预订' + wx.getStorageSync('tableInfo').table_name +'，'+ wx.getStorageSync('tableInfo').station + "，请确定好人数！",
        //   icon: 'none',
        //   duration: 3000
        // })
        // },500)
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    });
    // this.data.peploenum.item
  },
   // 点击关闭人数选择窗口
   showTable() {
    this.setData({
      hideNumModal: !this.data.hideNumModal, //显示人数选择弹窗
      // mask: !this.data.mask, //显示隐藏遮罩层
    });
  },

  changeCurrentIndex:function(e){
    this.setData({
      currentIndex:e.currentTarget.id,
      hideScanModal: !this.data.hideScanModal, //显示扫码弹窗
      hideGridsModal: !this.data.hideGridsModal, //隐藏预订
    })
  },
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
})
