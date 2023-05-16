import React from 'react';
import {Col, Row, Layout,notification} from "antd";
import {connect} from 'react-redux';

import FootMenu from "../../components/FootMenu";
import Personal from "../../components/Personal";
import FriendList from "../../components/FriendList";
import ChatList from "../../components/ChatList";
import {changeComponent, initSocket} from "../../store/action";
import MySocket from "../../utils/mySocket";

const {Header, Content, Footer} = Layout;

class Home extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(this.props.socket === ""){
            const userId = this.props.userId;
            const token = this.props.token;
            if(userId !== 0 && token !== ""){
                let socket=new MySocket(userId,token);
                this.props.initSocket(socket);
                socket.Init();
            }else{
                notification.open({
                    message: '连接异常',
                    description:"连接已断开，准备跳转登录",
                    duration: 2,
                    onClose:()=>{
                        this.props.history.push('/');
                    }
                });
            }
        }
    }

    render() {
        return (
            <div className="page-back">
                <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
                    <Col xs={22} sm={20} md={18} lg={16} xl={14}>
                        <Layout style={{minHeight: '100vh'}}>
                            <Header></Header>
                            <Content>
                                {
                                    this.props.onSwitch(this.props.cId)
                                }
                            </Content>
                            <Footer>
                                <FootMenu/>
                            </Footer>
                        </Layout>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        cId: state.cId,
        userId:state.userId,
        token:state.token,
        socket:state.socket
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSwitch: (cId) => {
            switch (cId) {
                case 0:
                    return <FriendList/>;
                case 1:
                    return <ChatList/>;
                case 2:
                    return <Personal/>;
                default:
                    break;
            }
        },
        initHome:()=>{
            dispatch(changeComponent(0))
        },
        initSocket:(socket)=>{
            dispatch(initSocket(socket))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);