# fetch_review
**A review collector for tmall, taobao, jingdong, suning.**

**Compatible with [Review Collect Server](https://github.com/ix64/review_collect).**
- fetch_review 0.0.1 插件将Chrome 76开发及测试平台
- fetch_review 未封装，请以开发者模式加载使用
### 使用方法
1. 打开 [插件管理](chrome://extensions) 打开开发者模式，将 fetch_review 0.0.1 解压缩，使用“加载已解压的扩展程序”方式加载
2. 右键扩展程序进入选项，输入 review_collect 的URL地址
3. 使用`--auto-open-devtools-for-tabs`参数重新启动Chrome
4. 访问对应商品页时，将自动收集商品评论的所有原始数据
