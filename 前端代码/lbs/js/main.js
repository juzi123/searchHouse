! function () {
    //radio点击标志
    var trafficModeSelect = 1;
    //初始化map
    var map = new AMap.Map('container', {
        zoom: 10
    });
    //信息窗口
    var infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -30)
    });
    //模拟当前住址，起点
    var startPoint;
    //终点
    var terminalPoint;
    //var terminalPoint = new AMap.LngLat(122, 37);;
    //点标记，模拟选中的房屋
    var markers = [];
    //console.log(sessionStorage.getItem("allSpareHouse"))
    var session = sessionStorage.getItem("allSpareHouse")
    var allSpareHouse;
    if (session) {
        allSpareHouse = JSON.parse(session);
    } else {
        allSpareHouse = $.ajax({
            url: "http://120.79.251.134/space/public/api/v1/house/get_all_spare_house",
            async: false
        });
        sessionStorage.setItem('allSpareHouse', JSON.stringify(allSpareHouse));
    }

    var SpareHouseObj = JSON.parse(allSpareHouse.responseText);

    // positions = [
    //     [122.3, 37.4],
    //     [122.21, 37.1],
    //     [122.1123, 37.1223],
    //     [122.1212, 37.1231],
    //     [122.3231, 37.3211]
    // ];
    //初始化点标记
    for (var i = 0; i < SpareHouseObj.length; i++) {
        if (SpareHouseObj[i].house.longitude !== null && SpareHouseObj[i].house.status !== 1) {
            var marker = new AMap.Marker({
                map: map,
                icon: chooseIconColor(parseInt(SpareHouseObj[i].house.price)),
                //icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b' + (i + 1) + '.png',
                position: [SpareHouseObj[i].house.longitude, SpareHouseObj[i].house.latitude],
                offset: {
                    x: -16,
                    y: -32
                }
            });
            var houseLink = SpareHouseObj[i].house.community_url
            var content = '<div>' + SpareHouseObj[i].house.introduction + "</br>" +
                `<a target="_blank" href = "${houseLink}">详细信息</a>` + "</br>" +
                `<button id="${SpareHouseObj[i].house.id}">添加收藏</button></div>` +
                `<button id="assess${SpareHouseObj[i].house.id}">获取评价</button></div>`
            // var content = [];
            // content.push(SpareHouseObj[i].house.introduction)
            // content.push("<a herf='SpareHouseObj[i].house.community_url'>详细信息</a>")
            marker.id = SpareHouseObj[i].house.id;
            marker.content = content;
            markers.push(marker);
        }
    }
    //为点标记添加点击事件
    for (var i = 0; i < markers.length; i++) {
        markers[i].on('click', function (e) {
            terminalPoint = new AMap.LngLat(this.getPosition().lng, this.getPosition().lat)
            //设置信息窗体
            infoWindow.setContent(e.target.content);
            infoWindow.open(map, e.target.getPosition());
            var userId = sessionStorage.getItem('userId');
            var houseId = this.id;
            document.getElementById(e.target.id).onclick = function () {
                var url = "http://120.79.251.134/space/public/api/v1/user/add_house_fav?userId=" + userId + "&houseId=" + houseId;
                $.get(url,
                    function (data) {
                        if (data.errorCode === 0) {
                            $('.alert').html('收藏成功').addClass('alert-success').show().delay(1500).fadeOut();
                        } else {
                            $('.alert').html('收藏失败').addClass('alert-danger').show().delay(1500).fadeOut();
                        }
                    }, "json");
            }
            document.getElementById('assess' + e.target.id).onclick = function () {
                var url = "http://120.79.251.134/space/public/api/v1/house/get_comments?houseIds=" + houseId;
                $.get(url, function (data) {
                    if(data[0].comment.length == 0){
                        alert('暂无评价');
                    } else {
                        var string = '';
                        for(var i = 0; i<data[0].comment.length; i++){
                            string += data[0].comment[i].comment + '\n';
                        }
                        alert(string);
                    }
                })
            }
            unbindAndReset();
        })
    }
    AMapUI.loadUI(['misc/PoiPicker'], function (PoiPicker) {
        var poiPicker = new PoiPicker({
            //city:'北京', //默认值为auto，即自动设定为用户ip所在城市onCityReady(callback:Function)
            input: 'pickerInput'
        });
        //初始化poiPicker
        poiPickerReady(poiPicker);
        trafficModeClicked(startPoint, terminalPoint);
        $(`.trafficMode input:nth-child(${trafficModeSelect})`).click();
    });

    function poiPickerReady(poiPicker) {
        window.poiPicker = poiPicker;
        //选取了某个POI
        poiPicker.on('poiPicked', function (poiResult) {
            //var source = poiResult.source,
            var poi = poiResult.item;
            $('#pickerInput').val(poi.name);
            startPoint = new AMap.LngLat(poi.location.lng, poi.location.lat);
            // info = {
            //     source: source,
            //     id: poi.id,
            //     name: poi.name,
            //     location: poi.location,
            //     address: poi.address
            // };
            //map.clearMap()
            unbindAndReset();
        });
    }

    //构造路线导航类
