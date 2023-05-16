
{/*
    编辑者：F
    功能：发送邮箱验证码
    说明：着重配合redux，固定使用表单提交，响应数据转json
*/
}

export default class MyFetch {
    //此处依次是发送数据、请求方法、请求地址（拼接api/v1后的地址内容）
    constructor(path, method, data) {
        this.Path = path;
        this.Method = method;
        this.Data = data;
    }

    sendFetch() {
        fetch('http://localhost:3000/api/v1/' + this.Path, {
            method: this.Method,
            body: this.Data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(res => res.json())
            .then(res => {
                return res.message
            }).catch(() => {
            return "请求服务器超时！"
        })
    }
    //此处直接返回promise对象
     returnFetch(){
        return fetch('http://localhost:3000/api/v1/' + this.Path, {
            method: this.Method,
            body: this.Data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    }
}