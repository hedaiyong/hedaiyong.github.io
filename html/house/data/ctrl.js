/**
 * Created by hedy02 on 2016/9/19.
 */
'use strict';
RegionChartApp
    .config(function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    })
    //数据传输
    .factory('eventbus', function ($rootScope) {
        var msgBus = {};

        msgBus.emitMsg = function (msg, data) {
            data = data || {};
            $rootScope.$emit(msg, data);
        };
        msgBus.onMsg = function (msg, func, scope) {
            var unbind = $rootScope.$on(msg, func);
            if (scope) {
                scope.$on('$destroy', unbind);
            }
            return unbind;
        };

        return msgBus;
    })
    .controller('RegionChartCtrl', function ($scope, $rootScope, $http, GLOBAL_CONFIG, GLOBAL_VALUE) {

    })
    //新房数据图表
    .controller('NewHouseChartCtrl', function ($scope, $filter, $rootScope, $http, GLOBAL_CONFIG, GLOBAL_VALUE) {

        $scope.new_house = {
            chartData:[],
            dataType:1,          //1,成交价格  2，成交套数  3，成交面积  4，未成交面积
            time: {
                startTime: '',     //默认值为最近一周
                startOpen: false,
                startOptions: {
                    maxDate: new Date(),
                    minDate: new Date(2016, 8, 16),
                    formatMonth: 'MM月',
                    formatDayTitle: 'MM月 yyyy',
                    startingDay: 1
                },
                openStart:function () {
                    $scope.new_house.time.startOpen = true;
                },
                endTime: '',
                endOpen: false,
                endOptions: {
                    maxDate: new Date(),
                    minDate: new Date(2016, 8, 16),
                    formatMonth: 'MM月',
                    formatDayTitle: 'MM月 yyyy',
                    startingDay: 1
                },
                openEnd:function () {
                    $scope.new_house.time.endOpen = true;
                }
                
            },
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
                        data: ['全市', '龙岗', '宝安', '南山', '福田', '罗湖', '盐田']
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
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
                            name: '全市',
                            type: 'line',
                            data: []

                        },
                        {
                            name: '龙岗',
                            type: 'line',
                            data: []
                        },
                        {
                            name: '宝安',
                            type: 'line',
                            data: []
                        },
                        {
                            name: '南山',
                            type: 'line',
                            data: []
                        },
                        {
                            name: '福田',
                            type: 'line',
                            data: []
                        },
                        {
                            name: '罗湖',
                            type: 'line',
                            data: []
                        },
                        {
                            name: '盐田',
                            type: 'line',
                            data: []
                        }
                    ]
                }
            }
        };

        $scope.initTime = function () {
            $scope.new_house.time.endTime = new Date();

            var startTime = new Date();
            startTime.setDate(startTime.getDate() - 14);
            $scope.new_house.time.startTime = startTime;
        };

        $scope.initTime();

        $scope.queryNewHouseRegion = function () {
            $scope.new_house.time.endTime = $filter('date')($scope.new_house.time.endTime, "yyyy-MM-dd");
            $scope.new_house.time.startTime = $filter('date')($scope.new_house.time.startTime, "yyyy-MM-dd");

            $scope.new_house.charts.config.dataLoaded = false;
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/getNewHouseDataOpen?startDate=' + $scope.new_house.time.startTime
                + '&endDate=' + $scope.new_house.time.endTime
            )
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.new_house.chartData = ret.data;
                        $scope.makeNewHouseRegionData();

                        $scope.new_house.charts.config.dataLoaded = true;
                    }
                }).error(function (msg) {
                console.log("Fail! " + msg);
            });
        };

        $scope.switchTab = function (tab) {
            $scope.new_house.dataType = tab;
            $scope.makeNewHouseRegionData();
        };

        $scope.makeNewHouseRegionData = function () {
            var data = $scope.new_house.chartData;

            switch ($scope.new_house.dataType){
                case 1:
                    //全市
                    $scope.new_house.charts.option.series[0].data = data.ALL.soldPrice;
                    //龙岗
                    $scope.new_house.charts.option.series[1].data = data.LG.soldPrice;
                    //宝安
                    $scope.new_house.charts.option.series[2].data = data.BA.soldPrice;
                    //南山
                    $scope.new_house.charts.option.series[3].data = data.NS.soldPrice;
                    //福田
                    $scope.new_house.charts.option.series[4].data = data.FT.soldPrice;
                    //罗湖
                    $scope.new_house.charts.option.series[5].data = data.LH.soldPrice;
                    //盐田
                    $scope.new_house.charts.option.series[6].data = data.YT.soldPrice;
                    //
                    $scope.new_house.charts.option.yAxis = [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} 平米/元'
                            }
                        }
                    ];
                    break;
                case 2:
                    //全市
                    $scope.new_house.charts.option.series[0].data = data.ALL.soldCount;
                    //龙岗
                    $scope.new_house.charts.option.series[1].data = data.LG.soldCount;
                    //宝安
                    $scope.new_house.charts.option.series[2].data = data.BA.soldCount;
                    //南山
                    $scope.new_house.charts.option.series[3].data = data.NS.soldCount;
                    //福田
                    $scope.new_house.charts.option.series[4].data = data.FT.soldCount;
                    //罗湖
                    $scope.new_house.charts.option.series[5].data = data.LH.soldCount;
                    //盐田
                    $scope.new_house.charts.option.series[6].data = data.YT.soldCount;
                    //
                    $scope.new_house.charts.option.yAxis = [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} 套'
                            }
                        }
                    ];
                    break;
                case 3:
                    //全市
                    $scope.new_house.charts.option.series[0].data = data.ALL.soldArea;
                    //龙岗
                    $scope.new_house.charts.option.series[1].data = data.LG.soldArea;
                    //宝安
                    $scope.new_house.charts.option.series[2].data = data.BA.soldArea;
                    //南山
                    $scope.new_house.charts.option.series[3].data = data.NS.soldArea;
                    //福田
                    $scope.new_house.charts.option.series[4].data = data.FT.soldArea;
                    //罗湖
                    $scope.new_house.charts.option.series[5].data = data.LH.soldArea;
                    //盐田
                    $scope.new_house.charts.option.series[6].data = data.YT.soldArea;
                    //
                    $scope.new_house.charts.option.yAxis = [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} 平米'
                            }
                        }
                    ];
                    break;
                case 4:
                    //全市
                    $scope.new_house.charts.option.series[0].data = data.ALL.allCount;
                    //龙岗
                    $scope.new_house.charts.option.series[1].data = data.LG.allCount;
                    //宝安
                    $scope.new_house.charts.option.series[2].data = data.BA.allCount;
                    //南山
                    $scope.new_house.charts.option.series[3].data = data.NS.allCount;
                    //福田
                    $scope.new_house.charts.option.series[4].data = data.FT.allCount;
                    //罗湖
                    $scope.new_house.charts.option.series[5].data = data.LH.allCount;
                    //盐田
                    $scope.new_house.charts.option.series[6].data = data.YT.allCount;
                    //
                    $scope.new_house.charts.option.yAxis = [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} 套'
                            }
                        }
                    ];
                    break;
            }


            //时间轴
            $scope.new_house.charts.option.xAxis[0].data = data.time;
        };

        $scope.queryNewHouseRegion();
    })
    //二手房数据图表
    .controller('SecondHandHouseChartCtrl', function ($scope, $filter, $rootScope, $http, GLOBAL_CONFIG, GLOBAL_VALUE) {

        $scope.second_hand_house = {
            chartData:[],
            dataType:1,          //1，成交套数  2，成交面积
            time: {
                startTime: '',     //默认值为最近一周
                startOpen: false,
                startOptions: {
                    maxDate: new Date(),
                    minDate: new Date(2016, 8, 16 ),
                    formatMonth: 'MM月',
                    formatDayTitle: 'MM月 yyyy',
                    startingDay: 1
                },
                openStart:function () {
                    $scope.second_hand_house.time.startOpen = true;
                },
                endTime: '',
                endOpen: false,
                endOptions: {
                    maxDate: new Date(),
                    minDate: new Date(2016, 8, 16),
                    formatMonth: 'MM月',
                    formatDayTitle: 'MM月 yyyy',
                    startingDay: 1
                },
                openEnd:function () {
                    $scope.second_hand_house.time.endOpen = true;
                }

            },
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
                        data: ['全市', '龙岗', '宝安', '南山', '福田', '罗湖', '盐田']
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
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
                            name: '全市',
                            type: 'line',
                            data: []

                        },
                        {
                            name: '龙岗',
                            type: 'line',
                            data: []
                        },
                        {
                            name: '宝安',
                            type: 'line',
                            data: []
                        },
                        {
                            name: '南山',
                            type: 'line',
                            data: []
                        },
                        {
                            name: '福田',
                            type: 'line',
                            data: []
                        },
                        {
                            name: '罗湖',
                            type: 'line',
                            data: []
                        },
                        {
                            name: '盐田',
                            type: 'line',
                            data: []
                        }
                    ]
                }
            }
        };

        $scope.initTime = function () {
            $scope.second_hand_house.time.endTime = new Date();

            var startTime = new Date();
            startTime.setDate(startTime.getDate() - 14);
            $scope.second_hand_house.time.startTime = startTime;
        };

        $scope.initTime();

        $scope.querySecondHandHouseRegion = function () {
            $scope.second_hand_house.time.endTime = $filter('date')($scope.second_hand_house.time.endTime, "yyyy-MM-dd");
            $scope.second_hand_house.time.startTime = $filter('date')($scope.second_hand_house.time.startTime, "yyyy-MM-dd");

            $scope.second_hand_house.charts.config.dataLoaded = false;
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/getSecondHandHouseDataOpen?startDate=' + $scope.second_hand_house.time.startTime
                + '&endDate=' + $scope.second_hand_house.time.endTime
            )
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.second_hand_house.chartData = ret.data;
                        $scope.makeSecondHandHouseRegionData();

                        $scope.second_hand_house.charts.config.dataLoaded = true;
                    }
                }).error(function (msg) {
                console.log("Fail! " + msg);
            });
        };

        $scope.switchTab = function (tab) {
            $scope.second_hand_house.dataType = tab;
            $scope.makeSecondHandHouseRegionData();
        };

        $scope.makeSecondHandHouseRegionData = function () {
            var data = $scope.second_hand_house.chartData;

            switch ($scope.second_hand_house.dataType){
                case 1:
                    //全市
                    $scope.second_hand_house.charts.option.series[0].data = data.ALL.soldCount;
                    //龙岗
                    $scope.second_hand_house.charts.option.series[1].data = data.LG.soldCount;
                    //宝安
                    $scope.second_hand_house.charts.option.series[2].data = data.BA.soldCount;
                    //南山
                    $scope.second_hand_house.charts.option.series[3].data = data.NS.soldCount;
                    //福田
                    $scope.second_hand_house.charts.option.series[4].data = data.FT.soldCount;
                    //罗湖
                    $scope.second_hand_house.charts.option.series[5].data = data.LH.soldCount;
                    //盐田
                    $scope.second_hand_house.charts.option.series[6].data = data.YT.soldCount;
                    //
                    $scope.second_hand_house.charts.option.yAxis = [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} 套'
                            }
                        }
                    ];
                    break;
                case 2:
                    //全市
                    $scope.second_hand_house.charts.option.series[0].data = data.ALL.soldArea;
                    //龙岗
                    $scope.second_hand_house.charts.option.series[1].data = data.LG.soldArea;
                    //宝安
                    $scope.second_hand_house.charts.option.series[2].data = data.BA.soldArea;
                    //南山
                    $scope.second_hand_house.charts.option.series[3].data = data.NS.soldArea;
                    //福田
                    $scope.second_hand_house.charts.option.series[4].data = data.FT.soldArea;
                    //罗湖
                    $scope.second_hand_house.charts.option.series[5].data = data.LH.soldArea;
                    //盐田
                    $scope.second_hand_house.charts.option.series[6].data = data.YT.soldArea;
                    //
                    $scope.second_hand_house.charts.option.yAxis = [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} 平米'
                            }
                        }
                    ];
                    break;

            }


            //时间轴
            $scope.second_hand_house.charts.option.xAxis[0].data = data.time;
        };

        $scope.querySecondHandHouseRegion();
    })
;


