import React from 'react';
import {List, Popconfirm,notification} from "antd";
import {RightOutlined, DownOutlined, UnorderedListOutlined} from "@ant-design/icons";
import {connect} from "react-redux";

//为了规范，将引用和自定义内容分开
import './index.css';
import {
    initSocket,
    onChangeListMenuVisible,
    onChangeListVisible,
    onMenuChat,
    onMenuDelete,
    onModalVisible
} from '../../store/action';
import MenuModal from "../MenuModal";
import MySocket from "../../utils/mySocket";

{/*
    编辑者：F
    功能：好友列表组件
    说明：使用了redux，处理起来更为复杂
*/}


class FriendList extends React.Component {

    //尝试性使用，是否有效待定，防止相同state的重复渲染
    shouldComponentUpdate(nextProps, nextState) {
        const props = JSON.stringify(nextProps)
        const state = JSON.stringify(nextState)
        return props !== state
    }

    render() {
        return (
            <div className="friend-list-wrapper">
                {
                    this.props.modalVisible ? <MenuModal/> : ''
                }
                <List className="friend-list" dataSource={this.props.friendList}
                      renderItem={(item, index) => {
                          return (
                              <>
                                  <List.Item onClick={this.props.onChangeListVisible(index)}
                                             className="friend-list-group"
                                             actions={[<button className="friend-list-menu-btn"
                                                               onClick={event => this.props.onChangeListMenuVisible(event, {index})}>
                                                 <UnorderedListOutlined/>
                                             </button>]}>
                                      {item.visible ? <DownOutlined style={{margin:'0 10px'}}/> : <RightOutlined style={{margin:'0 10px'}}/>}
                                      {item.name}({item.children.length})
                                  </List.Item>
                                  <List.Item className={item.menu ? 'friend-list-menu' : 'friend-list-hidden'}>
                                      <button className="friend-list-group-btn-primary"
                                              onClick={this.props.onModalVisible(0, index, -1, true)}>更名
                                      </button>
                                      <Popconfirm title="你确定要删除？"
                                                  okText="确认"
                                                  cancelText="取消"
                                                  placement="bottom"
                                                  onConfirm={this.props.onMenuDelete({index},
                                          this.props.socket,
                                          {userId: this.props.userId, friendId: 0, groupName: item.name})}>
                                          <button className="friend-list-group-btn-danger">删除</button>
                                      </Popconfirm>
                                  </List.Item>
                                  {item.children.length === 0 ? '' : item.children.map((childItem, childIndex) => {
                                      return (<div key={childIndex}>
                                          <List.Item
                                              actions={[<button className="friend-list-menu-btn"
                                                                onClick={event => this.props.onChangeListMenuVisible(event, {
                                                                    index,
                                                                    childIndex
                                                                })}>
                                                  <UnorderedListOutlined/>
                                              </button>]}
                                              className={item.visible ? 'friend-list-member' : 'friend-list-hidden'}>
                                              {childItem.nickName}({childItem.remarks})
                                          </List.Item>
                                          <List.Item
                                              className={childItem.menu ? 'friend-list-menu' : 'friend-list-hidden'}>
                                              <button className="friend-list-group-btn-success"
                                                      onClick={this.props.onMenuChat(1, childItem.id)}>聊天
                                              </button>
                                              <button className="friend-list-group-btn-primary"
                                                      onClick={this.props.onModalVisible(0, index, childIndex, true)}>更名
                                              </button>
                                              <button className="friend-list-group-btn-info"
                                                      onClick={this.props.onModalVisible(1, index, childIndex, true)}>移动
                                              </button>
                                              <Popconfirm title="你确定要删除？"
                                                          okText="确认"
                                                          cancelText="取消"
                                                          placement="bottom"
                                                          onConfirm={this.props.onMenuDelete({
                                                              index,
                                                              childIndex
                                                          }, this.props.socket, {
                                                              token:this.props.token,
                                                              userId: this.props.userId,
                                                              friendId: childItem.id,
                                                              groupName: ""
                                                          })}>
                                                  <button className="friend-list-group-btn-danger">删除</button>
                                              </Popconfirm>
                                          </List.Item>
                                      </div>)
                                  })}
                              </>
                          )
                      }}/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        cId: state.cId,
        chatId:state.chatId,
        userId: state.userId,
        modalId: state.modalId,
        modalVisible: state.modalVisible,
        friendList: state.friendList,
        socket:state.socket
    }
}

const mapDispatchToProps = dispatch => {
    return {
        //列表的合并与展开
        onChangeListVisible: (index) => {
            return () => {
                dispatch(onChangeListVisible(index))
            }
        },
        //菜单的显示与隐藏
        onChangeListMenuVisible: (event, data) => {
            event.stopPropagation()
            dispatch(onChangeListMenuVisible(data))
        },
        //菜单删除子项
        onMenuDelete: (data, socket, socketData) => {
            return () => {
                if (socket.Socket !== undefined && socket.Socket.readyState === 1) {
                    socket.onSend({
                        opcode: 9,
                        carrier: {
                            userid: socketData.userId,
                            friendid: socketData.friendId,
                            groupname: socketData.groupName
                        }
                    })
                }else{
                    notification.open({
                        message: '连接异常',
                        description: "连接异常，准备重新连接",
                        duration: 2,
                        onClose: () => {
                            let socket = new MySocket(socketData.userId,socketData.token);
                            dispatch(initSocket(socket));
                            socket.Init();
                        }
                    });
                }
                dispatch(onMenuDelete(data))
            }
        },
        //菜单聊天切换
        onMenuChat: (cId, chatId) => {
            return () => {
                dispatch(onMenuChat(cId, chatId))
            }
        },
        //模态框组件的显示与隐藏
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

export default connect(mapStateToProps, mapDispatchToProps)(FriendList);