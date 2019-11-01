//index.js
//获取应用实例
const app = getApp()
const config = require('../../config.js')

Page({
  data: {
    title: '',
    showAuthorize: false,
    imgUrls: [
    {'pic_url' : 'https://ipi-mzh.oss-cn-hangzhou.aliyuncs.com/file/upload/banner.jpeg'},
    {'pic_url' : 'https://ipi-mzh.oss-cn-hangzhou.aliyuncs.com/file/upload/yard_banner-min.png'},
    {'pic_url' : 'https://ipi-mzh.oss-cn-hangzhou.aliyuncs.com/file/upload/field_banner-min.png'}
    ],
    statusList: [
      { id: 1, name: '全部活动' },
      { id: 2, name: '未举办' },
      { id: 3, name: '举办中' },
      { id: 4, name: '已举办'}
    ],
    typeList: [
      { id: 1, name: '环境卫生', active: false },
      { id: 2, name: '治安巡逻', active: false },
      { id: 3, name: '交通劝导', active: false },
      { id: 4, name: '学习培训', active: false },
      { id: 5, name: '互学互比', active: false },
      { id: 6, name: '其它', active: false },
    ],
    activityList: [
      {
        url: '../../assets/image/recent_1.png',
        title: '戴村镇公益活动',
      },
      {
        url: '../../assets/image/recent_2.png',
        title: '戴村镇公益活动',
      },
      {
        url: '../../assets/image/recent_3.png',
        title: '戴村镇公益活动',
      },
    ],
    placeList: [
    ],
    statusId: 1,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    swiperIndex: 0,
    statusName: '全部活动',
    statusActive: false,
    timeActive: false,
    placeActive: false,
    sort: 'desc',
  },
  swiperChange(e) {
    this.setData({
      swiperIndex: e.detail.current,
    });
  },
  chooseStatus() {
    this.setData({
      placeActive: false,
      typeActive: false,
      statusActive: !this.data.statusActive,
    });
  },
  chooseTime() {
    this.data.page = 0;
    this.setData({ timeActive: !this.data.timeActive });
    if (this.data.timeActive === true) {
      this.data.sort = 'asc';
    } else {
      this.data.sort = 'desc';
    }
    this.getData();
  },
  choosePlace() {
    this.setData({
      typeActive: false,
      statusActive: false,
      placeActive: !this.data.placeActive,
    });
  },
  closeMask() {
    this.setData({
      statusActive: false,
      typeActive: false,
      placeActive: false,
    })
  },
  clearType() {
    this.data.typeList.forEach(item => {
        item.active = false;
    });
    this.setData({ typeList: this.data.typeList });
  },
  chooseItem(e) {  
    this.data.page = 0;
    const { name } = e.currentTarget.dataset;
    const { id } = e.currentTarget.dataset;
    this.setData({ statusName: name, statusId: id, statusActive: false });
  },
  chooseType() {
    this.setData({
      statusActive: false,
      placeActive: false,
      typeActive: !this.data.typeActive,
    });
  },
  chooseTime() {
    this.data.page = 0;
    this.setData({ timeActive: !this.data.timeActive });
    this.data.timeActive ? this.data.sort = 'asc' : this.data.sort = 'desc';
  },
  choosePrimaryPlace(e) {
    const { id } = e.currentTarget.dataset;
    
    this.setData({ primaryId: id, placeActive: !this.data.placeActive });
  },
  chooseTypes(e) {
    const { id } = e.currentTarget.dataset;
    this.data.typeList.forEach(item => {
      if (id === item.id) {
        item.active = !item.active;
      }
    });
    this.setData({ typeList: this.data.typeList });
  },
  confirm() {
    this.setData({
      statusActive: false,
      timeActive: false,
      placeActive: false,
    })
  },
  createActivity() {
    app.userLogin().then(() => {
      if (!app.globalData.userInfo.phone_certified) {
        wx.showModal({
          title: '手机绑定',
          content: `您尚未绑定手机号，绑定手机号参加活
      动后可获得积分，积分可兑换戴村专属
      权益及实物等~`,
          cancelText: '跳过',
          cancelColor: '#CCC',
          confirmText: '立即绑定',
          confirmColor: '#749C74',
          success: res => {
            if (res.confirm) {
              wx.navigateTo({
                url: `/pages/register/index`,
              });
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          },
        });
      } else {
        wx.navigateTo({
          url: `/pages/quickCreateAct/index`,
        });
      }
    });
  },
  attendActivity() {
    wx.navigateTo({
      url: `/pages/activityAll/index`,
    });
  },
 
})
