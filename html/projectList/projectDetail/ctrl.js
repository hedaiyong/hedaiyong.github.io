/**
 * Created by hedy02 on 2016/9/19.
 */
'use strict';
project_detail_app.controller("projectDetailCtl", function ($scope, $stateParams, $http, $filter, GLOBAL_CONFIG, UtilService) {
    $scope.isMobile = UtilService.isMobile();

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
        $scope.queryDaySaleChart();
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

    $scope.daySaleChart = {
        start: {
            opened: false,
            date: ''
        },
        end: {
            opened: false,
            date: ''
        }
    };
    $scope.openDaySaleChartStart = function () {
        $scope.daySaleChart.start.opened = true;
    };
    $scope.openDaySaleChartEnd = function () {
        $scope.daySaleChart.end.opened = true;
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
        activeForm:0,
        chartData:{
            dayPrice:[],
            dayArea:[],
            dayPriceAll:[],
            time:[]
        },

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
        },

        queryDaySaleChartData: function (startDate, key, endDate, projectSalesID) {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/queryProjectDaySaleChartDataOpen?startDate=' + startDate
                + '&endDate=' + endDate
                + '&projectSalesID=' + projectSalesID
                + '&key=' + key)
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.sale_tbl.charts.option.series[0].data = ret.data.dayPrice;
                        $scope.sale_tbl.charts.option.series[2].data = ret.data.dayArea;
                        $scope.sale_tbl.charts.option.series[1].data = ret.data.dayPriceAll;
                        $scope.sale_tbl.charts.option.xAxis[0].data = ret.data.time;
                    }
                }).error(function (msg) {
                console.log("Fail! " + msg);
            });
        }
    };
    $scope.sale_tbl.charts= {
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
                data: ['成交价格','总成交价格','成交面积']
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
                    data:[]

                }
            ],
            yAxis: [
                {
                    name:"价格",
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} 平米/元'
                    }
                },
                {
                    name:"面积",
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} 平米'
                    }
                }
            ],
            series: [
                {
                    name: '成交价格',
                    xAxisIndex:0,
                    yAxisIndex:0,
                    type: 'line',
                    data: []
                },
                {
                    name: '总成交价格',
                    xAxisIndex:0,
                    yAxisIndex:0,
                    type: 'line',
                    data: []
                },
                {
                    name: '成交面积',
                    xAxisIndex:0,
                    yAxisIndex:1,
                    type: 'bar',
                    data: []
                }
            ]
        }
    };
    $scope.initSalesTime = function () {
        $scope.sales.end.date = new Date();

        var startTime = new Date();
        startTime.setDate(startTime.getDate() - 21);
        $scope.sales.start.date = startTime;
    };
    //图表时间
    $scope.initDaySaleChartTime = function () {
        $scope.daySaleChart.end.date = new Date();

        var startTime = new Date();
        startTime.setDate(startTime.getDate() - 60);
        $scope.daySaleChart.start.date = startTime;
    };
    //初始化图表时间
    $scope.initDaySaleChartTime();
    //初始时间
    $scope.initSalesTime();
    //表格数据
    $scope.querySales = function (isInit) {
        $scope.sales.start.date = $filter('date')($scope.sales.start.date, 'yyyy-MM-dd');
        $scope.sales.end.date = $filter('date')($scope.sales.end.date , 'yyyy-MM-dd');
        //从第一页开始查询
        if (isInit) $scope.sales.page.curPage = 1;
        
        $scope.sale_tbl.queryProjectDaySale($scope.sales.start.date, 'time',$scope.sales.end.date, $scope.sales.page.pageSize, $scope.sales.page.curPage, $scope.projectSalesID)
    };

    //图表数据
    $scope.queryDaySaleChart = function () {
        $scope.daySaleChart.start.date = $filter('date')($scope.daySaleChart.start.date, 'yyyy-MM-dd');
        $scope.daySaleChart.end.date = $filter('date')($scope.daySaleChart.end.date , 'yyyy-MM-dd');
        $scope.sale_tbl.queryDaySaleChartData($scope.daySaleChart.start.date, 'time',$scope.daySaleChart.end.date, $scope.projectSalesID)
    };

    // -----------house-list-------------
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
        totalItems:1,
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
        $scope.queryHouseCount($scope.project.selected.projectID);
        $scope.house_list.page.curPage = 1;
        $scope.switchTab(1);
        $scope.house_list.queryHouseCountByUserType($scope.project.selected.projectID);
    };

    $scope.queryHouseList = function (useType) {
        if (arguments.length > 0) {
            $scope.house_list.page.useType = encodeURI(encodeURI(useType));
            $scope.house_list.page.curPage = 1;
            $scope.house_list.page.tabIndex = 1;
            $scope.house_list.page.state = '';
            $scope.house_list.theadConfig.price.clickState = 'noClick';
            $scope.house_list.queryHouseCountByUserType($scope.project.selected.projectID);
            $scope.house_list.queryHouseList($scope.house_list.page.pageSize, $scope.house_list.page.curPage, $scope.project.selected.projectID,useType);
        }else {
            $scope.house_list.queryHouseList($scope.house_list.page.pageSize, $scope.house_list.page.curPage, $scope.project.selected.projectID)
        }
       
    };

    $scope.switchTab = function (tabIndex) {
        $scope.house_list.page.tabIndex = tabIndex;
        $scope.house_list.page.curPage = 1;

        switch (tabIndex){
            case 1:
                $scope.house_list.theadConfig.price.clickState = 'noClick';
                $scope.house_list.page.state = '';
                $scope.house_list.queryHouseList($scope.house_list.page.pageSize, $scope.house_list.page.curPage, $scope.project.selected.projectID,"useType");
                break;
            case 2:
                $scope.house_list.theadConfig.price.clickState = 'noClick';
                $scope.house_list.page.state = GLOBAL_CONFIG.house.SIGNED_HOUSE;
                $scope.house_list.queryHouseList($scope.house_list.page.pageSize, $scope.house_list.page.curPage, $scope.project.selected.projectID);
                break;
            case 3:
                $scope.house_list.theadConfig.price.clickState = 'noClick';
                $scope.house_list.page.state = GLOBAL_CONFIG.house.SELLING;
                $scope.house_list.queryHouseList($scope.house_list.page.pageSize, $scope.house_list.page.curPage, $scope.project.selected.projectID);
                break;
            case 4:
                $scope.house_list.theadConfig.price.clickState = 'noClick';
                $scope.house_list.page.state = GLOBAL_CONFIG.house.ANJU_HOUSE;
                $scope.house_list.queryHouseList($scope.house_list.page.pageSize, $scope.house_list.page.curPage, $scope.project.selected.projectID);
                break;
        }
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


