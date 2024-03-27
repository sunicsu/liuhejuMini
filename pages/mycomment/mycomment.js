// pages/mycomment.js
const app = getApp()
const imageUrl = app.globalData.baseUrl + '/upload_image'
const cookieUtil = require('../../utils/cookie/Cookie.js')

Page({
  data: {
    // 需要上传的图片
    needUploadFiles: [],
    // 已下载的备份图片
    downloadedBackupedFiles: [],
    img_arr: [],
    title: "",
    number: "",
    // 存放微信图片地址
    imgList: "",
  },

     // 文件标题
  companyTitle: function(e) {
      // console.log(e)
      this.setData({ title: e.detail.value })   // 获取从键盘输入的值
    },
    // 资格证号
  companyNumber: function(e) {
      this.setData({ number: e.detail.value })
    },
  // 选择图片上传
  chooseImage: function(e) {
    var that = this;
    wx.chooseMedia({
			count: 1, // 选择的图片个数，默认值9
			mediaType: ['image'], // 文件类型
			sizeType: ['original'], // 是否压缩所选文件
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: res => {
				// console.log(res);
				that.setData({
					imgList: res.tempFiles[0].tempFilePath
        })
        // console.log(that.data.imgList);
        console.log(res);
        // console.log("img-url:", res.tempFiles[0].tempFilePath)
        wx.showToast({
          title: '已选择图片',
          icon: 'none'
        })
      },
      fail: res => {
        wx.showToast({
          title: '未选择图片',
          icon: 'none'
        })
      }
    })
  },

  // 上传图片文件
  uploadFiles: function() {
    // var that = this
    var value = cookieUtil.getCookieFromStorage('cookie')
    console.log('get cookie', value)
    var header = {}
    header.Cookie = value
    for (var i = 0; i < this.data.needUploadFiles.length; i ++){
      var filePath = this.data.needUploadFiles[i]
      wx.uploadFile({
        url: app.globalData.baseUrl + '/upload_image',
        filePath: filePath,
        header: header,
        name: 'test',
        success: function(res){
          console.log(res)
        }
      })
    }
  },

  // 下载图片
  downloadFile: function (imgItem) {
    var that = this
    wx.downloadFile({
      url: app.globalData.serverUrl + app.globalData.apiVersion + '/service/image' + '?md5=' + '1ad78e3e075fd648882ba5299728369b',
      success: function(res){
        var tmpPath = res.tempFilePath
        var newDownloadedBackupedFiles = that.data.downloadedBackupedFiles
        newDownloadedBackupedFiles.push(tmpPath)
        that.setData({
          downloadedBackupedFiles: newDownloadedBackupedFiles
        })
      }
    })
  },

  // 删除图片
  deleteBackup: function(imgItem){
    wx.request({
      url: app.globalData.serverUrl + app.globalData.apiVersion + '/service/image' + '?md5=' + '1ad78e3e075fd648882ba5299728369b',
      method: 'DELETE',
      success: function(res){
        console.log(res.data)
        wx.showToast({
          title: '删除成功',
        })
      }
    })
  },

 //判断是否填完整，并将input中的数据上传到服务器  
 formSubmit: function (e) { 
    var that = this
    var value = cookieUtil.getCookieFromStorage('cookie')
    console.log('get cookie', value)
    var header = {}
    header.Cookie = value
    var alreadyChoosedImageList = this.data.imgList;
    var title = this.data.title
    var number = this.data.number
    // 上传图片
    wx.uploadFile({
      filePath: alreadyChoosedImageList,   //要上传文件资源的路径 (本地路径)
      name: 'file',
      url: 'http://127.0.0.1:8000/api/TakeImage',        // 自己的API接口
      // header: {
      //   "content-type": "multipart/form-data",
      // },
      header: header,
      formData: {
        // title: "你好",
        // number: "18"
        title: JSON.stringify(title),
        text: JSON.stringify(number),
        username: '匿名用户'
      },
      success: res => {
        console.log('上传成功:', res)
        wx.showToast({
          title: '图片上传成功',
          icon: 'success'
        });
      },
      fail: function (err) {
        console.error(err);
        wx.showToast({
          title: '图片上传失败',
          icon: 'none'
        });
      }
    })
  }
})

