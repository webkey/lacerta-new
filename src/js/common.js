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
      minScrollTop = 50,
      currentScrollTop = $(window).scrollTop();

  $page.toggleClass('page-scrolled', (currentScrollTop > minScrollTop));

  $(window).on('load resizeByWidth scroll', function () {

    // minScrollTop = $fixedElement.offset().top;
    currentScrollTop = $(window).scrollTop();
    $page.toggleClass('page-scrolled', (currentScrollTop > minScrollTop));
  })
}

/**
 * !Initial custom select for cross-browser styling
 * */
function customSelect(select) {
  $.each(select, function () {
    var $thisSelect = $(this);
    // var placeholder = $thisSelect.attr('data-placeholder') || '';
    $thisSelect.select2({
      language: "ru",
      width: '100%',
      containerCssClass: 'cselect-head',
      dropdownCssClass: 'cselect-drop',
      minimumResultsForSearch: Infinity
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
function toggleShutters() {
  // Toggle shutter navigation
  var $shutterNavSwitcher = $('.shutter-nav-switcher-js'), shutterNavSwitcherJs;
  if ($shutterNavSwitcher.length) {
    shutterNavSwitcherJs = $shutterNavSwitcher.switchClass({
      switchClassTo: $('.shutter-nav-js')
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
          delay: 5000,
        },

        // Parallax
        // parallax: true,

        // Pagination
        pagination: {
          el: $thisPag,
          type: 'bullets',
          clickable: true
        },

        // Breakpoints
        breakpoints: {
          768: {
            // some props
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

        // Optional parameters
        loop: true,
        speed: 500,

        autoplay: {
          delay: 5000,
        },

        parallax: true,

        // Pagination
        pagination: {
          el: $thisPag,
          type: 'bullets',
          clickable: true
        }
      });

      promoSliderJs.on('init', function() {
        $(promoSliderJs.el).closest($thisSlider).addClass('is-loaded');
      });

      promoSliderJs.init();
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
          cardsSlider;

      cardsSlider = new Swiper ($cards, {
        init: false,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        loop: true,
        // disabled swiping
        followFinger: false,
        simulateTouch: false,
        spaceBetween: 20,
        preloadImages: false,
        pagination: {
          el: $cardsPagination,
          type: 'bullets',
          clickable: true
        },
        thumbs: {
          swiper: {
            el: $thumbs,
            loop: true,
            centeredSlides: true,
            direction: 'vertical',
            slidesPerView: 'auto',
            spaceBetween: 22,
            on: {
              click: function (e, el) {

                var activeIndex = this.activeIndex,
                    clickedIndex = this.clickedIndex;

                if (clickedIndex > activeIndex) {
                  this.slideNext();
                }
                if (clickedIndex < activeIndex) {
                  this.slidePrev();
                }
              }
            }
          },
        }
      });

      cardsSlider.on('init', function() {
        $curSlider.addClass('is-loaded');
      });

      cardsSlider.init();
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
      step: 100,
      force_edges: false,
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

  // todo это только пример работы калькулятора. Данные расчеты неверные
  function setValue(data, $slider) {

    var val = 12 * data.from * 0.12,
        $curSliderTotal = $slider.closest('.bond-calc').find('.bond-calc-total-js');

    $curSliderTotal.html(val);
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
  placeholderInit();
  detectScroll();
  customSelect($('select.cselect'));
  toggleShutters();
  slidersInit();
  objectFitImages(); // object-fit-images initial
  manualStepsSelect();
  rangeSlidersInit();
  equalHeight();
});