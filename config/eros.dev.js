// appBoard，mediator 不建议进行修改 如果修改了 也请对应修改
module.exports = {
    'eslint': false,
    'webpackWarnings': false,
    'exports': [
        // appBoard
        'js/config/index.js',
        // mediator
        'js/mediator/index.vue',
        // home
        'js/pages/diandian/index/index.vue',
        'js/pages/diandian/index/entry.vue',
        // task detail
        'js/pages/diandian/task/taskDetail.vue',
        // all task list
        'js/pages/diandian/task/allTasks.vue',
        // reward
        'js/pages/diandian/wallet/reward.vue',
        // history
        'js/pages/diandian/wallet/history.vue',
        // account register
        'js/pages/diandian/account/account.vue',
        // view task
        'js/pages/diandian/mine/viewTask.vue',
        // members
        'js/pages/diandian/member/members.vue',
        // settings
        'js/pages/diandian/mine/settings.vue',
        // pay
        'js/pages/diandian/member/pay.vue',
        // card
        'js/pages/diandian/mine/card.vue',
        // subAccount
        'js/pages/diandian/mine/subAccount.vue'



        // 'js/pages/demo/index.vue',
        // 'js/pages/demo/lifecycle/index.vue',
        // 'js/pages/demo/assets/index.vue',
        // 'js/pages/demo/globalAttr/index.vue',
        // 'js/pages/demo/inputExtend/index.vue',
        // 'js/pages/demo/refresh/index.vue',
        // 'js/pages/demo/storage/index.vue',
        // 'js/pages/demo/router/index.vue',
        // 'js/pages/demo/router/tabbarItem1.vue',
        // 'js/pages/demo/router/tabbarItem2.vue',
        // 'js/pages/demo/router/tabbarItem3.vue',
        // 'js/pages/demo/event/a.vue',
        // 'js/pages/demo/event/b.vue',
        // 'js/pages/demo/notice/index.vue',
        // 'js/pages/demo/font/index.vue',
        // 'js/pages/demo/image/index.vue',
        // 'js/pages/demo/bmchart/index.vue',
        // 'js/pages/demo/bmrichtext/index.vue',
        // 'js/pages/demo/bmcalendar/index.vue',
        // 'js/pages/demo/other/bindingx.vue',
        // 'js/pages/demo/other/weexui.vue',
        // 'js/pages/demo/other/bui.vue'
    ],
    'alias': {
        'Components': 'js/components',
        'Common': 'js/common',
        'Config': 'js/config',
        'Widget': 'js/widget',
        'Pages': 'js/pages',
        'Utils': 'js/utils'
    },
    'diff': {
        'pwd': '/Users/yangmingzhe/Work/opensource/eros-diff-folder',
        'proxy': 'https://app.weex-eros.com/source'
    },
    'server': {
        'path': './',
        'port': 8889
    },
    'mockServer': {
        'port': 52077,
        'mockDir': './dist/mock'
    },
    'socketServer': {
        'port': 8890,
        'switch': true
    }
};