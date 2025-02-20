// comment.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    comment_count: '0',
    comments:[],
  }, 

  onLoad: function () {
   
    var that = this
    wx.request({
      url: app.globalData.baseUrl + '/get_comments',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        wx.hideToast();
        console.log('get comments:', res.data.comments)
        that.setData({
          comments: res.data.comments,
          comment_count: res.data.comments.length.toString() 
         })
      },

    //   /*fail: function(res) {
    //     console.log('failed to load!')
    //   }*/
    })

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
    var that = this   
    var index = event.currentTarget.dataset.index
    // debugger
    console.log("id:",index)
    if (this.data.comments[index].canlike === true) {
      console.log('comments data ', this.data.comments)
      var param = {}
      var string = 'comments[' + index + '].canlike'
      var string2 = 'comments[' + index + '].likecount'
      param[string] = false
      this.setData(param)
      param[string2] = this.data.comments[index].likecount + 1
      this.setData(param)
      console.log('param', param)
      console.log('after setData', this.data.comments)
      wx.request({
        url: app.globalData.baseUrl + '/update_comments/' + this.data.comments[index].comments_id + '/' + 1 + "/" + 0,
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        // data: postBody,
        success: function(res) {
          wx.hideToast();
          console.log('updated comments:', res.data.comments)
          that.setData({
            // comments: res.data.comments,
           })
        },
  
      //   /*fail: function(res) {
      //     console.log('failed to load!')
      //   }*/
      })
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
    console.log('comments data ', this.data.comments)
    var that = this 
    var index = event.currentTarget.dataset.index
    console.log('unlike touch index', index)
    if (this.data.comments[index].canlike == true) {
      var param = {}
      var string = 'comments[' + index + '].canlike'
      var string2 = 'comments[' + index + '].unlikecount'
      param[string] = 'false'
      this.setData(param)
      param[string2] = this.data.comments[index].unlikecount + 1
      this.setData(param)
      wx.request({
        url: app.globalData.baseUrl + '/update_comments/' + this.data.comments[index].comments_id + '/' + 0 + "/" + 1,
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        // data: postBody,
        success: function(res) {
          wx.hideToast();
          console.log('updated comments:', res.data.comments)
          that.setData({
            comments: res.data.comments,
           })
        },
  
      //   /*fail: function(res) {
      //     console.log('failed to load!')
      //   }*/
      })
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