! function() {
    $("#viewRentals").on('click', function () {
        removeAllClass();
        $(".frame").addClass('show')
    })
    $("#publishRentals").on('click', function () {
        removeAllClass();
        $(".panel").addClass('show')
        $(".publishframe").addClass('show')
    })
    $("#viewCollection").on('click', function () {
        removeAllClass();
        $(".panel").addClass('show')
        $(".viewCollect").addClass('show')
    })
    $("#viewPublished").on('click', function(){
        removeAllClass();
        $(".panel").addClass('show')
        $(".viewPublish").addClass('show')
    })
    
    function removeAllClass(){
        $(".panel").removeClass('show')
        $(".publishframe").removeClass('show')
        $(".frame").removeClass('show')
        $(".viewCollect").removeClass('show')
        $(".viewPublish").removeClass('show')
    }

}.call()
