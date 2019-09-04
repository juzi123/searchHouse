//获取发布的住房信息
!function(){
    
    $('#viewPublished').on('click', function(){
        getPublishHourse();
    })

    var userId = sessionStorage.getItem('userId');

    function getPublishHourse() {
        document.getElementById('publishTableBody').innerHTML = '';
        var url = "http://120.79.251.134/space/public/api/v1/house/get_public_house?user_id=" + userId;
        $.get(url,
            function (data) {
                for (var i = 0; i < data.length; i++) {
                    var trow = getDataRow(data[i]);
                    $("#publishTableBody").append(trow);
                }
            }, "json");
    }
    
    function getDataRow(data) {
        var row = document.createElement('tr'); //创建行  
    
        var idCell = document.createElement('td'); //创建第一列id  
        idCell.innerHTML = data.id; //填充数据  
        row.appendChild(idCell); //加入行  ，下面类似  
    
        var priceCell = document.createElement('td'); //创建第二列name  
        priceCell.innerHTML = data.price;
        row.appendChild(priceCell);
    
        var locationCell = document.createElement('td'); //创建第三列job  
        locationCell.innerHTML = data.address;
        row.appendChild(locationCell);
    
        var allMessageCell = document.createElement('td'); //创建第四列，操作列
        row.appendChild(allMessageCell);
        var btnAllMes = document.createElement('input'); //创建一个input控件
        btnAllMes.setAttribute('type', 'button'); //type="button"  
        btnAllMes.setAttribute('value', '详细信息');
        btnAllMes.onclick = function () {
            var message = [
                '标题:' + data.title,
                '房源id:' + data.id,
                '地址:' + data.address,
                '面积:' + data.capacity,
                '支付方式:' + data.pay_way,
                '价格:' + data.price,
                '房源介绍:' + data.introduction
            ]
            var allMessages = '<div>详细信息</div>';
            for (var i = 0; i < message.length; i++) {
                message[i] = message[i].replace(/[\r\n]/g, ""); //去掉换行
                message[i] = message[i].replace(/[ ]/g, ""); //去掉空格
                allMessages = allMessages + '<p>' + message[i] + '</p>';
            }
            document.getElementById("showMessage").innerHTML = allMessages + '<button id="okButton" class="btn btn-default">确定</button>';
            document.getElementById("showMessage").classList.add('show');
            okButton.onclick = function () {
                document.getElementById("showMessage").classList.remove('show');
            }
        }
        allMessageCell.appendChild(btnAllMes);
    
        var statusCell = document.createElement('td'); //创建第五列
        if (data.status === 0) {
            statusCell.innerHTML = '待出租';
        } else {
            statusCell.innerHTML = '已出租';
        }
        row.appendChild(statusCell);
    
        var changeCell = document.createElement('td'); //创建第六列
        row.appendChild(changeCell);
        var btnChange = document.createElement('input');
        btnChange.setAttribute('type', 'button');
        btnChange.setAttribute('value', '修改房源状态');
        btnChange.onclick = function () {
            if (confirm("确定修改房源状态？")) {
                data.status = data.status ? 0 : 1;
                var changeURL = "http://120.79.251.134/space/public/api/v1/house/change_house_status?house_id=" + data.id + "&status=" + data.status;
                $.get(changeURL,
                    function (e) {
                        if (data.status === 1) {
                            statusCell.innerHTML = '已出租';
                        } else {
                            statusCell.innerHTML = '待出租';
                        }
                    }, "json");
            }
        }
        changeCell.appendChild(btnChange);
    
        var delCell = document.createElement('td'); //创建第七列
        row.appendChild(delCell);
        var btnDel = document.createElement('input');
        btnDel.setAttribute('type', 'button');
        btnDel.setAttribute('value', '删除房源');
    
        //删除操作  
        btnDel.onclick = function () {
            if (confirm("删除该房源？")) {
                this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
                var deleteURL = "http://120.79.251.134/space/public/api/v1/house/remove_public_house?userId=" + userId + "&houseId=" + data.id;
                $.get(deleteURL,
                    function (e) {
                        if(e.errorCode === 0){
                            $('.alert').html('删除成功').removeClass('alert-danger').addClass('alert-success').show().delay(1500).fadeOut();
                        } else {
                            $('.alert').html('删除失败').removeClass('alert-success').addClass('alert-danger').show().delay(1500).fadeOut();
                        }
                    }, "json");
            }
        }
        delCell.appendChild(btnDel);
    
        return row; //返回tr数据      
    }

}.call()
