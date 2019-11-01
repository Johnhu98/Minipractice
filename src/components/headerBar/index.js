Component({
  properties: {
    title: {
      type: String,
      value: '',
    },
    color: {
      type: String,
      value: '#000',
    },
    bgcolor: {
      type: String,
      value: '#fff',
    },
    normal: {
      type: Boolean,
    },
    scanner: {
      type: Boolean,
    },
    fontsize: {
      type: Number,
      value: 50,
    },
  },
  data: { statusBarHeight: 0, titleBarHeight: 0},
  lifetimes: {
    attached() {
      wx.getSystemInfo({
        success: res => {
          this.setData({ statusBarHeight: res.statusBarHeight });
        },
      });
    },
  },
});