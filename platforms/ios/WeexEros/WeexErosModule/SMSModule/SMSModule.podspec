Pod::Spec.new do |s|
  s.name         = "SMSModule"
  s.version      = "0.0.1"
  s.summary      = "SMSModule"
  # s.description  = <<-DESC
  #                  DESC
  s.homepage     = "https://www.maimai.com"
  s.license      = "MAIMAI"
  s.author       = { "maimai" => "1107821214@qq.com" }
  s.source       = { :git => "http://xxxx/xxx.git", :tag => "#{s.version}" }
  s.platform     = :ios
  s.requires_arc = true

  s.source_files  = [
    "Classes/**/*.{h,m}",
    "Classes/"
  ]
  s.public_header_files = "Classes/**/*.h"

  s.frameworks = 'UIKit'
  
  s.dependency 'mob_smssdk'
  s.dependency 'WeexSDK'
end
