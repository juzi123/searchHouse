! function () {
    var map = new AMap.Map("container", {
        resizeEnable: true
    });
    //工具插件
    AMap.plugin([
        'AMap.ToolBar',
        //'AMap.Scale',
        //'AMap.OverView',
        //'AMap.MapType',
        //'AMap.Geolocation',
    ], function () {
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        map.addControl(new AMap.ToolBar());
        // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
        //map.addControl(new AMap.Scale());
        // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
        // map.addControl(new AMap.OverView({
        //     isOpen: true
        // }));
        // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
        //map.addControl(new AMap.MapType());
        // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
        //map.addControl(new AMap.Geolocation());
    });
    var marker;
    var markerLocation;
    //为地图注册click事件获取鼠标点击出的经纬度坐标
    var clickEventListener = map.on('click', function (e) {
        if (marker) {
            map.remove(marker);
        }
        markerLocation = [e.lnglat.getLng(), e.lnglat.getLat()];
        marker = new AMap.Marker({
            map: map,
            position: markerLocation // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        });
        map.add(marker);
        parent.document.getElementById("lngVal").value = e.lnglat.getLng();
        parent.document.getElementById("latVal").value = e.lnglat.getLat();
        regeocoder();
    });
    var auto = new AMap.Autocomplete({
        input: "tipinput"
    });
    AMap.event.addListener(auto, "select", select); //注册监听，当选中某条记录时会触发
    function select(e) {
        if (e.poi && e.poi.location) {
            map.setZoom(15);
            map.setCenter(e.poi.location);
        }
    }

    //获取经纬度对应的地址并显示
    function regeocoder() { //逆地理编码
        var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });
        geocoder.getAddress(markerLocation, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                geocoder_CallBack(result);
            }
        });
        map.setFitView();
    }

    function geocoder_CallBack(data) {
        var address = data.regeocode.formattedAddress; //返回地址描述
        parent.document.getElementById("locationVal").value = data.regeocode.formattedAddress;
    }

}.call()