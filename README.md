# 在线聊天系统-前端部分

使用react进行编写，实现基本聊天的显示

## 基本组成

- 登陆
  - 登陆按钮
  - 跳转忘记密码按钮
  - 跳转更换邮箱按钮
  - 跳转注册按钮
- 注册
  - 注册按钮
  - 发送验证码按钮
  - 跳转登陆按钮
- 忘记密码
  - 忘记密码按钮
  - 发送验证码按钮
  - 跳转登陆按钮
- 更换绑定邮箱
  - 更换绑定邮箱按钮
  - 发送旧邮箱验证码按钮
  - 发送新邮箱验证码按钮
  - 跳转登陆按钮
- 登陆后主页
    - 好友列表组件
      - 好友列表（各自附带菜单）
    - 在线聊天组件
      - 聊天列表
      - 发送消息输入框
      - 发送消息按钮
    - 个人信息组件
      - 个人信息列表
      - 退出登陆按钮
    - 底部菜单组件
      - 切换好友列表按钮
      - 切换在线聊天按钮
      - 切换个人信息按钮
    - 菜单模态框组件
      - 修改名称
      - 更换分组
- 404


## 其它使用列表

- Ant Design:样式的选择，但是会尽量写原生满足自定义需求，但参考组件样式
- React-router-dom:页面路由，非单页应用
- React-Redux:状态集中管理
- Redux-Persist:持久化处理
- Reconnecting-WebSocket:进行WebSocket通信，此处不用原生是因为很多问题写原生难以解决，而且这个还支持自动重连
