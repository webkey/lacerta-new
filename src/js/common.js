/**
 * !Resize only width
 * */
var resizeByWidth = true;

var prevWidth = -1;
$(window).resize(function () {
  var currentWidth = $('body').outerWidth();
  resizeByWidth = prevWidth !== currentWidth;
  if (resizeByWidth) {
    $(window).trigger('resizeByWidth');
    prevWidth = currentWidth;
  }
});

/**
 * !Detected touchscreen devices
 * */
var TOUCH = Modernizr.touchevents;
var DESKTOP = !TOUCH;

/**
 * !Lazy loader
 * */
const observer = lozad(); // lazy loads elements with default selector as '.lozad'
observer.observe();

/**
 * !Show elements on scroll
 */
function showOnScroll() {
  var $showFigure = $('.show-figure-js');

  if ($showFigure.length) {
    ScrollReveal().reveal($showFigure, {
      duration: 900,
      distance: '100px',
      scale: 0.92,
      interval: 100,
      reset: false,
      // viewFactor: 0.1
      viewOffset: {
        bottom: 100
      }
    });
  }
}

/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }

  return "unknown";
}

function addOSClasses() {
  var $detectOS = $('.detect-os-js');
  if ($detectOS.length) {
    // $detectOS.toggleClass('detected-ios', getMobileOperatingSystem() === "iOS");
    if (getMobileOperatingSystem() === "iOS") {
      $detectOS.find('[href*="play.google.com"]').parent().hide();
    }
    // $detectOS.toggleClass('detected-android', getMobileOperatingSystem() === "Android");
    if (getMobileOperatingSystem() === "Android") {
      $detectOS.find('[href*="itunes.apple.com"]').parent().hide();
    }
  }
}

/**
 * !Add placeholder for old browsers
 * */
function placeholderInit() {
  $('[placeholder]').placeholder();
}

/**
 * !Detect scroll page
 */
function detectScroll() {
  // external js:
  // 1) resizeByWidth (resize only width);

  var $page = $('html'),
      // $fixedElement = $('.main-nav'),
      // var minScrollTop = $fixedElement.offset().top,
      minScrollTop = $('.header').outerHeight(),
      currentScrollTop = $(window).scrollTop();

  $page.toggleClass('page-scrolled', (currentScrollTop > minScrollTop));

  $(window).on('load resizeByWidth scroll', function () {

    // minScrollTop = $fixedElement.offset().top;
    minScrollTop = $('.header').outerHeight();
    currentScrollTop = $(window).scrollTop();
    $page.toggleClass('page-scrolled', (currentScrollTop > minScrollTop));
  })
}

/**
 * !Initial custom select for cross-browser styling
 * */
function customSelect() {
  var select = $('select.cselect');
  $.each(select, function () {
    var $thisSelect = $(this);
    // var placeholder = $thisSelect.attr('data-placeholder') || '';
    $thisSelect.select2({
      language: "ru",
      width: '100%',
      containerCssClass: 'cselect-head',
      dropdownCssClass: 'cselect-drop',
      minimumResultsForSearch: Infinity,
      allowClear: true
      // , placeholder: placeholder
    });
  })
}

/**
 * !jquery.ms-switch-class.js
 * Version: 2018.1.0
 * Author: *
 * Description: Extended toggle class
 */

