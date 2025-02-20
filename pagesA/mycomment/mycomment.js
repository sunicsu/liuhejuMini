// pages/mycomment.js
const app = getApp()
const imageUrl = app.globalData.baseUrl + '/upload_image'
const cookieUtil = require('../../utils/cookie/Cookie.js')

Page({
  data: {
    title: '',
    number: '',
    // 存放微信图片地址
    // imgList: '',
    pic: ''
  },

     // 标题
  companyTitle: function(e) {
      // console.log(e)
      this.setData({ title: e.detail.value })   // 获取从键盘输入的值
    },
    // 评论内容
  companyNumber: function(e) {
      this.setData({ number: e.detail.value })
    },
  
  
  chooseImage() {
    let that = this
    // 图片限制大小
    const fileLimit = 2 * 1024 * 1024
    // 选择图片原图或是压缩图
    wx.chooseMedia({
        sizeType: ['original', 'compressed'],
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        success: async function (res) {
            let tempFiles = res.tempFiles
            if (tempFiles.length) {
                for (let i = 0; i < tempFiles.length; i++) {
                    let filePath = tempFiles[i].tempFilePath
                    const size = tempFiles[i].size / 1024 / 1024;
                    that.setData({
                        sizeBefore: size,
                    })
                    // 图片超过大小限制
                    // 手动压缩
                    filePath = await that.compressFile(filePath, i, tempFiles[i].size)
                    // 上传图片
                    that.setData({
                        pic: [filePath] // 将图片路径设置到数据中，用于在页面上显示
                    });
                    // 获取压缩后图片的信息，包括大小等
                    wx.getFileSystemManager().getFileInfo({
                        filePath: filePath,
                        success: fileInfo => {
                            that.setData({
                                compressSize: fileInfo.size / 1024 / 1024
                            })
                        },
                        fail: err => {
                            console.error('获取压缩后图片信息失败:', err);
                        }
                    });
                }
            }
        }
    })
},
  
  compressFile(src, i, size) {
    let that = this
    return new Promise((resolve) => {
        // 获取图片信息
        wx.getImageInfo({
            src,
            success: (img) => {
                let imgWidth = img.width
                let imgHeight = img.height
                //这段必看！！！！
                  const windowWidth= wx.getSystemSetting().windowWidth;
                    let imgRatio = imgHeight/imgWidth;
                    that.setData({
                        compressH: windowWidth * imgRatio
                    })
                    that.compressImage(src, size).then(res => {
                        resolve(res)
                    })
            },
            fail: () => {
                that.compressImage(src, size).then(res => {
                    resolve(res)
                })
            }
        })
    })
  },
  compressImage(src, size) {
    let that = this
    return new Promise((resolve, reject) => {
        let quality = 100
        // ios因为自己有压缩机制，压缩到极致就不会再压，因此往小了写
        if (this.data.isIOS) {
            quality = 0.1
        } else {
            let temp = 30 - parseInt(size / 1024 / 1024)
            quality = temp < 10 ? 10 : temp
        }
        that.setData({
            quality: quality //测试后 ios 0.1  安卓压缩仅对jpg图片压缩
        })
        wx.compressImage({
            src, // 图片路径
            quality: 10, // 压缩质量
            success: function (res) {
                console.log('官方API压缩res', res, quality)

                resolve(res.tempFilePath)
            },
            fail: function (err) {
                resolve(src)
            }
        })
    })
  },


 //判断是否填完整，并将input中的数据上传到服务器  
 formSubmit: function (e) { 
    var that = this
    var value = cookieUtil.getCookieFromStorage('cookie')
    console.log('get cookie', value)
    var header = {}
    header.Cookie = value
    var alreadyChoosedImageList = this.data.pic[0];
    var title = this.data.title
    var number = this.data.number
    // 上传图片
    wx.uploadFile({
      filePath: alreadyChoosedImageList,   //要上传文件资源的路径 (本地路径)
      name: 'file',
      url: getApp().globalData.baseUrl + '/TakeImage',        // 自己的API接口
      // header: {
      //   "content-type": "multipart/form-data",
      // },
      header: header,
      formData: {
        // title: "你好",
        // number: "18"
        title: JSON.stringify(title),
        text: JSON.stringify(number),
        // username: '匿名用户'
        username: wx.getStorageSync('userInfo').nickName
      },
      success: res => {
        console.log('上传成功:', res)
        wx.showToast({
          title: '评论上传成功',
          icon: 'success'
        });
      },
      fail: function (err) {
        console.error(err);
        wx.showToast({
          title: '评论上传失败',
          icon: 'none'
        });
      }
    })
  }
})

