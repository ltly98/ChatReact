import React from 'react';
import {List, notification} from "antd";
import {connect} from "react-redux";

//为了规范，将引用和自定义内容分开
import './index.css';
import {initSocket, sendChatMessage} from "../../store/action";
import MyTime from "../../utils/myTime";
import MySocket from "../../utils/mySocket";

{/*
    编辑者：F
    功能：聊天组件
    说明：使用了redux，处理起来更为复杂
*/
}

class ChatList extends React.Component {
    constructor(props) {
        super(props);
        //存储滚动条对应标签
        this.scroll = null;
        //不是所有的state都需要redux管理
        this.state = {
            inputValue: ""
        };

        this.handleScoll = this.handleScoll.bind(this);
    }

    //滚动条跟踪,此处为点击输入框加载到底部
    handleScoll() {
        if(this.scroll !== null){
            const scrollHeight=this.scroll.scrollHeight;
            const clientHeight=this.scroll.clientHeight;
            const maxScrollTop=scrollHeight-clientHeight;
            this.scroll.scrollTop=maxScrollTop > 0 ? maxScrollTop : 0;
        }
    }

    render() {
        this.handleScoll()
        return (
            <div>
                <div className="chat-list-wrapper"  ref={e => {
                    this.scroll = e;
                }}>
                    <div className="chat-list">
                        <List dataSource={this.props.chatList}
                              renderItem={item => {
                                  return (<List.Item
                                      className={item.role === "sender" ? "chat-list-card-sender-content" : "chat-list-receiver-content"}>
                                      <p className={item.role === "sender" ? "chat-list-card-sender" : ""}>{item.remarks === "" ? item.nickName : item.remarks}</p>
                                      <p className={item.read === 1 ? "chat-list-card-read" : "chat-list-card-unread"}>{item.read === 1 ? "已读" : "未读"}</p>
                                      <p className="chat-list-card-content">{item.content}</p>
                                      <p className="chat-list-card-time">{item.time}</p>
                                  </List.Item>)
                              }}/>
                    </div>
                </div>
                <div className="chat-list-input-wrapper">
                    <input className="chat-list-input" value={this.state.inputValue}
                           onClick={this.handleScoll}
                           onChange={e => this.setState({inputValue: e.target.value})}/>
                    <button
                        className={this.state.inputValue === "" ? "chat-list-input-btn-disabled" : "chat-list-input-btn"}
                        disabled={this.state.inputValue === ""}
                        onClick={this.props.sendChatMessage(this.props.userId,
                            this.props.chatId,
                            this.props.token,
                            this.state.inputValue,
                            this.props.socket)}>
                        发送
                    </button>
                </div>
            </div>);
    }
}

const mapStateToProps = state => {
    return {
        cId: state.cId,
        userId: state.userId,
        token:state.token,
        chatId: state.chatId,
        chatList: state.chatList,
        socket: state.socket
    }
}

const mapDispatchToProps = dispatch => {
    return {
        //发送聊天内容
        sendChatMessage: (userId, chatId,token, inputValue, socket) => {
            return () => {
                //此处先设置数据内容，方便后续处理
                const data = {
                    id: userId,
                    nickName: '我',
                    role: "sender",
                    content: inputValue,
                    time: new MyTime().Time,
                    read: 0,
                    remarks: ""
                }
                if (socket.Socket !== undefined && socket.Socket.readyState === 1) {
                    socket.onSend({
                        opcode: 2, carrier: {
                            senderid: userId,
                            receiverid: chatId,
                            logcontent: inputValue,
                            logtime: data.time,
                            logread: data.read
                        }
                    })
                }else{
                    notification.open({
                        message: '连接异常',
                        description: "连接异常，准备重新连接",
                        duration: 2,
                        onClose: () => {
                            let socket = new MySocket(userId,token);
                            dispatch(initSocket(socket));
                            socket.Init();
                        }
                    });
                }
                dispatch(sendChatMessage(data))
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);

