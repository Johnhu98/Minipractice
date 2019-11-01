const config = require('./config.js');

App({
  url: config.url,
  title: '戴村映山红', // 转发标题
  globalData: {
    userInfo: {
      has_dot: false,
      certified: false,
      can_verify: false,
    },
    login: true,
    token: '',
    second: 60,
  },

  onLaunch() {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(() => {
      // 请求完新版本信息的回调
    });
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        },
      });
    });
    updateManager.onUpdateFailed(() => {
      // 新版本下载失败
    });

    wx.getSystemInfo({
      success: res => {
        if (res.model.search('iPhone X') !== -1) {
          this.globalData.iphoneX = true;
        }
      },
    });
  },

  wxRequest(url, data, method) {
    wx.showLoading();
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.url}${url}`,
        method: method || 'get',
        data,
        header: {
          Authorization: `Bearer ${this.globalData.userInfo.login_token}`,
        },
        success: res => {
          wx.hideLoading();
          if (res.statusCode === 200) {
            resolve(res);
          } else {
            // wx.showModal({
            //   title: '提示',
            //   content: `message code: ${res.statusCode}`,
            //   showCancel: false,
            // });
            reject(res);
          }
        },
        fail: res => {
          wx.showToast({
            title: 'error',
            icon: 'none',
          });
          reject(res);
        },
      });
    });
  },

  // 控制个人中心消息圆点
  checkUnReadMessage(hasDot) {
    // 有未读消息
    if (hasDot) {
      wx.setTabBarItem({
        index: 2,
        text: '个人中心',
        iconPath: '/assets/image/user_unselected_message.png',
        selectedIconPath: '/assets/image/user_message.png',
      });
    }
    // 无未读消息
    else {
      wx.setTabBarItem({
        index: 2,
        text: '个人中心',
        iconPath: '/assets/image/user_unselected.png',
        selectedIconPath: '/assets/image/user.png',
      });
    }
  },

  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: wxs => {
          const data = {
            code: wxs.code,
          };
          wx.request({
            url: `${this.url}user/login`,
            data,
            method: 'post',
            success: response => {
              if (response.statusCode === 200) {
                this.globalData.userInfo = response.data;
                this.wxRequest(`statistics`, { type: 1 }).then(re => {
                  this.globalData.has_dot = re.data.has_dot;
                  this.checkUnReadMessage(re.data.has_dot);
                });
                resolve();
              } else {
                wx.showToast({
                  title: 'error',
                  icon: 'none',
                  duration: 2000,
                });
                reject();
              }
            },
            fail: () => {
              wx.showToast({
                title: '网络错误',
                icon: 'none',
                duration: 2000,
              });
            },
          });
        },
      });
    });
  },
  userLogin() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          if (!res.authSetting['scope.userInfo']) {
            wx.setStorageSync('userLogin', false);
            wx.showModal({
              title: '温馨提示',
              content: '需要您的授权，才能正常使用哦～',
              showCancel: false,
            });
            reject();
          } else if (!wx.getStorageSync('userLogin')) {
            wx.login({
              success: wxs => {
                wx.getUserInfo({
                  success: resInfo => {
                    wx.request({
                      url: `${this.url}user/certification`,
                      method: 'post',
                      data: {
                        code: wxs.code,
                        encrypted_data: resInfo.encryptedData,
                        iv: resInfo.iv,
                      },
                      success: response => {
                        if (response.statusCode === 200) {
                          wx.setStorageSync('userLogin', true);
                          this.globalData.userInfo = response.data;
                          this.wxRequest(`statistics`, { type: 1 }).then(re => {
                            this.globalData.has_dot = re.data.has_dot;
                            this.checkUnReadMessage(re.data.has_dot);
                          });
                          resolve();
                        } else {
                          wx.showToast({
                            title: 'error',
                            icon: 'none',
                            duration: 2000,
                          });
                        }
                      },
                      fail: () => {
                        wx.showToast({
                          title: '网络错误',
                          icon: 'none',
                          duration: 2000,
                        });
                      },
                    });
                  },
                });
              },
            });
          } else {
            resolve();
          }
        },
      });
    });
  },

  wxUpload(raw) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${this.url}file`,
        filePath: raw,
        name: 'file',
        header: {
          Authorization: `Bearer ${this.globalData.userInfo.login_token}`,
        },
        success: res => {
          if (res.statusCode === 200) {
            resolve(res.data);
          } else {
            reject(res);
          }
        },
        fail: res => {
          reject(res);
          wx.showToast({
            title: '上传失败',
            icon: 'none',
            duration: 2000,
          });
        },
      });
    });
  },
});
