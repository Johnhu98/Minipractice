const app = getApp();
Page({
  data: {
    id: '',
    activity_list: [],
    activity_array: [],
    cycle_list: [
      { title: '长期', id: 0 },
      { title: '月榜', id: 1 },
      { title: '周榜', id: 2 },
      { title: '日榜', id: 3 },
    ],
    householdItemList: ['房前屋后', '庭院卫生', '垃圾分类'],
    fieldItemList: ['菜地整洁', '作物长势', '病虫害情况', ''],
    currentCycleIndex: 0,
    rank_list: [],
    array: [],
    cycle_index: 0,
    activity_index: 0,
  },

})