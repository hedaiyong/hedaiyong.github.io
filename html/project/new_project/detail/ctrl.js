/**
 * Created by hedy02 on 2016/9/19.
 */
'use strict';
all_project_detail_app.controller("AllProjectDetailCtl", function ($scope, $stateParams, $http, $filter, GLOBAL_CONFIG, $rootScope, UtilService) {
    $scope.isMobile = UtilService.isMobile();

    $scope.projectID = UtilService.getUrlParameter('projectID');
    $scope.project = {
        useType:[],
        noSelectText:'未选择项目',
        open: true
    };



    $scope.open_project = function (projectID) {
        $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/getNewProjectDetailOpen?projectID=' + projectID
        )
            .success(function (ret) {
                if (ret.code == '000') {
                    $scope.project.detail = ret.data;
                    $scope.projectName = ret.data.projectName;
                }
            }).error(function (msg) {
            console.log("Fail! " + msg);
        });
    };

    $scope.open_project($scope.projectID);


    $scope.getProjectUseType = function () {
        $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/getUseTypeListOpen?projectID=' + $scope.projectID
        )
            .success(function (ret) {
                if (ret.code == '000') {
                    $scope.project.useType = ret.data;
                }
            }).error(function (msg) {
            console.log("Fail! " + msg);
        });
    };

    
    
    //---------house-chart-------------------------

    $scope.chart={
        charts: {
            config: {
                theme: 'vintage',
                dataLoaded: true
            },
            option: {
                title: {
                    subtext: '来自住建局'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['备案价格']
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line','bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: true,
                        data: []

                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} 平米/元'
                        }
                    }
                ],
                series: [
                    {
                        name: '备案价格',
                        type: 'line',
                        data: []
                    }
                ]
            }
        }
    };

    $scope.house_price_0  = angular.copy($scope.chart);
    $scope.house_price_1  = angular.copy($scope.chart);
    $scope.house_price_2  = angular.copy($scope.chart);
    $scope.house_price_3  = angular.copy($scope.chart);
    $scope.house_price_4 = angular.copy($scope.chart);

        //获取项目有多少种用途
    $scope.getProjectUseType();

    //获取表数据
    $scope.getHouseData = function () {
        $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/queryHouseDataOpen?projectID=' + $scope.projectID
        )
            .success(function (ret) {
                if (ret.code == '000') {

                    for (var i = 0; i < ret.data.length; i++){
                        switch (i){
                            case 0:
                                $scope.house_price_0.charts.option.series[0].data=ret.data[i].price;

                                $scope.house_price_0.charts.option.xAxis[0].data = ret.data[i].name;
                                break;
                            case 1:
                                $scope.house_price_1.charts.option.series[0].data=ret.data[i].price;
                                $scope.house_price_1.charts.option.xAxis[0].data = ret.data[i].name;
                                break;
                            case 2:
                                $scope.house_price_2.charts.option.series[0].data=ret.data[i].price;
                                $scope.house_price_2.charts.option.xAxis[0].data = ret.data[i].name;
                                break;
                            case 3:
                                $scope.house_price_3.charts.option.series[0].data=ret.data[i].price;
                                $scope.house_price_3.charts.option.xAxis[0].data = ret.data[i].name;
                                break;
                            case 4:
                                $scope.house_price_4.charts.option.series[0].data=ret.data[i].price;
                                $scope.house_price_4.charts.option.xAxis[0].data = ret.data[i].name;
                                break;
                        }
                    }

                }
            }).error(function (msg) {
            console.log("Fail! " + msg);
        });
    };
    
    $scope.getHouseData();

    //--------------house-list---------------------
    $scope.houses = {
        activeForm:0,
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
        open: true,
        start: {
            opened: false,
            date:''
        },
        end: {
            opened: false,
            date: new Date()
        },
        signedCount: 0,
        signCount: 0,
        //安居房套数
        anjuCount:0,
        record: {
            selected: {
                buildingID: 0,
                buildingName: '全部'
            },
            ui_select_no_choice: '未选择楼栋',
            floors: [],
            recordPrice: 0
        }


    };


    $scope.house_list = {
        stateList:GLOBAL_CONFIG.house.stateList,
        priceSort:function () {
            if ($scope.house_list.theadConfig.price.clickState == 'update'){
                $scope.house_list.theadConfig.price.clickState = 'asc';
            }else if ($scope.house_list.theadConfig.price.clickState == 'asc'){
                $scope.house_list.theadConfig.price.clickState = 'desc';
            }else {
                $scope.house_list.theadConfig.price.clickState = 'asc';
            }

            $scope.queryHouseList();
        },
        page: {
            useType:'',
            //1全部，2，已签约 3，待签约 4，安居房
            tabIndex:1,
            state:'',
            pageSize: 20,
            curPage: 1,
            totalPage: 1,
            totalItems: 1,
            maxSize: 5,
            first_text: '首页',
            last_text: '尾页',
            next_text: '下页',
            previous_text: '上页'
        },
        data: '',
        theadConfig: {
            projectDetail: {
                isStore:false,
                name: '楼栋'
            },
            buildNO: {
                isStore:false,
                name: '座号'
            },
            houseNo: {
                isStore:false,
                name: '房号'
            },
            useType: {
                isStore:false,
                name: '用途'
            },
            type: {
                isStore:false,
                name: '户型'
            },
            price: {
                clickState:'update',
                isStore: true,
                name: '价格(备案)'
            },
            buildArea: {
                isStore:false,
                name: '建筑面积'
            },
            indoorArea: {
                isStore:false,
                name: '户内面积'
            },
            state: {
                isStore:false,
                name: '状态'
            }
        },
        queryHouseList: function (pageSize, curPage, projectID,useType) {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/queryHouseListOpen?pageSize=' +  $scope.house_list.page.pageSize
                + '&useType=' +  $scope.house_list.page.useType
                + '&curPage=' +  $scope.house_list.page.curPage
                + '&state=' +  $scope.house_list.page.state
                + '&order=' + $scope.house_list.theadConfig.price.clickState
                + '&buildingID=' + $scope.houses.record.selected.buildingID
                + '&projectID=' + projectID)
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.house_list.data = ret.data.data;
                        $scope.house_list.page.totalItems = ret.data.totalItems;
                        $scope.house_list.page.curPage = ret.data.curPage;

                        if (!((useType==undefined)||(useType==null)||(useType=='null'))) {
                            $scope.house_list.totalItems = ret.data.totalItems;
                        }
                    }
                }).error(function (msg) {
                console.log("Fail! " + msg);
            });
        },
        queryHouseCountByUserType: function (projectID) {

            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/queryHouseCountOpen?projectID=' + projectID
                + '&buildingID=' + $scope.houses.record.selected.buildingID
                + '&useType=' +  $scope.house_list.page.useType
            ).success(function (ret) {
                if (ret.code == '000') {
                    $scope.houses.signCount = ret.data.signCount;
                    $scope.houses.signedCount = ret.data.signedCount;
                    $scope.houses.anjuCount = ret.data.anjuCount;

                }
            }).error(function (msg) {
                console.log("Fail! " + msg);
            });
        }
    };

    $scope.queryHouseCount= function (projectID) {

        $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/queryHouseSignCountOpen?projectID=' + projectID
            + '&buildingID=' + $scope.houses.record.selected.buildingID
        ).success(function (ret) {
            if (ret.code == '000') {
                $scope.houses.record.recordPrice = ret.data.recordPrice;
                if ($scope.houses.record.selected.buildingID == 0 && $scope.houses.record.floors.length == 0) {
                    $scope.houses.record.floors = ret.data.floors;
                }

            }
        }).error(function (msg) {
            console.log("Fail! " + msg);
        });
    };
    //选择楼层
    $scope.houses.selectFloor = function () {
        $scope.queryHouseCount($scope.projectID);
        $scope.house_list.page.curPage = 1;
        $scope.switchTab(1);
        $scope.house_list.queryHouseCountByUserType($scope.projectID);
        //$scope.house_list.queryHouseList($scope.house_list.page.pageSize, $scope.house_list.page.curPage, $scope.projectID,"useType");
    };


    $scope.queryHouseList = function (useType) {
        if (arguments.length > 0) {
            $scope.house_list.page.useType = encodeURI(encodeURI(useType));
            $scope.house_list.page.curPage = 1;
            $scope.house_list.page.tabIndex = 1;
            $scope.house_list.page.state = '';
            $scope.house_list.theadConfig.price.clickState = 'noClick';
            $scope.house_list.queryHouseCountByUserType($scope.projectID);
            $scope.house_list.queryHouseList($scope.house_list.page.pageSize, $scope.house_list.page.curPage, $scope.projectID,useType);
        }else {
            $scope.house_list.queryHouseList($scope.house_list.page.pageSize, $scope.house_list.page.curPage, $scope.projectID)
        }
    };

    $scope.switchTab = function (tabIndex) {
        $scope.house_list.page.tabIndex = tabIndex;
        $scope.house_list.page.curPage = 1;

        switch (tabIndex){
            case 1:
                $scope.house_list.theadConfig.price.clickState = 'noClick';
                $scope.house_list.page.state = '';
                $scope.house_list.queryHouseList($scope.house_list.page.pageSize, $scope.house_list.page.curPage, $scope.projectID,"useType");
                break;
            case 2:
                $scope.house_list.theadConfig.price.clickState = 'noClick';
                $scope.house_list.page.state = GLOBAL_CONFIG.house.SIGNED_HOUSE;
                $scope.house_list.queryHouseList($scope.house_list.page.pageSize, $scope.house_list.page.curPage, $scope.projectID);
                break;
            case 3:
                $scope.house_list.theadConfig.price.clickState = 'noClick';
                $scope.house_list.page.state = GLOBAL_CONFIG.house.SELLING;
                $scope.house_list.queryHouseList($scope.house_list.page.pageSize, $scope.house_list.page.curPage, $scope.projectID);
                break;
            case 4:
                $scope.house_list.theadConfig.price.clickState = 'noClick';
                $scope.house_list.page.state = GLOBAL_CONFIG.house.ANJU_HOUSE;
                $scope.house_list.queryHouseList($scope.house_list.page.pageSize, $scope.house_list.page.curPage, $scope.projectID);
                break;
        }
    };

    $scope.houses.selectFloor();
    
});


