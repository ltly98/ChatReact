import ReconnectingWebSocket from "reconnecting-websocket";
import {store} from "../store";
import {initData, insertData} from "../store/action";
{/*
    编辑者：F
    功能：进行websocket通信
    说明：核心处理登陆后的通讯
*/
}

const opCode = {
    //获取用户信息
    GetUserInfo: 0,
    //获取聊天记录
    GetChatLog: 1,
    //发送聊天记录
    SendChatLog: 2,
    //更改聊天记录，主要是是否读取消息
    ChangeChatLog: 3,
    //获取好友请求
    GetAddRequest: 4,
    //发送好友请求
    SendAddRequest: 5,
    //修改好友请求，主要是同意或者拒绝
    ChangeAddRequest: 6,
    //获取好友分组
    GetGroup: 7,
    //修改好友分组
    ChangeGroup: 8,
    //清除好友分组
    EliminateGroup: 9
}

export default class MySocket {
    constructor(id, token) {
        //地址拼接
        this.Url = "ws://localhost:8080/api/v1/ws?id=" + id + "&token=" + token;
        this.UserId = id;
        this.token = token;
        this.Socket = null;
    }

    Init() {
        //建立连接
        this.Socket = new ReconnectingWebSocket(this.Url)
        //监听是否开启连接
        this.Socket.addEventListener('open', () => {
            if (!this.Socket) {
                return;
            }
        })
        //监听接收消息
        this.Socket.addEventListener('message', (e) => {
            const data = JSON.parse(e.data)
            if(data.data === null) return;
            if (data.datatype === opCode.GetUserInfo) {
                store.dispatch(initData({userName: data.username, nickName: data.nickname}))
            }
            if (data.datatype === opCode.GetChatLog || data.datatype === opCode.SendChatLog) {
                const list = [...data.data]
                let newList = []
                list.map((item) => {
                    let id = item.sender.id === this.UserId ? item.sender.id : item.receiver.id;
                    let role = item.sender.id === this.UserId ? "sender" : "receiver";
                    let nickName = item.sender.id === this.UserId ? item.sender.nickname : item.receiver.nickname;
                    let remarks = item.sender.id === this.UserId ? item.sender.remarks : item.receiver.remarks;
                    newList.push({
                        id,
                        role,
                        nickName,
                        remarks,
                        content: item.content,
                        time: item.time,
                        read: item.read
                    })
                })
                store.dispatch(initData({chatList: newList}))
            }
            if (data.datatype === opCode.ChangeChatLog) {
                console.log(data)
            }
            if (data.datatype === opCode.GetGroup || data.datatype === opCode.ChangeGroup || data.datatype === opCode.EliminateGroup) {
                const list = [...data.data]
                let newList = []
                let groupNames = []
                list.map((item) => {
                    if (groupNames.length === 0 || groupNames.indexOf(item.groupname) === -1) {
                        groupNames.push(item.groupname);
                        newList.push({
                            name: item.groupname,
                            visible: false,
                            menu: false,
                            children: []
                        })
                    }
                    if (item.id !== 0) {
                        let index = groupNames.indexOf(item.groupname)
                        newList[index].children.push({
                            id: item.id,
                            nickName: item.nickname,
                            remarks: item.remarks,
                            menu: false
                        })
                    }
                })
                store.dispatch(initData({friendList: newList}))
            }
            if (data.datatype === opCode.GetAddRequest || data.datatype === opCode.SendAddRequest) {
                const list = [...data.data]
                const newList = []
                list.map((item) => {
                    newList.push({
                        requestId: item.requestid,
                        id: item.senderid,
                        nickName: item.sendername,
                        time: item.requesttime
                    })
                })
                store.dispatch(initData({requestList: newList}))
            }
        })
        //监听错误
        this.Socket.addEventListener('error', (e) => {
            console.log(e.message)
        })
        //关闭操作
        this.Socket.addEventListener('close', () => {
            this.Socket = null;
            console.info("asset service disconnected.");
        })
    }

    onSend(msg) {
        //此处应为json格式数据
        this.Socket.send(JSON.stringify(msg))
    }

    onClose() {
        this.Socket.close()
    }

}