(function ($) {
  'use strict';

  var countFixedScroll = 0;
  // Нужно для корректной работы с доп. классом фиксирования скролла

  var SwitchClass = function (element, config) {
    var self,
        $element = $(element),
        $html = $('html'),
        pref = 'jq-switch-class',
        pluginClasses = {
          initClass: pref + '_initialized'
        },
        mod = {
          scrollFixedClass: 'css-scroll-fixed'
        },
        $switchClassTo = $element.add(config.switcher).add(config.adder).add(config.remover).add(config.switchClassTo),
        classIsAdded = false; //Флаг отвечающий на вопрос: класс добавлен?

    var callbacks = function () {
          /** track events */
          $.each(config, function (key, value) {
            if (typeof value === 'function') {
              $element.on('switchClass.' + key, function (e, param) {
                return value(e, $element, param);
              });
            }
          });
        },
        prevent = function (event) {
          event.preventDefault();
          event.stopPropagation();
          return false;
        },
        toggleFixedScroll = function () {
          $html.toggleClass(mod.scrollFixedClass, !!countFixedScroll);
        },
        add = function () {
          if (classIsAdded) return;

          // Callback before added class
          $element.trigger('switchClass.beforeAdded');

          // Добавить активный класс на:
          // 1) Основной элемент
          // 2) Дополнительный переключатель
          // 3) Элементы указанные в настройках экземпляра плагина
          $switchClassTo.addClass(config.modifiers.activeClass);

          classIsAdded = true;

          if (config.cssScrollFixed) {
            // Если в настойках указано, что нужно добавлять класс фиксации скролла,
            // То каждый раз вызывая ДОБАВЛЕНИЕ активного класса, увеличивается счетчик количества этих вызовов
            ++countFixedScroll;
            toggleFixedScroll();
          }

          // callback after added class
          $element.trigger('switchClass.afterAdded');
        },
        remove = function () {
          if (!classIsAdded) return;

          // callback beforeRemoved
          $element.trigger('switchClass.beforeRemoved');

          // Удалять активный класс с:
          // 1) Основной элемент
          // 2) Дополнительный переключатель
          // 3) Элементы указанные в настройках экземпляра плагина
          $switchClassTo.removeClass(config.modifiers.activeClass);

          classIsAdded = false;

          if (config.cssScrollFixed) {
            // Если в настойках указано, что нужно добавлять класс фиксации скролла,
            // То каждый раз вызывая УДАЛЕНИЕ активного класса, уменьшается счетчик количества этих вызовов
            --countFixedScroll;
            toggleFixedScroll();
          }

          // callback afterRemoved
          $element.trigger('switchClass.afterRemoved');
        },
        events = function () {
          $element.on('click', function (event) {
            if (classIsAdded) {
              remove();

              event.preventDefault();
              return false;
            }

            add();

            prevent(event);
          });

          $(config.switcher).on('click', function (event) {
            $element.click();
            prevent(event);
          });

          $(config.adder).on('click', function (event) {
            add();
            prevent(event);
          });

          $(config.remover).on('click', function (event) {
            remove();
            prevent(event);
          })

        },
        removeByClickOutside = function () {
          $html.on('click', function (event) {
            if (classIsAdded && config.removeOutsideClick && !$(event.target).closest('.' + config.modifiers.stopRemoveClass).length) {
              remove();
              // event.stopPropagation();
            }
          });
        },
        removeByClickEsc = function () {
          $html.keyup(function (event) {
            if (classIsAdded && config.removeEscClick && event.keyCode === 27) {
              remove();
            }
          });
        },
        init = function () {
          $element.addClass(pluginClasses.initClass).addClass(config.modifiers.initClass);
          $element.trigger('switchClass.afterInit');
        };

    self = {
      callbacks: callbacks,
      remove: remove,
      events: events,
      removeByClickOutside: removeByClickOutside,
      removeByClickEsc: removeByClickEsc,
      init: init
    };

    return self;
  };

  // $.fn.switchClass = function (options, params) {
  $.fn.switchClass = function () {
    var _ = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = _.length,
        i,
        ret;
    for (i = 0; i < l; i++) {
      if (typeof opt === 'object' || typeof opt === 'undefined') {
        _[i].switchClass = new SwitchClass(_[i], $.extend(true, {}, $.fn.switchClass.defaultOptions, opt));
        _[i].switchClass.callbacks();
        _[i].switchClass.events();
        _[i].switchClass.removeByClickOutside();
        _[i].switchClass.removeByClickEsc();
        _[i].switchClass.init();
      }
      else {
        ret = _[i].switchClass[opt].apply(_[i].switchClass, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return _;
  };

  $.fn.switchClass.defaultOptions = {
    switcher: null,
    /**
     * @description - Дополнительный элемент, которым можно ДОБАВЛЯТЬ/УДАЛЯТЬ класс
     * @example {String}{JQ Object} null - '.switcher-js', или $('.switcher-js')
     */
    adder: null,
    /**
     * @description - Дополнительный элемент, которым можно ДОБАВЛЯТЬ класс
     * @example {String}{JQ Object} null - '.adder-js', или $('.adder-js')
     */
    remover: null,
    /**
     * @description - Дополнительный элемент, которым можно УДАЛЯТЬ класс
     * @example {String}{JQ Object} null - '.remover-js', или $('.remover-js')
     */
    switchClassTo: null,
    /**
     * @description - Один или несколько эелментов, на которые будет добавляться/удаляться активный класс (modifiers.activeClass)
     * @example {JQ Object} null - 1) $('html, .popup-js, .overlay-js')
     * @example {JQ Object} null - 2) $('html').add('.popup-js').add('.overlay-js')
     */
    removeOutsideClick: true,
    /**
     * @description - Удалать класс по клику по пустому месту на странице? Если по клику на определенный элемент удалять класс не нужно, то на этот элемент нужно добавить дата-антрибут [data-tc-stop]
     * @param {boolean} true - или false
     */
    removeEscClick: true,
    /**
     * @description - Удалять класс по клику на клавишу Esc?
     * @param {boolean} true - или false
     */
    cssScrollFixed: false,
    /**
     * @description - Добавлять на html дополнительный класс 'css-scroll-fixed'? Через этот класс можно фиксировать скролл методами css
     * @see - _mixins.sass =scroll-blocked()
     * @param {boolean} true - или false.
     */
    modifiers: {
      initClass: null,
      activeClass: 'active',
      stopRemoveClass: 'stop-remove-class' // Если кликнуть по елементу с этим классам, то событие удаления активного класса не будет вызвано
    }
    /**
     * @description - Список классов-модификаторов
     */
  };

})(jQuery);

/**
 * !Toggle shutters panel, like a search panel, a catalog shutter etc.
 */
function switchClasses() {
  // Toggle shutter navigation
  var $shutterNavSwitcher = $('.shutter-nav-switcher-js'), shutterNavSwitcherJs;
  if ($shutterNavSwitcher.length) {
    shutterNavSwitcherJs = $shutterNavSwitcher.switchClass({
      switchClassTo: $('.shutter-nav-js').add('.shutter-overlay-js')
      , remover: $('.shutter-nav-close-js')
      , modifiers: {
        activeClass: 'shutter-nav_is-open'
      }
      , cssScrollFixed: true
      , removeOutsideClick: true
    });
  }

  // При добавлении классов одним экземпляром плагина,
  // вызывать метод удаления классов другими
  shutterNavSwitcherJs.on('switchClass.beforeAdded', function () {
    // otherShutter.switchClass('remove');
  });

  // Toggle callback form
  var $callbackFromOpener = $('.form-opener-js');

  if ($callbackFromOpener.length) {
    $.each($callbackFromOpener, function () {
      var $thisOpener = $(this),
          $thisDrop = $thisOpener.closest('form').find('.form-drop-js');

      $thisOpener.switchClass({
        switchClassTo: $thisDrop
        , modifiers: {
          activeClass: 'form-is-open'
        }
        , cssScrollFixed: false
        , removeOutsideClick: false
      });
    });
  }
}

/**
 * !Initial sliders on the project
 * */
function slidersInit() {
  /** Tape slider */
  var $tapeSlider = $('.tape-slider-js');
  if ($tapeSlider.length) {
    $tapeSlider.each(function () {
      var $thisSlider = $(this),
          $thisPag = $('.swiper-pagination', $thisSlider),
          promoSliderJs;

      promoSliderJs = new Swiper($thisSlider, {
        init: false,

        // Optional parameters
        loop: true,
        spaceBetween: 22,
        slidesPerView: 3,
        watchSlidesVisibility: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: true
        },
        pagination: {
          el: $thisPag,
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          1199: {
            slidesPerView: 2
          },
          991: {
            slidesPerView: 'auto',
            centeredSlides: true
          }
        }
      });

      promoSliderJs.on('init', function() {
        $(promoSliderJs.el).closest($thisSlider).addClass('is-loaded');
      });

      promoSliderJs.init();
    });
  }

  /** Reviews slider */
  var $opinionsSlider = $('.opinions-slider-js');
  if ($opinionsSlider.length) {
    $opinionsSlider.each(function () {
      var $thisSlider = $(this),
          $thisPag = $('.swiper-pagination', $thisSlider),
          promoSliderJs;

      promoSliderJs = new Swiper($thisSlider, {
        init: false,
        loop: true,
        speed: 500,
        autoplay: {
          delay: 5000,
          disableOnInteraction: true
        },
        parallax: true,
        pagination: {
          el: $thisPag,
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          991: {
            parallax: false,
            spaceBetween: 30
          }
        }
      });

      promoSliderJs.on('init', function() {
        $(promoSliderJs.el).closest($thisSlider).addClass('is-loaded');
      });

      promoSliderJs.init();
    });
  }

  /** Manual steps slider */
  var $manualStepsSlider = $('.manual-steps-slider-js');
  if ($manualStepsSlider.length) {
    $manualStepsSlider.each(function () {
      var $thisSlider = $(this),
          $thisPag = $('.swiper-pagination', $thisSlider);

      new Swiper($thisSlider, {
        simulateTouch: false,
        pagination: {
          el: $thisPag,
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          991: {
            followFinger: true,
            simulateTouch: true
          }
        }
      });
    });
  }

  /**Yield slider*/
  var $yieldGroup = $('.yield-group-js');
  if($yieldGroup.length){
    $yieldGroup.each(function () {
      var $curSlider = $(this),
          $cards = $curSlider.find('.yield-cards-slider-js'),
          $thumbs = $curSlider.find('.yield-thumbs-slider-js'),
          $cardsPagination = $curSlider.find('.swiper-pagination'),
          cardsSlider, thumbsSlider;

      thumbsSlider = new Swiper ($thumbs, {
        loop: true,
        centeredSlides: true,
        direction: 'vertical',
        slidesPerView: 'auto',
        spaceBetween: 22,
        slideToClickedSlide: true,
        loopedSlides: 5,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        allowTouchMove: false
      });

      cardsSlider = new Swiper ($cards, {
        init: false,
        effect: 'coverflow',
        coverflowEffect: {
          rotate: -5,
          stretch: 0,
          depth: 150,
          modifier: 1,
          slideShadows : false,
        },
        centeredSlides: true,
        slideToClickedSlide: true,
        loop: true,
        loopedSlides: 5,
        spaceBetween: 20,
        allowTouchMove: false,
        preloadImages: false,
        parallax: true,
        pagination: {
          el: $cardsPagination,
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          991: {
            slidesPerView: 'auto',
            allowTouchMove: true
          }
        }
      });

      cardsSlider.on('init', function() {
        $curSlider.addClass('is-loaded');
      });

      cardsSlider.init();

      thumbsSlider.on('slideChange', function () {
        var activeIndex = thumbsSlider.activeIndex;
        cardsSlider.slideTo(activeIndex);
      });

      cardsSlider.on('slideChange', function () {
        var activeIndex = cardsSlider.activeIndex;
        thumbsSlider.slideTo(activeIndex);
      });
    });
  }

  /**App visual slider*/
  var $appVisualSlider = $('.app-visual__slider-js');
  if($appVisualSlider.length){
    $appVisualSlider.each(function () {
      var $curSlider = $(this),
          curSliderJs;

      curSliderJs = new Swiper ($curSlider, {
        init: false,
        effect: 'coverflow',
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 0,
          modifier: 0,
          slideShadows : false,
        },
        slidesPerView: 'auto',
        centeredSlides: true,
        slideToClickedSlide: true,
        loop: true,
        loopedSlides: 20,
        spaceBetween: 20,
        parallax: true,
        breakpoints: {
          767: {
            coverflowEffect: {
              stretch: -35,
              depth: 150,
              modifier: 1
            },
          }
        }
      });

      curSliderJs.on('init', function() {
        $curSlider.addClass('is-loaded');
      });

      curSliderJs.init();
    });
  }
}

/**
 * !Manual steps select
 */
function manualStepsSelect() {
  var $stepsThumb = $('.manual-thumb-js'),
      $stepsItem = $('.manual__step-js'),
      activeClass = 'current';

  $stepsThumb.on('click', function (event) {
    var $thisStepsThumb = $(this);

    if($thisStepsThumb.hasClass(activeClass)) {
      return false;
    }

    var $thisStepsItem = $thisStepsThumb.closest($stepsItem);

    $stepsThumb.add($stepsItem).removeClass(activeClass);
    $thisStepsThumb.add($thisStepsItem).addClass(activeClass);

    event.preventDefault();
  })
}

/**
 * !Range sliders initial
 */
function rangeSlidersInit() {

  var slidersArr = [];

  $.each($('.bond-range-slider'), function (i, el) {
    var $curSlider = $(this);

    $curSlider.ionRangeSlider({
      skin: 'custom',
      hide_min_max: true,
      // force_edges: true,
      onStart: function (data) {
        setValue(data, $curSlider)
      },
      onChange: function (data) {
        setValue(data, $curSlider);
      },
      onUpdate: function (data) {
        setValue(data, $curSlider);
      }
    });

    slidersArr[i] = $curSlider.data('ionRangeSlider');
  });

  function setValue(data, $slider) {
    var $container = $slider.closest('.bond-calc-js'),
        $sumElem = $container.find('.bond-calc-sum-js'),
        currentVal = data.from,
        rate = $slider.data('rate'),
        length,
        total,
        // totalRound,
        profit;
        // profitRound;
    
    $sumElem.html(currentVal).attr('data-bond-calc-sum', currentVal);

    length = currentVal / $slider.data('step');
    total = rate / 100 * currentVal + currentVal;
    // totalRound = Math.round(total * 100) / 100;
    // profit = totalRound - currentVal;
    profit = total - currentVal;
    // profitRound = Math.round(profit * 100) / 100;

    total = parseFloat(total).toFixed(2);
    profit = parseFloat(profit).toFixed(2);

    $container.find('.bond-calc-length-js').html(length).attr('data-bond-calc-length', length);
    $container.find('.bond-calc-total-js').html(total).attr('data-bond-calc-total', total);
    $container.find('.bond-calc-profit-js').html(profit).attr('data-bond-calc-profit', profit);
  }
}

/**
 * !Equal height of blocks by maximum height of them
 */
function equalHeight() {
  // equal height of elements
  var $equalHeight = $('.equal-height-js');

  if($equalHeight.length) {
    $equalHeight.children().matchHeight({
      byRow: true, property: 'height', target: null, remove: false
    });
  }
}

/**
 * =========== !ready document, load/resize window ===========
 */

$(document).ready(function () {
  showOnScroll();
  addOSClasses();
  placeholderInit();
  detectScroll();
  customSelect();
  switchClasses();
  slidersInit();
  objectFitImages(); // object-fit-images initial
  manualStepsSelect();
  rangeSlidersInit();
  equalHeight();
});