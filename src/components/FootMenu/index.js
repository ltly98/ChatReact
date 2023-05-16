import React from 'react';
import {CommentOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import {connect} from "react-redux";

//为了规范，将引用和自定义内容分开
import './index.css';
import {changeComponent} from "../../store/action";

{/*
    编辑者：F
    功能：底部菜单组件
    说明：使用了redux，处理起来更为复杂
*/}


class FootMenu extends React.Component {
    //尝试性使用，是否有效待定，防止相同state的重复渲染
    shouldComponentUpdate(nextProps, nextState) {
        const props = JSON.stringify(nextProps)
        const state = JSON.stringify(nextState)
        return props !== state
    }

    render() {
        return (
            <div className="footer-menu-wrapper">
                <button className={this.props.cId === 0 ? "footer-menu-btn-select" : "footer-menu-btn"}
                        onClick={this.props.onSwitch(0)}><TeamOutlined/></button>
                <button className={this.props.cId === 1 ? "footer-menu-btn-select" : "footer-menu-btn"}
                        onClick={this.props.onSwitch(1)}><CommentOutlined/></button>
                <button className={this.props.cId === 2 ? "footer-menu-btn-select" : "footer-menu-btn"}
                        onClick={this.props.onSwitch(2)}><UserOutlined/></button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        cId: state.cId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        //底部菜单栏的切换
        onSwitch: (cId) => {
            return () => {
                if (cId < 0 || cId > 2) {
                    dispatch(changeComponent(0))
                } else {
                    dispatch(changeComponent(cId))
                }
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FootMenu);