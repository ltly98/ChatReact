import React from 'react';
import {Row, Col, Card, Input, Form, Button} from 'antd';
import {LockOutlined, MailOutlined, MessageOutlined} from "@ant-design/icons";
import {Link} from 'react-router-dom';

import MyFetch from "../../utils/myFetch";
import MyTime from "../../utils/myTime";
import MyDisabled from "../../utils/myDisabled";

{/*
    编辑者：F
    功能：忘记密码页面
    说明：此处不使用redux，因为没有state需要集中管理
         此处会有一个报错，是因为ant-design产生的
         按钮具有disabled的api，但是报错没没有该属性，疑似因为该属性直接赋值报错，但是不影响整体的运行
*/
}

class Forget extends React.Component {
    constructor(props) {
        super(props);
        //不通过直接操作邮箱输入框
        this.emailRef = React.createRef();
        //此处state不需要redux集中管理,只在该页面使用
        this.state = {
            msg: '',
            isDisabled: false,
            iTime: 0,
            interval: 0,
            loading: false
        };

        this.handleForget=this.handleForget.bind(this);
        this.handleGetEmailCode=this.handleGetEmailCode.bind(this);
        this.handleSetDisabled=this.handleSetDisabled.bind(this);
    }

    componentWillUnmount() {
        //卸载组件的时候清除定时器
        clearInterval(this.state.interval);
    }

    //忘记密码操作
    handleForget(email, emailcode, password, password2) {
        this.setState({msg: '', isDisabled: true, iTime: 0, interval: 0, loading: true});
        const data = "email=" + email + "&emailcode=" + emailcode + "&password=" + password + "&password2=" + password2;
        const myfetch = new MyFetch('forget', 'POST', data);
        let promise = myfetch.returnFetch()
        promise.then(res => res.json())
            .then(res => {
                this.setState({msg: res.message, isDisabled: false, iTime: 0, interval: 0, loading: false});
            }).catch(() => {
            this.setState({msg: "请求服务器超时！", isDisabled: false, iTime: 0, interval: 0, loading: false});
        })
    }

    //获取邮箱验证码
    handleGetEmailCode(email, interval) {
        const data = "emailto=" + email + "&emailtime=" + new MyTime().Time;
        const myfetch = new MyFetch('email', 'POST', data)
        let promise = myfetch.returnFetch()
        promise.then(res => res.json())
            .then(res => {
                this.setState({msg: res.message, isDisabled: false, iTime: 0, interval: 0, loading: false})
                if (res.message !== 'OK') {
                    clearInterval(interval)
                }
            }).catch(() => {
            clearInterval(interval)
            this.setState({msg: "请求服务器超时！", isDisabled: false, iTime: 0, interval: 0, loading: false})
        })
    }

    //设置获取验证码按钮倒计时，注册会直接清除，但是服务器会验证间隔时间
    handleSetDisabled(isDisabled, iTime) {
        let newInterval = setInterval(() => {
            let obj = new MyDisabled(isDisabled, iTime, newInterval).onChange();
            isDisabled = obj.isDisabled;
            iTime = obj.iTime;
            this.setState({msg: "", isDisabled: isDisabled, iTime: iTime, interval: newInterval, loading: false});
        }, 1000)
        this.setState({msg: "", isDisabled: isDisabled, iTime: iTime, interval: newInterval, loading: false});
        return newInterval
    }

    render() {
        return (
            <div className="page-back">
                <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
                    <Col xs={16} sm={14} md={12} lg={10} xl={8}>
                        <Card title="找回密码" headStyle={{textAlign: "center"}}>
                            <Form
                                name="forget"
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={(values) => {
                                    //清除定时器
                                    clearInterval(this.state.interval);
                                    this.handleForget(values.email,
                                        values.emailcode,
                                        values.password,
                                        values.password2);
                                }}
                            >
                                <Form.Item
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入绑定的邮箱!',
                                        },
                                    ]}
                                >
                                    <Input prefix={<MailOutlined/>}
                                           ref={this.emailRef}
                                           placeholder="绑定邮箱"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="emailcode"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入邮箱验证码！'
                                        }
                                    ]}
                                >
                                    <Input prefix={<MessageOutlined/>}
                                           placeholder="请输入邮箱验证码"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入新密码!',
                                        },
                                    ]}
                                >
                                    <Input prefix={<LockOutlined/>}
                                           type="password"
                                           placeholder="请输入新密码"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password2"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请再次输入新密码!',
                                        },
                                    ]}
                                >
                                    <Input prefix={<LockOutlined/>}
                                           type="password"
                                           placeholder="请再次输入新密码"
                                    />
                                </Form.Item>

                                <div style={{textAlign: 'center', color: 'red'}}>
                                    {this.state.msg === 'OK' ? '' : this.state.msg}
                                </div>

                                <Row type="flex" justify="center">
                                    <Col>
                                        <Button type="primary"
                                                size="middle"
                                                disabled={this.state.isDisabled}
                                                onClick={() => {
                                                    const email = this.emailRef.current.state.value
                                                    if (!this.state.loading) {
                                                        const interval = this.handleSetDisabled(true, 60);
                                                        this.handleGetEmailCode(email, interval)
                                                    } else {
                                                        this.setState({msg: "请输入邮箱"});
                                                    }
                                                }}>
                                            {
                                                this.state.iTime === 0 ? "发送验证码" : this.state.iTime + "s"
                                            }
                                        </Button>
                                    </Col>
                                </Row>

                                <Row type="flex" justify="center">
                                    <Col>
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                size="middle"
                                                loading={this.state.loading}>
                                                修改密码
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row type="flex" justify="center">
                                    <Col>
                                        <Link to="/">返回登陆</Link>
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

export default Forget;