/**
 * Created by hedy02 on 2016/9/12.
 */
var staoModule = angular.module('sModule', []);
staoModule.constant('GLOBAL_CONFIG', {
    article: {
        STATUS_DRAFT: 1,   //草稿
        STATUS_PUBLISHED: 2   //已发布
    },
    house:{
        SELLING:1,
        ANJU_HOUSE:9,
        stateList:["期房待售","已售","已签预售合同","已备案","已签认购书","初始登记","管理局锁定","自动锁定","安居型商品房","司法查封","未知状态"],
    },
    user:{
        jobs:['内部管理员','论坛管理员','普通用户','房产中介','房产销售','房屋装修','贷款专员','律师'],
        status:['未认证','认证中','已认证','认证失败']
    },
    url: {
        domain:window.location.host,
        'ip': (function () {
            return '114.55.42.174';
        })(),
        'port': (function () {
            return '9090';
        })()
    }
});
staoModule.value('GLOBAL_VALUE', {
    domain:window.location.host,
    isLogin: false,
    userName: ""
});

staoModule.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
}).constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
})
    .config(function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;

        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
    })
    .factory('AuthService', function ($http, Session, GLOBAL_CONFIG, Md5, $window, GLOBAL_VALUE) {
        var authService = {};

        authService.signUp = function (credentials) {
            var params = {
                password: Md5.hex_md5(credentials.password),
                nickname: credentials.nickname,
                phone: credentials.phone
            };
            return $http.post('http://' + GLOBAL_CONFIG.url.ip + ":" + GLOBAL_CONFIG.url.port + '/api/signUp', params).then(function (res) {
                if (res.data.code == '000') {
                    Session.create(res.data.data);
                    GLOBAL_VALUE.isLogin = true;
                }
                return res.data.data;
            });
        };

        authService.isAuthenticated = function () {
            return !!Session.userId;
        };

        authService.isAuthorized = function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
        };
        return authService;
    }).service('Session', function ($window) {

    this.create = function (user) {
        $window.localStorage['userID'] = user.id;
        $window.localStorage['nickname'] = user.nickname;
        $window.localStorage['userType'] = user.type;
        $window.localStorage['userProfilePhotoURL'] = user.profilePhotoURL;
        $window.localStorage['lt'] = user.password;
        $window.sessionStorage.setItem("userID", user.id);
    };
    this.destroy = function () {
        $window.localStorage['userID'] = null;
        $window.localStorage['nickname'] = null;
        $window.localStorage['userType'] = null;
        $window.localStorage['userProfilePhotoURL'] = null;
        $window.localStorage['lt'] = null;
    };
    return this;
}).service('UtilService', function ($window) {


    this.isEmpty = function (obj) {
        if (obj == undefined || obj == null || angular.equals({}, obj)) {
            return true;
        }
        return false;
    };
    var self = this;
    self.timeUtil = {};
    self.timeUtil.parseDate = function (e) {
        return e.parse("2011-10-28T00:00:00+08:00") &&
            function (t) {
                return new e(t)
            } || e.parse("2011/10/28T00:00:00+0800") &&
            function (t) {
                return new e(t.replace(/-/g, "/").replace(/:(\d\d)$/, "$1"))
            } || e.parse("2011/10/28 00:00:00+0800") &&
            function (t) {
                return new e(t.replace(/-/g, "/").replace(/:(\d\d)$/, "$1").replace("T", " "))
            } ||
            function (t) {
                return new e(t)
            }
    }(Date);
    self.timeUtil.elapsedTime = function (e) {
        var t = self.timeUtil.parseDate(e),
            s = new Date,
            a = (s - t) / 1e3;
        return 10 > a ? "刚刚" : 60 > a ? Math.round(a) + "秒前" : 3600 > a ? Math.round(a / 60) + "分钟前" : 86400 > a ? Math.round(a / 3600) + "小时前" : (s.getFullYear() == t.getFullYear() ? "" : t.getFullYear() + "年") + (t.getMonth() + 1) + "月" + t.getDate() + "日"
    };
    self.timeUtil.fullTime = function (e) {
        var t = self.timeUtil.parseDate(e);
        return t.getFullYear() + "年" + (t.getMonth() + 1) + "月" + t.getDate() + "日 " + t.toLocaleTimeString()
    };
    self.openSignDialog = function (ngDialog) {
        if ($window.localStorage['userID'] == 'null' || $window.localStorage['userID'] == null || $window.localStorage['userID'] == undefined){
            ngDialog.open({
                template: 'signInOrSignUpDialog',
                className: 'ngdialog-theme-default',
                controller: 'LoginController',
                showClose: true,
                closeByDocument: true
            });
            return false;
        }

        return true;

    };

    self.isMobile = function () {
        var isMobile = false; //initiate as false
// device detection
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

        return isMobile;

    };

    self.openMessage = function (content,ngDialog, callback) {
        var dialog = ngDialog.open({
            template: content,
            plain: true,
            className: 'ngDialog-theme-success',
            closeByDocument: true,
            closeByEscape: true
        });
        setTimeout(function () {
            dialog.close();
            $window.location.reload();
            if (callback != null){
                callback();
            }
        }, 1000);
    };
    self.getUrlParameter = function (sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };
}).factory('AuthInterceptor', function ($rootScope, $q,
                                        AUTH_EVENTS) {
    return {
        responseError: function (response) {
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized,
                419: AUTH_EVENTS.sessionTimeout,
                440: AUTH_EVENTS.sessionTimeout
            }[response.status], response);
            return $q.reject(response);
        }
    };
}).directive('loginDialog', function (AUTH_EVENTS) {
    return {
        restrict: 'A',
        template: '<div ng-if="visible" ng-include="\'login-form.html\'">',
        link: function (scope) {
            var showDialog = function () {
                scope.visible = true;
            };

            scope.visible = false;
            scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
            scope.$on(AUTH_EVENTS.sessionTimeout, showDialog)
        }
    };
})
    .controller('forum_comment_ctrl', function ($scope, GLOBAL_CONFIG, $http, $window, UtilService, $interval, $compile,ngDialog) {
        //文章ID
        $scope.article = $scope.$parent.comment;
        $scope.dateUtil = UtilService;

        $scope.getLikeOrCollect = function () {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ":" + GLOBAL_CONFIG.url.port + '/api/getArticleLikeOrCollectOpen?articleID=' + $scope.article.id
            ).then(function (res) {
                if (res.data.code == '000') {
                    $scope.article.likeCollect=res.data.data.likeCollect;
                    //设置点赞的数量和收藏的数量
                    if ($scope.article.likeCollect.likeCount > 0){
                        $scope.comment.supportText = $scope.article.likeCollect.likeCount;
                    }
                    if ($scope.article.likeCollect.collectCount > 0){
                        $scope.comment.collectText = $scope.article.likeCollect.collectCount;
                    }
                    if ($scope.article.likeCollect.isLike){
                        $scope.comment.isSupport = true;
                    }
                    if ($scope.article.likeCollect.isCollect){
                        $scope.comment.isCollection = true;
                    }
                } else {
                    console.log(res.data);
                }
            });
        };
        //设置点赞的数量和收藏的数量
        $scope.getLikeOrCollect();
        
        

        //要考虑未登录用户
        $scope.curUser = {
            //是否已登录
            isLogin: UtilService.isEmpty($window.localStorage['userID']),
            userID: $window.localStorage['userID'],
            nickname: $window.localStorage['nickname'],
            userProfilePhotoURL: $window.localStorage['userProfilePhotoURL']
        };
        
        $scope.comment = {
            collectText:'收藏',
            supportText:'点赞',
            isCollection: false,
            isSupport: false,
            isShow: false,
            reply: {
                submitText: '回复',
                content: undefined
            },
            submitText: '评论',
            content: undefined,
            list: [],
            page: {
                pageSize: 10,
                curPage: 1,
                totalPage: 1,
                totalItems: 1,
                maxSize: 5,
                first_text: '首页',
                last_text: '尾页',
                next_text: '下页',
                previous_text: '上页'
            },
            pageChanged: function () {
                //获取评论
                $scope.getCommentAndReply();
            },
            //显示评论窗口
            showComment: function () {
                //弹出登录或注册框
                if (UtilService.openSignDialog(ngDialog)){
                    $scope.comment.isShow = !$scope.comment.isShow;
                }

            },
            //文章点赞
            articleSupport: function () {
                //弹出登录或注册框
                if (UtilService.openSignDialog(ngDialog)) {
                    $http.get('http://' + GLOBAL_CONFIG.url.ip + ":" + GLOBAL_CONFIG.url.port + '/api/articleSupportWeb?articleID=' + $scope.article.id
                    ).then(function (res) {
                        if (res.data.code == '000') {
                            //点赞成功
                            $scope.comment.isSupport = true;
                        } else {
                            console.log(res.data);
                        }
                    });
                }
            },
            //用户收藏文章
            userCollect: function () {
                //弹出登录或注册框
                if (UtilService.openSignDialog(ngDialog)) {
                    $http.get('http://' + GLOBAL_CONFIG.url.ip + ":" + GLOBAL_CONFIG.url.port + '/api/userCollectionWeb?articleID=' + $scope.article.id
                    ).then(function (res) {
                        if (res.data.code == '000') {
                            //点赞成功
                            $scope.comment.isCollection = true;
                        } else {
                            console.log(res.data);
                        }
                    });
                }
            },
            articleID: $scope.article.id
        };

        $scope.addComment = function () {
            $scope.comment.submitText = '正在评论';
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ":" + GLOBAL_CONFIG.url.port + '/api/addCommentWeb?articleID=' + $scope.comment.articleID
                + "&content=" + $scope.comment.content
            ).then(function (res) {
                if (res.data.code == '000') {
                    var comment = res.data.data;
                    //正在评论，转圈的图片
                    $scope.comment.submitText = '评论';
                    $scope.comment.isShow = false;
                    //将回复增加到对话框下面
                    $scope.appendComment(comment.content, comment.createDate, comment.id);
                } else {
                    $scope.comment.submitText = '评论失败';
                }
            });
        };
        //将评论添加在第一个
        $scope.appendComment = function (content, commentDate, commentID) {

            var commentHtml = '<li class="ds-post">' +
                '<div class="ds-post-self"  data-source="duoshuo">' +
                '<div class="ds-avatar" data-user-id="' + $scope.curUser.userID + '"><a rel="nofollow author" target="_blank"' +
                'ng-href="http://www.zhuzhe2.com/user.html?userID=' + $scope.curUser.userID + '"' +
                'title="' + $scope.curUser.nickname + '"><img' +
                ' src="' + $scope.curUser.userProfilePhotoURL + '" alt="' + $scope.curUser.nickname + '"></a></div>' +
                '<div class="ds-comment-body">' +
                '<div class="ds-comment-header"><a class="ds-user-name ds-highlight" data-qqt-account=""' +
                'ng-href="http://www.zhuzhe2.com/user.html?userID=' + $scope.curUser.userID + '"' +
                'rel="nofollow" target="_blank" data-user-id="4549843">' + $scope.curUser.nickname + '</a>' +
                '</div>' +
                '<p>' + content + '</p>' +
                '<div class="ds-comment-footer ds-comment-actions"><span class="ds-time"' +
                'datetime="' + commentDate + '"' +
                'title="{{dateUtil.timeUtil.fullTime(\'' + commentDate + '\')}}">{{dateUtil.timeUtil.elapsedTime(\'' + commentDate + '\')}}</span>' +
                '<a class="ds-post-likes" ng-click="commentSupport(' + commentID + ',1,1)"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i> 赞</a>' +
                '<a class="ds-post-repost"  ng-click="commentSupport(' + commentID + ',1,2)"><i class="fa fa-thumbs-o-down" aria-hidden="true"></i> 呸</a>' +
                '<a class="ds-post-reply"  ng-click="openReply($event, ' + commentID + ', 1, ' + '\'0\'' + ', ' + $scope.curUser.userID + ', \'' + $scope.curUser.nickname + '\',1)" href="javascript:void(0);"><span  class="ds-icon ds-icon-reply"></span>回复</a>' +
                '<a class="ds-post-delete"  ng-click="deleteComment(' + commentID + ', 1)"><span class="ds-icon ds-icon-delete"></span>删除</a>' +
                '<a class="ds-post-report" href="javascript:void(0);"><span class="ds-icon ds-icon-report"></span>举报</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</li>';

            var el = $compile(commentHtml)($scope);
            angular.element('.ds-comments').prepend(el);
            //评论条数增加1
            $scope.comment.page.totalItems = $scope.comment.page.totalItems + 1;
        };
        //插入图片
        //待实现

        //插入表情
        $('.ds-add-emote').bind({
            click: function (event) {
                if (!$('#sinaEmotion').is(':visible')) {
                    $(this).sinaEmotion();
                    event.stopPropagation();
                }
            }
        });

        $scope.initReplyText = function () {
            //删除已显示的回复框
            $('.ds-inline-replybox').remove();
            $scope.comment.reply.content = undefined;
        };


        //弹出回复框
        $scope.curEvent = {
            reply: undefined,
            comment: undefined  //暂时不需要
        };
        $scope.openReply = function ($event, commentID, replyType, replyID, toUserID, toUserName, floorNum) {
            $scope.initReplyText();
            $scope.curEvent.reply = $event;

            var replyHtml = '<div class="ds-replybox ds-inline-replybox" style="display: block;"><form method="post">' +
                '<div class="ds-textarea-wrapper ds-rounded-top"><textarea id="reply-textarea" ng-model="comment.reply.content" title="Ctrl+Enter快捷提交" placeholder="说点什么吧…" autofocus="autofocus"></textarea><pre class="ds-hidden-text"></pre></div><div class="ds-post-toolbar"><div class="ds-post-options ds-gradient-bg"></div>' +
                '<button class="ds-post-button" ng-click="addReply(' + commentID + ',' + replyID + ',' + replyType + ',' + toUserID + ',\'' + toUserName + '\',' + floorNum + ')" type="button">{{comment.reply.submitText}}</button><div class="ds-toolbar-buttons"><a class="ds-toolbar-button ds-add-emote" title="插入表情"></a><a ng-model="file" class="ds-toolbar-button ds-add-image ng-pristine ng-untouched ng-valid ng-empty" title="插入图片"></a></div></div></form></div>';
            var el = $compile(replyHtml)($scope);
            if (replyType == 1) {
                angular.element($event.target).parent().append(el);
                angular.element('#reply-textarea').focus();
            } else {
                angular.element($event.target).parent().parent().parent().append(el);
                angular.element('#reply-textarea').focus();
            }

        };

        //获取评论
        $scope.getCommentAndReply = function () {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ":" + GLOBAL_CONFIG.url.port + '/api/getCommentsAndReplysOpen?articleID=' + $scope.comment.articleID
                + "&pageSize=" + $scope.comment.page.pageSize
                + "&curPage=" + $scope.comment.page.curPage
            ).then(function (res) {
                if (res.data.code == '000') {
                    $scope.comment.list = res.data.data.data;
                    $scope.comment.page.totalItems = res.data.data.totalItems;
                    
                } else {
                    console.log(res.data);
                }
            });
        };
        //获取评论
        $scope.getCommentAndReply();
        //定时更新评论时间
        $interval(function () {
            $(".ds-time").each(function () {
                var e = $(this).attr("datetime");
                e && (this.innerHTML = UtilService.timeUtil.elapsedTime(e));
            })
        }, 2e4);
        //展开隐藏的评论
        $scope.expendReply = function (commentID) {
            $(".ds-ctx-entry[data-comment=" + commentID + "]").each(function () {
                if ($(this).is(':hidden')) {　　//如果node是隐藏的则显示node元素，否则隐藏
                    $(this).show();
                } else {
                    $(this).hide();
                }
            })
        };

        //点赞OR点呸
        $scope.commentSupport = function (commentOrReplyID, replyType, supportType) {
            if (UtilService.openSignDialog(ngDialog)){
                $http.get('http://' + GLOBAL_CONFIG.url.ip + ":" + GLOBAL_CONFIG.url.port + '/api/commentOrReplySupportWeb?commentOrReplyID=' + commentOrReplyID
                    + "&replyType=" + replyType
                    + "&supportType=" + supportType
                ).then(function (res) {
                    if (res.data.code == '000') {
                        console.log(res.data.data);
                    } else {
                        console.log(res.data);
                    }
                });
            }
        };

        //回复
        $scope.addReply = function (commentID, replyID, replyType, toUserID, toUserName, floorNum) {
            if(UtilService.openSignDialog(ngDialog)){
                $scope.comment.reply.submitText = '正在回复';
                $http.get('http://' + GLOBAL_CONFIG.url.ip + ":" + GLOBAL_CONFIG.url.port + '/api/replyWeb?commentID=' + commentID
                    + "&replyID=" + replyID
                    + "&articleID=" + $scope.article.id
                    + "&replyType=" + replyType
                    + "&toUserID=" + toUserID
                    + "&toUserName=" + toUserName
                    + "&content=" + $scope.comment.reply.content
                ).then(function (res) {
                    if (res.data.code == '000') {
                        //正在评论，转圈的图片
                        $scope.comment.reply.submitText = '回复';
                        $scope.initReplyText();
                        //将回复增加到对话框下面
                        var newReply = res.data.data;
                        $scope.appendReply(replyType, commentID, newReply.id, newReply.fromUserID, newReply.fromUserName, newReply.fromUserURL, newReply.toUserID, newReply.toUserName, floorNum, newReply.content, newReply.createDate);
                    } else {
                        $scope.comment.reply.submitText = '回复失败';
                    }
                });
            }

        };

        //回复后添加html到末尾，分两种，一种是回复评论的，一种是回复回复的
        $scope.appendReply = function (replyType, commentID, replyID, fromUserID, fromUserName, fromUserURL, toUserID, toUserName, floorNum, content, replyDate) {
            var newReplyHtml = '<li class="ds-ctx-entry">' +
                '<div class="ds-avatar"><a rel="nofollow author" target="_blank" ' + '' +
                'ng-href="http://www.zhuzhe2.com/user.html?userID=' + fromUserID + '" ' +
                'title="' + fromUserName + '"><img' +
                ' src="' + fromUserURL + '" alt="' + fromUserName + '"></a>' +
                '</div>' +
                '<div class="ds-ctx-body">' +
                '<div class="ds-ctx-head"><a rel="nofollow author" target="_blank"  ng-href="http://www.zhuzhe2.com/user.html?userID=' + fromUserID + '">' + fromUserName + '</a>' +
                '<div class="stao-inline-block" ng-if="' + (replyType == 2) + '"> 回复 <a rel="nofollow author" target="_blank"  ng-href="http://www.zhuzhe2.com/user.html?userID=' + toUserID + '">' + toUserName + '</a></div>' +
                '<a href="undefined" target="_blank" rel="nofollow" class="ds-time" datetime="' + replyDate + '" title="{{dateUtil.timeUtil.fullTime(\'' + replyDate + '\')}}">{{dateUtil.timeUtil.elapsedTime(\'' + replyDate + '\')}}</a>' +
                '<div class="ds-ctx-nth" title="{{dateUtil.timeUtil.fullTime(\'' + replyDate + '\')}}">' + (floorNum + 1) + '楼</div>' +
                '</div>' +
                '<div class="ds-ctx-content">' + content + '' +
                '<div class="ds-comment-actions">' +
                '<a class="ds-post-likes" ng-click="commentSupport(' + replyID + ',2,1)"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i> 赞</a>' +
                '<a class="ds-post-repost"  ng-click="commentSupport(' + replyID + ',2,2)"><i class="fa fa-thumbs-o-down" aria-hidden="true"></i> 呸</a>' +
                '<a class="ds-post-reply" ng-click="openReply($event,' + commentID + ',2,' + replyID + ', ' + fromUserID + ',\'' + fromUserName + '\')" href="javascript:void(0);"><span class="ds-icon ds-icon-reply"></span>回复</a>' +
                '<a class="ds-post-delete" ng-click="deleteComment(' + replyID + ',2)"><span class="ds-icon ds-icon-delete"></span>删除</a>' +
                '<a class="ds-post-report" href="javascript:void(0);"><span class="ds-icon ds-icon-report"></span>举报</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</li>';

            var el = $compile(newReplyHtml)($scope);

            if (replyType == 1) {
                angular.element($scope.curEvent.reply.target).parent().parent().children('ol').append(el);

            } else {
                angular.element($scope.curEvent.reply.target).parent().parent().parent().parent().parent().append(el);

            }

        };

        //删除评论或回复    1，评论  2，回复
        $scope.deleteComment = function (id, replyType) {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ":" + GLOBAL_CONFIG.url.port + '/api/deleteCommentOrReplyWeb?id=' + id
                + "&replyType=" + replyType
            ).then(function (res) {
                if (res.data.code == '000') {
                    console.log(res.data.data);
                } else {
                    console.log(res.data);
                }
            });
        };

        //举报评论、回复、文章
        $scope.userReport = function (srcID, srcType, reportType) {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ":" + GLOBAL_CONFIG.url.port + '/api/userReportWeb?srcID=' + srcID
                + "&srcType=" + srcType
                + "&reportType=" + reportType
            ).then(function (res) {
                if (res.data.code == '000') {
                    console.log(res.data.data);
                } else {
                    console.log(res.data);
                }
            });
        };
    })


    .controller('LoginController', function ($scope, $window, $http, $rootScope,$interval, AUTH_EVENTS, AuthService, GLOBAL_CONFIG, Session, Md5, GLOBAL_VALUE,ngDialog,UtilService) {
        var signIn =  '<p style="color: #337ab7"><i class="fa fa-check-square  fa-lg" aria-hidden="true"></i> 登录成功</p>';
        var signUp =  '<p style="color: #337ab7"><i class="fa fa-check-square  fa-lg" aria-hidden="true"></i> 注册成功</p>';
        
        $scope.common = GLOBAL_CONFIG.url;
        
        $scope.user = {
            loginOut: false,
            isLogin: true,
            nickname:  $window.localStorage['nickname']
        };
        //检查用户是否登录
        $scope.checkLogin = function () {
            if (!($window.localStorage['userID'] == undefined || $window.localStorage['userID'] == null || $window.localStorage['userID'] == 'null')) {
                if (($window.sessionStorage.getItem("userID") == null) || (new Date().getTime() - $window.localStorage['lt']) > 1000 * 60 * 60 * 24 * 2) {
                    $http.get('http://' + GLOBAL_CONFIG.url.ip + ":" + GLOBAL_CONFIG.url.port + '/api/checkLogin?userID=' + $window.localStorage['userID']
                        + "&nickname=" + $window.localStorage['nickname']
                        + "&lt=" + $window.localStorage['lt']
                    ).success(function (res) {
                        if (res.code == '000') {
                            Session.create(res.data);
                            $scope.user.isLogin = true;
                            $scope.user.nickname = $window.localStorage['nickname'];
                        } else {
                            $scope.user.isLogin = false;
                            //销毁登录数据
                            Session.destroy();
                        }
                    }).error(function (msg) {
                        console.log("Fail! " + msg);
                    });
                }
            } else {
                $scope.user.isLogin = false;
            }

        };

        $scope.checkLogin();

        $scope.credentials = {
            phone: '',
            password: ''
        };
        $scope.msg = {
            isLoginError: false,
            loginError: '用户名或密码错误',
            NoEmpty: '不能为空哦'
        };
        $scope.signUp = function (credentials,isClose) {
            AuthService.signUp(credentials).then(function (user) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                $scope.setCurrentUser(user);
                $window.location.reload();
                if (isClose){
                    ngDialog.close();
                    UtilService.openMessage(signUp, ngDialog, null);
                }
            }, function () {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            });
        };

        $scope.login = function (credentials,isClose) {
            $scope.msg.isLoginError = false;
            var params = {
                password: Md5.hex_md5(credentials.password),
                phone: credentials.phone
            };
            return $http.post('http://' + GLOBAL_CONFIG.url.ip + ":" + GLOBAL_CONFIG.url.port + '/api/signIn', params).then(function (res) {
                if (res.data.code == '000') {
                    Session.create(res.data.data);
                    $scope.user.nickname = $window.localStorage['nickname'];
                    GLOBAL_VALUE.isLogin = true;
                    $scope.user.isLogin = true;
                    if (isClose){
                        ngDialog.close();
                        UtilService.openMessage(signIn, ngDialog, null);
                    }else {
                        $window.location.reload();
                    }

                } else {
                    $scope.msg.isLoginError = true;
                }
            });
        };

        //退出登录
        $scope.signOut = function () {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ":" + GLOBAL_CONFIG.url.port + '/api/signOut').success(function (res) {
                if (res.code == '000') {
                    $scope.user.isLogin = false;
                    $scope.user.loginOut = false;
                    //销毁登录数据
                    Session.destroy();
                    $window.location.reload();
                } else {
                    $scope.user.isLogin = false;

                }
            }).error(function (msg) {
                console.log("Fail! " + msg);
            });
        }

    }).service('Md5', function () {
    /*
     * Configurable variables. You may need to tweak these to be compatible with
     * the server-side, but the defaults work in most cases.
     */
    var hexcase = 0;
    /* hex output format. 0 - lowercase; 1 - uppercase        */
    var b64pad = "";
    /* base-64 pad character. "=" for strict RFC compliance   */
    var chrsz = 8;
    /* bits per input character. 8 - ASCII; 16 - Unicode      */

    /*
     * These are the functions you'll usually want to call
     * They take string arguments and return either hex or base-64 encoded strings
     */
    this.hex_md5 = function (s) {
        return binl2hex(core_md5(str2binl(s), s.length * chrsz));
    }
    function b64_md5(s) {
        return binl2b64(core_md5(str2binl(s), s.length * chrsz));
    }

    function str_md5(s) {
        return binl2str(core_md5(str2binl(s), s.length * chrsz));
    }

    function hex_hmac_md5(key, data) {
        return binl2hex(core_hmac_md5(key, data));
    }

    function b64_hmac_md5(key, data) {
        return binl2b64(core_hmac_md5(key, data));
    }

    function str_hmac_md5(key, data) {
        return binl2str(core_hmac_md5(key, data));
    }

    /*
     * Perform a simple self-test to see if the VM is working
     */
    function md5_vm_test() {
        return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
    }

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length
     */
    function core_md5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return Array(a, b, c, d);

    }

    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }

    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
     * Calculate the HMAC-MD5, of a key and some data
     */
    function core_hmac_md5(key, data) {
        var bkey = str2binl(key);
        if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

        var ipad = Array(16), opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
        return core_md5(opad.concat(hash), 512 + 128);
    }

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
     * Convert a string to an array of little-endian words
     * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
     */
    function str2binl(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz)
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
        return bin;
    }

    /*
     * Convert an array of little-endian words to a string
     */
    function binl2str(bin) {
        var str = "";
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < bin.length * 32; i += chrsz)
            str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
        return str;
    }

    /*
     * Convert an array of little-endian words to a hex string.
     */
    function binl2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8  )) & 0xF);
        }
        return str;
    }

    /*
     * Convert an array of little-endian words to a base-64 string
     */
    function binl2b64(binarray) {
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i += 3) {
            var triplet = (((binarray[i >> 2] >> 8 * ( i % 4)) & 0xFF) << 16)
                | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8 )
                | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
                else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
            }
        }
        return str;
    }
})

    .service('uploadIPs', function (GLOBAL_CONFIG, $http, $interval, $window) {
        //get the IP addresses associated with an account
        this.getIPs = function (callback) {
            var ip_dups = {};
            //compatibility for firefox and chrome
            var RTCPeerConnection = window.RTCPeerConnection
                || window.mozRTCPeerConnection
                || window.webkitRTCPeerConnection;
            //bypass naive webrtc blocking
            if (!RTCPeerConnection) {
                var iframe = document.createElement('iframe');
                //invalidate content script
                iframe.sandbox = 'allow-same-origin';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
                var win = iframe.contentWindow;
                window.RTCPeerConnection = win.RTCPeerConnection;
                window.mozRTCPeerConnection = win.mozRTCPeerConnection;
                window.webkitRTCPeerConnection = win.webkitRTCPeerConnection;
                RTCPeerConnection = window.RTCPeerConnection
                    || window.mozRTCPeerConnection
                    || window.webkitRTCPeerConnection;
            }
            //minimal requirements for data connection
            var mediaConstraints = {
                optional: [{RtpDataChannels: true}]
            };
            //firefox already has a default stun server in about:config
            //    media.peerconnection.default_iceservers =
            //    [{"url": "stun:stun.services.mozilla.com"}]
            var servers = undefined;
            //add same stun server for chrome
            if (window.webkitRTCPeerConnection)
                servers = {iceServers: [{urls: "stun:stun.voip.aebc.com"}]};
            //construct a new RTCPeerConnection
            var pc = new RTCPeerConnection(servers, mediaConstraints);
            //listen for candidate events
            pc.onicecandidate = function (ice) {
                //skip non-candidate events
                if (ice.candidate) {
                    //match just the IP address
                    var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
                    var ip_addr = ip_regex.exec(ice.candidate.candidate)[1];
                    //remove duplicates
                    if (ip_dups[ip_addr] === undefined)
                        callback(ip_addr);
                    ip_dups[ip_addr] = true;
                }
            };
            //create a bogus data channel
            pc.createDataChannel("");
            //create an offer sdp
            pc.createOffer(function (result) {
                //trigger the stun server request
                pc.setLocalDescription(result, function () {
                }, function () {
                });
            }, function () {
            });
        };

        //发送内网外网ip地址给服务器
        this.makeIPs = function () {
            var result = [];
            var index = 0;
            this.getIPs(function (ip) {
                result[index++] = ip;
            });

            //发送内网外网ip地址给服务器
            var timer = $interval(function () {
                $http.get('http://' + GLOBAL_CONFIG.url.ip + ":" + GLOBAL_CONFIG.url.port + '/api/uploadIPsOpen?ips=' + result
                ).success(function (res) {
                    if (res.code == '000') {
                        $interval.cancel(timer);
                        $window.localStorage['loadIPsTime'] = new Date().getTime();
                    } else {
                        $window.localStorage['loadIPsTime'] = undefined;
                        console.log("fail " + res.message);
                    }
                }).error(function (msg) {
                    $window.localStorage['loadIPsTime'] = undefined;
                    console.log("Fail! " + msg);
                });
            }, 3000, 1);

        };
        if ($window.localStorage['loadIPsTime'] == undefined || (new Date().getTime() - $window.localStorage['loadIPsTime'] ) > 1000 * 60 * 60 * 24)this.makeIPs();
    });

