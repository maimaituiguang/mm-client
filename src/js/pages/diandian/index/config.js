/**
 * Created by Tw93 on 2016/11/4.
 */
export default {
  // 使用 iconFont 模式的tab title配置
  tabIconFontTitles: [
    {
      title: '任务',
      codePoint: '\ue67b'
    },
    {
      title: "应用",
      codePoint: '\ue6db'
    },
    {
      title: '钱包',
      codePoint: '\ue67a',
      badge: 0
    },
    {
      title: '我的',
      codePoint: '\ue67c',
      dot: false
    }
  ],
  tabIconFontStyles: {
    bgColor: '#FFFFFF',
    titleColor: '#666666',
    activeTitleColor: '#3D3D3D',
    activeBgColor: '#FFFFFF',
    isActiveTitleBold: true,
    width: 160,
    height: 120,
    fontSize: 24,
    textPaddingLeft: 10,
    textPaddingRight: 10,
    iconFontSize: 50,
    iconFontMarginBottom: 8,
    iconFontColor: '#333333',
    activeIconFontColor: '#ed4040',
    iconFontUrl: 'http://at.alicdn.com/t/font_1141272_cz4hclau60o.ttf'
  }
};