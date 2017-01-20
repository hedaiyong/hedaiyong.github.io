/**
 * Created by hedy02 on 2016/9/19.
 */
'use strict';
project_detail_app.controller("projectDetailCtl", function ($scope, $stateParams, $http, $filter, GLOBAL_CONFIG, UtilService) {
    
    $scope.projectSalesID = UtilService.getUrlParameter('projectSalesID');
    $scope.project = {
        useType:[],
        noSelectText:'未选择项目',
        open: true
    };
    $scope.open_project = function (projectSalesID) {
        $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/getProjectDetailOpen?projectSalesID=' + projectSalesID
        )
            .success(function (ret) {
                if (ret.code == '000') {
                    $scope.project.list = ret.data;
                    $scope.projectName = ret.data.projectName;
                    $scope.projectInit(ret.data[0]);

                }
            }).error(function (msg) {
            console.log("Fail! " + msg);
        });
    };
    
    $scope.selectProject  = function (item) {
        $scope.projectInit(item);
    };

    $scope.open_project($scope.projectSalesID);

    $scope.projectInit = function (result) {
        //result是一个数组
        var result_first = result;

        $scope.project.selected =
            {
                projectID: result_first.projectID,
                salesCertID: result_first.salesCertID,
                projectName: result_first.projectName,
                projectDetailAddress: result_first.projectDetailAddress,
                transferDate: result_first.transferDate,
                projectRegion: result_first.projectRegion,
                projectCount: result_first.projectCount,
                projectUsePeriod: result_first.projectUsePeriod,
                projectUseType: result_first.projectUseType,
                projectLandType: result_first.projectLandType,
                developers: result_first.developers,
                transferNo: result_first.transferNo,
                housePropertyCard: result_first.housePropertyCard
            };

        //切换后初始化内容
        $scope.project.open= true;
        $scope.houses.open = true;
        $scope.houses.page.curPage = 1;
        $scope.querySales();
        $scope.queryHouseDay();
        $scope.houses.selectFloor();
        //房屋用途列表
        $scope.getProjectUseType();
        //获取房屋数据
        $scope.getHouseData();
    };

    $scope.getProjectUseType = function () {
        $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/getUseTypeListOpen?projectID=' + $scope.project.selected.projectID
        )
            .success(function (ret) {
                if (ret.code == '000') {
                    $scope.project.useType = ret.data;
                }
            }).error(function (msg) {
            console.log("Fail! " + msg);
        });
    };
    
    $scope.sales = {
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
            date: ''
        },
        end: {
            opened: false,
            date: ''
        }
    };

    $scope.startOptions = {
        maxDate: new Date(),
        minDate: new Date(2014, 5, 22),
        formatMonth: 'MM月',
        formatDayTitle: 'MM月 yyyy',
        startingDay: 1
    };
    $scope.endOptions = {
        maxDate: new Date(),
        minDate: new Date(2014, 5, 22),
        formatMonth: 'MM月',
        formatDayTitle: 'MM月 yyyy',
        startingDay: 1
    };
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];
    $scope.altInputFormats = ['yyyy-MM-dd'];
    $scope.openSalesStart = function () {
        $scope.sales.start.opened = true;
    };
    $scope.openSalesEnd = function () {
        $scope.sales.end.opened = true;
    };

    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    function getDayClass(data) {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }

    $scope.salePageInit = function (result) {
        $scope.sales.page.totalItems = result.totalItems;
        $scope.sales.page.curPage = result.curPage;
    };

    $scope.sale_tbl = {
        data: '',
        theadConfig: {
            projectName: {
                name: '时间'
            },
            projectRegion: {
                name: '成交套数'
            },
            saleCountByTime: {
                name: '成交均价'
            },
            saleAreaByTime: {
                name: '成交面积'
            },
            soldCountByAll: {
                name: '总成交套数'
            },
            soldPriceByAll: {
                name: '总成交价格'
            }
        },
        queryProjectDaySale: function (startDate, key, endDate, pageSize, curPage, projectSalesID) {
            var self = this;
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/queryProjectDaySaleOpen?startDate=' + startDate
                + '&pageSize=' + pageSize
                + '&curPage=' + curPage
                + '&endDate=' + endDate
                + '&projectSalesID=' + projectSalesID
                + '&key=' + key)
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.sale_tbl.data = ret.data.data;
                        $scope.salePageInit(ret.data);
                    }
                }).error(function (msg) {
                console.log("Fail! " + msg);
            });
        }
    };

    $scope.initSalesTime = function () {
        $scope.sales.end.date = new Date();

        var startTime = new Date();
        startTime.setDate(startTime.getDate() - 14);
        $scope.sales.start.date = startTime;
    };
    //初始时间
    $scope.initSalesTime();

    $scope.querySales = function () {
        $scope.sales.start.date = $filter('date')($scope.sales.start.date, 'yyyy-MM-dd');
        $scope.sales.end.date = $filter('date')($scope.sales.end.date , 'yyyy-MM-dd');

        $scope.sale_tbl.queryProjectDaySale($scope.sales.start.date, 'time',$scope.sales.end.date, $scope.sales.page.pageSize, $scope.sales.page.curPage, $scope.projectSalesID)
    };
    //--------------houses---------------------
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

    $scope.initHousesTime = function () {
        var startTime = new Date();
        startTime.setDate(startTime.getDate() - 14);
        $scope.houses.start.date = startTime;
    };

    $scope.initHousesTime();

    $scope.openHousesStart = function () {
        $scope.houses.start.opened = true;
    };
    $scope.openHousesEnd = function () {
        $scope.houses.end.opened = true;
    };
    $scope.housePageInit = function (result) {
        $scope.houses.page.totalItems = result.totalItems;
        $scope.houses.page.curPage = result.curPage;
    };


    //选择楼层
    $scope.houses.selectFloor = function () {
        $scope.house_tbl.queryHouseSignCount($scope.project.selected.projectID);
        $scope.house_no_sign.page.curPage = 1;
        $scope.houses.activeForm = 0;
    };

    $scope.house_tbl = {
        data: '',
        stateList:GLOBAL_CONFIG.house.stateList,
        theadConfig: {
            updateDate: {
                name: '签约时间'
            },
            projectDetail: {
                name: '楼栋'
            },
            buildNO: {
                name: '座号'
            },
            houseNo: {
                name: '房号'
            },
            useType: {
                name: '用途'
            },
            type: {
                name: '户型'
            },
            price: {
                name: '价格(备案)'
            },
            buildArea: {
                name: '建筑面积'
            },
            state: {
                name: '户内面积'
            },
            indoorArea: {
                name: '状态'
            }
        },
        queryHouseDay: function (startDate, key, endDate, pageSize, curPage, projectID) {
            var self = this;
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/querySaleHousesOpen?startDate=' + startDate
                + '&pageSize=' + pageSize
                + '&curPage=' + curPage
                + '&endDate=' + endDate
                + '&projectID=' + projectID
                + '&buildingID=' + $scope.houses.record.selected.buildingID
                + '&key=' + key)
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.house_tbl.data = ret.data.data;
                        $scope.housePageInit(ret.data);
                    }
                }).error(function (msg) {
                console.log("Fail! " + msg);
            });
        },
        queryHouseSignCount: function (projectID) {

            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/queryHouseSignCountOpen?projectID=' + projectID
                + '&buildingID=' + $scope.houses.record.selected.buildingID
            ).success(function (ret) {
                if (ret.code == '000') {
                    $scope.houses.signCount = ret.data.signCount;
                    $scope.houses.signedCount = ret.data.signedCount;
                    $scope.houses.anjuCount = ret.data.anjuCount;
                    $scope.houses.record.recordPrice = ret.data.recordPrice;

                    if ($scope.houses.record.selected.buildingID == 0 && $scope.houses.record.floors.length == 0) {
                        $scope.houses.record.floors = ret.data.floors;
                    }

                }
            }).error(function (msg) {
                console.log("Fail! " + msg);
            });
        }
    };
    $scope.queryHouseDay = function () {
        $scope.houses.start.date = $filter('date')($scope.houses.start.date, 'yyyy-MM-dd');
        $scope.houses.end.date = $filter('date')($scope.houses.end.date, 'yyyy-MM-dd');
        
        $scope.house_tbl.queryHouseDay($scope.houses.start.date, 'time', $scope.houses.end.date, $scope.houses.page.pageSize, $scope.houses.page.curPage, $scope.project.selected.projectID)
    };

    // -----------未签约房子-------------
    $scope.house_no_sign = {
        priceSort:function () {
            if ($scope.house_no_sign.theadConfig.price.clickState == 'noClick'){
                $scope.house_no_sign.theadConfig.price.clickState = 'asc';
            }else if ($scope.house_no_sign.theadConfig.price.clickState == 'asc'){
                $scope.house_no_sign.theadConfig.price.clickState = 'desc';
            }else {
                $scope.house_no_sign.theadConfig.price.clickState = 'asc';
            }

            $scope.queryNoSignHouse();
        },
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
                clickState:'noClick',
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
            }
        },
        queryNoSignHouse: function (pageSize, curPage, projectID) {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/queryHouseListByStateOpen?pageSize=' + pageSize
                + '&curPage=' + curPage
                + '&state=' + GLOBAL_CONFIG.house.SELLING
                + '&order=' + $scope.house_no_sign.theadConfig.price.clickState
                + '&buildingID=' + $scope.houses.record.selected.buildingID
                + '&projectID=' + projectID)
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.house_no_sign.data = ret.data.data;
                        $scope.house_no_sign.page.totalItems = ret.data.totalItems;
                    }
                }).error(function (msg) {
                console.log("Fail! " + msg);
            });
        }
    };

    $scope.queryNoSignHouse = function () {
        $scope.house_no_sign.queryNoSignHouse($scope.house_no_sign.page.pageSize, $scope.house_no_sign.page.curPage, $scope.project.selected.projectID)
    };

    //------------------------安居型商品房------------------------------------------
    $scope.anju_house_list = {
        priceSort:function () {
            if ($scope.anju_house_list.theadConfig.price.clickState == 'noClick'){
                $scope.anju_house_list.theadConfig.price.clickState = 'asc';
            }else if ($scope.anju_house_list.theadConfig.price.clickState == 'asc'){
                $scope.anju_house_list.theadConfig.price.clickState = 'desc';
            }else {
                $scope.anju_house_list.theadConfig.price.clickState = 'asc';
            }

            $scope.queryAnJuHouseList();
        },
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
                clickState:'noClick',
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
            }
        },
        queryAnJuHouseList: function (pageSize, curPage, projectID) {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/queryHouseListByStateOpen?pageSize=' + pageSize
                + '&curPage=' + curPage
                + '&state=' + GLOBAL_CONFIG.house.ANJU_HOUSE
                + '&order=' + $scope.anju_house_list.theadConfig.price.clickState
                + '&buildingID=' + $scope.houses.record.selected.buildingID
                + '&projectID=' + projectID)
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.anju_house_list.data = ret.data.data;
                        $scope.anju_house_list.page.totalItems = ret.data.totalItems;
                    }
                }).error(function (msg) {
                console.log("Fail! " + msg);
            });
        }
    };

    $scope.queryAnJuHouseList = function () {
        $scope.anju_house_list.queryAnJuHouseList($scope.anju_house_list.page.pageSize, $scope.anju_house_list.page.curPage, $scope.project.selected.projectID)
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
                        boundaryGap: false,
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

    //获取表数据
    $scope.getHouseData = function () {
        $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/queryHouseDataOpen?projectID=' + $scope.project.selected.projectID
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
});


