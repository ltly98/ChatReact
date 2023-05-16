{/*
    编辑者：F
    功能：action
    说明：集中所有的action
*/
}

export const login = (userId, token, msg, loading, socket) => {
    return {
        type: 'LOGIN',
        userId,
        token,
        msg,
        loading,
        socket
    }
}

{/*
    编辑者：F
    功能：action
    说明：通用部分
*/
}

export const initData = (data) => {
    return {
        type: 'INIT_DATA',
        ...data
    }
}

export const initSocket = (socket) =>{
    return  {
        type:'INIT_SOCKET',
        socket
    }
}

{/*
    编辑者：F
    功能：主页组件部分action
    说明：
*/
}

export const changeComponent = (cId) => {
    return {
        type: 'CHANGE_COMPONENT',
        cId
    }
}

export const sendChatMessage = (data) => {
    return {
        type: 'SEND_CHAT_MESSAGE',
        data
    }
}

export const onChangeInputValue = (inputValue) => {
    return {
        type: 'CHANGE_INPUT_VALUE',
        inputValue
    }
}

export const onChangeListVisible = (index) => {
    return {
        type: 'CHANGE_VISIBLE',
        index
    }
}

export const onChangeRequest = (index) => {
    return {
        type: 'CHANGE_REQUEST',
        index
    }
}

{/*
    编辑者：F
    功能：菜单功能
    说明：此处传入一个对象
    ｛
    index:0,       分组菜单索引
    childIndex:0   分组菜单子项索引
    ｝
*/
}

export const onChangeListMenuVisible = (data) => {
    return {
        type: 'CHANGE_MENU_VISIBLE',
        ...data
    }
}

export const onMenuDelete = (data) => {
    return {
        type: 'MENU_DELETE',
        ...data
    }
}

export const onMenuChat = (cId, chatId) => {
    return {
        type: 'MENU_CHAT',
        cId,
        chatId
    }
}

{/*
    编辑者：F
    功能：菜单Modal功能
    说明：
*/
}

export const onModalVisible = (modalId, groupSelect = -1, chatSelect = -1, modalVisible) => {
    return {
        type: 'MODAL_VISIBLE',
        modalId,
        groupSelect,
        chatSelect,
        modalVisible
    }
}

export const onGroupSelect = (groupSelect) => {
    return {
        type: 'GROUP_SELECT',
        groupSelect
    }
}

export const onMenuRename = (inputValue, groupSelect = -1, chatSelect = -1, modalVisible) => {
    return {
        type: 'MENU_RENAME',
        inputValue,
        groupSelect,
        chatSelect,
        modalVisible
    }
}

export const onMenuMove = (oldGroupSelect = -1, newGroupSelect = -1, chatSelect = -1, modalVisible) => {
    return {
        type: 'MENU_MOVE',
        oldGroupSelect,
        newGroupSelect,
        chatSelect,
        modalVisible
    }
}