package com.example.smsmodule;

import com.alibaba.weex.plugin.annotation.WeexModule;
import com.taobao.weex.annotation.JSMethod;
import com.taobao.weex.bridge.JSCallback;
import com.taobao.weex.common.WXModule;

import android.os.Handler;
import android.os.Handler.Callback;
import android.os.Message;
import android.os.Looper;

import cn.smssdk.EventHandler;
import cn.smssdk.SMSSDK;

/**
 * Created by liuyuanxiao on 2019/5/14.
 */
@WeexModule(name = "smsCode", lazyLoad = true)
public class SMSModule extends WXModule {

    private EventHandler eventHandler;
    private JSCallback sendCallback;
    private JSCallback checkCallback;

    @JSMethod(uiThread = false)
    public void initSMS() {
        eventHandler = new EventHandler() {
            public void afterEvent(int event, int result, Object data) {
                // afterEvent会在子线程被调用，因此如果后续有UI相关操作，需要将数据发送到UI线程
                Message msg = new Message();
                msg.arg1 = event;
                msg.arg2 = result;
                msg.obj = data;
                new Handler(Looper.getMainLooper(), new Callback() {
                    @Override
                    public boolean handleMessage(Message msg) {
                        int event = msg.arg1;
                        int result = msg.arg2;
                        Object data = msg.obj;
                        if (event == SMSSDK.EVENT_GET_VERIFICATION_CODE) {
                            if (result == SMSSDK.RESULT_COMPLETE) {
                                // 处理成功得到验证码的结果
                                // 请注意，此时只是完成了发送验证码的请求，验证码短信还需要几秒钟之后才送达
                                sendCallback.invokeAndKeepAlive("1");
                            } else {
                                // 处理错误的结果
                                ((Throwable) data).printStackTrace();
                                sendCallback.invokeAndKeepAlive("0");
                            }
                        } else if (event == SMSSDK.EVENT_SUBMIT_VERIFICATION_CODE) {
                            if (result == SMSSDK.RESULT_COMPLETE) {
                                // 处理验证码验证通过的结果
                                checkCallback.invokeAndKeepAlive("1");
                            } else {
                                // 处理错误的结果
                                ((Throwable) data).printStackTrace();
                                checkCallback.invokeAndKeepAlive("0");
                            }
                        }
                        // 其他接口的返回结果也类似，根据event判断当前数据属于哪个接口
                        return false;
                    }
                }).sendMessage(msg);
            }
        };

        // 注册一个事件回调，用于处理SMSSDK接口请求的结果
        SMSSDK.registerEventHandler(eventHandler);
    }

    @JSMethod(uiThread = false)
    public void getCode(String phone, JSCallback callback) {
        // 请求验证码，其中country表示国家代码，如“86”；phone表示手机号码，如“13800138000”
        sendCallback = callback;
        SMSSDK.getVerificationCode("86", phone);
    }

    @JSMethod(uiThread = false)
    public void checkCode(String code, String phone, JSCallback callback) {
        // 提交验证码，其中的code表示验证码，如“1357”
        checkCallback = callback;
        SMSSDK.submitVerificationCode("86", phone, code);
    }

    @JSMethod(uiThread = false)
    public void unregisterEventHandler() {
        SMSSDK.unregisterEventHandler(eventHandler);
    }


}
