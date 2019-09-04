! function () {
    $("#rentSubmit").click(function () {
        //console.log($('#locationVal').val())
        if ($('#locationVal').val() === '') {
            $('.alert').html('地址不能为空').removeClass('alert-success').addClass('alert-danger').show().delay(1500).fadeOut();
        } else if ($('#priceVal').val() === '') {
            $('.alert').html('价格不能为空').removeClass('alert-success').addClass('alert-danger').show().delay(1500).fadeOut();
        } else if ($('#paywayVal').val() === '') {
            $('.alert').html('支付方式不能为空').removeClass('alert-success').addClass('alert-danger').show().delay(1500).fadeOut();
        } else if ($('#areaVal').val() === '') {
            $('.alert').html('住房面积不能为空').removeClass('alert-success').addClass('alert-danger').show().delay(1500).fadeOut();
        } else if ($('#capacityVal').val() === '') {
            $('.alert').html('住房结构不能为空').removeClass('alert-success').addClass('alert-danger').show().delay(1500).fadeOut();
        } else if ($('#titleVal').val() === '') {
            $('.alert').html('标题不能为空').removeClass('alert-success').addClass('alert-danger').show().delay(1500).fadeOut();
        } else {
            $.post("http://120.79.251.134/space/public/api/v1/house/add_house", {
                    user_id: sessionStorage.getItem('userId'),
                    capacity: $('#capacityVal').val(),
                    pay_way: $('#paywayVal').val(),
                    price: $('#priceVal').val(),
                    status: 0,
                    area: $('#areaVal').val(),
                    title: $('#titleVal').val(),
                    longitude: $('#lngVal').val(),
                    latitude: $('#latVal').val(),
                    address: $('#locationVal').val(),
                    introduction: $('#introductionVal').val(),
                    from_time: 1525410373,
                    to_time: 1525423547
                },
                function (data) {
                    if (data.errorCode === 0) {
                        $('.alert').html('发布成功').removeClass('alert-danger').addClass('alert-success').show().delay(1500).fadeOut();
                    } else {
                        $('.alert').html('发布失败').removeClass('alert-success').addClass('alert-danger').show().delay(1500).fadeOut();
                    }
                }, "json");
        }
    })
}.call()