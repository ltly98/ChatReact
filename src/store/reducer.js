{/*
    编辑者：F
    功能：reducer
    说明：此处因为使用combineReducers会出现未知异常，所以使用单一reducer
*/
}

export const Reducer = (state = {
    userId: 0,
    chatId: 7,
    userName: '用户名',
    nickName: '昵称',
    token: '',
    msg: '',
    //主页切换使用页面ID
    cId: 0,
    //好友列表
    friendList: [{
        name: "新好友",
        visible: false,
        menu: false,
        children: [{id: 2, nickName: "好友一昵称", remarks: "好友一备注", menu: false}]
    }, {
        name: "我的好友",
        visible: false,
        menu: false,
        children: [{id: 3, nickName: "好友二昵称", remarks: "好友二备注", menu: false}]
    }],
    //聊天记录列表
    chatList: [{id: 1, role: "sender", nickName: '我', remarks: '', content: "在吗", time: '20210218', read: 1}, {
        id: 2,
        nickName: '好友一',
        remarks: '好友一备注',
        role: "receiver",
        content: "不在",
        time: '20210218',
        read: 0
    }],
    requestList: [{requestId: 1, id: 1, nickName: "陌生人1", time: "20210227"}, {
        requestId: 2,
        id: 12,
        nickName: "陌生人2",
        time: "20210227"
    }, {
        requestId: 3,
        id: 123,
        nickName: "陌生人3",
        time: "20210227"
    }],
    socket: '',
    inputValue: '',
    modalId: 0,
    modalVisible: false,
    groupSelect: -1,
    chatSelect: -1,
    //加载标记
    loading: false
}, action) => {
    switch (action.type) {
        case 'LOGIN':
            const newLog = JSON.parse(JSON.stringify(state));
            newLog.userId = action.userId;
            newLog.token = action.token;
            newLog.msg = action.msg;
            newLog.loading = action.loading;
            newLog.socket = action.socket;
            return newLog
        case 'CHANGE_COMPONENT':
            const newCom = JSON.parse(JSON.stringify(state));
            //引用类型不能拷贝，会失效
            newCom.socket = state.socket;
            newCom.cId = action.cId;
            return newCom;
        case 'CHANGE_INPUT_VALUE':
            const newInp = JSON.parse(JSON.stringify(state));
            newInp.inputValue = action.inputValue;
            //引用类型不能拷贝，会失效
            newInp.socket = state.socket;
            return newInp
        case 'SEND_CHAT_MESSAGE':
            const newCha = JSON.parse(JSON.stringify(state));
            newCha.chatList = [
                ...state.chatList,
                action.data
            ];
            //引用类型不能拷贝，会失效
            newCha.socket = state.socket;
            return newCha
        case 'CHANGE_VISIBLE':
            const newVis = JSON.parse(JSON.stringify(state));
            let newFriendList = [...state.friendList]
            newFriendList[action.index].visible = !newFriendList[action.index].visible;
            newFriendList[action.index].menu = false;
            newFriendList[action.index].children = newFriendList[action.index].children.map((item) => {
                item.menu = false;
                return item;
            })
            newVis.friendList = newFriendList;
            //引用类型不能拷贝，会失效
            newVis.socket = state.socket;
            return newVis
        case 'CHANGE_MENU_VISIBLE':
            const newMeVi = JSON.parse(JSON.stringify(state));
            let newMenuFriendList = [...state.friendList];
            newMenuFriendList = newMenuFriendList.map((item, index) => {
                if (action.index !== undefined && action.childIndex !== undefined) {
                    item.menu = false;
                    item.children = item.children.map((childItem, childIndex) => {
                        if (action.index === index && action.childIndex === childIndex) {
                            childItem.menu = !childItem.menu;
                        } else {
                            childItem.menu = false;
                        }
                        return childItem;
                    })
                } else if (action.index !== undefined) {
                    if (action.index === index) {
                        item.menu = !item.menu;
                    } else {
                        item.menu = false;
                    }
                    item.children = item.children.map((childItem) => {
                        childItem.menu = false;
                        return childItem;
                    })
                }
                return item;
            })
            newMeVi.friendList = newMenuFriendList;
            //引用类型不能拷贝，会失效
            newMeVi.socket = state.socket;
            return newMeVi
        case 'MENU_DELETE':
            const newMeDe = JSON.parse(JSON.stringify(state));
            if (action.index !== undefined && action.childIndex !== undefined) {
                newMeDe.friendList[action.index].children = newMeDe.friendList[action.index].children.filter((childItem, childIndex) => {
                    return childIndex !== action.childIndex
                })
            } else {
                newMeDe.friendList = newMeDe.friendList.filter((item, index) => {
                    return action.index !== index
                })
            }
            //引用类型不能拷贝，会失效
            newMeDe.socket = state.socket;
            return newMeDe
        case 'MENU_CHAT':
            const newMeCh = JSON.parse(JSON.stringify(state));
            newMeCh.cId = action.cId;
            newMeCh.chatId = action.chatId;
            //引用类型不能拷贝，会失效
            newMeCh.socket = state.socket;
            return newMeCh
        case 'MODAL_VISIBLE':
            const newMoInVi = JSON.parse(JSON.stringify(state));
            newMoInVi.modalVisible = action.modalVisible;
            newMoInVi.modalId = action.modalId;
            newMoInVi.groupSelect = action.groupSelect;
            newMoInVi.chatSelect = action.chatSelect;
            //引用类型不能拷贝，会失效
            newMoInVi.socket = state.socket;
            return newMoInVi
        case 'GROUP_SELECT':
            const newLiSe = JSON.parse(JSON.stringify(state));
            newLiSe.groupSelect = action.groupSelect;
            //引用类型不能拷贝，会失效
            newLiSe.socket = state.socket;
            return newLiSe
        case 'MENU_RENAME':
            const newMeRe = JSON.parse(JSON.stringify(state));
            newMeRe.modalVisible = action.modalVisible;
            if (action.chatSelect !== -1 && action.groupSelect !== -1) {
                newMeRe.friendList[action.groupSelect].children[action.chatSelect].remarks = action.inputValue;
            } else if (action.groupSelect !== -1) {
                newMeRe.friendList[action.groupSelect].name = action.inputValue;
            }
            //引用类型不能拷贝，会失效
            newMeRe.socket = state.socket;
            return newMeRe
        case 'MENU_MOVE':
            const newMeMo = JSON.parse(JSON.stringify(state));
            if (action.oldGroupSelect === -1 || action.newGroupSelect === -1 || action.chatSelect === -1) return newMeMo;
            newMeMo.modalVisible = action.modalVisible;
            let temp = JSON.parse(JSON.stringify(newMeMo.friendList[action.oldGroupSelect].children[action.chatSelect]));
            temp.menu = false;
            newMeMo.friendList[action.oldGroupSelect].children = newMeMo.friendList[action.oldGroupSelect].children.filter((item, index) => {
                return index !== action.chatSelect
            });
            newMeMo.friendList[action.newGroupSelect].children.push(temp);
            //引用类型不能拷贝，会失效
            newMeMo.socket = state.socket;
            return newMeMo
        case 'CHANGE_REQUEST':
            const newReq = JSON.parse(JSON.stringify(state));
            newReq.requestList = state.requestList.filter((item) => {
                return item.requestId !== action.index;
            })
            //引用类型不能拷贝，会失效
            newReq.socket = state.socket;
            return newReq
        case 'INIT_DATA':
            const newDat = JSON.parse(JSON.stringify(state));
            //引用类型不能拷贝，会失效
            newDat.socket = state.socket;
            if (action.userId !== undefined) newDat.userId = action.userId;
            if (action.chatId !== undefined) newDat.chatId = action.chatId;
            if (action.userName !== undefined) newDat.userName = action.userName;
            if (action.nickName !== undefined) newDat.nickName = action.nickName;
            if (action.friendList !== undefined) newDat.friendList = [...action.friendList];
            if (action.chatList !== undefined) newDat.chatList = [...action.chatList];
            if (action.requestList !== undefined) newDat.requestList = [...action.requestList];
            if (action.cId !== undefined) newDat.cId = action.cId;
            if (action.msg !== undefined) newDat.msg = action.msg;
            if (action.token !== undefined) newDat.token = action.token;
            if (action.loading !== undefined) newDat.loading = action.loading;
            if (action.socket !== undefined) newDat.socket = action.socket;
            return newDat
        case 'INIT_SOCKET':
            const newSoc = JSON.parse(JSON.stringify(state));
            newSoc.socket = action.socket;
            return newSoc
        default:
            return state
    }
}