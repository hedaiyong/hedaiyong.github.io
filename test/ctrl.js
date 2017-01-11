/**
 * Created by hedy02 on 2016/8/27.
 */

stao_index_app.controller('wwc_contain_ctrl', function($scope,$rootScope,$http) {

    $scope.device = {
        getDeviceHistory:function () {
            $http.get('http://youminfo.com/api/queryDevicesStatusHistoryOpen?key='+  $scope.device.key
                +'&deviceID='+ $scope.device.deviceID
                +'&day='+ $scope.device.day
                +'&curPage='+ $scope.device.curPage
                +'&deviceSN='+ $scope.device.deviceSN
                +'&pageSize='+ $scope.device.pageSize)
                .success(function(ret){
                        $scope.device.history = ret.data.data;
                        // $scope.tblPagination.initPagination(ret);
                }).error(function(msg){
                console.log("Fail! "+msg);
            });
        },
        key:'',
        deviceID:'',
        deviceSN:'',
        curPage:1,
        day:1,
        pageSize:200,
        history:[]
    }
});