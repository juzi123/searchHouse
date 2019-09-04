! function () {
    var view = document.querySelector('nav.menu')
    var controller = {
        view: null,
        liTags: null,
        aTags: null,
        init: function (view) {
            this.view = view
            this.initAnimation()
            this.bindEvents()
        },
        initAnimation: function () {
            //Tween.js
            function animate(time) {
                requestAnimationFrame(animate);
                TWEEN.update(time);
            }
            requestAnimationFrame(animate);
        },
        bindEvents: function () {
            let liTags = view.querySelectorAll('nav.menu > ul > li')
            for (let i = 0; i < liTags.length; i++) {
                liTags[i].onmouseenter = function (x) {
                    x.currentTarget.classList.add('active')
                }
                liTags[i].onmouseleave = function (x) {
                    x.currentTarget.classList.remove('active')
                }
            }
            let aTags = view.querySelectorAll('nav.menu > ul > li > a')
            for (let i = 0; i < aTags.length; i++) {
                aTags[i].onclick = (x) => {
                    x.preventDefault()
                    let a = x.currentTarget
                    let href = a.getAttribute('href')
                    let element = document.querySelector(href)
                    this.scrollToElement(element)
                }
            }
        },
        scrollToElement: function (element) {
            let top = element.offsetTop
            //window.scrollTo(0, top - 80)
            var currentPostion = window.scrollY
            var targetPostion = top - 80;

            var s = targetPostion - currentPostion
            var t = Math.abs(s / 100) * 300
            if (t > 500) {
                t = 500
            }
            var coords = {
                y: currentPostion
            }; // Start at (0, 0)
            var tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
                .to({
                    y: targetPostion
                }, t) // Move to (300, 200) in 1 second.
                .easing(TWEEN.Easing.Quadratic.InOut) // Use an easing function to make the animation smooth.
                .onUpdate(function () {
                    window.scrollTo(0, coords.y)
                })
                .start(); // Start the tween immediately.
        }
    }

    controller.init(view)
}.call()