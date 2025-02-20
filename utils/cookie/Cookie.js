const key = 'cookie'

function getSessionIDFromResponse(res){
  var cookie = res.header['Set-Cookie']
  console.log('get cookie from response: ', cookie)
  return cookie
}

function setCookieToStorage(cookie) {
  try {
    console.log('set cookie to Storage: ', cookie)
    wx.setStorageSync(key, cookie)
  } catch (e) {
    console.log(e)
  }
}

function getCookieFromStorage(key) {
  var value = wx.getStorageSync(key)
  console.log('get cookie from storage: ', value)
  return value
}

module.exports = {
  // cookie: new Cookie('cookie'),
  getSessionIDFromResponse: getSessionIDFromResponse,
  setCookieToStorage: setCookieToStorage,
  getCookieFromStorage: getCookieFromStorage
}