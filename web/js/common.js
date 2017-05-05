$(document).ready(function(){
    //====================================
    //--------- Functions ----------------
    //====================================

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this;
            var args = arguments;
    
            var later = function () {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
    
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    }
    
    // HOW IT USE
    // var myEfficientFn = debounce(function () {
    //     // All the taxing stuff you do
    // }, 250);
    //
    // window.addEventListener('resize', myEfficientFn);
    function equalHeight(container) {
        var currentTallest = 0;
        var currentRowStart = 0;
        var rowDivs = new Array();
        var $el;
        var topPosition = 0;
    
        $(container).each(function () {
    
            $el = $(this);
            $($el).height('auto');
            topPostion = $el.position().top;
    
            if (currentRowStart !== topPostion) {
                for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                    rowDivs[currentDiv].height(currentTallest);
                }
                rowDivs.length = 0; // empty the array
                currentRowStart = topPostion;
                currentTallest = $el.height();
                rowDivs.push($el);
            } else {
                rowDivs.push($el);
                currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
            }
    
            for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                rowDivs[currentDiv].height(currentTallest);
            }
        });
    }
    // Miss click
    function missClick(div) {
        if (!div.is(e.target) && // если клик был не по нашему блоку
            div.has(e.target).length === 0) { // и не по его дочерним элементам
            div.hide(); // скрываем его
        }
    }
    // END Miss click
    
    // Обертка для вызова функции
    // jQuery(function ($) {
    //     $(document).mouseup(function (e) { // событие клика по веб-документу
    //         // Вызываем функцию с необходимым параметром при клике
    //     });
    // });
    // Responsive iframe video
    
    function responsiveIframe(contentContainer) {
        var videoWrapper = '<div class="embed-responsive embed-responsive-16by9"></div>';
        contentContainer.find('iframe').wrap(videoWrapper);
    }
    // END Responsive iframe video

    //====================================
    //--------- Custom Scripts -----------
    //====================================

    // Custom Google Map style
    $(function () {
        if ($('#map').length > 0) { // #map - id conteiner
            jQuery(function ($) {
                var isMobile = {
                    android: function () {
                        return navigator.userAgent.match(/Android/i);
                    },
                    blackBerry: function () {
                        return navigator.userAgent.match(/BlackBerry/i);
                    },
                    iOS: function () {
                        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                    },
                    opera: function () {
                        return navigator.userAgent.match(/Opera Mini/i);
                    },
                    windows: function () {
                        return navigator.userAgent.match(/IEMobile/i);
                    },
                    any: function () {
                        return (
                            isMobile.android() ||
                            isMobile.blackBerry() ||
                            isMobile.iOS() ||
                            isMobile.opera() ||
                            isMobile.windows());
                    }
                };
    
                var styles = [{
                    'featureType': 'all',
                    'stylers': [{
                        'saturation': -100
                    }, {
                        'gamma': 0.5
                    }]
                }, {
                    'featureType': 'road',
                    'elementType': 'geometry',
                    'stylers': [{
                        'lightness': 100
                    }, {
                        'visibility': 'simplified'
                    }]
                }, {
                    'featureType': 'water',
                    'elementType': 'geometry',
                    'stylers': [{
                        'visibility': 'on'
                    }, {
                        'color': '#c4c4c4'
                    }]
                }, {
                    'featureType': 'poi',
                    'elementType': 'geometry.fill',
                    'stylers': [{
                        'color': '#e2e2e2'
                    }]
                }, {
                    'featureType': 'road',
                    'elementType': 'geometry.fill',
                    'stylers': [{
                        'color': '#ffffff'
                    }]
                }];
                var styledMap = new google.maps.StyledMapType(styles, {
                    name: 'Styled Map'
                });
    
                var myOptions = {
                    zoom: 18,
                    center: center,
                    scrollwheel: false,
                    draggable: drag,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(
                    document.getElementById('map'), myOptions);
                var image = 'images/marker.png'; // icon map image
                var beachMarker = new google.maps.Marker({
                    position: position,
                    map: map,
                    icon: image
                });
                var marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    icon: image,
                    title: 'CasinoForumBatumi' // marker text
                });
                var lat = 55.800129; // latitude
                var lng = 37.674181; // longitude
                var position = new google.maps.LatLng(lat, lng);
                var center = new google.maps.LatLng(lat, lng);
                var drag = true;
    
                if (isMobile.any()) {
                    drag = false;
                }
    
                map.mapTypes.set('map_style', styledMap);
                map.setMapTypeId('map_style');
    
                $('.for_ct').click(function (e) {
                    if (e.srcElement === this) {
                        $(this).prev().click();
                    }
                });
            });
        }
    });
    // Button Top
    // How use
    // Add <div id="toTop"></div>
    $(function () {
        var btnTop = $('#toTop'); // Button id
    
        $(window).scroll(function () {
            if ($(this).scrollTop() > 0 && !btnTop.hasClass('scrolling')) {
                btnTop.fadeIn();
            } else {
                btnTop.fadeOut();
            }
        });
    
        btnTop.click(function () {
            btnTop.fadeOut().addClass('scrolling');
            $('body,html').animate({
                scrollTop: 0
            }, 800, function () {
    
                btnTop.removeClass('scrolling');
            });
        });
    
        $('.smoothScroll').click(function (event) {
            var href = $(this).attr('href');
            var target = $(href);
            var top = target.offset().top;
    
            if (target.length) {
                event.preventDefault();
                $('html,body').animate({
                    scrollTop: top - 190
                }, 500);
            }
        });
    });
    // End Button Top script
    // Modal popup
    
    var cookie = document.cookie;
    var date = new Date();
    
    // Modal show timer
    if (cookie.indexOf('popclose=submited') === -1) {
        setTimeout(function () {
            $('#Modal').modal('show');
        }, 2000); // Time popUp
    }
    
    $('#Modal .close').click(function () {
        date.setDate(date.getDate() + 14);
        document.cookie = 'popclose=submited; expires=' + date.toGMTString();
    });
    
    $('#Modal').click(function (data, handler) {
        if (data.target === this) {
            date.setDate(date.getDate() + 14);
            document.cookie = 'popclose=submited; expires=' + date.toGMTString();
        }
    });
    
    // For form id
    $('#lottery-popup-form').on('beforeSubmit', function () {
        date.setDate(date.getDate() + 365);
        document.cookie = 'popclose=submited; expires=' + date.toGMTString();
    });
    // End Modal popup script

    //====================================
    //-------- Only this site ------------
    //====================================



    //====================================
    //------ Listener functions ----------
    //====================================

    var resizeListener = debounce(function () {
        // Do something
    }, 200);
    
    window.addEventListener('resize', resizeListener);
    var scrollListener = debounce(function () {
        // Do something
    }, 200);
    
    window.addEventListener('scroll', scrollListener);

    //====================================
    //--------- Setting libs -------------
    //====================================



});