Page({

    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        type:"文本",// 图像还是文字
        columns: ["文本","图像"],
        scrollInto: '',
        apiurl: 'https://aichat.2lc.top',
        apisucc: false,
        sentext: '发送',
        msgLoad: false,
        anData: {},
        animationData: {},
        showTow: false,
        msgList: [{
            my: false,
            msg: "你好,我是AI智能问答机器人（点击左下角更换模式）"
        }],
        msgContent: "",
        msg: "",
        sendmsgcache: []
    },
    onChange(e) {
        const {value } = e.detail;
        this.setData({
            type:value,
            show:false
        })
    },
    showPopup() {
        this.setData({
            show: true
        });
    },
    onClose() {
        this.setData({
            show: false
        });
    },

    setPageScrollTo: function setPageScrollTo() {
        var len = this.data.msgList.length;
        this.scrollInto = 'id' + (len - 1);
    },
    // },
    send: function send() {
        this.sendMsg();
    },
    inputChange(e){
        this.setData({
            msg:e.detail.value
        })
    },
    sendMsg: function sendMsg() {
        var _this3 = this;
        console.log('上下文');
        // 消息为空不做任何操作
        if (this.data.msg == "") {
            wx.showToast({
                title: '请输入您想询问的问题',
                icon: 'warning',
                duration: 2000
            })
            return 0;
        }
        if (this.data.msgLoad == true) {
            wx.showToast({
                title: '请先等待回答完毕',
                icon: 'warning',
                duration: 2000
            })
            return 0;
        }
        let sendmsgcacheTemp = this.data.sendmsgcache
        let msgListTemp = this.data.msgList
        sendmsgcacheTemp.push('YOU:' + this.data.msg + "\n")
        msgListTemp.push({
            "msg": this.data.msg,
            "my": true
        })
        this.setData({
            sendmsgcache:sendmsgcacheTemp,
            sentext:'请求中',
            msgContent:"",
            msgList: msgListTemp
        })
        let msgContent = ''
        this.data.sendmsgcache.map(function (info) {
            msgContent += info;
        });
        this.setData({
            msgContent:msgContent,
            msgLoad:true,
        })
        this.setPageScrollTo();
        var data = JSON.stringify({
            msg: this.data.type=='图像'?this.data.msg:this.data.msgContent,
            maxtoken: 2048,
            type:this.data.type
        });
        
        wx.request({
            url: this.data.apiurl + '/message',
            data: data,
            method: 'POST',
            success: function success(resTemp) {
                console.log(resTemp);
                
                if (resTemp.statusCode == 200) {

                    let res = JSON.parse(resTemp.data.resmsg)
                    // var text = res.data.resmsg.choices[0].text.replace("openai:", "").replace(
                    //     "openai：", "").
                    // replace(/^\n|\n$/g, "");
                    let text,img
                    let sendmsgcacheTemp = _this3.data.sendmsgcache
                    if(_this3.data.type=='文本'){
                    text = res.choices[0].text
                    var msglen = res.usage.total_tokens;
                    var msgcomplen = res.usage.completion_tokens;
                    if (msglen + msgcomplen > 1500) {
                        let sendmsgcacheTemp = _this3.data.sendmsgcache
                        for (var msg in _this3.data.sendmsgcache) {
                            sendmsgcacheTemp.shift()
                            _this3.setData({
                                sendmsgcache:sendmsgcacheTemp
                            })
                            if (_this3.data.msgContent.length * 1.6 + msglen < 800) {
                                console.log('ok');
                                break;
                            }
                        }
                    }
                    }else{
                        img = res.data[0].url
                    }
                    
                    let msgListTemp = _this3.data.msgList
                    if(_this3.data.type=='文本'){
                        msgListTemp.push({
                            "msg": text,
                            "my": false
                        })
                        
                        sendmsgcacheTemp.push(text + "\n")
                        
                    }else{
                        msgListTemp.push({
                            "msg": img,
                            type:"图像",
                            "my": false
                        })
                    }
                    _this3.setData({
                        msgList:msgListTemp
                    })
                    _this3.setData({
                        sentext:"发送",msgLoad:false,
                        msg:"",
                        sendmsgcache:sendmsgcacheTemp
                    })
                    
                    _this3.setPageScrollTo();
                } else {
                    wx.showToast({
                        title: '网络错误或余额不足',
                        icon: 'none',
                        duration: 2000
                    })
                    _this3.setData({sentext:"发送",msgLoad:false,msg:"",})
                }
            },
            fail: function fail(res) {
                wx.showToast({
                    title: '网络错误或余额不足',
                    icon: 'none',
                    duration: 2000
                })
                _this3.setData({sentext:"发送",msgLoad:false,msg:"",})
            }
        });

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map