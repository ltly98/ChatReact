import React from 'react';
import {notification, Popconfirm} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {connect} from "react-redux";

//为了规范，将引用和自定义内容分开
import './index.css'
import {initSocket, onGroupSelect, onMenuMove, onMenuRename, onModalVisible} from "../../store/action";
import MySocket from "../../utils/mySocket";

{/*
    编辑者：F
    功能：菜单操作模态框组件
    说明：使用了redux，处理起来更为复杂
*/}

class MenuModal extends React.Component {

    constructor(props) {
        super(props);
        //中途分组的选中会改变，保留最初的选中索引
        this.oldGroupSelect = this.props.groupSelect;
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
        return (<div className={this.props.modalVisible ? 'menu-modal-wrapper' : 'menu-modal-wrapper-hidden'}>
            <div className="menu-modal-header">
                <div className="menu-modal-header-title">
                    {this.props.modalId === 0 ? "修改名称" : "移动分组"}
                </div>
                <div>
                    <button className="menu-modal-header-btn" onClick={this.props.onModalVisible(0, -1, -1, false)}>
                        <CloseOutlined/></button>
                </div>
            </div>
            <div className="menu-modal-content">
                {this.props.modalId === 0 ? <div className="modal-input-wrapper">
                    <input placeholder="请输入新名称"
                           onChange={e=>this.setState({inputValue:e.target.value})}
                           className="modal-input"/>
                    <Popconfirm title="你确定要更名？"
                        okText="确认"
                        cancelText="取消"
                        placement="bottom" disabled={this.state.inputValue === ""}
                        onConfirm={this.props.onMenuRename(this.state.inputValue,
                            this.props.groupSelect,
                            this.props.chatSelect,
                            false,
                            this.props.socket,
                            {
                                userId: this.props.userId,
                                token:this.props.token,
                                friendId: this.props.chatSelect === -1 ? 0 : this.props.friendList[this.props.groupSelect].children[this.props.chatSelect].id,
                                oldGroupName: this.props.friendList[this.props.groupSelect].name,
                                newGroupName: this.props.chatSelect === -1 ? this.state.inputValue : '',
                                remarks: this.props.chatSelect === -1 ? '' : this.state.inputValue
                            })}>
                        <button className={this.state.inputValue === ""?"modal-input-btn-disabled":"modal-input-btn"}>更名</button>
                    </Popconfirm>
                </div> : <div className="modal-list-wrapper">
                    {this.props.friendList.length === 0 ? '' : this.props.friendList.map((item, index) => {
                        return (<div key={index} onClick={this.props.onListSelect(index)}
                                     className={this.props.groupSelect === index ? 'modal-list-select' : 'modal-list'}>
                            {item.name}
                        </div>);
                    })}
                    <Popconfirm title="你确定要移动？"
                                okText="确认"
                                cancelText="取消"
                                placement="bottom"
                                onConfirm={this.props.onMenuMove(this.oldGroupSelect,
                                    this.props.groupSelect,
                                    this.props.chatSelect,
                                    false,
                                    this.props.socket,{
                                        userId: this.props.userId,
                                        token:this.props.token,
                                        friendId:this.props.friendList[this.oldGroupSelect].children[this.props.chatSelect].id,
                                        oldGroupName: this.props.friendList[this.oldGroupSelect].name,
                                        newGroupName: this.props.chatSelect === -1 ? '' : this.props.friendList[this.props.groupSelect].name
                                    })}>
                        <button className="modal-list-btn">移动</button>
                    </Popconfirm>
                </div>}
            </div>
        </div>);
    }
}

const mapStateToProps = state => {
    return {
        chatSelect: state.chatSelect,
        groupSelect: state.groupSelect,
        friendList: state.friendList,
        socket: state.socket,
        userId: state.userId,
        token:state.token,
        modalId: state.modalId,
        modalVisible: state.modalVisible
    }
}

const mapDispatchToProps = dispatch => {
    return {
        //重命名
        onMenuRename: (inputValue, groupSelect, chatSelect, modalVisible, socket, socketData) => {
            return () => {
                if (socket.Socket !== undefined && socket.Socket.readyState === 1) {
                    socket.onSend({
                        opcode: 8,
                        carrier: {
                            userid: socketData.userId,
                            friendid: socketData.friendId,
                            oldgroupname: socketData.oldGroupName,
                            newgroupname: socketData.newGroupName,
                            remarks: socketData.remarks
                        }
                    })
                }else{
                    notification.open({
                        message: '连接异常',
                        description: "连接异常，准备重新连接",
                        duration: 2,
                        onClose: () => {
                            dispatch(initSocket(new MySocket(socketData.userId,socketData.token)));
                        }
                    });
                }
                dispatch(onMenuRename(inputValue, groupSelect, chatSelect, modalVisible))
            }
        },
        //更换分组的选中状态切换
        onListSelect: (index) => {
            return () => {
                dispatch(onGroupSelect(index))
            }
        },
        //更换分组
        onMenuMove: (oldGroupSelect, newGroupSelect, chatSelect, modalVisible, socket, socketData) => {
            return () => {
                if (socket.Socket !== undefined && socket.Socket.readyState === 1) {
                    socket.onSend({
                        opcode: 8,
                        carrier: {
                            userid: socketData.userId,
                            friendid: socketData.friendId,
                            oldgroupname: socketData.oldGroupName,
                            newgroupname: socketData.newGroupName
                        }
                    })
                }else{
                    notification.open({
                        message: '连接异常',
                        description: "连接异常，准备重新连接",
                        duration: 2,
                        onClose: () => {
                            dispatch(initSocket(new MySocket(socketData.userId,socketData.token)));
                        }
                    });
                }
                dispatch(onMenuMove(oldGroupSelect, newGroupSelect, chatSelect, modalVisible))
            }
        },
        //当前modal的显示切换
        onModalVisible: (modalId, groupSelect, chatSelect, modalVisible) => {
            return () => {
                dispatch(onModalVisible(modalId, groupSelect, chatSelect, modalVisible))
            }
        },
        initSocket:(socket)=>{
            dispatch(initSocket(socket))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuModal);