/**
 * Created by hedy02 on 2016/9/19.
 */
'use strict';
//跨越post提交，有没有注意到我
user_app.config(function ($httpProvider, $urlRouterProvider, $stateProvider) {
    $httpProvider.defaults.withCredentials = true;
    $urlRouterProvider.otherwise('/user_info');

    $stateProvider
    //用户信息
        .state('user_info', {
            url: '/user_info',
            templateUrl: '../../../tpl/forum/user/user_info.html',
            controller: 'UserInfoCtrl'
        })
        //我的帖子
        // nested list with custom controller
        .state('user_articles', {
            url: '/user_articles',
            templateUrl: '../../../tpl/forum/user/user_articles.html',
            controller: 'UserArticlesCtrl'
        })
        //我的评论或回复
        .state('user_commentOrReply', {
            url: '/user_commentOrReply',
            templateUrl: '../../../tpl/forum/user/user_commentOrReply.html',
            controller: 'UserCommentOrReplyCtrl'
        })
        //我的收藏
        .state('user_collection', {
            url: '/user_collection',
            templateUrl: '../../../tpl/forum/user/user_collection.html',
            controller: 'UserCollectionCtrl'
        })
        //我的消息
        .state('user_msg', {
            url: '/user_msg',
            templateUrl: '../../../tpl/forum/user/user_msg.html',
            controller: 'UserMsgCtrl'
        })
        //我的访客
        .state('user_visitor', {
            url: '/user_visitor',
            templateUrl: '../../../tpl/forum/user/user_visitor.html',
            controller: 'UserVisitorCtrl'
        })
        //关注我的
        .state('follow_me', {
            url: '/follow_me',
            templateUrl: '../../../tpl/forum/user/follow_me.html',
            controller: 'FollowMeCtrl'
        })
        //我关注的
        .state('me_follow', {
            url: '/me_follow',
            templateUrl: '../../../tpl/forum/user/me_follow.html',
            controller: 'MeFollowCtrl'
        })
        //我的预约
        .state('my_reservation', {
            url: '/my_reservation',
            templateUrl: '../../../tpl/forum/user/my_reservation.html',
            controller: 'MyReservationCtrl'
        })
        //我的客户
        .state('my_customer', {
            url: '/my_customer',
            templateUrl: '../../../tpl/forum/user/my_customer.html',
            controller: 'MyCustomerCtrl'
        })
        //安全中心
        .state('security', {
            url: '/security',
            templateUrl: '../../../tpl/forum/user/security.html',
            controller: 'SecurityCtrl'
        })
        //违规记录
        .state('criminal_records', {
            url: '/criminal_records',
            templateUrl: '../../../tpl/forum/user/criminal_records.html',
            controller: 'CriminalRecordsCtrl'
        });
}).run(['$rootScope', '$log', function ($rootScope, $log) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $log.debug('successfully changed states');

        $log.debug('event', event);
        $log.debug('toState', toState);
        $log.debug('toParams', toParams);
        $log.debug('fromState', fromState);
        $log.debug('fromParams', fromParams);
    });

    $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
        $log.error('The request state was not found: ' + unfoundState);
    });

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        $log.error('An error occurred while changing states: ' + error);

        $log.debug('event', event);
        $log.debug('toState', toState);
        $log.debug('toParams', toParams);
        $log.debug('fromState', fromState);
        $log.debug('fromParams', fromParams);
    });
}])
    .controller('user_ctrl', function ($scope, $window, $rootScope, $http, $timeout, GLOBAL_CONFIG) {


    })
    .controller('UserInfoCtrl', function ($scope, $window, $location, $http, $timeout, GLOBAL_CONFIG) {
        if ($window.localStorage['userID'] == 'null' || $window.localStorage['userID'] == null || $window.localStorage['userID'] == undefined) {
            $window.location = '../../common/error/500.html';
        }
        ;

        $scope.user = {
            userID: $window.localStorage['userID'],
            nickname: $window.localStorage['nickname'],
            type: $window.localStorage['userType'],
            profilePhotoURL: $window.localStorage['userProfilePhotoURL']
        };

        $scope.getUserInfo = function () {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/getUserDetailWeb')
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.user = ret.data;
                        if (ret.data.sex == 1) {
                            $scope.user.gender = '男';
                        } else if (ret.data.sex == 2) {
                            $scope.user.gender = '女';
                        } else {
                            $scope.user.gender = '未设置';
                        }

                    } else {
                        $window.location = '../../common/error/500.html';
                    }
                }).error(function (msg) {
                $window.location = '../../common/error/500.html';
            });
        };

        $scope.getUserInfo();
    })
    .controller('UserArticlesCtrl', function ($scope, $window, $rootScope, $http, $timeout, GLOBAL_CONFIG, UtilService) {
        $scope.dateUtil = UtilService;
        $scope.articles = {
            searchState: undefined,
            noSelectText: '状态未选择...',
            status: [{
                state: 2,
                name: '已发布'
            }, {
                state: 1,
                name: '草稿'
            }
            ],
            list: [],
            thead: {
                indexText: {
                    name: '序号'
                },
                titleText: {
                    name: '标题'
                },
                plateText: {
                    name: '板块'
                },
                stateText: {
                    name: '状态'
                },
                remarkText: {
                    name: ''
                }
            },
            page: {
                key: '',
                state: '',
                totalPage: 1,
                totalItems: 1,
                pageSize: 12,
                curPage: 1,
                maxSize: 5,
                first_text: '首页',
                last_text: '尾页',
                next_text: '下页',
                previous_text: '上页'
            }

        };

        $scope.articles.selectState = function () {
            $scope.articles.page.state = $scope.articles.searchState.state;
        };
            //获取文章列表
        $scope.getArticles = function () {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/getUserArticlesWeb?&pageSize=' + $scope.articles.page.pageSize
                + '&curPage=' + $scope.articles.page.curPage
                + '&key=' + $scope.articles.page.key
                + '&state=' + $scope.articles.page.state
            )
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.articles.page.totalItems = ret.data.totalItems;
                        $scope.articles.page.curPage = ret.data.curPage;
                        $scope.articles.list = ret.data.data;
                    } else {
                        // $window.location = '../../common/error/500.html';
                    }
                }).error(function (msg) {
                // $window.location = '../../common/error/500.html';
            });
        };

        $scope.getArticles();
    })
    .controller('UserCommentOrReplyCtrl', function ($scope, $window, $rootScope, $http, $timeout, GLOBAL_CONFIG,UtilService) {
        $scope.dateUtil = UtilService;

        $scope.comment = {
            list:[],
            page: {
                key: '',
                totalPage: 1,
                totalItems: 1,
                pageSize: 8,
                curPage: 1,
                maxSize: 5,
                first_text: '首页',
                last_text: '尾页',
                next_text: '下页',
                previous_text: '上页'
            }
        };

        $scope.getComments = function () {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/getCommentsWeb?&pageSize=' + $scope.comment.page.pageSize
                + '&curPage=' + $scope.comment.page.curPage
                + '&key=' + $scope.comment.page.key
            )
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.comment.page.totalItems = ret.data.totalItems;
                        $scope.comment.page.curPage = ret.data.curPage;
                        $scope.comment.list = ret.data.data;
                    } else {
                        // $window.location = '../../common/error/500.html';
                    }
                }).error(function (msg) {
                // $window.location = '../../common/error/500.html';
            });
        };

        $scope.reply = {
            list:[],
            page: {
                key: '',
                totalPage: 1,
                totalItems: 1,
                pageSize: 8,
                curPage: 1,
                maxSize: 5,
                first_text: '首页',
                last_text: '尾页',
                next_text: '下页',
                previous_text: '上页'
            }
        };

        $scope.getReplys = function () {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/getReplysWeb?&pageSize=' + $scope.reply.page.pageSize
                + '&curPage=' + $scope.reply.page.curPage
                + '&key=' + $scope.reply.page.key
            )
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.reply.page.totalItems = ret.data.totalItems;
                        $scope.reply.page.curPage = ret.data.curPage;
                        $scope.reply.list = ret.data.data;
                    } else {
                        // $window.location = '../../common/error/500.html';
                    }
                }).error(function (msg) {
                // $window.location = '../../common/error/500.html';
            });
        };
    })
    .controller('UserCollectionCtrl', function ($scope, $window, $rootScope, $http, $timeout, GLOBAL_CONFIG) {

    })
    .controller('UserMsgCtrl', function ($scope, $window, $rootScope, $http, $timeout, GLOBAL_CONFIG) {

    })
    .controller('UserVisitorCtrl', function ($scope, $window, $rootScope, $http, $timeout, GLOBAL_CONFIG) {

    })
    .controller('FollowMeCtrl', function ($scope, $window, $rootScope, $http, $timeout, GLOBAL_CONFIG) {

    })
    .controller('MeFollowCtrl', function ($scope, $window, $rootScope, $http, $timeout, GLOBAL_CONFIG) {

    })
    .controller('MyReservationCtrl', function ($scope, $window, $rootScope, $http, $timeout, GLOBAL_CONFIG) {

    })
    .controller('MyCustomerCtrl', function ($scope, $window, $rootScope, $http, $timeout, GLOBAL_CONFIG) {

    })
    .controller('SecurityCtrl', function ($scope, $window, $rootScope, $http, $timeout, GLOBAL_CONFIG) {

    })
    .controller('CriminalRecordsCtrl', function ($scope, $window, $rootScope, $http, $timeout, GLOBAL_CONFIG) {

    })
;
