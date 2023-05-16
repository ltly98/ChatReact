import React from 'react';
import {Row, Col, Card, Input, Form, Button, Checkbox} from 'antd';
import {MailOutlined, MessageOutlined} from "@ant-design/icons";
import {Link} from 'react-router-dom';

import MyFetch from "../../utils/myFetch";
import MyTime from "../../utils/myTime";
import MyDisabled from "../../utils/myDisabled";

{/*
    编辑者：F
    功能：更换绑定邮箱页面
    说明：此处不使用redux，因为没有state需要集中管理
         此处会有一个报错，是因为ant-design产生的
         按钮具有disabled的api，但是报错没没有该属性，疑似因为该属性直接赋值报错，但是不影响整体的运行
*/
}

class Replace extends React.Component {

    constructor(props) {
        super(props);
        //不通过直接操作邮箱输入框
        this.emailRef = React.createRef();
        this.emailRef2 = React.createRef();
        //此处state不需要redux集中管理,只在该页面使用
        this.state={
            msg: '',
            isDisabled: false,
            iTime:0,
            isDisabled2: false,
            iTime2: 0,
            interval:0,
            loading: false
        };

        this.handleReplace=this.handleReplace.bind(this);
        this.handleGetEmailCode=this.handleGetEmailCode.bind(this);
        this.handleSetDisabled=this.handleSetDisabled.bind(this);
    }

    componentWillUnmount() {
        //卸载组件的时候清除定时器
        clearInterval(this.state.interval);
    }

    //更换邮箱
    handleReplace(oldemail, oldcode, newemail, newcode){
        this.setState({msg: '', isDisabled: true, iTime:0, isDisabled2: true, iTime2: 0, interval:0, loading: true});
        const data = "oldemail=" + oldemail + "&oldcode=" + oldcode + "&newemail=" + newemail + "&newcode=" + newcode;
        const myfetch = new MyFetch('email', 'PUT', data)
        let promise = myfetch.returnFetch()
        promise.then(res => res.json())
            .then(res => {
                this.setState({msg: res.message, isDisabled: false, iTime:0, isDisabled2: false, iTime2: 0, interval:0, loading: false});
            }).catch(() => {
            this.setState({msg: "请求服务器超时！", isDisabled: false, iTime:0, isDisabled2: false, iTime2: 0, interval:0, loading: false});
        })
    }

    //设置获取验证码按钮倒计时，注册会直接清除，但是服务器会验证间隔时间
    handleGetEmailCode(email, interval) {
        const data = "emailto=" + email + "&emailtime=" + new MyTime().Time;
        const myfetch = new MyFetch('email', 'POST', data)
        let promise = myfetch.returnFetch()
        promise.then(res => res.json())
            .then(res => {
                this.setState({msg: res.message, isDisabled: false, iTime:0, isDisabled2: false, iTime2: 0, interval:0, loading: false});
                if (res.message !== 'OK') {
                    clearInterval(interval)
                }
            }).catch(() => {
            clearInterval(interval)
            this.setState({msg: "请求服务器超时！", isDisabled: false, iTime:0, isDisabled2: false, iTime2: 0, interval:0, loading: false});
        })
    }

    //设置获取验证码按钮倒计时，注册会直接清除，但是服务器会验证间隔时间
    handleSetDisabled(isDisabled, iTime, isDisabled2, iTime2, interval) {
        if (interval !== 0) {
            clearInterval(interval);
        }
        let newInterval = setInterval(() => {
            let obj = new MyDisabled(isDisabled, iTime, newInterval).onChangeNoClear();
            isDisabled = obj.isDisabled;
            iTime = obj.iTime;
            let obj2 = new MyDisabled(isDisabled2, iTime2, newInterval).onChangeNoClear();
            isDisabled2 = obj2.isDisabled;
            iTime2 = obj2.iTime;
            this.setState({msg: '', isDisabled: isDisabled, iTime:iTime, isDisabled2: isDisabled2, iTime2:iTime2, interval:newInterval, loading: false});
            if (!isDisabled && !isDisabled2) {
                clearInterval(newInterval);
            }
        }, 1000)
        this.setState({msg: '', isDisabled: isDisabled, iTime:iTime, isDisabled2: isDisabled2, iTime2:iTime2, interval:newInterval, loading: false});
        return newInterval;
    }

