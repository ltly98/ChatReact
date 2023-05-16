import React from 'react';
import {Row,Col,Card,Button} from 'antd';
import {Link} from 'react-router-dom';

export default class NotFound extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="page-back">
                <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
                    <Col xs={16} sm={14} md={12} lg={10} xl={8}>
                        <Card title="404" headStyle={{textAlign:"center"}}>

                            <Row type="flex" justify="center">
                                <Col>
                                    <div style={{fontSize:"25px",margin:'25px'}}>
                                        页面未找到
                                    </div>
                                </Col>
                            </Row>

                            <Row type="flex" justify="center">
                                <Col>
                                    <Link to="/">前往登陆</Link>
                                </Col>
                            </Row>

                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}