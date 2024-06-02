//menu.js
//获取应用实例
const app = getApp()
const getRoundeNumber = num => {
  if (!Number.prototype._toFixed) {
      Number.prototype._toFixed = Number.prototype.toFixed
  }
  Number.prototype.toFixed = function(n) {
      return (this + 1e-14)._toFixed(n)
  }
  return Number(num).toFixed(2)
}

Page({
  data: {
    /*motto: 'ChickenDinner8！',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'), */
    menu: [], 
    newmenu: [], 
    menuall: [],
    productList: [],
    shopping: [],
    totalPrice: 0,
    totalNum: '0',
    showCartDetail: false,
    leftMenuList: [],
    rightContent: [],
    currentIndex: 0,
    winHeight: 0,
    // navRightItems: [],  
    num: 0,
    scrollTop: 0,
     //购物车弹窗显示隐藏
    hideModal: true,
    cartList: [],
    allChecked: true

  },

  // 为了方便使用数据，在data同层级下创建Cates空数组接收接口返回的数据
  Cates: [],
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
   // 菜品分组
   groupByKeyword: function(info) { 
    // var that = this
    let groupedData = {};
    if (Array.isArray(info)){
      info.forEach(item => {
      if (!groupedData[item.categoryname]) {
        groupedData[item.categoryname] = [];
      }
      groupedData[item.categoryname].push(item);
    });
    }      
    return groupedData;
   
    },
    //返回数据生成新数组
    createNewArray: function(menuall){
        var array = new Array()
         for (var i =0; i<that.data.menuall.length; i++){
          that.data.newmenu = that.data.menuall[i].children
          for (var j = 0; j < that.data.newmenu.length; j++){
            var keys = Object.keys(that.data.newmenu)[j]
            var values = that.data.newmenu[keys]
            // var array = new Array()
            var info = {}
            info['id'] = keys
            info['value'] = values
            array.push(info)
            // that.data.menu.push(that.data.menuall[i].children)
          }
        }
        that.data.menu = array
        console.log("array", array)
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
    // wx.request({
    //   url: 'http://127.0.0.1:8000/api/CategoryViewset',
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function(res) {
    //     wx.hideToast();
    //     that.setData({
    //        navLeftItems: res.data
    //     })
    //   },
    // })
    
    // get goods
    wx.request({
      // url: 'http://127.0.0.1:8000/api/menu/' + this.data.tableInfo.restaurantId.toString(),
      url: getApp().globalData.baseUrl + '/category_dish',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        wx.hideToast();
        that.data.menu = res.data;
        that.Cates = that.data.menu;
        wx.setStorageSync("cates", { time: Date.now(), data: that.Cates });
        let leftMenuList = that.Cates.map(v=>v.cat_name)
        // 构造右侧的大菜单数据
        // let rightContent = that.Cates.map(v=>v.children);
        let rightContent = that.data.menu;
        that.setData({
          menu: res.data,
          leftMenuList,
          rightContent
        }) 

        // that.data.rightContent = that.data.menu[0].children
        // console.log("rightContent", that.data.rightContent)
        console.log("get menu", that.data.menu)
        console.log("get leftMenuList", that.data.leftMenuList)
        console.log("get rightContent", that.data.rightContent)

        var k = 0
        for (var i = 0; i < that.data.menu.length; i++){
          // var k = 0
          for (var j = 0; j < that.data.menu[i].children.length; j++){
            that.data.menu[i].children[j].index = k
            that.data.menu[i].children[j].num = 0
            that.setData(that.data.menu[i])
            k++
          } 
        } 

      
      },

      /*fail: function(res) {
        console.log('failed to load!')
      }*/
    })
  },
  
  
   //事件处理函数  
  switchRightTab: function(e) {  
    const Cates = wx.getStorageSync('cates');
    //  2 判断  
    if(!Cates){
      // 不存在 发送请求获取数据
      this.onLoad();
    }else{
      // 有旧的数据 定义过期时间5分钟 1000ms = 1s
      if(Date.now()-Cates.time>1000*300){
        // 重新发送请求
        this.onLoad();
      }else{
        this.Cates = Cates.data;
        const {index} = e.currentTarget.dataset;
        let rightContent = this.Cates[index];
        var array = new Array()
        array.push(rightContent)
        this.setData({
          currentIndex: index,
          rightContent: array,
          scrollTop: 0
        })
        console.log("get rightContent again", this.data.rightContent)
      }
    }
// debugger;
  },
  
  //保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。
  to_comment:function() {
    wx.navigateTo({
      url: '/pagesA/comment/comment',
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

  to_business:function() {
    wx.navigateTo({
      url: '/pagesA/business/business',
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
      wx.setStorageSync('data', this.data.cartDish)
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
  // 点击关闭购物车窗口
  showCart() {
    this.setData({
      hideModal: !this.data.hideModal, //显示隐藏购物车弹窗
      // mask: !this.data.mask, //显示隐藏遮罩层
    });
  },
 // 点击购物车
  handleCart(event) {
    let id = wx.getStorageSync('tableInfo').table_id
    this.setData({
      cartList: wx.getStorageSync('cartDish' + id),
    })
    // debugger;
    if(wx.getStorageSync('cartDish' + id) && wx.getStorageSync('cartDish' + id).length != 0) {
      this.setData({hideModal: false})
      this.setCart()
    } else {
      wx.showToast({
        title: '请添加商品',
        icon: 'none'
      })
    }
  },
  // 将菜品加入购物车
  addDish: function(event) {  

    console.log(event)
    // var newMenu = this.data.menu
    // 选中的商品信息
    let productInfo = event.currentTarget.dataset.dishs
    let id = wx.getStorageSync('tableInfo').table_id
    // 先获取缓存中的商品信息
    let cart = wx.getStorageSync('cartDish' + id) || []
    // 判断当前商品是否第一次添加
    // debugger;
    let index = cart.findIndex(v => v.food_id === productInfo.food_id)
    if(index === -1) { 
      // 第一次添加则把商品信息及初始化的数量和选中状态一起存入
      cart.push({...productInfo, num: 1, checked: true})
      // debugger;
    } else {
      // 前面添加过的话只需要更改商品中的数量即可
      cart[index].num = cart[index].num + 1
    }
    // 把更改后的购物车数据重新存入缓存
    wx.setStorageSync('cartDish'+ id, cart)
    
    this.setData({cartList: cart})
    // console.log("get cartlist", this.data.cateList)
    wx.showToast({
      title: '商品已放入购物车',
      icon: 'none'
    })
    // 加入购物车给购物车加一个抖动的动画
    this.cartWwing()
    // 设置购物车状态（勾选、全选、总数、总价）
    this.setCart()
  

  },
  // 将菜品从购物车删除
  removeDish: function(event) {
    let that = this
    let productInfo = event.currentTarget.dataset.dishs
    let id = wx.getStorageSync('tableInfo').table_id
    let cart = wx.getStorageSync('cartDish'+ id) || []
    // 找到缓存中对应的商品
    let index = cart.findIndex(v => v.food_id === productInfo.food_id)
    // 商品数量大于1则直接减去数量，然后设置购物车状态

    if(cart[index].num > 1) {
      cart[index].num--;
      this.setCart(cart)
    } else if(cart[index].num == 1) {
      // 商品数量为1则给出弹窗提示
      cart[index].num = 0
      wx.showModal({
        content: '确定不要了吗？',
        success(res) {
          if(res.confirm) {
            // 确定移出则删除对应商品信息后设置购物车状态
            cart.splice(index,1)
          } else if(res.cancel) {
            // 取消后商品数量不做改变
            cart[index].num = 1
          }
          that.setCart(cart)
        }
      })
    }
  },
  // 设置购物车状态
  setCart(cart) {
    let id = wx.getStorageSync('tableInfo').table_id
    cart = cart ? cart : wx.getStorageSync('cartDish'+ id) || []
   
    if(cart.length === 0) {
      this.setData({hideModal: false})
    }
    let allChecked = true, totalNum = 0, totalPrice = 0
    cart.forEach(v => {
      if(v.checked) {
      	// 计算已经勾选商品的总价及总数
        totalPrice += getRoundeNumber(v.price * v.num) * 1
        totalNum += v.num
      } else {
      	// 购物车中存在商品且没有商品被勾选，则全选按钮取消勾选
        allChecked = false
      }
    })
    // 购物车中不存在商品，则全选按钮取消勾选
    allChecked = cart.length != 0 ? allChecked : false
    wx.setStorageSync('cartDish' + id, cart)
    this.setData({
      allChecked,
      totalNum,
      totalPrice,
      cartList: cart
    })
    this.handleList()
  },



  
  // 加入购物车动画
  cartWwing: function(){
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease-in'
    })
    animation.translateX(6).rotate(21).step()
    animation.translateX(-6).rotate(-21).step()
    animation.translateX(0).rotate(0).step()
    // 导出动画
    this.setData({
      ani: animation.export()
    })
  },
  // 购物车勾选
  checkboxChange(e) {
    console.log(e);
    let { id } = e.currentTarget.dataset
    let cartList = JSON.parse(JSON.stringify(this.data.cartList))
    let index = cartList.findIndex(v => v.id === id)
    cartList[index].checked = !cartList[index].checked
    this.setCart(cartList)
  },
  // 清空购物车
  handleClearCart() {
    let that = this
    wx.showModal({
      content:'确定不要了吗？',
      success(res) {
        if(res.confirm) {
          that.setCart([])
        } else if(res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },
  handleCheck(e) {
    let { id } = e.currentTarget.dataset
    let cartList = JSON.parse(JSON.stringify(this.data.cartList))
    let index = cartList.findIndex(v => v.id === id)
    cartList[index].checked = !cartList[index].checked
    // 设置购物车状态
    this.setCart(cartList)
  },
  // 全选
  handleAllCheck() {
    let { cartList,allChecked } = this.data
    allChecked = !allChecked
    cartList.forEach(v => v.checked = allChecked)
    // 设置购物车状态
    this.setCart(cartList)
  },
  // 购物车回填商品列表数据
  handleList() {
    let id = wx.getStorageSync('tableInfo').table_id
    let cart = wx.getStorageSync('cartDish' + id) || []
    let productList = this.data.productList.map(item => {
      delete item.num
      return item
    })
    productList.map(item => {
      cart.map(v => {
        if(item.id === v.id) {
          item.num = v.num
        } 
      })
    })
    this.setData({productList})
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
  handleClearCart() {
    let that = this
    wx.showModal({
      content:'确定不要了吗？',
      success(res) {
        if(res.confirm) {
          that.setCart([])
        } else if(res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
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