    render() {
        return (
            <div className="page-back">
                <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
                    <Col xs={16} sm={14} md={12} lg={10} xl={8}>
                        <Card title="更换邮箱" headStyle={{textAlign: "center"}}>
                            <Form
                                name="forget"
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={(values) => {
                                    //清除定时器
                                    clearInterval(this.state.interval);
                                    this.handleReplace(values.oldemail, values.oldcode, values.newemail, values.newcode)
                                }}
                            >
                                <Form.Item
                                    name="oldemail"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入绑定的邮箱!',
                                        },
                                    ]}
                                >
                                    <Input prefix={<MailOutlined/>}
                                           type="email"
                                           ref={this.emailRef}
                                           placeholder="绑定邮箱"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="oldcode"
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
                                    name="newemail"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入新邮箱!',
                                        },
                                    ]}
                                >
                                    <Input prefix={<MailOutlined/>}
                                           type="email"
                                           ref={this.emailRef2}
                                           placeholder="请输入新邮箱"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="newcode"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入新邮箱验证码!',
                                        },
                                    ]}
                                >
                                    <Input prefix={<MessageOutlined/>}
                                           placeholder="请输入新邮箱验证码"
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
                                                    const email = this.emailRef.current.state.value;
                                                    if (!this.state.loading) {
                                                        const newInterval = this.handleSetDisabled(true,
                                                            60, this.state.isDisabled2, this.state.iTime2, this.state.interval);
                                                        this.handleGetEmailCode(email, newInterval);
                                                    } else {
                                                        this.setState({
                                                            msg: "请输入旧邮箱",
                                                            isDisabled: this.state.isDisabled,
                                                            iTime:this.state.iTime,
                                                            isDisabled2: this.state.isDisabled2,
                                                            iTime2:this.state.iTime2,
                                                            interval:this.state.interval});
                                                    }
                                                }}>
                                            {
                                                this.state.iTime === 0 ? "发送旧邮箱验证码" : this.state.iTime + "s"
                                            }
                                        </Button>
                                    </Col>
                                </Row>

                                <Row type="flex" justify="center">
                                    <Col>
                                        <Button type="primary"
                                                size="middle"
                                                disabled={this.state.isDisabled2}
                                                onClick={() => {
                                                    const email = this.emailRef2.current.state.value
                                                    const {
                                                        isDisabled,
                                                        iTime,
                                                        isDisabled2,
                                                        iTime2,
                                                        interval
                                                    } = this.props
                                                    if (!this.state.loading) {
                                                        const newInterval = this.handleSetDisabled(this.state.isDisabled,
                                                            this.state.iTime, true, 60, this.state.interval);
                                                        this.handleGetEmailCode(email, newInterval);
                                                    } else {
                                                        this.setState({
                                                            msg: "请输入新邮箱",
                                                            isDisabled: this.state.isDisabled,
                                                            iTime:this.state.iTime,
                                                            isDisabled2: this.state.isDisabled2,
                                                            iTime2:this.state.iTime2,
                                                            interval:this.state.interval});
                                                    }
                                                }}>
                                            {
                                                this.state.iTime2 === 0 ? "发送新邮箱验证码" : this.state.iTime2 + "s"
                                            }
                                        </Button>
                                    </Col>
                                </Row>

                                <Row type="flex" justify="center">
                                    <Col>
                                        <Form.Item>
                                            <Button type="primary"
                                                    htmlType="submit"
                                                    size="middle"
                                                    loading={this.state.loading}>
                                                修改绑定邮箱
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

export default Replace;