/*!
 * jQuery Mobile Navigation
 * by Brian Barton (www.github.com/bribar)
 *
 * Copyright 2015, Brian Barton
 * Licensed under the MIT License:
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
(function($){
  
  'use strict';
  var settings,
  	  animateObj = {},
      panelObj   = {};

  var methods = {
	  
    init : function(options) { 
       
	    settings = $.extend({
            panelWrap       : 'mobigation',
			buttonParent    : 'body', // Menu button appended to this element
			mode            : 'modal', // "modal" or "shift"
			offset          : 100, // if mode = shift, how much of site to show (integer or float)
			direction       : 'left', // "left", "right", "bottom"
			speed           : 500, // int, "slow", or "fast"
			easing          : 'swing', // "swing" or "linear"
			scrollToElement : false, // true or false, clicking menu links scroll to page element
			scrollSpeed     : 500, // scrollbar speed
			closeIcon       : 'x', // text or img
			opened          : null, // callback function
			closed          : null // callback function
        }, options);
        
		//this.data('settings',settings);
		
		var clonedMenu = this.clone();
		
		$('body').append('<div id="'+ settings.panelWrap +'"><a id="'+ settings.panelWrap +'-close">'+settings.closeIcon+'</a><div class="'+ settings.panelWrap +'-pad"><ul id="'+settings.panelWrap+'-ul">' + clonedMenu.html() + '</ul></div></div>');
		
		if(settings.mode === 'shift' && settings.direction !== 'bottom'){
			
			$('body').children('div').eq(0).wrapAll('<div id="'+settings.panelWrap+'-body-wrap"></div>');
			$('#' + settings.panelWrap + '-body-wrap').css('position','relative');
			
		}
		
		methods.update.call(this);
		
		$(window).resize(function() {
			
            methods.update.call(this);
			
        });
		
		// ADD BUTTON TO BUTTON PARENT CONTAINER
		$(settings.buttonParent).append('<a id="'+settings.panelWrap+'-menu" class="'+settings.panelWrap+'-menu"></a>');
		
		$('body').delegate('#'+settings.panelWrap+'-menu','click',function(e){
			
			e.stopPropagation();
			methods.open.call(this);
			
		});
		
		$('body').delegate('#'+settings.panelWrap+'-close','click',function(){
			
			methods.close.call(this);
			
		});
		
		if(settings.mode === 'shift'){
			
			$('#' + settings.panelWrap + '-body-wrap').click(function() {
                methods.close.call(this);
            });
			
		}
		
		$('#' + settings.panelWrap + ' li a').each(function() {
			
			var $this = $(this);
			
			$this.click(function(e) {
				
				e.stopPropagation();
				
				var target = $this.attr('href');
				
				if(target.indexOf('#') === 0 && target.length > 1){
					
					e.preventDefault();
					
					if(target !== ''){
						
						$('html,body').animate({
							scrollTop: $(target).offset().top
						}, settings.scrollSpeed, settings.easing, function(){
							
							methods.close.call(this);
							
						});
						
					}else{
						
						methods.close.call(this);
						
					}
					
					//return false;
				}else{
					
					if(target.indexOf('#') === 0 && $this.siblings('ul').length === 1){
						
						var subMenu = $this.parent().children('ul').eq(0);
						if(subMenu.length > 0){
							e.preventDefault();
							if(subMenu.is(':visible')){
								
								subMenu.slideUp();
								
							}else{
								
								subMenu.slideDown();
								
							}
						}
						
					}else{
						
						methods.close.call(this);
							
					}
					
				}
				
			});
			
		});
        
    },
    open : function(args) { 
		
		animateObj[settings.direction] = 0;
		
		$('#'+settings.panelWrap+'-menu').hide();
		
		if(settings.mode === 'shift' && settings.direction !== 'bottom'){
			
			$('#' + settings.panelWrap + '-body-wrap').prepend('<div id="mobigation-mask"></div>')
			
			var wOffset;
			
			if(settings.offset % 1 !== 0){
				wOffset = Math.round($(window).outerWidth() * settings.offset);
			}else{
				wOffset = settings.offset;
			}
			
			animateObj.width = $(window).outerWidth() - wOffset;
			
			var bodyObj = {};
			bodyObj.position            = 'relative';
			bodyObj[settings.direction] = $(window).outerWidth() - wOffset;
			bodyObj.top                 = 0; 
			$('#' + settings.panelWrap + '-body-wrap').animate(bodyObj,settings.speed,settings.easing,function(){});
			
		}
		
		$('#' + settings.panelWrap).animate(animateObj,settings.speed,settings.easing,function(){
		
			$('body,html').css({
				overflow : 'hidden',
				height   : '100%'
			});
			
			if ($.isFunction(settings.opened)){
				
				settings.opened.call(this);
				
			}
			
		});
		
    },
	close : function(args) { 
		if(settings.direction === 'bottom'){
			
			animateObj[settings.direction] = ($(window).outerHeight() * -1);
			
		}else{
			
			animateObj[settings.direction] = ($(window).outerWidth() * -1);
			
			$('#'+settings.panelWrap+'-menu').show();
			
			if(settings.mode === 'shift'){
				
				$('#mobigation-mask').remove();
				
				animateObj.width = $(window).outerWidth();
				
				var bodyObj = {};
				bodyObj.position            = 'relative';
				bodyObj[settings.direction] = 0;
				bodyObj.top                 = 0; 
				$('#' + settings.panelWrap + '-body-wrap').animate(bodyObj,settings.speed,settings.easing,function(){});
				
			}
			
		}
		
		$('#' + settings.panelWrap).animate(animateObj,settings.speed,settings.easing,function(){
			
			$('body,html').css({
				overflow : 'visible',
				height   : '100%'
			});
			
			if($.isFunction(settings.closed)){
				
				settings.closed.call(this);
				
			}
			
		});
		
    },
	update : function(args) {
		
		$('#'+settings.panelWrap+'-menu').show();
		$('body').css('overflow','visible');
		
		panelObj.position                = 'fixed';
		
		if(settings.direction === 'bottom'){
			
			panelObj.left                = 0;
			panelObj.bottom              = ($(window).outerHeight() * -1);
			
		}else{
			
			panelObj.top                 = 0;
			panelObj[settings.direction] = ($(window).outerWidth() * -1);
			
		}
		
		$('#' + settings.panelWrap).css(panelObj);
		
		methods.close.call(this);
		
	},
	destory : function(args) {
		
		$(settings.buttonParent).find('#'+settings.panelWrap+'-menu').remove();
		$('#' + settings.panelWrap).remove();
		this.removeData();
		
	}
	
  };

  $.fn.mobigation = function(method){

    if(methods[method]) {
		
		return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
	  
    }else if(typeof method === 'object' || ! method){
		
		return methods.init.apply(this, arguments);
	  
    }else{
		
		$.error('Method ' +  method + ' does not exist on Mobigation');
	  
    }    

  };

})(jQuery);