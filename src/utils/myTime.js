{/*
    编辑者：F
    功能：配合邮箱验证码
    说明：主要是配合后端时间的格式
*/
}

export default class MyTime {
    constructor() {
        this.Time = this.GetTime();
    }

    GetTime() {
        const date = new Date()

        let Result = ""
        let year = date.getFullYear()
        Result = Result + year + "/"
        //0-11代表1-12月
        let month = date.getMonth() + 1
        if (month < 10) {
            Result = Result + "0" + month + "/"
        } else {
            Result = Result + month + "/"
        }
        let day = date.getDate()
        if (day < 10) {
            Result = Result + "0" + day + " "
        } else {
            Result = Result + day + " "
        }
        let hour = date.getHours()
        if (hour < 10) {
            Result = Result + "0" + hour + ":"
        } else {
            Result = Result + hour + ":"
        }
        let minu = date.getMinutes()
        if (minu < 10) {
            Result = Result + "0" + minu + ":"
        } else {
            Result = Result + minu + ":"
        }
        let secon = date.getSeconds()
        if (secon < 10) {
            Result = Result + "0" + secon
        } else {
            Result = Result + secon
        }
        return Result
    }
}