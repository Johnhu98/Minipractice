# 个人问题与小结
##等级列表##
**picker的一些问题**
> picker滚动选择器标签，value的值和range数组绑定，添加class标签会使picker空白部分失去唤起滚动选择器，内部标签正常，同时用<text>标签实现文字撑开
**wx:if  和 wx:for 联用的坑**
>wxml代码
```html
<view class="containtView">
  <block wx:for="{{list}}" wx:key="title" > 
    <view id = "{{item.id}}" class="tableView"  bindtap="selectedCell" >
        <view class="titleView">{{item.title}}</view>
        <image class="imageView" src="/pages/image/{{item.imageSource}}" mode="scaleToFill"></image>
    </view>
     
    <block wx:if="{{item.span}}" wx:for="{{item.sublist}}" wx:key="subtitle" >
        <view class="titleView" bindlongtap="subCellSelected">{{item.title}}</view>
    </block>
   
  </block>
</view>
```
***代码分析***
```html
<!--注意这里的wx:if 和 wx:for -->
 <block wx:if="{{item.span}}" wx:for="{{item.sublist}}" wx:key="subtitle" >
        <view class="titleView" bindlongtap="subCellSelected">{{item.title}}</view>
    </block>
```
>问题点: ```wx:if="{{item.span}}" ```此处的item  编译器真的能正确区分其作用域吗?事实是不行的!!! (意不意外,惊不惊喜?);事实上,上述代码结果无法得到正确结果
正确写法应该如下:(给外层item  来个别名就好了)
```html
<!--table.wxml-->
<view class="containtView">
  <block wx:for="{{list}}" wx:key="title" wx:for-item="pitem" > 
    <view id = "{{pitem.id}}" class="tableView"  bindtap="selectedCell"  >
        <view class="titleView">{{pitem.title}}</view>
        <image class="imageView" src="/pages/image/{{pitem.imageSource}}" mode="scaleToFill"></image>
    </view>
    <block wx:if="{{pitem.span}}">
        <block  wx:for="{{pitem.sublist}}" wx:key="subtitle" >
            <view class="titleView" bindlongtap="subCellSelected">{{item.title}}</view>
        </block>
  </block>
   
  </block>
</view>
```