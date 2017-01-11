/**
 * Created by hedy02 on 2016/9/19.
 */
'use strict';
article_app.config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}).controller('article_ctrl', function ($scope,$window, $rootScope, $http, $timeout, GLOBAL_CONFIG) {

    $rootScope.ip = GLOBAL_CONFIG.url.ip;
    $rootScope.port = GLOBAL_CONFIG.url.port;
    $scope.article = {
        isShowTitleNoEmpty:false,
        showTitleNoEmptyMsg:'标题不能为空哦...',
        isShowPlateNoSelect:false,
        showPlateNoSelectMsg:'需要选择板块哦...',
        froalaOptions: {
            // toolbarButtons: ["fontFamily","fontSize","strikeThrough","subscript","superscript",
            //     "color","emoticons","paragraphStyle","paragraphFormat","outdent","indent","insertLink","quote","insertHR","insertImage","insertVideo",
            //     "insertFile","insertTable","clearFormatting","bold","italic","underline","align","formatOL","formatUL"
            //     ,"html","selectAll","undo","redo","fullscreen"]
        },
        title: undefined,
        content: '<div>Lorem ipsum dolor sit amet,<strong>consectetur</strong>adipiscing elit<del>Praesent lacus diam</del>, fermentum et venenatis quis, suscipit sed nisi. In pharetra sem eget orci posuere pretium.<em>Integer</em>non eros<strong><em>scelerisque</em></strong>, consequat lacus id, rutrum felis. Nulla elementum felis urna, at placerat arcu ultricies in.</div><ul><li>Proin elementum sollicitudin sodales.</li><li>Nam id erat nec nibh dictum cursus.</li></ul><blockquote>In et urna eros. Fusce molestie, orci vel laoreet tempus, sem justo blandit magna, at volutpat velit lacus id turpis.<br>Quisque malesuada sem at interdum congue. Aenean dapibus fermentum orci eu euismod.</blockquote><div></div>',
        //取消
        cancel:function () {

        },
        //保存为草稿
        saveDraft:function () {
            $scope.addArticle(GLOBAL_CONFIG.article.STATUS_DRAFT);
        },
        //发布
        release:function () {
            $scope.addArticle(GLOBAL_CONFIG.article.STATUS_PUBLISHED);
        },
        articleFocus:function () {
            $scope.article.isShowTitleNoEmpty=false;
        }
    };
    //增加文章
    $scope.addArticle = function (status) {
        if (!$scope.validationArticle()){
            var params = {
                    userID:$window.localStorage['userID'],
                    status:status,
                    content:$scope.article.content,
                    title:$scope.article.title,
                    plateLevel1ID:$scope.plate.selected.plateID,
                    plateLevel2ID:$scope.plate.selected.id,
                    plateLevel3ID: function(){
                        if ($scope.plate.selected.plateID == 1){
                            return $scope.community.selected.id;
                        }else {
                            return 0;
                        }
                    },
                    plateLevel4ID:  function(){
                        if ($scope.plate.selected.plateID == 1){
                            return $scope.community_plate.selected.id;
                        }else {
                            return 0;
                        }
                    }
                },
                transFn = function(params) {
                    return $.param(params);
                },
                url = 'http://' + $rootScope.ip + ':' + $rootScope.port + '/api/addArticleWeb',
                postCfg = {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    transformRequest: transFn
                };
            $http.post(url, params, postCfg)
                .success(function(ret){
                    console.log(ret);
                });
        }
    };

    $scope.showCommunity = false;
    $scope.plate = {};
    $scope.plate.selected = undefined;
    $scope.plates = [
        {name: '南山区', id: '11', plate: '社区论坛', plateID: '1'},
        {name: '龙岗区', id: '12', plate: '社区论坛', plateID: '1'},
        {name: '宝安区', id: '13', plate: '社区论坛', plateID: '1'},
        {name: '福田区', id: '14', plate: '社区论坛', plateID: '1'},
        {name: '罗湖区', id: '15', plate: '社区论坛', plateID: '1'},
        {name: '盐田区', id: '16', plate: '社区论坛', plateID: '1'},
        {name: '来个帅哥', id: '21', plate: '征婚论坛', plateID: '2'},
        {name: '求个贤妻', id: '22', plate: '征婚论坛', plateID: '2'},
        {name: '房价', id: '31', plate: '侃房产', plateID: '3'},
        {name: '购房', id: '32', plate: '侃房产', plateID: '3'},
        {name: '卖房', id: '33', plate: '侃房产', plateID: '3'},
        {name: '直播', id: '34', plate: '侃房产', plateID: '3'},
        {name: '惊呆', id: '41', plate: '头条新闻', plateID: '4'},
        {name: '炸开', id: '42', plate: '头条新闻', plateID: '4'},
        {name: '吓哭', id: '43', plate: '头条新闻', plateID: '4'},
        {name: '喜大普奔', id: '44', plate: '头条新闻', plateID: '4'},
        {name: '生活琐事', id: '51', plate: '天南海北', plateID: '5'},
        {name: '旅游分享', id: '52', plate: '天南海北', plateID: '5'},
        {name: '美食佳肴', id: '53', plate: '天南海北', plateID: '5'},
        {name: '活动召集', id: '54', plate: '天南海北', plateID: '5'}
    ];
    $scope.selectPlate = function (item) {
        $scope.article.isShowPlateNoSelect=false;
        if (item.plateID == 1) {
            $scope.community.selected = undefined;
            $scope.community_plate.selected = undefined;
            $scope.showCommunity = true;
            $scope.queryCommunities(item.id);
        } else {
            $scope.showCommunity = false;
        }

    };
    //---------具体小区-------------
    $scope.community = {};
    $scope.community.selected = undefined;
    $scope.communities = [];
    $scope.queryCommunities = function (regionID) {

        $http.get('http://' + $rootScope.ip + ':' + $rootScope.port + '/api/queryCommunityWeb?regionID=' + regionID)
            .success(function (ret) {
                if (ret.code=='000') {
                    $scope.communities = ret.data;
                }
            }).error(function (msg) {
            console.log("Fail! " + msg);
        });
    };
    $scope.selectCommunity = function (item) {
        $scope.article.isShowPlateNoSelect=false;
        console.log(item)
    };
    //--------------最小板块--------
    $scope.community_plate = {};
    $scope.community_plate.selected = undefined;
    $scope.community_plates = [
        {name: '房屋装修', id: '61'},
        {name: '房屋租售', id: '62'},
        {name: '生活琐事', id: '63'},
        {name: '活动召集', id: '64'}
    ];

    $scope.ui_select_no_choice = "哇哦，没有这个选项...";

    $scope.isEmpty = function (str)
    {
        if(str == undefined || $.trim(str)==''){
            return true;
        }else{
            return false;
        }
    };
    $scope.validationArticle=function () {
        if ($scope.isEmpty($scope.article.title)){
            $scope.article.isShowTitleNoEmpty=true;
        }
        if ($scope.isEmpty($scope.plate.selected)){
            $scope.article.isShowPlateNoSelect=true;
        }else if ($scope.plate.selected.plateID==1){
            if ($scope.isEmpty($scope.community.selected) || $scope.isEmpty($scope.community_plate.selected)){
                $scope.article.isShowPlateNoSelect=true;
            }
        }
        return $scope.article.isShowTitleNoEmpty | $scope.article.isShowPlateNoSelect;
    };
});

article_app.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function (item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});
