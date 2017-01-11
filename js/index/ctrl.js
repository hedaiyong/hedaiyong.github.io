/**
 * Created by hedy02 on 2016/8/27.
 */

stao_index_app
    .controller('stao_contain_ctrl', function ($scope, $rootScope, $http, GLOBAL_CONFIG, GLOBAL_VALUE, UtilService) {
    $scope.dateUtil = UtilService;

    $rootScope.ip = GLOBAL_CONFIG.url.ip;
    $rootScope.port = GLOBAL_CONFIG.url.port;

    $scope.getNewHouseTopSaleList = function () {
        $scope.$broadcast("getNewHouseTopSaleList", "");
    };

    $scope.querySignHouseTop = function () {
        $scope.$broadcast("querySignHouseTop", "");
    };

    $scope.newHouse_region_tbl = {
        theadConfig: {
            sortBuffer: {
                region: {
                    name: '区域',
                    canSort: true,
                    sortName: 'region',
                    sortDir: '',
                    sortState: false,
                },
                soldArea: {
                    name: '成交面积',
                    canSort: true,
                    sortName: 'soldArea',
                    sortDir: '',
                    sortState: false,
                },
                soldCount: {
                    name: '成交套数',
                    canSort: true,
                    sortName: 'soldCount',
                    sortDir: '',
                    sortState: false,
                },
                soldPrice: {
                    name: '成交均价',
                    canSort: true,
                    sortName: 'soldPrice',
                    sortDir: '',
                    sortState: false,
                },
                allCount: {
                    name: '可售套数',
                    canSort: true,
                    sortName: 'allCount',
                    sortDir: '',
                    sortState: false,
                }
            },
        },
        getNewHouseRegionList: function (key, pageSize, curPage) {
            var self = this;
            $http.get('http://' + $rootScope.ip + ':' + $rootScope.port + '/api/queryNewHouseRegionOpen?'
                + '&pageSize=' + pageSize
                + '&curPage=' + curPage
                + '&key=' + key)
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.newHouse_region_tbl.sales = ret.data.data;
                        // $scope.tblPagination.initPagination(ret);
                    }
                }).error(function (msg) {
                console.log("Fail! " + msg);
            });
        }
    };

    $scope.second_hand_house_tbl = {
        theadConfig: {
            sortBuffer: {
                region: {
                    name: '区域',
                    canSort: true,
                    sortName: 'region',
                    sortDir: '',
                    sortState: false,
                },
                soldArea: {
                    name: '成交面积',
                    canSort: true,
                    sortName: 'soldArea',
                    sortDir: '',
                    sortState: false,
                },
                soldCount: {
                    name: '成交套数',
                    canSort: true,
                    sortName: 'soldCount',
                    sortDir: '',
                    sortState: false,
                }
            }
        },
        getSHHouseRegionList: function (key, pageSize, curPage) {
            var self = this;
            $http.get('http://' + $rootScope.ip + ':' + $rootScope.port + '/api/querySHHouseRegionOpen?'
                + '&pageSize=' + pageSize
                + '&curPage=' + curPage
                + '&key=' + key)
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.second_hand_house_tbl.sales = ret.data.data;
                        // $scope.tblPagination.initPagination(ret);
                    }
                }).error(function (msg) {
                console.log("Fail! " + msg);
            });
        }
    };


    $scope.getRegionHouse = function () {
        $scope.second_hand_house_tbl.getSHHouseRegionList('day', 7, 1);
        $scope.newHouse_region_tbl.getNewHouseRegionList('day', 7, 1);
    };

    $scope.top = {
        hotArticles: [],
        latestComment: []
    };
    //获取24小时热门帖子
    $scope.getDayHotTop = function () {
        $http.get('http://' + $rootScope.ip + ':' + $rootScope.port + '/api/dayHotTopOpen')
            .success(function (ret) {
                if (ret.code == '000') {
                    $scope.top.hotArticles = ret.data;
                }
            }).error(function (msg) {
            console.log("Fail! " + msg);
        });
    };
    $scope.getDayHotTop();
    //获取最新的10条评论
    $scope.getLatestComment = function () {
        $http.get('http://' + $rootScope.ip + ':' + $rootScope.port + '/api/latestCommentOpen')
            .success(function (ret) {
                if (ret.code == '000') {
                    $scope.top.latestComment = ret.data;
                }
            }).error(function (msg) {
            console.log("Fail! " + msg);
        });
    };
    $scope.getLatestComment();
})
//新房昨日销售排名
    .controller('NewHouseYestSaleCtrl', function ($scope, $http, GLOBAL_CONFIG) {
        $scope.newHouse_tbl = {
            dataType: 1,
            dataText: 'day',
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
            theadConfig: {
                sortBuffer: {
                    projectName: {
                        name: '项目名称',
                        canSort: true,
                        sortName: 'projectName',
                        sortDir: '',
                        sortState: false
                    },
                    projectRegion: {
                        name: '区域',
                        canSort: true,
                        sortName: 'projectRegion',
                        sortDir: '',
                        sortState: false
                    },
                    saleCountByTime: {
                        name: '成交套数',
                        canSort: true,
                        sortName: 'saleCountByTime',
                        sortDir: '',
                        sortState: false
                    },
                    salePriceByTime: {
                        name: '成交均价',
                        canSort: true,
                        sortName: 'salePriceByTime',
                        sortDir: '',
                        sortState: false
                    },
                    saleAreaByTime: {
                        name: '成交面积',
                        canSort: true,
                        sortName: 'saleAreaByTime',
                        sortDir: '',
                        sortState: false
                    },
                    soldCountByAll: {
                        name: '总成交套数',
                        canSort: true,
                        sortName: 'soldCountByAll',
                        sortDir: 'down',
                        sortType: 1,
                        sortState: true
                    },
                    soldPriceByAll: {
                        name: '总成交价格',
                        canSort: false,
                        sortName: 'soldPriceByAll',
                        sortDir: '',
                        sortState: false
                    }
                }
            },
            getNewHouseTopSaleList: function () {
                $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/queryProjectSalesByTimeOpen?pageSize=' + $scope.newHouse_tbl.page.pageSize
                    + '&curPage=' + $scope.newHouse_tbl.page.curPage
                    + '&key=' + $scope.newHouse_tbl.dataText)
                    .success(function (ret) {
                        if (ret.code == '000') {
                            $scope.newHouse_tbl.top10 = ret.data.data;
                            $scope.newHouse_tbl.page.totalItems = ret.data.totalItems;
                        }
                    }).error(function (msg) {
                    console.log("Fail! " + msg);
                });
            }
        };

        $scope.switchTab = function (tag) {
            $scope.newHouse_tbl.dataType = tag;
            $scope.newHouse_tbl.page.curPage = 1;

            switch ($scope.newHouse_tbl.dataType) {
                case 1:
                    $scope.newHouse_tbl.dataText = 'day';
                    break;
                case 2:
                    $scope.newHouse_tbl.dataText = 'week';
                    break;
                case 3:
                    $scope.newHouse_tbl.dataText = 'mouth';
                    break;
            }

            $scope.newHouse_tbl.getNewHouseTopSaleList();
        };

        $scope.$on("getNewHouseTopSaleList", function (event, msg) {
            $scope.newHouse_tbl.getNewHouseTopSaleList();
        });


    })
    //新房昨日签约排名
    .controller('NewHouseYestSignCtrl', function ($scope, $http, GLOBAL_CONFIG) {

        $scope.signed_house_tbl = {
            data: '',
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
            theadConfig: {
                region: {
                    name: '排名'
                },
                soldArea: {
                    name: '楼盘'
                },
                soldCount: {
                    name: '签约套数'
                }
            },
            querySignHouseTop: function (pageSize, curPage) {
                $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/querySignHouseTopOpen?pageSize=' + pageSize
                    + '&curPage=' + curPage)
                    .success(function (ret) {
                        if (ret.code == '000') {
                            $scope.signed_house_tbl.data = ret.data.data;
                            $scope.signed_house_tbl.page.totalItems = ret.data.totalItems;
                        }
                    }).error(function (msg) {
                    console.log("Fail! " + msg);
                });
            }
        };

        $scope.$on("querySignHouseTop", function (event, msg) {
            $scope.querySignHouseTop();
        });

        $scope.querySignHouseTop = function () {
            $scope.signed_house_tbl.querySignHouseTop($scope.signed_house_tbl.page.pageSize, $scope.signed_house_tbl.page.curPage);
        };
    })
;