//
//  SMSModule.m
//  ErosPluginBaseLibrary
//
//  Created by 范腾飞 on 2019/5/12.
//

#import "SMSModule.h"
#import <WeexPluginLoader/WeexPluginLoader.h>
#import <SMS_SDK/SMSSDK.h>

WX_PlUGIN_EXPORT_MODULE(smsCode, SMSModule)

@interface SMSModule()

@end

@implementation SMSModule
    
@synthesize weexInstance;

WX_EXPORT_METHOD(@selector(getCode:callback:))
WX_EXPORT_METHOD(@selector(checkCode:phone:callback:))


- (void)getCode:(NSString *)phone callback:(WXModuleCallback)callback {
    [SMSSDK getVerificationCodeByMethod:SMSGetCodeMethodSMS phoneNumber:phone zone:@"86"  result:^(NSError *error) {
        if (callback) {
            if (!error) {
                callback(@(1));
            } else {
                callback(@(0));
            }
        }
    }];
}

- (void)checkCode:(NSString *)code phone:(NSString *)phone callback:(WXModuleCallback)callback {
    [SMSSDK commitVerificationCode:code phoneNumber:phone zone:@"86" result:^(NSError *error) {
        if (callback) {
            if (!error) {
                callback(@(1));
            } else {
                callback(@(0));
            }
        }
    }];
}


@end
