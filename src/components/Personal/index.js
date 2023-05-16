import React from 'react';
import {Card, List, notification, Popconfirm} from "antd";
import {Link} from 'react-router-dom';
import {connect} from "react-redux";

//为了规范，将引用和自定义内容分开
import './index.css';
import {initData, initSocket, onChangeRequest} from "../../store/action";
import MyTime from "../../utils/myTime";
import MySocket from "../../utils/mySocket";

{/*
    编辑者：F
    功能：主页个人信息组件
    说明：使用了redux，处理起来更为复杂
*/
}

class Personal extends React.Component {
    constructor(props) {
        super(props);
        //不是所有的state都需要redux管理
        this.state = {
            inputValue: ""
        };
    }

    //尝试性使用，是否有效待定，防止相同state的重复渲染
    shouldComponentUpdate(nextProps, nextState) {
        const props = JSON.stringify(nextProps)
        const state = JSON.stringify(nextState)
        return props !== state
    }

    render() {
        //处理引用组件Card需要的数据
        const PersonalInfo = [
            {
                title: "用户ID",
                description: this.props.userId
            }, {
                title: "用户名",
                description: this.props.userName
            }, {
                title: "昵称",
                description: this.props.nickName
            }
        ]
        return (
            <div>
                <div className="personal-card-wrapper">
                    <Card className="personal-card">
                        <List
                            className="personal-card-list"
                            dataSource={PersonalInfo}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.title}
                                        description={item.description}
                                    />
                                </List.Item>
                            )}>
                        </List>
                    </Card>
                </div>

                <div className="personal-request-list-wrapper">
                    <List bordered
                          header={<div className="personal-request-list-header">
                              <div>
                                  <input type="number"
                                         onChange={e => this.setState({inputValue: e.target.value})}
                                         className="personal-request-list-header-input"
                                         placeholder="请输入好友id"/>
                              </div>
                              <div>
                                  <button
                                      className={this.state.inputValue === "" ? "personal-request-list-header-btn-disabled" : "personal-request-list-header-btn"}
                                      disabled={this.state.inputValue === ""}
                                      onClick={this.props.onAddRequest(this.props.userId,
                                          this.props.token,
                                          this.state.inputValue,
                                          this.props.socket)}>添加好友
                                  </button>
                              </div>
                          </div>}
                          dataSource={this.props.requestList}
                          renderItem={item => {
                              return (<List.Item className="personal-request-list-item"
                                                 actions={[<Popconfirm title="你确定要添加？（操作后会删除该条记录）"
                                                                       okText="确认"
                                                                       cancelText="取消"
                                                                       placement="bottom"
                                                                       onConfirm={this.props.onChangeRequest(true, item.requestId, item.id, this.props.userId,this.props.token,  this.props.socket)}>
                                                     <button className="personal-request-list-btn-agree">同意</button>
                                                 </Popconfirm>, <Popconfirm title="你确定要拒绝？（操作后会删除该条记录）"
                                                                            okText="确认"
                                                                            cancelText="取消"
                                                                            placement="bottom"
                                                                            onConfirm={this.props.onChangeRequest(false, item.requestId, item.id, this.props.userId,this.props.token, this.props.socket)}>
                                                     <button className="personal-request-list-btn-disagree">拒绝</button>
                                                 </Popconfirm>]}>
                                  <span>{item.id}</span>
                                  <span>{item.nickName}</span>
                                  <span>{item.time}</span>
                              </List.Item>)
                          }}
                    />
                </div>

                <div className="personal-btn-wrapper">
                    <Link to="/">
                        <button className="personal-btn" onClick={this.props.logout}>注销</button>
                    </Link>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        cId: state.cId,
        userId: state.userId,
        token: state.token,
        userName: state.userName,
        nickName: state.nickName,
        requestList: state.requestList,
        socket: state.socket
    }
}

const mapDispatchToProps = dispatch => {
    return {
        //同意和拒绝按钮使用
        onChangeRequest: (confirm, requestId, senderId, receiverId,token, socket) => {
            return () => {
                if (socket.Socket !== undefined && socket.Socket.readyState === 1) {
                    //此处自己是接受者，不是发送请求者
                    socket.onSend({
                        opcode: 6,
                        carrier: {
                            requestid: requestId,
                            senderid: senderId,
                            receiverid: receiverId,
                            isaccept: confirm ? 1 : 0
                        }
                    })
                }else{
                    notification.open({
                        message: '连接异常',
                        description: "连接异常，准备重新连接",
                        duration: 2,
                        onClose: () => {
                            let socket = new MySocket(receiverId,token);
                            dispatch(initSocket(socket));
                            socket.Init();
                        }
                    });
                }
                dispatch(onChangeRequest(requestId))
            }
        },
        //添加好友按钮使用
        onAddRequest: (senderId,token, receiverId, socket) => {
            //发送方不显示请求
            return () => {
                if (socket.Socket !== undefined && socket.Socket.readyState === 1) {
                    socket.onSend({
                        opcode: 5,
                        carrier: {
                            senderid: senderId,
                            receiverid: receiverId,
                            requesttime: new MyTime().Time,
                            isaccept: -1
                        }
                    });
                }else{
                    notification.open({
                        message: '连接异常',
                        description: "连接异常，准备重新连接",
                        duration: 2,
                        onClose: () => {
                            let socket = new MySocket(senderId,token);
                            dispatch(initSocket(socket));
                            socket.Init();
                        }
                    });
                }
            }
        },
        //注销
        logout: () => {
            return () => {
                //传空值直接变默认值
                dispatch(initData())
            }
        },
        initSocket:(socket)=>{
            dispatch(initSocket(socket))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Personal);