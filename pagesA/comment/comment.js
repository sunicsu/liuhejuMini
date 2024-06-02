// comment.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    comment_count: '0',
    comment: [{
      img: '../../images/comment_img1.jpg',
      userImg: '../../images/userimg1.png',
      userName: '一叶知秋',
      date: '2024-05-03',
      desc: '好吃的菜，可爱的人，有趣的心灵，还会再来的。',
      likeCount: 31,
      unlikeCount: 5,
      canlike: 'true',
      index: 0
    }, {
      img: '../../images/comment_img3.jpg',
      userImg: '../../images/userimg3.png',
      userName: '就是不说名字的人',
      date: '2024-05-05',
      desc: '今天吃的很开心，喜欢这家餐厅，传统的味道、地道的羊肉、精致的菜品。',
      likeCount: 101,
      unlikeCount: 0,
      canlike: 'true',
      index: 1
    }],
    comments:[],
  }, 

  onLoad: function () {
    this.setData({
      comment_count: this.data.comment.length.toString() 
    });
    var that = this
    wx.request({
      url: app.globalData.baseUrl + '/get_comments',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        wx.hideToast();
        //console.log('get menu', res.data.foods)
        that.setData({
          comments: res.data.comments,
         })
    //     //console.log('set menu', that.data.menu)
      },

    //   /*fail: function(res) {
    //     console.log('failed to load!')
    //   }*/
    })
    console.log('comment_count', this.data.comment_count)
  },

  toCommit: function() {
    // wx.showToast({
    //   title: '功能正在开发中',
    //   icon: 'loading',
    //   duration: 1000
    // })
    wx.navigateTo({
      url: '/pagesA/mycomment/mycomment',
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

  addLike: function(event) {
    var index = event.target.id
    if (this.data.comment[index].canlike === 'true') {
      console.log('comment data ', this.data)
      var param = {}
      var string = 'comment[' + index + '].canlike'
      var string2 = 'comment[' + index + '].likeCount'
      param[string] = 'false'
      this.setData(param)
      param[string2] = this.data.comment[index].likeCount + 1
      this.setData(param)
      console.log('param', param)
      console.log('after setData', this.data.comment)
    } else {
      wx.showModal({
        content: '你已经表态过了哦',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('再次点击like/unlike')
          }
        }
      })
    }
  },

  addUnlike: function(event) {
    console.log('comment data ', this.data)
    var index = event.target.id
    console.log('unlike touch index', index)
    if (this.data.comment[index].canlike == 'true') {
      var param = {}
      var string = 'comment[' + index + '].canlike'
      var string2 = 'comment[' + index + '].unlikeCount'
      param[string] = 'false'
      this.setData(param)
      param[string2] = this.data.comment[index].unlikeCount + 1
      this.setData(param)
    } else {
      wx.showModal({
        content: '你已经表态过了哦',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('再次点击like/unlike')
          }
        }
      })
    }
  }
});