var driving = new AMap.Driving({
    map: map,
    panel: "panel"
});
    //步行导航
    var walking = new AMap.Walking({
        map: map,
        panel: "panel"
    });
    //公交导航类
    var transOptions = {
        map: map,
        panel: 'panel',
        //policy: AMap.TransferPolicy.LEAST_TIME
    };
    var transfer = new AMap.Transfer(transOptions);

    //绑定事件
    function trafficModeClicked(startPoint, terminalPoint) {
        $('#car').on('click', function (e) {
            $('#panel').html("");
            walking.clear();
            transfer.clear();
            trafficModeSelect = 1;
            // 根据起终点经纬度规划驾车导航路线
            driving.search(startPoint, terminalPoint);
        })
        $('#walk').on('click', function (e) {
            $('#panel').html("");
            driving.clear();
            transfer.clear();
            trafficModeSelect = 2;
            //根据起终点坐标规划步行路线
            walking.search(startPoint, terminalPoint);
        })
        $('#bus').on('click', function (e) {
            $('#panel').html("");
            walking.clear();
            driving.clear();
            trafficModeSelect = 3;
            //根据起、终点坐标查询公交换乘路线
            transfer.search(startPoint, terminalPoint);
        })
    }

    //自动定位
    map.plugin('AMap.Geolocation', function () {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: false, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RB' //定位按钮的位置为右下
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
        AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
    });
    //解析定位结果
    function onComplete(data) {
        //定位成功，将起始坐标设为当前位置
        startPoint = new AMap.LngLat(data.position.getLng(), data.position.getLat());
        $('.alert').html('自动定位成功').addClass('alert-success').show().delay(1500).fadeOut();
        unbindAndReset();
    }
    function onError() {
        //定位失败，将起始坐标设为威海市政府
        startPoint = new AMap.LngLat(122.120511, 37.513423);
        $('.alert').html('自动定位失败').addClass('alert-warning').show().delay(1500).fadeOut();
    }

    function unbindAndReset() {
        $('#car').unbind();
        $('#walk').unbind();
        $('#bus').unbind();
        trafficModeClicked(startPoint, terminalPoint);
        $(`.trafficMode input:nth-child(${trafficModeSelect})`).click();
    }

    function chooseIconColor(price) {
        var iconColor;
        if (price <= 1000) {
            iconColor = './image/marker_yellow.png';
        } else if (price <= 2000) {
            iconColor = './image/marker_green.png';
        } else if (price <= 3000) {
            iconColor = './image/marker_blue.png';
        } else if (price <= 4000) {
            iconColor = './image/marker_deepblue.png';
        } else if (price <= 5000) {
            iconColor = './image/marker_red.png';
        } else {
            iconColor = './image/marker_black.png';
        }
        return iconColor;
    }


}.call()