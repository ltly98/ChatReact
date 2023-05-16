
{/*
    编辑者：F
    功能：此处是为发送邮箱验证码的按钮做处理
    说明：着重配合redux
*/
}

export default class MyDisabled {
    //是否禁用，间隔时间,定时器
    constructor(isDisabled, iTime, interval) {
        this.Disabled = isDisabled;
        this.Time = iTime;
        this.Interval = interval;
    }

    //此处必须配合定时器嵌套使用
    onChange() {
        this.Time = this.Time - 1;
        if (this.Time < 1) {
            this.Disabled = !this.Disabled;
            clearInterval(this.Interval);
        }
        return {
            isDisabled: this.Disabled,
            iTime: this.Time
        }
    }
    //此处是双按钮时间变化使用，定时器由外部控制
    onChangeNoClear(){
        this.Time = this.Time - 1;
        if (this.Time < 1) {
            this.Disabled = false;
            this.Time = 0;
        }
        return {
            isDisabled: this.Disabled,
            iTime: this.Time
        }
    }
}
