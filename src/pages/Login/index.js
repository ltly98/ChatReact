import React from 'react';
import {Row, Col, Card, Input, Form, Button, Checkbox, Spin} from 'antd';
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {login} from "../../store/action";
import MyFetch from "../../utils/myFetch";
import MySocket from "../../utils/mySocket";

{/*
    编辑者：F
    功能：登陆页面
    说明：使用了redux，处理起来更为复杂
*/
}

class Login extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="page-back">
                <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
                    <Col xs={16} sm={14} md={12} lg={10} xl={8}>
                        <Card title="用户登陆" headStyle={{textAlign: "center"}}>
                            <Form
                                name="login"
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={values => {
                                    this.props.login(values.username, values.password, this.props.history)
                                }}>
                                <Form.Item
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入用户名!',
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined/>}
                                        placeholder="用户名"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入密码!',
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<LockOutlined/>}
                                        type="password"
                                        placeholder="密码"
                                    />
                                </Form.Item>

                                <div style={{textAlign: 'center', color: 'red'}}>
                                    {this.props.msg === 'OK' && this.props.msg !== undefined ? '' : this.props.msg.toString()}
                                </div>

                                <Row type="flex" justify="center">
                                    <Col>
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                size="middle"
                                                loading={this.props.loading}>
                                                登陆
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row type="flex" justify="space-around">
                                    <Col>
                                        <Link to="/forget">忘记密码</Link>
                                    </Col>
                                    <Col>
                                        <Link to="/replace">更换邮箱</Link>
                                    </Col>
                                    <Col>
                                        <Link to="/register">注册用户</Link>
                                    </Col>
                                </Row>

                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

const MapStateToProps = state => {
    return {
        userId: state.userId,
        token: state.token,
        msg: state.msg,
        loading: state.loading
    }
}

const MapDispatchToProps = dispatch => {
    return {
        //登陆操作
        login: (username, password, history) => {
            dispatch(login(0, '', '', true))
            const data = "username=" + username + "&password=" + password;
            const myfetch = new MyFetch('login', 'POST', data)
            //接收promise对象方便进行异步操作
            let promise = myfetch.returnFetch()
            promise.then(res => res.json())
                .then((res) => {
                    const userId = res.userid
                    const token = res.token
                    const message = res.message
                    let socket = new MySocket(userId, token)
                    dispatch(login(userId, token, message, false, socket))
                    socket.Init()

                    //获取个人信息
                    socket.Socket.send(JSON.stringify({opcode: 0, carrier: {userid: userId}}));
                    //获取聊天列表，多半是空
                    socket.Socket.send(JSON.stringify({opcode: 1, carrier: {senderid: userId, receiverid: 1}}));
                    //获取好友请求
                    socket.Socket.send(JSON.stringify({opcode: 4, carrier: {receiverid: userId}}));
                    //好友列表
                    socket.Socket.send(JSON.stringify({opcode: 7, carrier: {userid: userId}}));

                    history.push('/home')
                }).catch(() => {
                dispatch(login(0, '', "请求服务器超时！", false, ''))
            })
        }
    }
};

export default connect(MapStateToProps, MapDispatchToProps)(Login);

