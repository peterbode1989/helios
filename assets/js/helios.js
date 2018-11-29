/**
 * Helios
 *
 * Helios is a lightweight Bootstrap gridslider
 *
 * @package     Helios
 * @version     1.0.0
 * @author      Peter Bode <peter@acfbentveld.nl>
 */

;(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($) {
    'use strict';
    var Helios = window.Helios || {};

    Helios = (function() {
        function Helios(element, settings) {
            var _ = this;

            _.defaults = {
                namespace: 'helios',
                step: 2, // the amount of cols to scroll when moving
                gutter: 15, // the default space between cols
                infinite: true,
                duration: 1000,

                dots: true, // Boolean for showing/hiding the dots
                appendDots: $(element),
                elDots: '<li><a href="#"></a></li>',

                arrows: true, // Boolean for showing/hiding the arrows
                appendArrows: $(element), // Element to appen
                elPrevArrow: '<button class="helios-arrow prev" aria-label="Previous" type="button">Previous</button>',
                elNextArrow: '<button class="helios-arrow next" aria-label="Next" type="button">Next</button>',
            };

            _.options = $.extend({}, _.defaults, settings);

            _.$slider = $(element);
            _.$sliderSize = _.$slider.outerWidth();
            _.$children = _.$slider.children('div[class^=\'col-\']');
            _.$clonedChildren = _.$children.clone();
            _.$childrenCount = _.$children.length;
            _.$dotCount = Math.ceil(_.$childrenCount / _.options.step);
            _.$childSize = _.$children.outerWidth();
            _.$colCount = Math.round(_.$sliderSize / _.$childSize);
            _.$currentIndex = 0;
            _.$currentOrder = Array.apply(null, Array(_.$childrenCount)).map(function (x, i) { return i });

            _.init();
        }
        return Helios;
    }());

    Helios.prototype.queue = function(cD, duration) {
        var _ = this;
        duration = duration || _.options.duration;

        // if(_.options.infinite === true) {
        //     _.clone();
        // }

        _.$slider.queue(function() {
            _.$children.each(function() {
                $(this).animate({
                    left: -parseFloat(cD),
                }, duration, function() {
                    _.$slider.dequeue();
                });
            });
            _.update();
        });
    }

    Helios.prototype.move = function(_, e) {
        var _ = this;

        let dir = parseInt($(e.target).attr('data-dir'));

        _.updateIndex('move', dir);


        // _.virtualscroll();
        _.virtualscrolling(dir);

        // this add max slide scrolling for last elements..
        // let dynamic = (_.$currentIndex * _.$childSize); // temp slide maxer
        // _.queue( (dynamic >= _.$sliderSize ? _.$sliderSize : dynamic) );

        _.queue( (_.$currentIndex * _.$childSize) );
    }

    Helios.prototype.responsive = function(duration) {
        var _ = this;
        duration = duration || _.options.duration;

        _.update();

        // this add max slide scrolling for last elements..
        // let sol = (_.$currentIndex * _.$childSize) >= _.$sliderSize;
        // _.queue( (sol ? _.$sliderSize : _.$currentIndex * _.$childSize) );

        _.queue( (_.$currentIndex * _.$childSize), duration );
    }

    // Helios.prototype.buildInfinite = function() {
    //     var _ = this;
    //
    //     if(_.options.infinite === false) return false;
    //
    //     //
    //     // console.log('buildInfinite');
    //     //
    //     // var collection = [];
    //     //
    //     // _.$children.each(function() {
    //     //     var temp = $(this).clone()
    //     //         .addClass('helios-clone');
    //     //     collection.push(temp);
    //     // });
    //     //
    //     //
    //     // _.$slider.append(collection);
    //     //
    //     // console.log(collection);
    //     //
    //     // _.$children = _.$slider.children('div');
    // }

    Helios.prototype.updateIndex = function(type, dir) {
        var _ = this;

        if(type === 'move') _.$currentIndex -= dir;
        if(type === 'equal') _.$currentIndex = dir;

        if(_.$currentIndex >= _.$childrenCount) {
            _.$currentIndex += -(_.$childrenCount);
        }

        console.log(_.$currentIndex);
    }

    Helios.prototype.buildArrows = function() {
        // all code that builds the arrows
        var _ = this;

        if(_.options.arrows === true) {
            // Apply default classes and events to elements
            _.$prevArrow = $(_.options.elPrevArrow)
                .addClass(_.options.namespace+'-arrow')
                .addClass(_.options.namespace+'-prev')
                .attr('data-dir', _.options.step * 1)
                .on('click', function(e) {
                    _.move(_, e);
                });

            _.$nextArrow = $(_.options.elNextArrow)
                .addClass(_.options.namespace+'-arrow')
                .addClass(_.options.namespace+'-next')
                .attr('data-dir', _.options.step * -1)
                .on('click', function(e) {
                    _.move(_, e);
                });

            _.options.elPrevArrow = _.$prevArrow;
            _.options.elNextArrow = _.$nextArrow;

            // Append buttons to the selector

            $(_.options.appendArrows).append(_.options.elPrevArrow);
            $(_.options.appendArrows).append(_.options.elNextArrow);
        }
    }

    Helios.prototype.buildDots = function() {
        // all code that builds the dots
        var _ = this;

        if(_.options.dots === true) {
            // do something
            // let ul = $(_.options.appendDots);
            let ul = $('<ul class="'+_.options.namespace+'-dots'+'"></ul>');

            for(var i = 0; i < _.$dotCount; i++) {
                let li = $(_.options.elDots)
                    .attr('data-step', (i * _.options.step))
                    .on('click', function(e) {
                        _.updateIndex('equal', parseInt($(this).attr('data-step')));
                        _.responsive();
                    });

                $(ul).append(li);
            }


            $(_.options.appendDots).append(ul);
        }
    }

    // Helios.prototype.virtualscroll = function() {
    //     var _ = this;
    //
    //
    //     // before i start cloning, do i meed these requirements?
    //     console.log(_.$currentIndex);
    //     console.log((_.$colCount + _.$currentIndex));
    //     console.log(_.$children.length);
    //
    //     if((_.$colCount + _.$currentIndex) != _.$children.length
    //         && _.$currentIndex != _.$children.length) {
    //         _.$slider.append(_.$children.clone())
    //     } else if(_.$currentIndex == _.$children.length) {
    //         console.log('spcial?');
    //         _.$currentIndex = 0;
    //         _.$children.each(function() {
    //             $(this).css('left', 0);
    //         });
    //     }
    //
    //     // let activeSlides = _.$children.filter(function(i) {
    //     //     return (i >= _.$currentIndex && i < (_.$colCount + _.$currentIndex))
    //     // });
    //     //
    //     // if(activeSlides.length != _.$colCount) {
    //     //     // console.warn('virtualscroll');
    //     //     // var toClone = _.$colCount - activeSlides.length;
    //     //     // console.log(toClone);
    //     //
    //     //     // _.$children.each(function(i, el) {
    //     //     //     console.log({i,el});
    //     //     // });
    //     //     _.$slider.append(_.$children.first().clone());
    //     // }
    //
    //     _.update();
    //
    // }

    Helios.prototype.update = function() {
        var _ = this;


        if(_.$childSize !== _.$children.outerWidth()) {
            _.$childSize = _.$children.outerWidth();
            _.$sliderSize = _.$slider.outerWidth();

            _.$colCount = Math.round(_.$sliderSize / _.$childSize);
        }

        _.$children = _.$slider.children('div[class^=\'col-\']'); // Update all the children (default fallback trigger)

        if(_.options.arrows === true) {
            if(_.$currentIndex == 0 && _.options.infinite === false) {
                _.options.elPrevArrow.attr('disabled', 'disabled');
            } else {
                _.options.elPrevArrow.removeAttr('disabled', 'disabled');
            }
            if(_.$childrenCount == (_.$currentIndex + _.options.step) && _.options.infinite === false) {
                _.options.elNextArrow.attr('disabled', 'disabled');
            } else {
                _.options.elNextArrow.removeAttr('disabled', 'disabled');
            }
        }

        if(_.options.dots === true) {
            $(_.options.appendDots).find('ul').children('li').each(function() {
                $(this).removeClass('active');
                if(_.$currentIndex == parseInt($(this).attr('data-step'))) {
                    $(this).addClass('active');
                }
            });
        }
    }

    Helios.prototype.reorder = function() {
        // function for all reordering of the DOM...

        // All elements can be found here _.$children
        // New order of dom Elements

        // Add them to the current dom

        // Update all Helios-data to be certain!
    }

    Helios.prototype.virtualscrolling = function(dir) {
        dir = dir || 0;

        var _ = this;

        // console.log(_.$clonedChildren);
// console.log(_.options.step);
        // let possibilities = new Array().map(function (x, i) { return i })
        // console.log(_.$currentOrder); // returns the current load order; supplied by the user-dom



        if(dir === 0) {

            // let min =
            // console.log(_.$clonedChildren);

            if((_.$colCount + (_.options.step*2)) > _.$childrenCount) {
                console.log('need double clone');
            }

            // console.log(
            //     _.$currentOrder.slice(_.$currentIndex, _.$currentIndex + _.$colCount + _.options.step)
            // );



            // _.$currentOrder.map((el, index) => {
            //   console.log("The current iteration is: " + index);
            //   console.log("The current element is: " + el);
            //   console.log("\n");
            //   return 'X';
            // });
            _.$currentIndex=0;

            console.log(
                _.$currentOrder
            );
            let bleed = _.$currentOrder.splice(_.$currentIndex+_.$colCount+_.options.step, _.$currentOrder.length);


            let order = bleed.concat(_.$currentOrder.splice(_.$currentIndex, _.$currentIndex+_.$colCount+_.options.step));
            console.log(order);

//
//             if(
//                 (_.$currentIndex - _.options.step) < 0
//             ) {
//                 order = _.$currentOrder.slice( (_.$currentIndex - _.options.step) ).concat(
//                     order
//                 );
//                 console.log('concat :: ' + _.$currentOrder.slice( (_.$currentIndex - _.options.step) ));
//             }
//             console.log(order);


            // _.$currentOrder = _.$currentOrder.splice(_.$childrenCount-_.options.step, _.$childrenCount).concat(
            //     _.$currentOrder
            // );
            // console.log(_.$currentOrder);
            // console.log('end init');

        } else {
            console.log(dir);
            console.log(_.$childrenCount-_.options.step - _.options.step);
            console.log( _.$childrenCount);
            console.log(_.$currentIndex);
        }

        // if(_.$currentIndex >= _.$childrenCount) {
        //     _.$currentIndex = _.$currentIndex - _.$childrenCount;
        // }
        // console.log('i :: ' + _.$currentIndex);
        //
        // let newKeys = [];
        // for(var i = (_.$currentIndex - _.options.step); i < (_.$currentIndex + _.options.step + _.$colCount); i++ ) {
        //
        //     if(i >= _.$childrenCount) {
        //          newKeys.push((i - _.$childrenCount));
        //         // console.log(i - _.$childrenCount);
        //     } else if(i < 0) {
        //         // console.log(i + _.$childrenCount);
        //          newKeys.push((i + _.$childrenCount));
        //     } else {
        //         // console.log(i);
        //          newKeys.push(i);
        //     }
        // }
        // // for(var i = (_.$currentIndex - _.options.step); i < (_.$colCount + _.$currentIndex + _.options.step); i++ ) {
        // //     if(i < 0) {
        // //         newKeys.push((i + _.$childrenCount));
        // //     } else if(i >= _.$childrenCount) {
        // //         newKeys.push((i - _.$childrenCount));
        // //     } else {
        // //         newKeys.push(i);
        // //     }
        // // }
        //
        // // console.log(newKeys);
        //
        // let newOrder = newKeys.map(function(i){
        //     return _.$children[i];
        // });
        //
        // // console.log(newOrder);
        //
        // _.$children.each(function() {
        //     $(this).remove();
        // });
        // //
        // // console.log(newOrder);
        // //
        // _.$slider.append(newOrder);
        // _.$currentIndex += _.options.step;
        // // _.responsive(1);





        // dump all the assets needed
        // let test = _.$children.filter(function(i) {
        //     return (i >= _.$currentIndex && i < (_.$currentIndex + _.$colCount));
        // });
        // console.log(test);
        //

        // working example... beta-charlie everything.. bad
        // if(dir !== 0 && test.length !== _.$colCount) {
        //     let elms = _.$children.clone();
        //
        //     $(elms).each(function() {
        //         $(this).addClass(_.options.namespace + '-clone');
        //     });
        //     _.$slider.append(elms);
        //
        //     _.update();
        //
        // }


    }

    Helios.prototype.render = function() {
        // all code that appends here.
        var _ = this;

        // _.buildInfinite();
        _.buildArrows();
        _.buildDots();

        _.virtualscrolling();

        _.update();
    }

    Helios.prototype.init = function() {
        // all code that needs to be executed before the rest starts.
        var _ = this;

        // Adds the default class for style purpose
        if (!$(_.$slider).hasClass('helios')) {
            $(_.$slider).addClass('helios');
        }

         $(window).on('resize', function() {
             _.resize();
         });

        _.render();
    };

    Helios.prototype.resize = function() {
        var _ = this;

        clearTimeout(_.windowDelay);
        _.windowDelay = window.setTimeout(function() {
            _.responsive();
        }, 50);
    };

    $.fn.helios = function() {
        var _ = this;
        for (let i = 0; i < _.length; i++) {
            _[i].helios = new Helios(_[i], arguments[0]);
        }
        return _;
    };
}));
