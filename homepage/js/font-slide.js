! function () {
    showLine()
    window.addEventListener('scroll', (x) => { 
        if (window.scrollY > 460) {
            $('.firstLine > div').removeClass('show')
            $('.secondLine > div').removeClass('show')
            $('.start-button').removeClass('show')
        }
        if (window.scrollY < 350) {
            showLine()
        }
    })
    function showLine() {
        setTimeout(function () {
            $('.firstLine > div').addClass('show')
        }, 100)
        setTimeout(function () {
            $('.secondLine > div').addClass('show')
        }, 400)
        setTimeout(function () {
            $('.start-button').addClass('show')
        }, 1000)
    }
}.call()