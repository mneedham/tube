/*jshint browser:true, devel:true, jquery: true, smarttabs: true */
/*global google:false, steal:false */
/*! appendAround markup pattern. [c]2012, @scottjehl, Filament Group, Inc. MIT/GPL
how-to:
	1. Insert potential element containers throughout the DOM
	2. give each container a data-set attribute with a value that matches all other containers' values
	3. Place your appendAround content in one of the potential containers
	4. Call appendAround() on that element when the DOM is ready
*/
(function ($) {
    $.fn.appendAround = function () {
        return this.each(function () {
            var $self = $(this),
                att = "data-set",
                $set = $("[" + att + "='" + $self.closest("[" + att + "]").attr(att) + "']");

            function appendToVisibleContainer() {
                if ($self.is(":hidden")) {
                    $self.appendTo($set.filter(":visible:eq(0)"));
                }
                $(window).trigger('append-around-complete');
            }

            appendToVisibleContainer();

            //NOTE - THIS NEXT LINE HAS BEEN MODIFIED TO HOOK INTO OUR MODIFIED BREAKPOINTS.JS
            $(window).on("changeBreakpoint", appendToVisibleContainer);
        });
    };
}(jQuery));
/*
	Breakpoints.js
	version 1.0

	Creates handy events for your responsive design breakpoints

	Copyright 2011 XOXCO, Inc
	http://xoxco.com/

	Documentation for this plugin lives here:
	http://xoxco.com/projects/code/breakpoints

	Licensed under the MIT license:
	http://www.opensource.org/licenses/mit-license.php

*/
(function ($) {
    "use strict";
    var lastSize = 0;
    var interval = null;
    var sorted = null;

    $.fn.resetBreakpoints = function () {
        $(window).unbind('resize');
        lastSize = 0;
    };

    $.fn.setBreakpoints = function (settings) {
        var options = jQuery.extend({
            distinct: true,
            useInnerWidth: true,
            breakpoints: [
                { name: 'Small', resolution: 10 },
                { name: 'Medium', resolution: 580 },
                { name: 'Large', resolution: 900 }
            ]
        }, settings);

        sorted = options.breakpoints.sort(function (a, b) { return (b.resolution - a.resolution); });

        $(window).on('resize', function () {
            var w;
            //use innerWidth, so that js breakpoints get triggered at the same time as css breakpoints
            //TODO - Don't use browser detection to fix differences in implementation
            if ("innerWidth" in window) {
                w = window.innerWidth;
            } else {
                w = $(window).width();
            }
            var done = false;
            var changed = false;
            for (var bp in sorted) {
                // fire onEnter when a browser expands into a new breakpoint
                // if in distinct mode, remove all other breakpoints first.

                var currentBP = options.breakpoints[bp].resolution;

                if (!done && w >= currentBP && lastSize < currentBP) {
                    if (options.distinct) {
                        for (var x in sorted) {
                            if ($('body').hasClass('breakpoint-' + options.breakpoints[x].name)) {
                                $('body').removeClass('breakpoint-' + options.breakpoints[x].name);
                                $(window).trigger('exitBreakpoint' + options.breakpoints[x].name);
                            }
                        }
                        done = true;
                    }
                    $('body').addClass('breakpoint-' + options.breakpoints[bp].name);
                    $(window).trigger('enterBreakpoint' + options.breakpoints[bp].name);
                    changed = true;
                }

                // fire onExit when browser contracts out of a larger breakpoint
                if (w < options.breakpoints[bp].resolution && lastSize >= options.breakpoints[bp].resolution) {
                    $('body').removeClass('breakpoint-' + options.breakpoints[bp].name);
                    $(window).trigger('exitBreakpoint' + options.breakpoints[bp].name);
                    changed = true;
                }

                // if in distinct mode, fire onEnter when browser contracts into a smaller breakpoint
                if (
					options.distinct && // only one breakpoint at a time
					w >= options.breakpoints[bp].resolution && // and we are in this one
					w < options.breakpoints[bp - 1].resolution && // and smaller than the bigger one
					lastSize > w && // and we contracted
					lastSize > 0 &&  // and this is not the first time
					!$('body').hasClass('breakpoint-' + options.breakpoints[bp].name) // and we aren't already in this breakpoint
					) {
                    $('body').addClass('breakpoint-' + options.breakpoints[bp].name);
                    $(window).trigger('enterBreakpoint' + options.breakpoints[bp].name);
                    changed = true;
                }
            }
            if (changed) {
                $(window).trigger('changeBreakpoint');
            }
            // set up for next call
            if (lastSize != w) {
                lastSize = w;
            }
        });
        $(window).resize();
    };
})(jQuery);
/*! jQuery UI - v1.10.1 - 2013-02-15
* http://jqueryui.com
* Includes: jquery.ui.core.js
* Copyright 2013 jQuery Foundation and other contributors; Licensed MIT */
(function(e,t){function i(t,n){var r,i,o,u=t.nodeName.toLowerCase();return"area"===u?(r=t.parentNode,i=r.name,!t.href||!i||r.nodeName.toLowerCase()!=="map"?!1:(o=e("img[usemap=#"+i+"]")[0],!!o&&s(o))):(/input|select|textarea|button|object/.test(u)?!t.disabled:"a"===u?t.href||n:n)&&s(t)}function s(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return e.css(this,"visibility")==="hidden"}).length}var n=0,r=/^ui-id-\d+$/;e.ui=e.ui||{};if(e.ui.version)return;e.extend(e.ui,{version:"1.10.1",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({_focus:e.fn.focus,focus:function(t,n){return typeof t=="number"?this.each(function(){var r=this;setTimeout(function(){e(r).focus(),n&&n.call(r)},t)}):this._focus.apply(this,arguments)},scrollParent:function(){var t;return e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?t=this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):t=this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(document):t},zIndex:function(n){if(n!==t)return this.css("zIndex",n);if(this.length){var r=e(this[0]),i,s;while(r.length&&r[0]!==document){i=r.css("position");if(i==="absolute"||i==="relative"||i==="fixed"){s=parseInt(r.css("zIndex"),10);if(!isNaN(s)&&s!==0)return s}r=r.parent()}}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++n)})},removeUniqueId:function(){return this.each(function(){r.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(n){return!!e.data(n,t)}}):function(t,n,r){return!!e.data(t,r[3])},focusable:function(t){return i(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var n=e.attr(t,"tabindex"),r=isNaN(n);return(r||n>=0)&&i(t,!r)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(n,r){function u(t,n,r,s){return e.each(i,function(){n-=parseFloat(e.css(t,"padding"+this))||0,r&&(n-=parseFloat(e.css(t,"border"+this+"Width"))||0),s&&(n-=parseFloat(e.css(t,"margin"+this))||0)}),n}var i=r==="Width"?["Left","Right"]:["Top","Bottom"],s=r.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+r]=function(n){return n===t?o["inner"+r].call(this):this.each(function(){e(this).css(s,u(this,n)+"px")})},e.fn["outer"+r]=function(t,n){return typeof t!="number"?o["outer"+r].call(this,t):this.each(function(){e(this).css(s,u(this,t,!0,n)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(e==null?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(n){return arguments.length?t.call(this,e.camelCase(n)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.support.selectstart="onselectstart"in document.createElement("div"),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),e.extend(e.ui,{plugin:{add:function(t,n,r){var i,s=e.ui[t].prototype;for(i in r)s.plugins[i]=s.plugins[i]||[],s.plugins[i].push([n,r[i]])},call:function(e,t,n){var r,i=e.plugins[t];if(!i||!e.element[0].parentNode||e.element[0].parentNode.nodeType===11)return;for(r=0;r<i.length;r++)e.options[i[r][0]]&&i[r][1].apply(e.element,n)}},hasScroll:function(t,n){if(e(t).css("overflow")==="hidden")return!1;var r=n&&n==="left"?"scrollLeft":"scrollTop",i=!1;return t[r]>0?!0:(t[r]=1,i=t[r]>0,t[r]=0,i)}})})(jQuery);
/*!
 * jQuery Cookie Plugin v1.3
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function ($, document, undefined) {
	var pluses = /\+/g;

	function raw(s) {
		return s;
	}

	function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
	}

	var config = $.cookie = function (key, value, options) {
		// write
		if (value !== undefined) {
			options = $.extend({}, config.defaults, options);

			if (value === null) {
				options.expires = -1;
			}

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = config.json ? JSON.stringify(value) : String(value);

			return (document.cookie = [
				encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// read
		var decode = config.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			if (decode(parts.shift()) === key) {
				var cookie = decode(parts.join('='));
				return config.json ? JSON.parse(cookie) : cookie;
			}
		}

		return null;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== null) {
			$.cookie(key, null, options);
			return true;
		}
		return false;
	};
})(jQuery, document);
;
(function ($) { /*******************************************************************************************/
    // jquery.pajinate.js - version 0.4
    // A jQuery plugin for paginating through any number of DOM elements
    // 
    // Copyright (c) 2010, Wes Nolte (http://wesnolte.com)
    // Licensed under the MIT License (MIT-LICENSE.txt)
    // http://www.opensource.org/licenses/mit-license.php
    // Created: 2010-04-16 | Updated: 2010-04-26
    //
    /*******************************************************************************************/

    $.fn.pajinate = function (options) {
        // Set some state information
        var current_page = 'current_page';
        var items_per_page = 'items_per_page';

        var meta;

        // Setup default option values
        var defaults = {
            item_container_id: '.content',
            items_per_page: 10,
            nav_panel_id: '.page_navigation',
            nav_info_id: '.info_text',
            num_page_links_to_display: 20,
            start_page: 0,
            wrap_around: false,
            nav_label_first: 'First',
            nav_label_prev: 'Prev',
            nav_label_next: 'Next',
            nav_label_last: 'Last',
            nav_order: ["first", "prev", "num", "next", "last"],
            nav_label_info: 'Showing {0}-{1} of {2} results',
            show_first_last: true,
            abort_on_small_lists: false,
            jquery_ui: false,
            jquery_ui_active: "ui-state-highlight",
            jquery_ui_default: "ui-state-default",
            jquery_ui_disabled: "ui-state-disabled"
        };

        var options = $.extend(defaults, options);
        var $item_container;
        var $page_container;
        var $items;
        var $nav_panels;
        var total_page_no_links;
        var jquery_ui_default_class = options.jquery_ui ? options.jquery_ui_default : '';
        var jquery_ui_active_class = options.jquery_ui ? options.jquery_ui_active : '';
        var jquery_ui_disabled_class = options.jquery_ui ? options.jquery_ui_disabled : '';

        return this.each(function () {
            $page_container = $(this);
            $item_container = $(this).find(options.item_container_id);
            $items = $page_container.find(options.item_container_id).children();

            if (options.abort_on_small_lists && options.items_per_page >= $items.size()) return $page_container;

            meta = $page_container;

            // Initialize meta data
            meta.data(current_page, 0);
            meta.data(items_per_page, options.items_per_page);

            // Get the total number of items
            var total_items = $item_container.children().size();

            // Calculate the number of pages needed
            var number_of_pages = Math.ceil(total_items / options.items_per_page);

            // Construct the nav bar
            var more = '<span class="ellipse more">...</span>';
            var less = '<span class="ellipse less">...</span>';
            var first = !options.show_first_last ? '' : '<a class="first_link ' + jquery_ui_default_class + '" href="">' + options.nav_label_first + '</a>';
            var last = !options.show_first_last ? '' : '<a class="last_link ' + jquery_ui_default_class + '" href="">' + options.nav_label_last + '</a>';

            var navigation_html = "";

            for (var i = 0; i < options.nav_order.length; i++) {
                switch (options.nav_order[i]) {
                    case "first":
                        navigation_html += first;
                        break;
                    case "last":
                        navigation_html += last;
                        break;
                    case "next":
                        navigation_html += '<a id="next-link" class="next_link hide-text ' + jquery_ui_default_class + '" href="">' + options.nav_label_next + '</a>';
                        break;
                    case "prev":
                        navigation_html += '<a id="prev-link" class="previous_link hide-text ' + jquery_ui_default_class + '" href="">' + options.nav_label_prev + '</a>';
                        break;
                    case "num":
                        navigation_html += less;
                        var current_link = 0;
                        while (number_of_pages > current_link) {
                            navigation_html += '<a class="page_link ' + jquery_ui_default_class + '" href="" data-longdesc="' + current_link + '">' + (current_link + 1) + '</a>';
                            current_link++;
                        }
                        navigation_html += more;
                        break;
                    default:
                        break;
                }

            }

            // And add it to the appropriate area of the DOM	
            $nav_panels = $page_container.find(options.nav_panel_id);
            $nav_panels.html(navigation_html).each(function () {

                $(this).find('.page_link:first').addClass('first');
                $(this).find('.page_link:last').addClass('last');

            });

            // Hide the more/less indicators
            $nav_panels.children('.ellipse').hide();

            // Set the active page link styling
            $nav_panels.find('.previous_link').next().next().addClass('active_page ' + jquery_ui_active_class);

            /* Setup Page Display */
            // And hide all pages
            $items.hide();
            // Show the first page			
            $items.slice(0, meta.data(items_per_page)).show();

            /* Setup Nav Menu Display */
            // Page number slices
            total_page_no_links = $page_container.find(options.nav_panel_id + ':first').children('.page_link').size();
            options.num_page_links_to_display = Math.min(options.num_page_links_to_display, total_page_no_links);

            $nav_panels.children('.page_link').hide(); // Hide all the page links
            // And only show the number we should be seeing
            $nav_panels.each(function () {
                $(this).children('.page_link').slice(0, options.num_page_links_to_display).show();
            });

            /* Bind the actions to their respective links */

            // Event handler for 'First' link
            $page_container.find('.first_link').click(function (e) {
                e.preventDefault();

                movePageNumbersRight($(this), 0);
                gotopage(0);
            });

            // Event handler for 'Last' link
            $page_container.find('.last_link').click(function (e) {
                e.preventDefault();
                var lastPage = total_page_no_links - 1;
                movePageNumbersLeft($(this), lastPage);
                gotopage(lastPage);
            });

            // Event handler for 'Prev' link
            $page_container.find('.previous_link').click(function (e) {
                e.preventDefault();
                showPrevPage($(this));
            });


            // Event handler for 'Next' link
            $page_container.find('.next_link').click(function (e) {
                e.preventDefault();
                showNextPage($(this));
            });

            // Event handler for each 'Page' link
            $page_container.find('.page_link').click(function (e) {
                e.preventDefault();
                gotopage($(this).attr('data-longdesc'));
            });

            // Goto the required page
            gotopage(parseInt(options.start_page));
            toggleMoreLess();
            if (!options.wrap_around) tagNextPrev();
        });

        function showPrevPage(e) {
            new_page = parseInt(meta.data(current_page)) - 1;

            // Check that we aren't on a boundary link
            if ($(e).siblings('.active_page').prev('.page_link').length == true) {
                movePageNumbersRight(e, new_page);
                gotopage(new_page);
            }
            else if (options.wrap_around) {
                gotopage(total_page_no_links - 1);
            }

        };

        function showNextPage(e) {
            new_page = parseInt(meta.data(current_page)) + 1;

            // Check that we aren't on a boundary link
            if ($(e).siblings('.active_page').next('.page_link').length == true) {
                movePageNumbersLeft(e, new_page);
                gotopage(new_page);
            }
            else if (options.wrap_around) {
                gotopage(0);
            }

        };

        function gotopage(page_num) {

            page_num = parseInt(page_num, 10)

            var ipp = parseInt(meta.data(items_per_page));

            // Find the start of the next slice
            start_from = page_num * ipp;

            // Find the end of the next slice
            end_on = start_from + ipp;
            // Hide the current page	
            var items = $items.hide().slice(start_from, end_on);

            items.show();

            // Reassign the active class
            $page_container.find(options.nav_panel_id).children('.page_link[data-longdesc=' + page_num + ']').addClass('active_page ' + jquery_ui_active_class).siblings('.active_page').removeClass('active_page ' + jquery_ui_active_class);

            // Set the current page meta data							
            meta.data(current_page, page_num);
            /*########## Ajout de l'option page courante + nombre de pages*/
            var $current_page = parseInt(meta.data(current_page) + 1);
            // Get the total number of items
            var total_items = $item_container.children().size();
            // Calculate the number of pages needed
            var $number_of_pages = Math.ceil(total_items / options.items_per_page);
            /*##################################################################*/
            $page_container.find(options.nav_info_id).html(options.nav_label_info.replace("{0}", start_from + 1).
			replace("{1}", start_from + items.length).replace("{2}", $items.length).replace("{3}", $current_page).replace("{4}", $number_of_pages));

            // Hide the more and/or less indicators
            toggleMoreLess();

            // Add a class to the next or prev links if there are no more pages next or previous to the active page
            tagNextPrev();

            // check if the onPage callback is available and call it
            if (typeof (options.onPageDisplayed) !== "undefined") {
                options.onPageDisplayed.call(this, page_num + 1)
            }

        }

        // Methods to shift the diplayed index of page numbers to the left or right


        function movePageNumbersLeft(e, new_p) {
            var new_page = new_p;

            var $current_active_link = $(e).siblings('.active_page');

            if ($current_active_link.siblings('.page_link[data-longdesc=' + new_page + ']').css('display') == 'none') {

                $nav_panels.each(function () {
                    $(this).children('.page_link').hide() // Hide all the page links
					.slice(parseInt(new_page - options.num_page_links_to_display + 1), new_page + 1).show();
                });
            }

        }

        function movePageNumbersRight(e, new_p) {
            var new_page = new_p;

            var $current_active_link = $(e).siblings('.active_page');

            if ($current_active_link.siblings('.page_link[data-longdesc=' + new_page + ']').css('display') == 'none') {

                $nav_panels.each(function () {
                    $(this).children('.page_link').hide() // Hide all the page links
					.slice(new_page, new_page + parseInt(options.num_page_links_to_display)).show();
                });
            }
        }

        // Show or remove the ellipses that indicate that more page numbers exist in the page index than are currently shown


        function toggleMoreLess() {

            if (!$nav_panels.children('.page_link:visible').hasClass('last')) {
                $nav_panels.children('.more').show();
            }
            else {
                $nav_panels.children('.more').hide();
            }

            if (!$nav_panels.children('.page_link:visible').hasClass('first')) {
                $nav_panels.children('.less').show();
            }
            else {
                $nav_panels.children('.less').hide();
            }
        }

        /* Add the style class ".no_more" to the first/prev and last/next links to allow custom styling */

        function tagNextPrev() {
            if ($nav_panels.children('.last').hasClass('active_page')) {
                $nav_panels.children('.next_link').add('.last_link').addClass('no_more ' + jquery_ui_disabled_class);
            }
            else {
                $nav_panels.children('.next_link').add('.last_link').removeClass('no_more ' + jquery_ui_disabled_class);
            }

            if ($nav_panels.children('.first').hasClass('active_page')) {
                $nav_panels.children('.previous_link').add('.first_link').addClass('no_more ' + jquery_ui_disabled_class);
            }
            else {
                $nav_panels.children('.previous_link').add('.first_link').removeClass('no_more ' + jquery_ui_disabled_class);
            }
        }

    };

})(jQuery);

/* ============================================================================
 * jquery.clearsearch.js v1.0.1
 * https://github.com/waslos/jquery-clearsearch
 * ============================================================================
 * Copyright (c) 2012, Was los.de GmbH & Co. KG
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the "Was los.de GmbH & Co. KG" nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 * ========================================================================= */
(function ($) {
    $.fn.clearSearch = function (options) {
        var settings = $.extend({
            'clearClass': 'clear_input',
            'divClass': this.clearClass + '_div',
            'focusAfterClear': true,
            'linkText': '&times;',
            'distanceFromEdge': 5
        }, options);
        return this.each(function () {
            var $this = $(this), btn;

            if (!$this.parent().hasClass(settings.divClass)) {
                $this.wrap('<div style="position: relative;" class="'
                    + settings.divClass + '">' + $this.html() + '</div>');
                $this.after('<a href="javascript:void(0)" style="position: absolute; cursor: pointer;" class="'
                    + settings.clearClass + '">' + settings.linkText + '</a>');
            }
            btn = $this.next();

            function clearField() {
                $this.val('').change();
                triggerBtn();
                if (settings.focusAfterClear) {
                    $this.focus();
                }
                if (typeof (settings.callback) === "function") {
                    settings.callback();
                }
            }

            function triggerBtn() {
                if (hasText()) {
                    btn.show();
                } else {
                    btn.hide();
                }
                update();
            }

            function hasText() {
                return $this.val().replace(/^\s+|\s+$/g, '').length > 0;
            }

            function update() {
                var height = $this.outerHeight();
                btn.css({
                    top: height / 2 - btn.height() / 2,
                    right: settings.distanceFromEdge
                });
            }

            btn.on('click', clearField);
            $this.on('keyup keydown change focus', triggerBtn);
            triggerBtn();
        });
    };
})(jQuery);
/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */



var Hogan = {};

(function (Hogan, useArrayBuffer) {
  Hogan.Template = function (renderFunc, text, compiler, options) {
    this.r = renderFunc || this.r;
    this.c = compiler;
    this.options = options;
    this.text = text || '';
    this.buf = (useArrayBuffer) ? [] : '';
  }

  Hogan.Template.prototype = {
    // render: replaced by generated code.
    r: function (context, partials, indent) { return ''; },

    // variable escaping
    v: hoganEscape,

    // triple stache
    t: coerceToString,

    render: function render(context, partials, indent) {
      return this.ri([context], partials || {}, indent);
    },

    // render internal -- a hook for overrides that catches partials too
    ri: function (context, partials, indent) {
      return this.r(context, partials, indent);
    },

    // tries to find a partial in the curent scope and render it
    rp: function(name, context, partials, indent) {
      var partial = partials[name];

      if (!partial) {
        return '';
      }

      if (this.c && typeof partial == 'string') {
        partial = this.c.compile(partial, this.options);
      }

      return partial.ri(context, partials, indent);
    },

    // render a section
    rs: function(context, partials, section) {
      var tail = context[context.length - 1];

      if (!isArray(tail)) {
        section(context, partials, this);
        return;
      }

      for (var i = 0; i < tail.length; i++) {
        context.push(tail[i]);
        section(context, partials, this);
        context.pop();
      }
    },

    // maybe start a section
    s: function(val, ctx, partials, inverted, start, end, tags) {
      var pass;

      if (isArray(val) && val.length === 0) {
        return false;
      }

      if (typeof val == 'function') {
        val = this.ls(val, ctx, partials, inverted, start, end, tags);
      }

      pass = (val === '') || !!val;

      if (!inverted && pass && ctx) {
        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
      }

      return pass;
    },

    // find values with dotted names
    d: function(key, ctx, partials, returnFound) {
      var names = key.split('.'),
          val = this.f(names[0], ctx, partials, returnFound),
          cx = null;

      if (key === '.' && isArray(ctx[ctx.length - 2])) {
        return ctx[ctx.length - 1];
      }

      for (var i = 1; i < names.length; i++) {
        if (val && typeof val == 'object' && names[i] in val) {
          cx = val;
          val = val[names[i]];
        } else {
          val = '';
        }
      }

      if (returnFound && !val) {
        return false;
      }

      if (!returnFound && typeof val == 'function') {
        ctx.push(cx);
        val = this.lv(val, ctx, partials);
        ctx.pop();
      }

      return val;
    },

    // find values with normal names
    f: function(key, ctx, partials, returnFound) {
      var val = false,
          v = null,
          found = false;

      for (var i = ctx.length - 1; i >= 0; i--) {
        v = ctx[i];
        if (v && typeof v == 'object' && key in v) {
          val = v[key];
          found = true;
          break;
        }
      }

      if (!found) {
        return (returnFound) ? false : "";
      }

      if (!returnFound && typeof val == 'function') {
        val = this.lv(val, ctx, partials);
      }

      return val;
    },

    // higher order templates
    ho: function(val, cx, partials, text, tags) {
      var compiler = this.c;
      var options = this.options;
      options.delimiters = tags;
      var text = val.call(cx, text);
      text = (text == null) ? String(text) : text.toString();
      this.b(compiler.compile(text, options).render(cx, partials));
      return false;
    },

    // template result buffering
    b: (useArrayBuffer) ? function(s) { this.buf.push(s); } :
                          function(s) { this.buf += s; },
    fl: (useArrayBuffer) ? function() { var r = this.buf.join(''); this.buf = []; return r; } :
                           function() { var r = this.buf; this.buf = ''; return r; },

    // lambda replace section
    ls: function(val, ctx, partials, inverted, start, end, tags) {
      var cx = ctx[ctx.length - 1],
          t = null;

      if (!inverted && this.c && val.length > 0) {
        return this.ho(val, cx, partials, this.text.substring(start, end), tags);
      }

      t = val.call(cx);

      if (typeof t == 'function') {
        if (inverted) {
          return true;
        } else if (this.c) {
          return this.ho(t, cx, partials, this.text.substring(start, end), tags);
        }
      }

      return t;
    },

    // lambda replace variable
    lv: function(val, ctx, partials) {
      var cx = ctx[ctx.length - 1];
      var result = val.call(cx);

      if (typeof result == 'function') {
        result = coerceToString(result.call(cx));
        if (this.c && ~result.indexOf("{\u007B")) {
          return this.c.compile(result, this.options).render(cx, partials);
        }
      }

      return coerceToString(result);
    }

  };

  var rAmp = /&/g,
      rLt = /</g,
      rGt = />/g,
      rApos =/\'/g,
      rQuot = /\"/g,
      hChars =/[&<>\"\']/;


  function coerceToString(val) {
    return String((val === null || val === undefined) ? '' : val);
  }

  function hoganEscape(str) {
    str = coerceToString(str);
    return hChars.test(str) ?
      str
        .replace(rAmp,'&amp;')
        .replace(rLt,'&lt;')
        .replace(rGt,'&gt;')
        .replace(rApos,'&#39;')
        .replace(rQuot, '&quot;') :
      str;
  }

  var isArray = Array.isArray || function(a) {
    return Object.prototype.toString.call(a) === '[object Array]';
  };

})(typeof exports !== 'undefined' ? exports : Hogan);




(function (Hogan) {
  // Setup regex  assignments
  // remove whitespace according to Mustache spec
  var rIsWhitespace = /\S/,
      rQuot = /\"/g,
      rNewline =  /\n/g,
      rCr = /\r/g,
      rSlash = /\\/g,
      tagTypes = {
        '#': 1, '^': 2, '/': 3,  '!': 4, '>': 5,
        '<': 6, '=': 7, '_v': 8, '{': 9, '&': 10
      };

  Hogan.scan = function scan(text, delimiters) {
    var len = text.length,
        IN_TEXT = 0,
        IN_TAG_TYPE = 1,
        IN_TAG = 2,
        state = IN_TEXT,
        tagType = null,
        tag = null,
        buf = '',
        tokens = [],
        seenTag = false,
        i = 0,
        lineStart = 0,
        otag = '{{',
        ctag = '}}';

    function addBuf() {
      if (buf.length > 0) {
        tokens.push(new String(buf));
        buf = '';
      }
    }

    function lineIsWhitespace() {
      var isAllWhitespace = true;
      for (var j = lineStart; j < tokens.length; j++) {
        isAllWhitespace =
          (tokens[j].tag && tagTypes[tokens[j].tag] < tagTypes['_v']) ||
          (!tokens[j].tag && tokens[j].match(rIsWhitespace) === null);
        if (!isAllWhitespace) {
          return false;
        }
      }

      return isAllWhitespace;
    }

    function filterLine(haveSeenTag, noNewLine) {
      addBuf();

      if (haveSeenTag && lineIsWhitespace()) {
        for (var j = lineStart, next; j < tokens.length; j++) {
          if (!tokens[j].tag) {
            if ((next = tokens[j+1]) && next.tag == '>') {
              // set indent to token value
              next.indent = tokens[j].toString()
            }
            tokens.splice(j, 1);
          }
        }
      } else if (!noNewLine) {
        tokens.push({tag:'\n'});
      }

      seenTag = false;
      lineStart = tokens.length;
    }

    function changeDelimiters(text, index) {
      var close = '=' + ctag,
          closeIndex = text.indexOf(close, index),
          delimiters = trim(
            text.substring(text.indexOf('=', index) + 1, closeIndex)
          ).split(' ');

      otag = delimiters[0];
      ctag = delimiters[1];

      return closeIndex + close.length - 1;
    }

    if (delimiters) {
      delimiters = delimiters.split(' ');
      otag = delimiters[0];
      ctag = delimiters[1];
    }

    for (i = 0; i < len; i++) {
      if (state == IN_TEXT) {
        if (tagChange(otag, text, i)) {
          --i;
          addBuf();
          state = IN_TAG_TYPE;
        } else {
          if (text.charAt(i) == '\n') {
            filterLine(seenTag);
          } else {
            buf += text.charAt(i);
          }
        }
      } else if (state == IN_TAG_TYPE) {
        i += otag.length - 1;
        tag = tagTypes[text.charAt(i + 1)];
        tagType = tag ? text.charAt(i + 1) : '_v';
        if (tagType == '=') {
          i = changeDelimiters(text, i);
          state = IN_TEXT;
        } else {
          if (tag) {
            i++;
          }
          state = IN_TAG;
        }
        seenTag = i;
      } else {
        if (tagChange(ctag, text, i)) {
          tokens.push({tag: tagType, n: trim(buf), otag: otag, ctag: ctag,
                       i: (tagType == '/') ? seenTag - ctag.length : i + otag.length});
          buf = '';
          i += ctag.length - 1;
          state = IN_TEXT;
          if (tagType == '{') {
            if (ctag == '}}') {
              i++;
            } else {
              cleanTripleStache(tokens[tokens.length - 1]);
            }
          }
        } else {
          buf += text.charAt(i);
        }
      }
    }

    filterLine(seenTag, true);

    return tokens;
  }

  function cleanTripleStache(token) {
    if (token.n.substr(token.n.length - 1) === '}') {
      token.n = token.n.substring(0, token.n.length - 1);
    }
  }

  function trim(s) {
    if (s.trim) {
      return s.trim();
    }

    return s.replace(/^\s*|\s*$/g, '');
  }

  function tagChange(tag, text, index) {
    if (text.charAt(index) != tag.charAt(0)) {
      return false;
    }

    for (var i = 1, l = tag.length; i < l; i++) {
      if (text.charAt(index + i) != tag.charAt(i)) {
        return false;
      }
    }

    return true;
  }

  function buildTree(tokens, kind, stack, customTags) {
    var instructions = [],
        opener = null,
        token = null;

    while (tokens.length > 0) {
      token = tokens.shift();
      if (token.tag == '#' || token.tag == '^' || isOpener(token, customTags)) {
        stack.push(token);
        token.nodes = buildTree(tokens, token.tag, stack, customTags);
        instructions.push(token);
      } else if (token.tag == '/') {
        if (stack.length === 0) {
          throw new Error('Closing tag without opener: /' + token.n);
        }
        opener = stack.pop();
        if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
          throw new Error('Nesting error: ' + opener.n + ' vs. ' + token.n);
        }
        opener.end = token.i;
        return instructions;
      } else {
        instructions.push(token);
      }
    }

    if (stack.length > 0) {
      throw new Error('missing closing tag: ' + stack.pop().n);
    }

    return instructions;
  }

  function isOpener(token, tags) {
    for (var i = 0, l = tags.length; i < l; i++) {
      if (tags[i].o == token.n) {
        token.tag = '#';
        return true;
      }
    }
  }

  function isCloser(close, open, tags) {
    for (var i = 0, l = tags.length; i < l; i++) {
      if (tags[i].c == close && tags[i].o == open) {
        return true;
      }
    }
  }

  Hogan.generate = function (tree, text, options) {
    var code = 'var _=this;_.b(i=i||"");' + walk(tree) + 'return _.fl();';
    if (options.asString) {
      return 'function(c,p,i){' + code + ';}';
    }

    return new Hogan.Template(new Function('c', 'p', 'i', code), text, Hogan, options);
  }

  function esc(s) {
    return s.replace(rSlash, '\\\\')
            .replace(rQuot, '\\\"')
            .replace(rNewline, '\\n')
            .replace(rCr, '\\r');
  }

  function chooseMethod(s) {
    return (~s.indexOf('.')) ? 'd' : 'f';
  }

  function walk(tree) {
    var code = '';
    for (var i = 0, l = tree.length; i < l; i++) {
      var tag = tree[i].tag;
      if (tag == '#') {
        code += section(tree[i].nodes, tree[i].n, chooseMethod(tree[i].n),
                        tree[i].i, tree[i].end, tree[i].otag + " " + tree[i].ctag);
      } else if (tag == '^') {
        code += invertedSection(tree[i].nodes, tree[i].n,
                                chooseMethod(tree[i].n));
      } else if (tag == '<' || tag == '>') {
        code += partial(tree[i]);
      } else if (tag == '{' || tag == '&') {
        code += tripleStache(tree[i].n, chooseMethod(tree[i].n));
      } else if (tag == '\n') {
        code += text('"\\n"' + (tree.length-1 == i ? '' : ' + i'));
      } else if (tag == '_v') {
        code += variable(tree[i].n, chooseMethod(tree[i].n));
      } else if (tag === undefined) {
        code += text('"' + esc(tree[i]) + '"');
      }
    }
    return code;
  }

  function section(nodes, id, method, start, end, tags) {
    return 'if(_.s(_.' + method + '("' + esc(id) + '",c,p,1),' +
           'c,p,0,' + start + ',' + end + ',"' + tags + '")){' +
           '_.rs(c,p,' +
           'function(c,p,_){' +
           walk(nodes) +
           '});c.pop();}';
  }

  function invertedSection(nodes, id, method) {
    return 'if(!_.s(_.' + method + '("' + esc(id) + '",c,p,1),c,p,1,0,0,"")){' +
           walk(nodes) +
           '};';
  }

  function partial(tok) {
    return '_.b(_.rp("' +  esc(tok.n) + '",c,p,"' + (tok.indent || '') + '"));';
  }

  function tripleStache(id, method) {
    return '_.b(_.t(_.' + method + '("' + esc(id) + '",c,p,0)));';
  }

  function variable(id, method) {
    return '_.b(_.v(_.' + method + '("' + esc(id) + '",c,p,0)));';
  }

  function text(id) {
    return '_.b(' + id + ');';
  }

  Hogan.parse = function(tokens, text, options) {
    options = options || {};
    return buildTree(tokens, '', [], options.sectionTags || []);
  },

  Hogan.cache = {};

  Hogan.compile = function(text, options) {
    // options
    //
    // asString: false (default)
    //
    // sectionTags: [{o: '_foo', c: 'foo'}]
    // An array of object with o and c fields that indicate names for custom
    // section tags. The example above allows parsing of {{_foo}}{{/foo}}.
    //
    // delimiters: A string that overrides the default delimiters.
    // Example: "<% %>"
    //
    options = options || {};

    var key = text + '||' + !!options.asString;

    var t = this.cache[key];

    if (t) {
      return t;
    }

    t = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);
    return this.cache[key] = t;
  };
})(typeof exports !== 'undefined' ? exports : Hogan);


/*!
 * typeahead.js 0.9.3
 * https://github.com/twitter/typeahead
 * Copyright 2013 Twitter, Inc. and other contributors; Licensed MIT
 */

(function($) {
    var VERSION = "0.9.3";
    var utils = {
        isMsie: function() {
            var match = /(msie) ([\w.]+)/i.exec(navigator.userAgent);
            return match ? parseInt(match[2], 10) : false;
        },
        isBlankString: function(str) {
            return !str || /^\s*$/.test(str);
        },
        escapeRegExChars: function(str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        },
        isString: function(obj) {
            return typeof obj === "string";
        },
        isNumber: function(obj) {
            return typeof obj === "number";
        },
        isArray: $.isArray,
        isFunction: $.isFunction,
        isObject: $.isPlainObject,
        isUndefined: function(obj) {
            return typeof obj === "undefined";
        },
        bind: $.proxy,
        bindAll: function(obj) {
            var val;
            for (var key in obj) {
                $.isFunction(val = obj[key]) && (obj[key] = $.proxy(val, obj));
            }
        },
        indexOf: function(haystack, needle) {
            for (var i = 0; i < haystack.length; i++) {
                if (haystack[i] === needle) {
                    return i;
                }
            }
            return -1;
        },
        each: $.each,
        map: $.map,
        filter: $.grep,
        every: function(obj, test) {
            var result = true;
            if (!obj) {
                return result;
            }
            $.each(obj, function(key, val) {
                if (!(result = test.call(null, val, key, obj))) {
                    return false;
                }
            });
            return !!result;
        },
        some: function(obj, test) {
            var result = false;
            if (!obj) {
                return result;
            }
            $.each(obj, function(key, val) {
                if (result = test.call(null, val, key, obj)) {
                    return false;
                }
            });
            return !!result;
        },
        mixin: $.extend,
        getUniqueId: function() {
            var counter = 0;
            return function() {
                return counter++;
            };
        }(),
        defer: function(fn) {
            setTimeout(fn, 0);
        },
        debounce: function(func, wait, immediate) {
            var timeout, result;
            return function() {
                var context = this, args = arguments, later, callNow;
                later = function() {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                    }
                };
                callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    result = func.apply(context, args);
                }
                return result;
            };
        },
        throttle: function(func, wait) {
            var context, args, timeout, result, previous, later;
            previous = 0;
            later = function() {
                previous = new Date();
                timeout = null;
                result = func.apply(context, args);
            };
            return function() {
                var now = new Date(), remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                } else if (!timeout) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },
        tokenizeQuery: function(str) {
            return $.trim(str).toLowerCase().split(/[\s]+/);
        },
        tokenizeText: function(str) {
            return $.trim(str).toLowerCase().split(/[\s\-_]+/);
        },
        getProtocol: function() {
            return location.protocol;
        },
        noop: function() {}
    };
    var EventTarget = function() {
        var eventSplitter = /\s+/;
        return {
            on: function(events, callback) {
                var event;
                if (!callback) {
                    return this;
                }
                this._callbacks = this._callbacks || {};
                events = events.split(eventSplitter);
                while (event = events.shift()) {
                    this._callbacks[event] = this._callbacks[event] || [];
                    this._callbacks[event].push(callback);
                }
                return this;
            },
            trigger: function(events, data) {
                var event, callbacks;
                if (!this._callbacks) {
                    return this;
                }
                events = events.split(eventSplitter);
                while (event = events.shift()) {
                    if (callbacks = this._callbacks[event]) {
                        for (var i = 0; i < callbacks.length; i += 1) {
                            callbacks[i].call(this, {
                                type: event,
                                data: data
                            });
                        }
                    }
                }
                return this;
            }
        };
    }();
    var EventBus = function() {
        var namespace = "typeahead:";
        function EventBus(o) {
            if (!o || !o.el) {
                $.error("EventBus initialized without el");
            }
            this.$el = $(o.el);
        }
        utils.mixin(EventBus.prototype, {
            trigger: function(type) {
                var args = [].slice.call(arguments, 1);
                this.$el.trigger(namespace + type, args);
            }
        });
        return EventBus;
    }();
    var PersistentStorage = function() {
        var ls, methods;
        try {
            ls = window.localStorage;
            ls.setItem("~~~", "!");
            ls.removeItem("~~~");
        } catch (err) {
            ls = null;
        }
        function PersistentStorage(namespace) {
            this.prefix = [ "__", namespace, "__" ].join("");
            this.ttlKey = "__ttl__";
            this.keyMatcher = new RegExp("^" + this.prefix);
        }
        if (ls && window.JSON) {
            methods = {
                _prefix: function(key) {
                    return this.prefix + key;
                },
                _ttlKey: function(key) {
                    return this._prefix(key) + this.ttlKey;
                },
                get: function(key) {
                    if (this.isExpired(key)) {
                        this.remove(key);
                    }
                    return decode(ls.getItem(this._prefix(key)));
                },
                set: function(key, val, ttl) {
                    if (utils.isNumber(ttl)) {
                        ls.setItem(this._ttlKey(key), encode(now() + ttl));
                    } else {
                        ls.removeItem(this._ttlKey(key));
                    }
                    return ls.setItem(this._prefix(key), encode(val));
                },
                remove: function(key) {
                    ls.removeItem(this._ttlKey(key));
                    ls.removeItem(this._prefix(key));
                    return this;
                },
                clear: function() {
                    var i, key, keys = [], len = ls.length;
                    for (i = 0; i < len; i++) {
                        if ((key = ls.key(i)).match(this.keyMatcher)) {
                            keys.push(key.replace(this.keyMatcher, ""));
                        }
                    }
                    for (i = keys.length; i--; ) {
                        this.remove(keys[i]);
                    }
                    return this;
                },
                isExpired: function(key) {
                    var ttl = decode(ls.getItem(this._ttlKey(key)));
                    return utils.isNumber(ttl) && now() > ttl ? true : false;
                }
            };
        } else {
            methods = {
                get: utils.noop,
                set: utils.noop,
                remove: utils.noop,
                clear: utils.noop,
                isExpired: utils.noop
            };
        }
        utils.mixin(PersistentStorage.prototype, methods);
        return PersistentStorage;
        function now() {
            return new Date().getTime();
        }
        function encode(val) {
            return JSON.stringify(utils.isUndefined(val) ? null : val);
        }
        function decode(val) {
            return JSON.parse(val);
        }
    }();
    var RequestCache = function() {
        function RequestCache(o) {
            utils.bindAll(this);
            o = o || {};
            this.sizeLimit = o.sizeLimit || 10;
            this.cache = {};
            this.cachedKeysByAge = [];
        }
        utils.mixin(RequestCache.prototype, {
            get: function(url) {
                return this.cache[url];
            },
            set: function(url, resp) {
                var requestToEvict;
                if (this.cachedKeysByAge.length === this.sizeLimit) {
                    requestToEvict = this.cachedKeysByAge.shift();
                    delete this.cache[requestToEvict];
                }
                this.cache[url] = resp;
                this.cachedKeysByAge.push(url);
            }
        });
        return RequestCache;
    }();
    var Transport = function() {
        var pendingRequestsCount = 0, pendingRequests = {}, maxPendingRequests, requestCache;
        function Transport(o) {
            utils.bindAll(this);
            o = utils.isString(o) ? {
                url: o
            } : o;
            requestCache = requestCache || new RequestCache();
            maxPendingRequests = utils.isNumber(o.maxParallelRequests) ? o.maxParallelRequests : maxPendingRequests || 6;
            this.url = o.url;
            this.wildcard = o.wildcard || "%QUERY";
            this.filter = o.filter;
            this.replace = o.replace;
            this.ajaxSettings = {
                type: "get",
                cache: o.cache,
                timeout: o.timeout,
                dataType: o.dataType || "json",
                beforeSend: o.beforeSend
            };
            this._get = (/^throttle$/i.test(o.rateLimitFn) ? utils.throttle : utils.debounce)(this._get, o.rateLimitWait || 300);
        }
        utils.mixin(Transport.prototype, {
            _get: function(url, cb) {
                var that = this;
                if (belowPendingRequestsThreshold()) {
                    this._sendRequest(url).done(done);
                } else {
                    this.onDeckRequestArgs = [].slice.call(arguments, 0);
                }
                function done(resp) {
                    var data = that.filter ? that.filter(resp) : resp;
                    cb && cb(data);
                    requestCache.set(url, resp);
                }
            },
            _sendRequest: function(url) {
                var that = this, jqXhr = pendingRequests[url];
                if (!jqXhr) {
                    incrementPendingRequests();
                    jqXhr = pendingRequests[url] = $.ajax(url, this.ajaxSettings).always(always);
                }
                return jqXhr;
                function always() {
                    decrementPendingRequests();
                    pendingRequests[url] = null;
                    if (that.onDeckRequestArgs) {
                        that._get.apply(that, that.onDeckRequestArgs);
                        that.onDeckRequestArgs = null;
                    }
                }
            },
            get: function(query, cb) {
                var that = this, encodedQuery = encodeURIComponent(query || ""), url, resp;
                cb = cb || utils.noop;
                url = this.replace ? this.replace(this.url, encodedQuery) : this.url.replace(this.wildcard, encodedQuery);
                if (resp = requestCache.get(url)) {
                    utils.defer(function() {
                        cb(that.filter ? that.filter(resp) : resp);
                    });
                } else {
                    this._get(url, cb);
                }
                return !!resp;
            }
        });
        return Transport;
        function incrementPendingRequests() {
            pendingRequestsCount++;
        }
        function decrementPendingRequests() {
            pendingRequestsCount--;
        }
        function belowPendingRequestsThreshold() {
            return pendingRequestsCount < maxPendingRequests;
        }
    }();
    var Dataset = function() {
        var keys = {
            thumbprint: "thumbprint",
            protocol: "protocol",
            itemHash: "itemHash",
            adjacencyList: "adjacencyList"
        };
        function Dataset(o) {
            utils.bindAll(this);
            if (utils.isString(o.template) && !o.engine) {
                $.error("no template engine specified");
            }
            if (!o.local && !o.prefetch && !o.remote) {
                $.error("one of local, prefetch, or remote is required");
            }
            this.name = o.name || utils.getUniqueId();
            this.limit = o.limit || 5;
            this.minLength = o.minLength === 0 ? 0 : o.minLength || 1;
            this.header = o.header;
            this.footer = o.footer;
            this.valueKey = o.valueKey || "value";
            this.template = compileTemplate(o.template, o.engine, this.valueKey);
            this.local = o.local;
            this.prefetch = o.prefetch;
            this.remote = o.remote;
            this.itemHash = {};
            this.adjacencyList = {};
            this.storage = o.name ? new PersistentStorage(o.name) : null;
        }
        utils.mixin(Dataset.prototype, {
            _processLocalData: function(data) {
                this._mergeProcessedData(this._processData(data));
            },
            _loadPrefetchData: function(o) {
                var that = this, thumbprint = VERSION + (o.thumbprint || ""), storedThumbprint, storedProtocol, storedItemHash, storedAdjacencyList, isExpired, deferred;
                if (this.storage) {
                    storedThumbprint = this.storage.get(keys.thumbprint);
                    storedProtocol = this.storage.get(keys.protocol);
                    storedItemHash = this.storage.get(keys.itemHash);
                    storedAdjacencyList = this.storage.get(keys.adjacencyList);
                }
                isExpired = storedThumbprint !== thumbprint || storedProtocol !== utils.getProtocol();
                o = utils.isString(o) ? {
                    url: o
                } : o;
                o.ttl = utils.isNumber(o.ttl) ? o.ttl : 24 * 60 * 60 * 1e3;
                if (storedItemHash && storedAdjacencyList && !isExpired) {
                    this._mergeProcessedData({
                        itemHash: storedItemHash,
                        adjacencyList: storedAdjacencyList
                    });
                    deferred = $.Deferred().resolve();
                } else {
                    deferred = $.getJSON(o.url).done(processPrefetchData);
                }
                return deferred;
                function processPrefetchData(data) {
                    var filteredData = o.filter ? o.filter(data) : data, processedData = that._processData(filteredData), itemHash = processedData.itemHash, adjacencyList = processedData.adjacencyList;
                    if (that.storage) {
                        that.storage.set(keys.itemHash, itemHash, o.ttl);
                        that.storage.set(keys.adjacencyList, adjacencyList, o.ttl);
                        that.storage.set(keys.thumbprint, thumbprint, o.ttl);
                        that.storage.set(keys.protocol, utils.getProtocol(), o.ttl);
                    }
                    that._mergeProcessedData(processedData);
                }
            },
            _transformDatum: function(datum) {
                var value = utils.isString(datum) ? datum : datum[this.valueKey], tokens = datum.tokens || utils.tokenizeText(value), item = {
                    value: value,
                    tokens: tokens
                };
                if (utils.isString(datum)) {
                    item.datum = {};
                    item.datum[this.valueKey] = datum;
                } else {
                    item.datum = datum;
                }
                item.tokens = utils.filter(item.tokens, function(token) {
                    return !utils.isBlankString(token);
                });
                item.tokens = utils.map(item.tokens, function(token) {
                    return token.toLowerCase();
                });
                return item;
            },
            _processData: function(data) {
                var that = this, itemHash = {}, adjacencyList = {};
                utils.each(data, function(i, datum) {
                    var item = that._transformDatum(datum), id = utils.getUniqueId(item.value);
                    itemHash[id] = item;
                    utils.each(item.tokens, function(i, token) {
                        var character = token.charAt(0), adjacency = adjacencyList[character] || (adjacencyList[character] = [ id ]);
                        !~utils.indexOf(adjacency, id) && adjacency.push(id);
                    });
                });
                return {
                    itemHash: itemHash,
                    adjacencyList: adjacencyList
                };
            },
            _mergeProcessedData: function(processedData) {
                var that = this;
                utils.mixin(this.itemHash, processedData.itemHash);
                utils.each(processedData.adjacencyList, function(character, adjacency) {
                    var masterAdjacency = that.adjacencyList[character];
                    that.adjacencyList[character] = masterAdjacency ? masterAdjacency.concat(adjacency) : adjacency;
                });
            },
            _getLocalSuggestions: function(terms) {
                var that = this, firstChars = [], lists = [], shortestList, suggestions = [];
                utils.each(terms, function(i, term) {
                    var firstChar = term.charAt(0);
                    !~utils.indexOf(firstChars, firstChar) && firstChars.push(firstChar);
                });
                utils.each(firstChars, function(i, firstChar) {
                    var list = that.adjacencyList[firstChar];
                    if (!list) {
                        return false;
                    }
                    lists.push(list);
                    if (!shortestList || list.length < shortestList.length) {
                        shortestList = list;
                    }
                });
                if (lists.length < firstChars.length) {
                    return [];
                }
                utils.each(shortestList, function(i, id) {
                    var item = that.itemHash[id], isCandidate, isMatch;
                    isCandidate = utils.every(lists, function(list) {
                        return ~utils.indexOf(list, id);
                    });
                    isMatch = isCandidate && utils.every(terms, function(term) {
                        return utils.some(item.tokens, function(token) {
                            return token.indexOf(term) === 0;
                        });
                    });
                    isMatch && suggestions.push(item);
                });
                return suggestions;
            },
            initialize: function() {
                var deferred;
                this.local && this._processLocalData(this.local);
                this.transport = this.remote ? new Transport(this.remote) : null;
                deferred = this.prefetch ? this._loadPrefetchData(this.prefetch) : $.Deferred().resolve();
                this.local = this.prefetch = this.remote = null;
                this.initialize = function() {
                    return deferred;
                };
                return deferred;
            },
            getSuggestions: function(query, cb) {
                var that = this, terms, suggestions, cacheHit = false;
                if (query.length < this.minLength) {
                    return;
                }
                terms = utils.tokenizeQuery(query);
                suggestions = this._getLocalSuggestions(terms).slice(0, this.limit);
                if (suggestions.length < this.limit && this.transport) {
                    cacheHit = this.transport.get(query, processRemoteData);
                }
                !cacheHit && cb && cb(suggestions);
                function processRemoteData(data) {
                    suggestions = suggestions.slice(0);
                    utils.each(data, function(i, datum) {
                        var item = that._transformDatum(datum), isDuplicate;
                        isDuplicate = utils.some(suggestions, function(suggestion) {
                            return item.value === suggestion.value;
                        });
                        !isDuplicate && suggestions.push(item);
                        return suggestions.length < that.limit;
                    });
                    cb && cb(suggestions);
                }
            }
        });
        return Dataset;
        function compileTemplate(template, engine, valueKey) {
            var renderFn, compiledTemplate;
            if (utils.isFunction(template)) {
                renderFn = template;
            } else if (utils.isString(template)) {
                compiledTemplate = engine.compile(template);
                renderFn = utils.bind(compiledTemplate.render, compiledTemplate);
            } else {
                renderFn = function(context) {
                    return "<p>" + context[valueKey] + "</p>";
                };
            }
            return renderFn;
        }
    }();
    var InputView = function() {
        function InputView(o) {
            var that = this;
            utils.bindAll(this);
            this.specialKeyCodeMap = {
                9: "tab",
                27: "esc",
                37: "left",
                39: "right",
                13: "enter",
                38: "up",
                40: "down"
            };
            this.$hint = $(o.hint);
            this.$input = $(o.input).on("blur.tt", this._handleBlur).on("focus.tt", this._handleFocus).on("keydown.tt", this._handleSpecialKeyEvent);
            if (!utils.isMsie()) {
                this.$input.on("input.tt", this._compareQueryToInputValue);
            } else {
                this.$input.on("keydown.tt keypress.tt cut.tt paste.tt", function($e) {
                    if (that.specialKeyCodeMap[$e.which || $e.keyCode]) {
                        return;
                    }
                    utils.defer(that._compareQueryToInputValue);
                });
            }
            this.query = this.$input.val();
            this.$overflowHelper = buildOverflowHelper(this.$input);
        }
        utils.mixin(InputView.prototype, EventTarget, {
            _handleFocus: function() {
                this.trigger("focused");
            },
            _handleBlur: function() {
                this.trigger("blured");
            },
            _handleSpecialKeyEvent: function($e) {
                var keyName = this.specialKeyCodeMap[$e.which || $e.keyCode];
                keyName && this.trigger(keyName + "Keyed", $e);
            },
            _compareQueryToInputValue: function() {
                var inputValue = this.getInputValue(), isSameQuery = compareQueries(this.query, inputValue), isSameQueryExceptWhitespace = isSameQuery ? this.query.length !== inputValue.length : false;
                if (isSameQueryExceptWhitespace) {
                    this.trigger("whitespaceChanged", {
                        value: this.query
                    });
                } else if (!isSameQuery) {
                    this.trigger("queryChanged", {
                        value: this.query = inputValue
                    });
                }
            },
            destroy: function() {
                this.$hint.off(".tt");
                this.$input.off(".tt");
                this.$hint = this.$input = this.$overflowHelper = null;
            },
            focus: function() {
                this.$input.focus();
            },
            blur: function() {
                this.$input.blur();
            },
            getQuery: function() {
                return this.query;
            },
            setQuery: function(query) {
                this.query = query;
            },
            getInputValue: function() {
                return this.$input.val();
            },
            setInputValue: function(value, silent) {
                this.$input.val(value);
                !silent && this._compareQueryToInputValue();
            },
            getHintValue: function() {
                return this.$hint.val();
            },
            setHintValue: function(value) {
                this.$hint.val(value);
            },
            hidePlaceholder: function() {
                if (!this.placeholderText) {
                    this.placeholderText = this.$input.attr("placeholder");
                }
                this.$input.attr("placeholder", "");
            },
            showPlaceholder: function() {
                if (this.placeholderText) {
                    this.$input.attr("placeholder", this.placeholderText);
                }
            },
            getLanguageDirection: function() {
                return (this.$input.css("direction") || "ltr").toLowerCase();
            },
            isOverflow: function() {
                this.$overflowHelper.text(this.getInputValue());
                return this.$overflowHelper.width() > this.$input.width();
            },
            isCursorAtEnd: function() {
                var valueLength = this.$input.val().length, selectionStart = this.$input[0].selectionStart, range;
                if (utils.isNumber(selectionStart)) {
                    return selectionStart === valueLength;
                } else if (document.selection) {
                    range = document.selection.createRange();
                    range.moveStart("character", -valueLength);
                    return valueLength === range.text.length;
                }
                return true;
            },
            isCursorAtBeginning: function() {
                var valueLength = this.$input.val().length, selectionStart = this.$input[0].selectionStart, range;
                if (utils.isNumber(selectionStart)) {
                    return selectionStart === 0;
                } else if (document.selection) {
                    range = document.selection.createRange();
                    range.moveStart("character", -valueLength);
                    return range.text.length === 0;
                }
                return true;
            }
        });
        return InputView;
        function buildOverflowHelper($input) {
            return $("<span></span>").css({
                position: "absolute",
                left: "-9999px",
                visibility: "hidden",
                whiteSpace: "nowrap",
                fontFamily: $input.css("font-family"),
                fontSize: $input.css("font-size"),
                fontStyle: $input.css("font-style"),
                fontVariant: $input.css("font-variant"),
                fontWeight: $input.css("font-weight"),
                wordSpacing: $input.css("word-spacing"),
                letterSpacing: $input.css("letter-spacing"),
                textIndent: $input.css("text-indent"),
                textRendering: $input.css("text-rendering"),
                textTransform: $input.css("text-transform")
            }).insertAfter($input);
        }
        function compareQueries(a, b) {
            a = (a || "").replace(/^\s*/g, "").replace(/\s{2,}/g, " ");
            b = (b || "").replace(/^\s*/g, "").replace(/\s{2,}/g, " ");
            return a === b;
        }
    }();
    var DropdownView = function() {
        var html = {
            suggestionsList: '<span class="tt-suggestions"></span>'
        }, css = {
            suggestionsList: {
                display: "block"
            },
            suggestion: {
                whiteSpace: "nowrap",
                cursor: "pointer"
            },
            suggestionChild: {
                whiteSpace: "normal"
            }
        };
        function DropdownView(o) {
            utils.bindAll(this);
            this.isOpen = false;
            this.isEmpty = true;
            this.isMouseOverDropdown = false;
            this.$menu = $(o.menu).on("mouseenter.tt", this._handleMouseenter).on("mouseleave.tt", this._handleMouseleave).on("click.tt", ".tt-suggestion", this._handleSelection).on("mouseover.tt", ".tt-suggestion", this._handleMouseover);
        }
        utils.mixin(DropdownView.prototype, EventTarget, {
            _handleMouseenter: function() {
                this.isMouseOverDropdown = true;
            },
            _handleMouseleave: function() {
                this.isMouseOverDropdown = false;
            },
            _handleMouseover: function($e) {
                var $suggestion = $($e.currentTarget);
                this._getSuggestions().removeClass("tt-is-under-cursor");
                $suggestion.addClass("tt-is-under-cursor");
            },
            _handleSelection: function($e) {
                var $suggestion = $($e.currentTarget);
                this.trigger("suggestionSelected", extractSuggestion($suggestion));
            },
            _show: function() {
                this.$menu.css("display", "block");
            },
            _hide: function() {
                this.$menu.hide();
            },
            _moveCursor: function(increment) {
                var $suggestions, $cur, nextIndex, $underCursor;
                if (!this.isVisible()) {
                    return;
                }
                $suggestions = this._getSuggestions();
                $cur = $suggestions.filter(".tt-is-under-cursor");
                $cur.removeClass("tt-is-under-cursor");
                nextIndex = $suggestions.index($cur) + increment;
                nextIndex = (nextIndex + 1) % ($suggestions.length + 1) - 1;
                if (nextIndex === -1) {
                    this.trigger("cursorRemoved");
                    return;
                } else if (nextIndex < -1) {
                    nextIndex = $suggestions.length - 1;
                }
                $underCursor = $suggestions.eq(nextIndex).addClass("tt-is-under-cursor");
                this._ensureVisibility($underCursor);
                this.trigger("cursorMoved", extractSuggestion($underCursor));
            },
            _getSuggestions: function() {
                return this.$menu.find(".tt-suggestions > .tt-suggestion");
            },
            _ensureVisibility: function($el) {
                var menuHeight = this.$menu.height() + parseInt(this.$menu.css("paddingTop"), 10) + parseInt(this.$menu.css("paddingBottom"), 10), menuScrollTop = this.$menu.scrollTop(), elTop = $el.position().top, elBottom = elTop + $el.outerHeight(true);
                if (elTop < 0) {
                    this.$menu.scrollTop(menuScrollTop + elTop);
                } else if (menuHeight < elBottom) {
                    this.$menu.scrollTop(menuScrollTop + (elBottom - menuHeight));
                }
            },
            destroy: function() {
                this.$menu.off(".tt");
                this.$menu = null;
            },
            isVisible: function() {
                return this.isOpen && !this.isEmpty;
            },
            closeUnlessMouseIsOverDropdown: function() {
                if (!this.isMouseOverDropdown) {
                    this.close();
                }
            },
            close: function() {
                if (this.isOpen) {
                    this.isOpen = false;
                    this.isMouseOverDropdown = false;
                    this._hide();
                    this.$menu.find(".tt-suggestions > .tt-suggestion").removeClass("tt-is-under-cursor");
                    this.trigger("closed");
                }
            },
            open: function() {
                if (!this.isOpen) {
                    this.isOpen = true;
                    !this.isEmpty && this._show();
                    this.trigger("opened");
                }
            },
            setLanguageDirection: function(dir) {
                var ltrCss = {
                    left: "0",
                    right: "auto"
                }, rtlCss = {
                    left: "auto",
                    right: " 0"
                };
                dir === "ltr" ? this.$menu.css(ltrCss) : this.$menu.css(rtlCss);
            },
            moveCursorUp: function() {
                this._moveCursor(-1);
            },
            moveCursorDown: function() {
                this._moveCursor(+1);
            },
            getSuggestionUnderCursor: function() {
                var $suggestion = this._getSuggestions().filter(".tt-is-under-cursor").first();
                return $suggestion.length > 0 ? extractSuggestion($suggestion) : null;
            },
            getFirstSuggestion: function() {
                var $suggestion = this._getSuggestions().first();
                return $suggestion.length > 0 ? extractSuggestion($suggestion) : null;
            },
            renderSuggestions: function(dataset, suggestions) {
                var datasetClassName = "tt-dataset-" + dataset.name, wrapper = '<div class="tt-suggestion">%body</div>', compiledHtml, $suggestionsList, $dataset = this.$menu.find("." + datasetClassName), elBuilder, fragment, $el;
                if ($dataset.length === 0) {
                    $suggestionsList = $(html.suggestionsList).css(css.suggestionsList);
                    $dataset = $("<div></div>").addClass(datasetClassName).append(dataset.header).append($suggestionsList).append(dataset.footer).appendTo(this.$menu);
                }
                if (suggestions.length > 0) {
                    this.isEmpty = false;
                    this.isOpen && this._show();
                    elBuilder = document.createElement("div");
                    fragment = document.createDocumentFragment();
                    utils.each(suggestions, function(i, suggestion) {
                        suggestion.dataset = dataset.name;
                        compiledHtml = dataset.template(suggestion.datum);
                        elBuilder.innerHTML = wrapper.replace("%body", compiledHtml);
                        $el = $(elBuilder.firstChild).css(css.suggestion).data("suggestion", suggestion);
                        $el.children().each(function() {
                            $(this).css(css.suggestionChild);
                        });
                        fragment.appendChild($el[0]);
                    });
                    $dataset.show().find(".tt-suggestions").html(fragment);
                } else {
                    this.clearSuggestions(dataset.name);
                }
                this.trigger("suggestionsRendered");
            },
            clearSuggestions: function(datasetName) {
                var $datasets = datasetName ? this.$menu.find(".tt-dataset-" + datasetName) : this.$menu.find('[class^="tt-dataset-"]'), $suggestions = $datasets.find(".tt-suggestions");
                $datasets.hide();
                $suggestions.empty();
                if (this._getSuggestions().length === 0) {
                    this.isEmpty = true;
                    this._hide();
                }
            }
        });
        return DropdownView;
        function extractSuggestion($el) {
            return $el.data("suggestion");
        }
    }();
    var TypeaheadView = function() {
        var html = {
            wrapper: '<span class="twitter-typeahead"></span>',
            hint: '<input class="tt-hint" type="text" autocomplete="off" aria-hidden="true" spellcheck="off" disabled>',
            dropdown: '<span class="tt-dropdown-menu"></span>'
        }, css = {
            wrapper: {
                position: "relative",
                display: "inline-block"
            },
            hint: {
                position: "absolute",
                top: "0",
                left: "0",
                borderColor: "transparent",
                boxShadow: "none"
            },
            query: {
                position: "relative",
                verticalAlign: "top",
                backgroundColor: "transparent"
            },
            dropdown: {
                position: "absolute",
                top: "100%",
                left: "0",
                zIndex: "100",
                display: "none"
            }
        };
        if (utils.isMsie()) {
            utils.mixin(css.query, {
                backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"
            });
        }
        if (utils.isMsie() && utils.isMsie() <= 7) {
            utils.mixin(css.wrapper, {
                display: "inline",
                zoom: "1"
            });
            utils.mixin(css.query, {
                marginTop: "-1px"
            });
        }
        function TypeaheadView(o) {
            var $menu, $input, $hint;
            utils.bindAll(this);
            this.$node = buildDomStructure(o.input);
            this.datasets = o.datasets;
            this.dir = null;
            this.eventBus = o.eventBus;
            $menu = this.$node.find(".tt-dropdown-menu");
            $input = this.$node.find(".tt-query");
            $hint = this.$node.find(".tt-hint");
            this.dropdownView = new DropdownView({
                menu: $menu
            }).on("suggestionSelected", this._handleSelection).on("cursorMoved", this._clearHint).on("cursorMoved", this._setInputValueToSuggestionUnderCursor).on("cursorRemoved", this._setInputValueToQuery).on("cursorRemoved", this._updateHint).on("suggestionsRendered", this._updateHint).on("opened", this._updateHint).on("closed", this._clearHint).on("opened closed", this._propagateEvent);
            this.inputView = new InputView({
                input: $input,
                hint: $hint
            }).on("focused", this._openDropdown)
                .on("blured", this._closeDropdown)
                .on("blured", this._setInputValueToQuery)
                .on("enterKeyed tabKeyed", this._handleSelection)
                .on("queryChanged", this._clearHint)
                .on("queryChanged", this._clearSuggestions)
                .on("queryChanged", this._getSuggestions)
                .on("whitespaceChanged", this._updateHint)
                .on("queryChanged whitespaceChanged", this._openDropdown)
                .on("queryChanged whitespaceChanged", this._setLanguageDirection)
                .on("escKeyed", this._closeDropdown)
                .on("escKeyed", this._setInputValueToQuery)
                .on("tabKeyed upKeyed downKeyed", this._managePreventDefault)
                .on("upKeyed downKeyed", this._moveDropdownCursor)
                .on("upKeyed downKeyed", this._openDropdown)
                .on("tabKeyed leftKeyed rightKeyed", this._autocomplete)
                .on("tabKeyed", this._closeDropdown);
        }
        utils.mixin(TypeaheadView.prototype, EventTarget, {
            _managePreventDefault: function(e) {
                var $e = e.data, hint, inputValue, preventDefault = false;
                switch (e.type) {
                  case "tabKeyed":
                    hint = this.inputView.getHintValue();
                    inputValue = this.inputView.getInputValue();
                    preventDefault = hint && hint !== inputValue && inputValue !== "";
                    break;

                  case "upKeyed":
                  case "downKeyed":
                    preventDefault = !$e.shiftKey && !$e.ctrlKey && !$e.metaKey;
                    break;
                }
                preventDefault && $e.preventDefault();
            },
            _setLanguageDirection: function() {
                var dir = this.inputView.getLanguageDirection();
                if (dir !== this.dir) {
                    this.dir = dir;
                    this.$node.css("direction", dir);
                    this.dropdownView.setLanguageDirection(dir);
                }
            },
            _updateHint: function() {
                var suggestion = this.dropdownView.getFirstSuggestion(), hint = suggestion ? suggestion.value : null, dropdownIsVisible = this.dropdownView.isVisible(), inputHasOverflow = this.inputView.isOverflow(), inputValue, query, escapedQuery, beginsWithQuery, match;
                if (hint && dropdownIsVisible && !inputHasOverflow) {
                    inputValue = this.inputView.getInputValue();
                    query = inputValue.replace(/\s{2,}/g, " ").replace(/^\s+/g, "");
                    escapedQuery = utils.escapeRegExChars(query);
                    beginsWithQuery = new RegExp("^(?:" + escapedQuery + ")(.*$)", "i");
                    match = beginsWithQuery.exec(hint);
                    if (inputValue === "") {
                        this.inputView.hidePlaceholder();
                    }
                    this.inputView.setHintValue(inputValue + (match ? match[1] : ""));
                }
            },
            _clearHint: function() {
                this.inputView.showPlaceholder();
                this.inputView.setHintValue("");
            },
            _clearSuggestions: function() {
                this.dropdownView.clearSuggestions();
            },
            _setInputValueToQuery: function() {
                this.inputView.setInputValue(this.inputView.getQuery());
            },
            _setInputValueToSuggestionUnderCursor: function(e) {
                var suggestion = e.data;
                this.inputView.setInputValue(suggestion.value, true);
            },
            _openDropdown: function() {
                if (!this.dropdownView.isOpen) {
                    this._getSuggestions();
                }
                this.dropdownView.open();
            },
            _closeDropdown: function(e) {
                this.dropdownView[e.type === "blured" ? "closeUnlessMouseIsOverDropdown" : "close"]();
            },
            _moveDropdownCursor: function(e) {
                var $e = e.data;
                if (!$e.shiftKey && !$e.ctrlKey && !$e.metaKey) {
                    this.dropdownView[e.type === "upKeyed" ? "moveCursorUp" : "moveCursorDown"]();
                }
            },
            _handleSelection: function(e) {
                var byClick = e.type === "suggestionSelected", suggestion = byClick ? e.data : this.dropdownView.getSuggestionUnderCursor();
                if (suggestion) {
                    this.inputView.setInputValue(suggestion.value);
                    byClick ? this.inputView.focus() : e.data.preventDefault();
                    byClick && utils.isMsie() ? utils.defer(this.dropdownView.close) : this.dropdownView.close();
                    this.eventBus.trigger("selected", suggestion.datum, suggestion.dataset);
                }
            },
            _getSuggestions: function() {
                var that = this, query = this.inputView.getQuery(), blank = utils.isBlankString(query);
                utils.each(this.datasets, function(i, dataset) {
                    if (!blank) {
                        dataset.getSuggestions(query, function(suggestions) {
                            if (query === that.inputView.getQuery()) {
                                that.dropdownView.renderSuggestions(dataset, suggestions);
                            }
                        });
                    } else if (dataset.minLength === 0) {
                        var suggestions = [];
                        var i = 0;
                        for (var item in dataset.itemHash) {
                            if (dataset.limit && i >= dataset.limit) {
                                break;
                            }
                            suggestions.push(dataset.itemHash[item]);
                            i++;
                        }
                        that.dropdownView.renderSuggestions(dataset, suggestions);
                    }
                });
            },
            _autocomplete: function(e) {
                var isCursorAtEnd, isCursorAtBeginning, languageDirection, ignoreEvent, query, hint, suggestion;
                if (e.type === "rightKeyed" || e.type === "leftKeyed") {
                    isCursorAtEnd = this.inputView.isCursorAtEnd();
                    ignoreEvent = this.inputView.getLanguageDirection() === "ltr" ? e.type === "leftKeyed" : e.type === "rightKeyed";
                    if (!isCursorAtEnd || ignoreEvent) {
                        return;
                    }
                }
                if (e.type === "tabKeyed") {
                    languageDirection = this.inputView.getLanguageDirection();
                    if (languageDirection === "ltr" && this.inputView.isCursorAtBeginning() || languageDirection !== "ltr" && this.inputView.isCursorAtEnd()) {
                        return;
                    }
                }
                query = this.inputView.getQuery();
                hint = this.inputView.getHintValue();
                if (hint !== "" && query !== hint) {
                    suggestion = this.dropdownView.getFirstSuggestion();
                    this.inputView.setInputValue(suggestion.value);
                    this.eventBus.trigger("autocompleted", suggestion.datum, suggestion.dataset);
                }
            },
            _propagateEvent: function(e) {
                this.eventBus.trigger(e.type);
            },
            destroy: function() {
                this.inputView.destroy();
                this.dropdownView.destroy();
                destroyDomStructure(this.$node);
                this.$node = null;
            },
            setQuery: function(query) {
                this.inputView.setQuery(query);
                this.inputView.setInputValue(query);
                this._clearHint();
                this._clearSuggestions();
                this._getSuggestions();
            }
        });
        return TypeaheadView;
        function buildDomStructure(input) {
            var $wrapper = $(html.wrapper), $dropdown = $(html.dropdown), $input = $(input), $hint = $(html.hint);
            $wrapper = $wrapper.css(css.wrapper);
            $dropdown = $dropdown.css(css.dropdown);
            $hint.css(css.hint).css({
                backgroundAttachment: $input.css("background-attachment"),
                backgroundClip: $input.css("background-clip"),
                backgroundColor: $input.css("background-color"),
                backgroundImage: $input.css("background-image"),
                backgroundOrigin: $input.css("background-origin"),
                backgroundPosition: $input.css("background-position"),
                backgroundRepeat: $input.css("background-repeat"),
                backgroundSize: $input.css("background-size")
            });
            $input.data("ttAttrs", {
                dir: $input.attr("dir"),
                autocomplete: $input.attr("autocomplete"),
                spellcheck: $input.attr("spellcheck"),
                style: $input.attr("style")
            });
            $input.addClass("tt-query").attr({
                autocomplete: "off",
                spellcheck: false
            }).css(css.query);
            try {
                !$input.attr("dir") && $input.attr("dir", "auto");
            } catch (e) {}
            return $input.wrap($wrapper).parent().prepend($hint).append($dropdown);
        }
        function destroyDomStructure($node) {
            var $input = $node.find(".tt-query");
            utils.each($input.data("ttAttrs"), function(key, val) {
                utils.isUndefined(val) ? $input.removeAttr(key) : $input.attr(key, val);
            });
            $input.detach().removeData("ttAttrs").removeClass("tt-query").insertAfter($node);
            $node.remove();
        }
    }();
    (function() {
        var cache = {}, viewKey = "ttView", methods;
        methods = {
            initialize: function(datasetDefs) {
                var datasets;
                datasetDefs = utils.isArray(datasetDefs) ? datasetDefs : [ datasetDefs ];
                if (datasetDefs.length === 0) {
                    $.error("no datasets provided");
                }
                datasets = utils.map(datasetDefs, function(o) {
                    var dataset = cache[o.name] ? cache[o.name] : new Dataset(o);
                    if (o.name) {
                        cache[o.name] = dataset;
                    }
                    return dataset;
                });
                return this.each(initialize);
                function initialize() {
                    var $input = $(this), deferreds, eventBus = new EventBus({
                        el: $input
                    });
                    deferreds = utils.map(datasets, function(dataset) {
                        return dataset.initialize();
                    });
                    $input.data(viewKey, new TypeaheadView({
                        input: $input,
                        eventBus: eventBus = new EventBus({
                            el: $input
                        }),
                        datasets: datasets
                    }));
                    $.when.apply($, deferreds).always(function() {
                        utils.defer(function() {
                            eventBus.trigger("initialized");
                        });
                    });
                }
            },
            destroy: function() {
                return this.each(destroy);
                function destroy() {
                    var $this = $(this), view = $this.data(viewKey);
                    if (view) {
                        view.destroy();
                        $this.removeData(viewKey);
                    }
                }
            },
            setQuery: function(query) {
                return this.each(setQuery);
                function setQuery() {
                    var view = $(this).data(viewKey);
                    view && view.setQuery(query);
                }
            }
        };
        jQuery.fn.typeahead = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, [].slice.call(arguments, 1));
            } else {
                return methods.initialize.apply(this, arguments);
            }
        };
    })();
})(window.jQuery);

(function (o) {
    "use strict";
    tfl.logs.create("tfl.storage: loaded");
    var storage = window.localStorage;
    o.isLocalStorageSupported = function () {
        if ("localStorage" in window && window["localStorage"] !== null) {
            tfl.logs.create("tfl.storage: isLocalStorageSupported true");
            return true;
        } else {
            tfl.logs.create("tfl.storage: isLocalStorageSupported false");
            return false;
        }
    };
    o.set = function (key, value) {
        if (storage && key != undefined) {
            try {
                var parseValue = JSON.stringify(value);
                storage.setItem(key, parseValue);
                tfl.logs.create("tfl.storage.set: " + key + ":" + parseValue);
            } catch (e) {
                tfl.logs.create("tfl.storage.set:" + e.message, "error");
            }
        }
    };
    o.get = function (key, defaultValue) {
        if (storage) {
            try {
                var value = storage.getItem(key);
                if (value != null) {
                    //tfl.logs.create("tfl.storage.get: " + key + ":" + value);
                    return JSON.parse(value);
                }
            } catch (e) {
                tfl.logs.create("tfl.storage.get:" + e.message, "error");
            }
        }
        if (defaultValue !== '') {
            tfl.logs.create("tfl.storage.get: " + key + ":" + defaultValue);
            return defaultValue;
        }
        tfl.logs.create("tfl.storage.get: " + key + ": []");
        return [];
    };

    o.showIfNotDisabled = function (key, callbackShowOnEnabledOrFailure) {
        if (storage) {
            try {
                var isHidden = JSON.parse(o.get(key, false));
                if (!isHidden) {
                    callbackShowOnEnabledOrFailure();
                }
            } catch (e) {
                callbackShowOnEnabledOrFailure();
            }
        } else {
            callbackShowOnEnabledOrFailure();
        }
    };
}(window.tfl.storage = window.tfl.storage || {}));
/**
* jQuery Validation Plugin 1.9.0
*
* http://bassistance.de/jquery-plugins/jquery-plugin-validation/
* http://docs.jquery.com/Plugins/Validation
*
* Copyright (c) 2006 - 2011 Jörn Zaefferer
*
* Licensed under MIT: http://www.opensource.org/licenses/mit-license.php
*/

(function ($) {
	$.extend($.fn, {
		// http://docs.jquery.com/Plugins/Validation/validate
		validate: function (options) {
			// if nothing is selected, return nothing; can't chain anyway
			if (!this.length) {
				options && options.debug && window.console && console.warn("nothing selected, can't validate, returning nothing");
				return;
			}

			// check if a validator for this form was already created
			var validator = $.data(this[0], 'validator');
			if (validator) {
				return validator;
			}

			// Add novalidate tag if HTML5.
			this.attr('novalidate', 'novalidate');

			validator = new $.validator(options, this[0]);
			$.data(this[0], 'validator', validator);

			if (validator.settings.onsubmit) {
				var inputsAndButtons = this.find("input, button");

				// allow suppresing validation by adding a cancel class to the submit button
				inputsAndButtons.filter(".cancel").click(function () {
					validator.cancelSubmit = true;
				});

				// when a submitHandler is used, capture the submitting button
				if (validator.settings.submitHandler) {
					inputsAndButtons.filter(":submit").click(function () {
						validator.submitButton = this;
					});
				}

				// validate the form on submit
				this.submit(function (event) {
					if (validator.settings.debug)
					// prevent form submit to be able to see console output
						event.preventDefault();

					function handle() {
						if (validator.settings.submitHandler) {
							if (validator.submitButton) {
								// insert a hidden input as a replacement for the missing submit button
								var hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
							}
							validator.settings.submitHandler.call(validator, validator.currentForm);
							if (validator.submitButton) {
								// and clean up afterwards; thanks to no-block-scope, hidden can be referenced
								hidden.remove();
							}
							return false;
						}
						return true;
					}

					// prevent submit for invalid forms or custom submit handlers
					if (validator.cancelSubmit) {
						validator.cancelSubmit = false;
						return handle();
					}
					if (validator.form()) {
						if (validator.pendingRequest) {
							validator.formSubmitted = true;
							return false;
						}
						return handle();
					} else {
						validator.focusInvalid();
						return false;
					}
				});
			}

			return validator;
		},
		// http://docs.jquery.com/Plugins/Validation/valid
		valid: function () {
			if ($(this[0]).is('form')) {
				return this.validate().form();
			} else {
				var valid = true;
				var validator = $(this[0].form).validate();
				this.each(function () {
					valid &= validator.element(this);
				});
				return valid;
			}
		},
		// attributes: space seperated list of attributes to retrieve and remove
		removeAttrs: function (attributes) {
			var result = {},
			$element = this;
			$.each(attributes.split(/\s/), function (index, value) {
				result[value] = $element.attr(value);
				$element.removeAttr(value);
			});
			return result;
		},
		// http://docs.jquery.com/Plugins/Validation/rules
		rules: function (command, argument) {
			var element = this[0];

			if (command) {
				var settings = $.data(element.form, 'validator').settings;
				var staticRules = settings.rules;
				var existingRules = $.validator.staticRules(element);
				switch (command) {
					case "add":
						$.extend(existingRules, $.validator.normalizeRule(argument));
						staticRules[element.name] = existingRules;
						if (argument.messages)
							settings.messages[element.name] = $.extend(settings.messages[element.name], argument.messages);
						break;
					case "remove":
						if (!argument) {
							delete staticRules[element.name];
							return existingRules;
						}
						var filtered = {};
						$.each(argument.split(/\s/), function (index, method) {
							filtered[method] = existingRules[method];
							delete existingRules[method];
						});
						return filtered;
				}
			}

			var data = $.validator.normalizeRules(
		$.extend(
			{},
			$.validator.metadataRules(element),
			$.validator.classRules(element),
			$.validator.attributeRules(element),
			$.validator.staticRules(element)
		), element);

			// make sure required is at front
			if (data.required) {
				var param = data.required;
				delete data.required;
				data = $.extend({ required: param }, data);
			}

			return data;
		}
	});

	// Custom selectors
	$.extend($.expr[":"], {
		// http://docs.jquery.com/Plugins/Validation/blank
		blank: function (a) { return !$.trim("" + a.value); },
		// http://docs.jquery.com/Plugins/Validation/filled
		filled: function (a) { return !!$.trim("" + a.value); },
		// http://docs.jquery.com/Plugins/Validation/unchecked
		unchecked: function (a) { return !a.checked; }
	});

	// constructor for validator
	$.validator = function (options, form) {
		this.settings = $.extend(true, {}, $.validator.defaults, options);
		this.currentForm = form;
		this.init();
	};

	$.validator.format = function (source, params) {
		if (arguments.length == 1)
			return function () {
				var args = $.makeArray(arguments);
				args.unshift(source);
				return $.validator.format.apply(this, args);
			};
		if (arguments.length > 2 && params.constructor != Array) {
			params = $.makeArray(arguments).slice(1);
		}
		if (params.constructor != Array) {
			params = [params];
		}
		$.each(params, function (i, n) {
			source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
		});
		return source;
	};

	$.extend($.validator, {
		defaults: {
			messages: {},
			groups: {},
			rules: {},
			errorClass: "error",
			validClass: "valid",
			errorElement: "label",
			focusInvalid: true,
			errorContainer: $([]),
			errorLabelContainer: $([]),
			onsubmit: true,
			ignore: ":hidden",
			ignoreTitle: false,
			onfocusin: function (element, event) {
				this.lastActive = element;

				// hide error label and remove error class on focus if enabled
				if (this.settings.focusCleanup && !this.blockFocusCleanup) {
					this.settings.unhighlight && this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
					this.addWrapper(this.errorsFor(element)).hide();
				}
			},
			onfocusout: function (element, event) {
				if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element))) {
					this.element(element);
				}
			},
			onkeyup: function (element, event) {
				if (element.name in this.submitted || element == this.lastElement) {
					this.element(element);
				}
			},
			onclick: function (element, event) {
				// click on selects, radiobuttons and checkboxes
				if (element.name in this.submitted)
					this.element(element);
				// or option elements, check parent select in that case
				else if (element.parentNode.name in this.submitted)
					this.element(element.parentNode);
			},
			highlight: function (element, errorClass, validClass) {
				if (element.type === 'radio') {
					this.findByName(element.name).addClass(errorClass).removeClass(validClass);
				} else {
					$(element).addClass(errorClass).removeClass(validClass);
				}
			},
			unhighlight: function (element, errorClass, validClass) {
				if (element.type === 'radio') {
					this.findByName(element.name).removeClass(errorClass).addClass(validClass);
				} else {
					$(element).removeClass(errorClass).addClass(validClass);
				}
			}
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
		setDefaults: function (settings) {
			$.extend($.validator.defaults, settings);
		},

		messages: {
			required: "This field is required.",
			remote: "Please fix this field.",
			email: "Please enter a valid email address.",
			url: "Please enter a valid URL.",
			date: "Please enter a valid date.",
			dateISO: "Please enter a valid date (ISO).",
			number: "Please enter a valid number.",
			digits: "Please enter only digits.",
			creditcard: "Please enter a valid credit card number.",
			equalTo: "Please enter the same value again.",
			accept: "Please enter a value with a valid extension.",
			maxlength: $.validator.format("Please enter no more than {0} characters."),
			minlength: $.validator.format("Please enter at least {0} characters."),
			rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
			range: $.validator.format("Please enter a value between {0} and {1}."),
			max: $.validator.format("Please enter a value less than or equal to {0}."),
			min: $.validator.format("Please enter a value greater than or equal to {0}.")
		},

		autoCreateRanges: false,

		prototype: {
			init: function () {
				this.labelContainer = $(this.settings.errorLabelContainer);
				this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
				this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
				this.submitted = {};
				this.valueCache = {};
				this.pendingRequest = 0;
				this.pending = {};
				this.invalid = {};
				this.reset();

				var groups = (this.groups = {});
				$.each(this.settings.groups, function (key, value) {
					$.each(value.split(/\s/), function (index, name) {
						groups[name] = key;
					});
				});
				var rules = this.settings.rules;
				$.each(rules, function (key, value) {
					rules[key] = $.validator.normalizeRule(value);
				});

				function delegate(event) {
					var validator = $.data(this[0].form, "validator"),
					eventType = "on" + event.type.replace(/^validate/, "");
					validator.settings[eventType] && validator.settings[eventType].call(validator, this[0], event);
				}
				$(this.currentForm)
			       .validateDelegate("[type='text'], [type='password'], [type='file'], select, textarea, " +
						"[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
						"[type='email'], [type='datetime'], [type='date'], [type='month'], " +
						"[type='week'], [type='time'], [type='datetime-local'], " +
						"[type='range'], [type='color'] ",
						"focusin focusout keyup", delegate)
				.validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);

				if (this.settings.invalidHandler)
					$(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
			},

			// http://docs.jquery.com/Plugins/Validation/Validator/form
			form: function () {
				this.checkForm();
				$.extend(this.submitted, this.errorMap);
				this.invalid = $.extend({}, this.errorMap);
				if (!this.valid())
					$(this.currentForm).triggerHandler("invalid-form", [this]);
				this.showErrors();
				return this.valid();
			},

			checkForm: function () {
				this.prepareForm();
				for (var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++) {
					this.check(elements[i]);
				}
				return this.valid();
			},

			// http://docs.jquery.com/Plugins/Validation/Validator/element
			element: function (element) {
				element = this.validationTargetFor(this.clean(element));
				this.lastElement = element;
				this.prepareElement(element);
				this.currentElements = $(element);
				var result = this.check(element);
				if (result) {
					delete this.invalid[element.name];
				} else {
					this.invalid[element.name] = true;
				}
				if (!this.numberOfInvalids()) {
					// Hide error containers on last error
					this.toHide = this.toHide.add(this.containers);
				}
				this.showErrors();
				return result;
			},

			// http://docs.jquery.com/Plugins/Validation/Validator/showErrors
			showErrors: function (errors) {
				if (errors) {
					// add items to error list and map
					$.extend(this.errorMap, errors);
					this.errorList = [];
					for (var name in errors) {
						this.errorList.push({
							message: errors[name],
							element: this.findByName(name)[0]
						});
					}
					// remove items from success list
					this.successList = $.grep(this.successList, function (element) {
						return !(element.name in errors);
					});
				}
				this.settings.showErrors
				? this.settings.showErrors.call(this, this.errorMap, this.errorList)
				: this.defaultShowErrors();
			},

			// http://docs.jquery.com/Plugins/Validation/Validator/resetForm
			resetForm: function () {
				if ($.fn.resetForm)
					$(this.currentForm).resetForm();
				this.submitted = {};
				this.lastElement = null;
				this.prepareForm();
				this.hideErrors();
				this.elements().removeClass(this.settings.errorClass);
			},

			numberOfInvalids: function () {
				return this.objectLength(this.invalid);
			},

			objectLength: function (obj) {
				var count = 0;
				for (var i in obj)
					count++;
				return count;
			},

			hideErrors: function () {
				this.addWrapper(this.toHide).hide();
			},

			valid: function () {
				return this.size() == 0;
			},

			size: function () {
				return this.errorList.length;
			},

			focusInvalid: function () {
				if (this.settings.focusInvalid) {
					try {
						$(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
					.filter(":visible")
					.focus()
						// manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
					.trigger("focusin");
					} catch (e) {
						// ignore IE throwing errors when focusing hidden elements
					}
				}
			},

			findLastActive: function () {
				var lastActive = this.lastActive;
				return lastActive && $.grep(this.errorList, function (n) {
					return n.element.name == lastActive.name;
				}).length == 1 && lastActive;
			},

			elements: function () {
				var validator = this,
				rulesCache = {};

				// select all valid inputs inside the form (no submit or reset buttons)
				return $(this.currentForm)
			.find("input, select, textarea")
			.not(":submit, :reset, :image, [disabled]")
			.not(this.settings.ignore)
			.filter(function () {
				!this.name && validator.settings.debug && window.console && console.error("%o has no name assigned", this);

				// select only the first element for each name, and only those with rules specified
				if (this.name in rulesCache || !validator.objectLength($(this).rules()))
					return false;

				rulesCache[this.name] = true;
				return true;
			});
			},

			clean: function (selector) {
				return $(selector)[0];
			},

			errors: function () {
				return $(this.settings.errorElement + "." + this.settings.errorClass, this.errorContext);
			},

			reset: function () {
				this.successList = [];
				this.errorList = [];
				this.errorMap = {};
				this.toShow = $([]);
				this.toHide = $([]);
				this.currentElements = $([]);
			},

			prepareForm: function () {
				this.reset();
				this.toHide = this.errors().add(this.containers);
			},

			prepareElement: function (element) {
				this.reset();
				this.toHide = this.errorsFor(element);
			},

			check: function (element) {
				element = this.validationTargetFor(this.clean(element));

				var rules = $(element).rules();
				var dependencyMismatch = false;
				for (var method in rules) {
					var rule = { method: method, parameters: rules[method] };
					try {
						var result = $.validator.methods[method].call(this, element.value.replace(/\r/g, ""), element, rule.parameters);

						// if a method indicates that the field is optional and therefore valid,
						// don't mark it as valid when there are no other rules
						if (result == "dependency-mismatch") {
							dependencyMismatch = true;
							continue;
						}
						dependencyMismatch = false;

						if (result == "pending") {
							this.toHide = this.toHide.not(this.errorsFor(element));
							return;
						}

						if (!result) {
							this.formatAndAdd(element, rule);
							return false;
						}
					} catch (e) {
						this.settings.debug && window.console && console.log("exception occured when checking element " + element.id
						 + ", check the '" + rule.method + "' method", e);
						throw e;
					}
				}
				if (dependencyMismatch)
					return;
				if (this.objectLength(rules))
					this.successList.push(element);
				return true;
			},

			// return the custom message for the given element and validation method
			// specified in the element's "messages" metadata
			customMetaMessage: function (element, method) {
				if (!$.metadata)
					return;

				var meta = this.settings.meta
				? $(element).metadata()[this.settings.meta]
				: $(element).metadata();

				return meta && meta.messages && meta.messages[method];
			},

			// return the custom message for the given element name and validation method
			customMessage: function (name, method) {
				var m = this.settings.messages[name];
				return m && (m.constructor == String
				? m
				: m[method]);
			},

			// return the first defined argument, allowing empty strings
			findDefined: function () {
				for (var i = 0; i < arguments.length; i++) {
					if (arguments[i] !== undefined)
						return arguments[i];
				}
				return undefined;
			},

			defaultMessage: function (element, method) {
				return this.findDefined(
				this.customMessage(element.name, method),
				this.customMetaMessage(element, method),
				// title is never undefined, so handle empty string as undefined
				!this.settings.ignoreTitle && element.title || undefined,
				$.validator.messages[method],
				"<strong>Warning: No message defined for " + element.name + "</strong>"
			);
			},

			formatAndAdd: function (element, rule) {
				var message = this.defaultMessage(element, rule.method),
				theregex = /\$?\{(\d+)\}/g;
				if (typeof message == "function") {
					message = message.call(this, rule.parameters, element);
				} else if (theregex.test(message)) {
					message = jQuery.format(message.replace(theregex, '{$1}'), rule.parameters);
				}
				this.errorList.push({
					message: message,
					element: element
				});

				this.errorMap[element.name] = message;
				this.submitted[element.name] = message;
			},

			addWrapper: function (toToggle) {
				if (this.settings.wrapper)
					toToggle = toToggle.add(toToggle.parent(this.settings.wrapper));
				return toToggle;
			},

			defaultShowErrors: function () {
				for (var i = 0; this.errorList[i]; i++) {
					var error = this.errorList[i];
					this.settings.highlight && this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass);
					this.showLabel(error.element, error.message);
				}
				if (this.errorList.length) {
					this.toShow = this.toShow.add(this.containers);
				}
				if (this.settings.success) {
					for (var i = 0; this.successList[i]; i++) {
						this.showLabel(this.successList[i]);
					}
				}
				if (this.settings.unhighlight) {
					for (var i = 0, elements = this.validElements(); elements[i]; i++) {
						this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
					}
				}
				this.toHide = this.toHide.not(this.toShow);
				this.hideErrors();
				this.addWrapper(this.toShow).show();
			},

			validElements: function () {
				return this.currentElements.not(this.invalidElements());
			},

			invalidElements: function () {
				return $(this.errorList).map(function () {
					return this.element;
				});
			},

			showLabel: function (element, message) {
				var label = this.errorsFor(element);
				if (label.length) {
					// refresh error/success class
					label.removeClass(this.settings.validClass).addClass(this.settings.errorClass);

					// check if we have a generated label, replace the message then
					label.attr("generated") && label.html(message);
				} else {
					// create label
					label = $("<" + this.settings.errorElement + "/>")
					.attr({ "for": this.idOrName(element), generated: true })
					.addClass(this.settings.errorClass)
					.html(message || "");
					if (this.settings.wrapper) {
						// make sure the element is visible, even in IE
						// actually showing the wrapped element is handled elsewhere
						label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
					}
					if (!this.labelContainer.append(label).length)
						this.settings.errorPlacement
						? this.settings.errorPlacement(label, $(element))
						: label.insertAfter(element);
				}
				if (!message && this.settings.success) {
					label.text("");
					typeof this.settings.success == "string"
					? label.addClass(this.settings.success)
					: this.settings.success(label);
				}
				this.toShow = this.toShow.add(label);
			},

			errorsFor: function (element) {
				var name = this.idOrName(element);
				return this.errors().filter(function () {
					return $(this).attr('for') == name;
				});
			},

			idOrName: function (element) {
				return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
			},

			validationTargetFor: function (element) {
				// if radio/checkbox, validate first element in group instead
				if (this.checkable(element)) {
					element = this.findByName(element.name).not(this.settings.ignore)[0];
				}
				return element;
			},

			checkable: function (element) {
				return /radio|checkbox/i.test(element.type);
			},

			findByName: function (name) {
				// select by name and filter by form for performance over form.find("[name=...]")
				var form = this.currentForm;
				return $(document.getElementsByName(name)).map(function (index, element) {
					return element.form == form && element.name == name && element || null;
				});
			},

			getLength: function (value, element) {
				switch (element.nodeName.toLowerCase()) {
					case 'select':
						return $("option:selected", element).length;
					case 'input':
						if (this.checkable(element))
							return this.findByName(element.name).filter(':checked').length;
				}
				return value.length;
			},

			depend: function (param, element) {
				return this.dependTypes[typeof param]
				? this.dependTypes[typeof param](param, element)
				: true;
			},

			dependTypes: {
				"boolean": function (param, element) {
					return param;
				},
				"string": function (param, element) {
					return !!$(param, element.form).length;
				},
				"function": function (param, element) {
					return param(element);
				}
			},

			optional: function (element) {
				return !$.validator.methods.required.call(this, $.trim(element.value), element) && "dependency-mismatch";
			},

			startRequest: function (element) {
				if (!this.pending[element.name]) {
					this.pendingRequest++;
					this.pending[element.name] = true;
				}
			},

			stopRequest: function (element, valid) {
				this.pendingRequest--;
				// sometimes synchronization fails, make sure pendingRequest is never < 0
				if (this.pendingRequest < 0)
					this.pendingRequest = 0;
				delete this.pending[element.name];
				if (valid && this.pendingRequest == 0 && this.formSubmitted && this.form()) {
					$(this.currentForm).submit();
					this.formSubmitted = false;
				} else if (!valid && this.pendingRequest == 0 && this.formSubmitted) {
					$(this.currentForm).triggerHandler("invalid-form", [this]);
					this.formSubmitted = false;
				}
			},

			previousValue: function (element) {
				return $.data(element, "previousValue") || $.data(element, "previousValue", {
					old: null,
					valid: true,
					message: this.defaultMessage(element, "remote")
				});
			}
		},

		classRuleSettings: {
			required: { required: true },
			email: { email: true },
			url: { url: true },
			date: { date: true },
			dateISO: { dateISO: true },
			dateDE: { dateDE: true },
			number: { number: true },
			numberDE: { numberDE: true },
			digits: { digits: true },
			creditcard: { creditcard: true }
		},

		addClassRules: function (className, rules) {
			className.constructor == String ?
			this.classRuleSettings[className] = rules :
			$.extend(this.classRuleSettings, className);
		},

		classRules: function (element) {
			var rules = {};
			var classes = $(element).attr('class');
			classes && $.each(classes.split(' '), function () {
				if (this in $.validator.classRuleSettings) {
					$.extend(rules, $.validator.classRuleSettings[this]);
				}
			});
			return rules;
		},

		attributeRules: function (element) {
			var rules = {};
			var $element = $(element);

			for (var method in $.validator.methods) {
				var value;
				// If .prop exists (jQuery >= 1.6), use it to get true/false for required
				if (method === 'required' && typeof $.fn.prop === 'function') {
					value = $element.prop(method);
				} else {
					value = $element.attr(method);
				}
				if (value) {
					rules[method] = value;
				} else if ($element[0].getAttribute("type") === method) {
					rules[method] = true;
				}
			}

			// maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
			if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
				delete rules.maxlength;
			}

			return rules;
		},

		metadataRules: function (element) {
			if (!$.metadata) return {};

			var meta = $.data(element.form, 'validator').settings.meta;
			return meta ?
			$(element).metadata()[meta] :
			$(element).metadata();
		},

		staticRules: function (element) {
			var rules = {};
			var validator = $.data(element.form, 'validator');
			if (validator.settings.rules) {
				rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
			}
			return rules;
		},

		normalizeRules: function (rules, element) {
			// handle dependency check
			$.each(rules, function (prop, val) {
				// ignore rule when param is explicitly false, eg. required:false
				if (val === false) {
					delete rules[prop];
					return;
				}
				if (val.param || val.depends) {
					var keepRule = true;
					switch (typeof val.depends) {
						case "string":
							keepRule = !!$(val.depends, element.form).length;
							break;
						case "function":
							keepRule = val.depends.call(element, element);
							break;
					}
					if (keepRule) {
						rules[prop] = val.param !== undefined ? val.param : true;
					} else {
						delete rules[prop];
					}
				}
			});

			// evaluate parameters
			$.each(rules, function (rule, parameter) {
				rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
			});

			// clean number parameters
			$.each(['minlength', 'maxlength', 'min', 'max'], function () {
				if (rules[this]) {
					rules[this] = Number(rules[this]);
				}
			});
			$.each(['rangelength', 'range'], function () {
				if (rules[this]) {
					rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
				}
			});

			if ($.validator.autoCreateRanges) {
				// auto-create ranges
				if (rules.min && rules.max) {
					rules.range = [rules.min, rules.max];
					delete rules.min;
					delete rules.max;
				}
				if (rules.minlength && rules.maxlength) {
					rules.rangelength = [rules.minlength, rules.maxlength];
					delete rules.minlength;
					delete rules.maxlength;
				}
			}

			// To support custom messages in metadata ignore rule methods titled "messages"
			if (rules.messages) {
				delete rules.messages;
			}

			return rules;
		},

		// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
		normalizeRule: function (data) {
			if (typeof data == "string") {
				var transformed = {};
				$.each(data.split(/\s/), function () {
					transformed[this] = true;
				});
				data = transformed;
			}
			return data;
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/addMethod
		addMethod: function (name, method, message) {
			$.validator.methods[name] = method;
			$.validator.messages[name] = message != undefined ? message : $.validator.messages[name];
			if (method.length < 3) {
				$.validator.addClassRules(name, $.validator.normalizeRule(name));
			}
		},

		methods: {
			// http://docs.jquery.com/Plugins/Validation/Methods/required
			required: function (value, element, param) {
				// check if dependency is met
				if (!this.depend(param, element))
					return "dependency-mismatch";
				switch (element.nodeName.toLowerCase()) {
					case 'select':
						// could be an array for select-multiple or a string, both are fine this way
						var val = $(element).val();
						return val && val.length > 0;
					case 'input':
						if (this.checkable(element))
							return this.getLength(value, element) > 0;
					default:
						return $.trim(value).length > 0;
				}
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/remote
			remote: function (value, element, param) {
				if (this.optional(element))
					return "dependency-mismatch";

				var previous = this.previousValue(element);
				if (!this.settings.messages[element.name])
					this.settings.messages[element.name] = {};
				previous.originalMessage = this.settings.messages[element.name].remote;
				this.settings.messages[element.name].remote = previous.message;

				param = typeof param == "string" && { url: param} || param;

				if (this.pending[element.name]) {
					return "pending";
				}
				if (previous.old === value) {
					return previous.valid;
				}

				previous.old = value;
				var validator = this;
				this.startRequest(element);
				var data = {};
				data[element.name] = value;
				$.ajax($.extend(true, {
					url: param,
					mode: "abort",
					port: "validate" + element.name,
					dataType: "json",
					data: data,
					success: function (response) {
						validator.settings.messages[element.name].remote = previous.originalMessage;
						var valid = response === true;
						if (valid) {
							var submitted = validator.formSubmitted;
							validator.prepareElement(element);
							validator.formSubmitted = submitted;
							validator.successList.push(element);
							validator.showErrors();
						} else {
							var errors = {};
							var message = response || validator.defaultMessage(element, "remote");
							errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
							validator.showErrors(errors);
						}
						previous.valid = valid;
						validator.stopRequest(element, valid);
					}
				}, param));
				return "pending";
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/minlength
			minlength: function (value, element, param) {
				return this.optional(element) || this.getLength($.trim(value), element) >= param;
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/maxlength
			maxlength: function (value, element, param) {
				return this.optional(element) || this.getLength($.trim(value), element) <= param;
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/rangelength
			rangelength: function (value, element, param) {
				var length = this.getLength($.trim(value), element);
				return this.optional(element) || (length >= param[0] && length <= param[1]);
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/min
			min: function (value, element, param) {
				return this.optional(element) || value >= param;
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/max
			max: function (value, element, param) {
				return this.optional(element) || value <= param;
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/range
			range: function (value, element, param) {
				return this.optional(element) || (value >= param[0] && value <= param[1]);
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/email
			email: function (value, element) {
				// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
				return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/url
			url: function (value, element) {
				// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
				return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/date
			date: function (value, element) {
				return this.optional(element) || !/Invalid|NaN/.test(new Date(value));
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/dateISO
			dateISO: function (value, element) {
				return this.optional(element) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value);
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/number
			number: function (value, element) {
				return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/digits
			digits: function (value, element) {
				return this.optional(element) || /^\d+$/.test(value);
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/creditcard
			// based on http://en.wikipedia.org/wiki/Luhn
			creditcard: function (value, element) {
				if (this.optional(element))
					return "dependency-mismatch";
				// accept only spaces, digits and dashes
				if (/[^0-9 -]+/.test(value))
					return false;
				var nCheck = 0,
				nDigit = 0,
				bEven = false;

				value = value.replace(/\D/g, "");

				for (var n = value.length - 1; n >= 0; n--) {
					var cDigit = value.charAt(n);
					var nDigit = parseInt(cDigit, 10);
					if (bEven) {
						if ((nDigit *= 2) > 9)
							nDigit -= 9;
					}
					nCheck += nDigit;
					bEven = !bEven;
				}

				return (nCheck % 10) == 0;
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/accept
			accept: function (value, element, param) {
				param = typeof param == "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
				return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/equalTo
			equalTo: function (value, element, param) {
				// bind to the blur event of the target in order to revalidate whenever the target field is updated
				// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
				var target = $(param).unbind(".validate-equalTo").bind("blur.validate-equalTo", function () {
					$(element).valid();
				});
				return value == target.val();
			}
		}
	});

	// deprecated, use $.validator.format instead
	$.format = $.validator.format;
})(jQuery);

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
; (function ($) {
	var pendingRequests = {};
	// Use a prefilter if available (1.5+)
	if ($.ajaxPrefilter) {
		$.ajaxPrefilter(function (settings, _, xhr) {
			var port = settings.port;
			if (settings.mode == "abort") {
				if (pendingRequests[port]) {
					pendingRequests[port].abort();
				}
				pendingRequests[port] = xhr;
			}
		});
	} else {
		// Proxy ajax
		var ajax = $.ajax;
		$.ajax = function (settings) {
			var mode = ("mode" in settings ? settings : $.ajaxSettings).mode,
				port = ("port" in settings ? settings : $.ajaxSettings).port;
			if (mode == "abort") {
				if (pendingRequests[port]) {
					pendingRequests[port].abort();
				}
				return (pendingRequests[port] = ajax.apply(this, arguments));
			}
			return ajax.apply(this, arguments);
		};
	}
})(jQuery);

// provides cross-browser focusin and focusout events
// IE has native support, in other browsers, use event caputuring (neither bubbles)

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
; (function ($) {
	// only implement if not provided by jQuery core (since 1.4)
	// TODO verify if jQuery 1.4's implementation is compatible with older jQuery special-event APIs
	if (!jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener) {
		$.each({
			focus: 'focusin',
			blur: 'focusout'
		}, function (original, fix) {
			$.event.special[fix] = {
				setup: function () {
					this.addEventListener(original, handler, true);
				},
				teardown: function () {
					this.removeEventListener(original, handler, true);
				},
				handler: function (e) {
					arguments[0] = $.event.fix(e);
					arguments[0].type = fix;
					return $.event.handle.apply(this, arguments);
				}
			};
			function handler(e) {
				e = $.event.fix(e);
				e.type = fix;
				return $.event.handle.call(this, e);
			}
		});
	};
	$.extend($.fn, {
		validateDelegate: function (delegate, type, handler) {
			return this.bind(type, function (event) {
				var target = $(event.target);
				if (target.is(delegate)) {
					return handler.apply(target, arguments);
				}
			});
		}
	});
})(jQuery);
/*
** Unobtrusive validation support library for jQuery and jQuery Validate
** Copyright (C) Microsoft Corporation. All rights reserved.
*/
(function (a) { var d = a.validator, b, f = "unobtrusiveValidation"; function c(a, b, c) { a.rules[b] = c; if (a.message) a.messages[b] = a.message } function i(a) { return a.replace(/^\s+|\s+$/g, "").split(/\s*,\s*/g) } function g(a) { return a.substr(0, a.lastIndexOf(".") + 1) } function e(a, b) { if (a.indexOf("*.") === 0) a = a.replace("*.", b); return a } function l(c, d) { var b = a(this).find("[data-valmsg-for='" + d[0].name + "']"), e = a.parseJSON(b.attr("data-valmsg-replace")) !== false; b.removeClass("field-validation-valid").addClass("field-validation-error"); c.data("unobtrusiveContainer", b); if (e) { b.empty(); c.removeClass("input-validation-error").appendTo(b) } else c.hide() } function k(e, d) { var c = a(this).find("[data-valmsg-summary=true]"), b = c.find("ul"); if (b && b.length && d.errorList.length) { b.empty(); c.addClass("validation-summary-errors").removeClass("validation-summary-valid"); a.each(d.errorList, function () { a("<li />").html(this.message).appendTo(b) }) } } function j(c) { var b = c.data("unobtrusiveContainer"), d = a.parseJSON(b.attr("data-valmsg-replace")); if (b) { b.addClass("field-validation-valid").removeClass("field-validation-error"); c.removeData("unobtrusiveContainer"); d && b.empty() } } function h(d) { var b = a(d), c = b.data(f); if (!c) { c = { options: { errorClass: "input-validation-error", errorElement: "span", errorPlacement: a.proxy(l, d), invalidHandler: a.proxy(k, d), messages: {}, rules: {}, success: a.proxy(j, d) }, attachValidation: function () { b.validate(this.options) }, validate: function () { b.validate(); return b.valid() } }; b.data(f, c) } return c } d.unobtrusive = { adapters: [], parseElement: function (b, i) { var d = a(b), f = d.parents("form")[0], c, e, g; if (!f) return; c = h(f); c.options.rules[b.name] = e = {}; c.options.messages[b.name] = g = {}; a.each(this.adapters, function () { var c = "data-val-" + this.name, i = d.attr(c), h = {}; if (i !== undefined) { c += "-"; a.each(this.params, function () { h[this] = d.attr(c + this) }); this.adapt({ element: b, form: f, message: i, params: h, rules: e, messages: g }) } }); jQuery.extend(e, { __dummy__: true }); !i && c.attachValidation() }, parse: function (b) { a(b).find(":input[data-val=true]").each(function () { d.unobtrusive.parseElement(this, true) }); a("form").each(function () { var a = h(this); a && a.attachValidation() }) } }; b = d.unobtrusive.adapters; b.add = function (c, a, b) { if (!b) { b = a; a = [] } this.push({ name: c, params: a, adapt: b }); return this }; b.addBool = function (a, b) { return this.add(a, function (d) { c(d, b || a, true) }) }; b.addMinMax = function (e, g, f, a, d, b) { return this.add(e, [d || "min", b || "max"], function (b) { var e = b.params.min, d = b.params.max; if (e && d) c(b, a, [e, d]); else if (e) c(b, g, e); else d && c(b, f, d) }) }; b.addSingleVal = function (a, b, d) { return this.add(a, [b || "val"], function (e) { c(e, d || a, e.params[b]) }) }; d.addMethod("__dummy__", function () { return true }); d.addMethod("regex", function (b, c, d) { var a; if (this.optional(c)) return true; a = (new RegExp(d)).exec(b); return a && a.index === 0 && a[0].length === b.length }); b.addSingleVal("accept", "exts").addSingleVal("regex", "pattern"); b.addBool("creditcard").addBool("date").addBool("digits").addBool("email").addBool("number").addBool("url"); b.addMinMax("length", "minlength", "maxlength", "rangelength").addMinMax("range", "min", "max", "range"); b.add("equalto", ["other"], function (b) { var h = g(b.element.name), i = b.params.other, d = e(i, h), f = a(b.form).find(":input[name=" + d + "]")[0]; c(b, "equalTo", f) }); b.add("required", function (a) { (a.element.tagName.toUpperCase() !== "INPUT" || a.element.type.toUpperCase() !== "CHECKBOX") && c(a, "required", true) }); b.add("remote", ["url", "type", "additionalfields"], function (b) { var d = { url: b.params.url, type: b.params.type || "GET", data: {} }, f = g(b.element.name); a.each(i(b.params.additionalfields || b.element.name), function (h, g) { var c = e(g, f); d.data[c] = function () { return a(b.form).find(":input[name='" + c + "']").val() } }); c(b, "remote", d) }); a(function () { d.unobtrusive.parse(document) }) })(jQuery);

(function (utils) {
    "use strict";

    tfl.logs.create("tfl.utils: loaded");

    utils.supportsSVG = function () {
        if (!!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect) {
            utils.supportsSVG = function () { return true; };
        } else {
            $(document.body).addClass("nosvg");
            utils.supportsSVG = function () { return false; };
        }
    };

    utils.supportsFlexbox = function () {
        var types = ["flexWrap", "webkitFlexWrap", "mozFlexWrap", "msFlexWrap"];
        for (var type in types) {
            if (document.body.style[type] !== undefined) {
                $(document.body).addClass("flexbox");
                utils.supportsFlexbox = function () { return true; };
                return true;
            }
        }
        $(document.body).addClass("no-flexbox");
        utils.supportsFlexbox = function () { return false; };
        return false;
    };

    utils.isTouchDevice = function() {
        return !!('ontouchstart' in window) || !!('onmsgesturechange' in window);
    };

    utils.requestAnimFrame;
    function polyfillAnimFrame() {
        if (window.requestAnimationFrame) {
            utils.requestAnimFrame = function (callback) { window.requestAnimationFrame(callback) }
        } else if (window.webkitRequestAnimationFrame) {
            utils.requestAnimFrame = function (callback) { window.webkitRequestAnimationFrame(callback) }
        } else if (window.mozRequestAnimationFrame) {
            utils.requestAnimFrame = function (callback) { window.mozRequestAnimationFrame(callback) }
        } else {
            utils.requestAnimFrame = function (callback) { 
                window.setTimeout(callback, 1000 / 60);
            };
        }
    }

    function polyfillIndexOf() {
        Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
            'use strict';
            if (this == null) {
                throw new TypeError();
            }
            var n, k, t = Object(this),
                len = t.length >>> 0;

            if (len === 0) {
                return -1;
            }
            n = 0;
            if (arguments.length > 1) {
                n = Number(arguments[1]);
                if (n != n) { // shortcut for verifying if it's NaN
                    n = 0;
                } else if (n != 0 && n != Infinity && n != -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0) ; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        };
    }

    utils.runOnImgComplete = function (img, callback) {
        if (img.nodeType === 1 && img.tagName.toLowerCase() === 'img' && img.src !== '') {
            if (img.complete || img.readyState === 4) { ///// img already loaded
                callback();
            } else if (img.readyState === 'uninitialized' && img.src.indexOf('data:') === 0) {
                tfl.logs.create('tfl.utils.runOnImgComplete: failed to load ' + img.src);
            } else {
                img.one('load', callback);
            }
        }
    }

    // one time inits of setup of functions if needed.
    function init() {
        tfl.logs.create("tfl.utils: started");
        utils.supportsSVG();
        if (!Array.prototype.indexOf) {
            polyfillIndexOf();
        }
        polyfillAnimFrame();
    }
    
    init();
   
})(window.tfl.utils = window.tfl.utils || {});

(function (tfl) {
    "use strict";

    tfl.dictionary = {
        MoreOptions: 'Accessibility & travel options',
        LessOptions: 'Fewer options',
        CustomisedOptions: $.cookie('jp-pref') !== null ? ' (customised)' : '',
        ShowDetailedView: 'View Details',
        HideDetailedView: 'Hide Details',
        ShowAllStops: 'View all stops',
        HideAllStops: 'Hide all stops',
        ShowTextInstructions: 'View text instructions',
        HideTextInstructions: 'Hide text instructions',
        NowText: 'Now',
        TodayText: 'Today',
        RemoveContentClass: ".remove-content",
        JpTypeCycling: 'cycling',
        JpTypeWalking: 'walking',
        FirstServiceText: 'First service',
        LastServiceText: 'Last service',
        //the space after this text is important to allow
        //the cursor to be visible after the blue box
        CurrentLocationText: 'Current location '
    };
        
    tfl.logs.create("tfl.dictionary: loaded");
   
})(window.tfl = window.tfl || {});

(function (o) {
    "use strict";
    
    // helper to check is not undefined
    function isDefined(prop) {
        if (prop === undefined) {
            tfl.logs.create("error instantiating object - mandatory field not populated");
            return false;
        }
        return true;        
    }

    

    // =========================== SSP Definitions ============================

    // Mode Types 
    o.modes = [tfl.modeNameTube, tfl.modeNameBus, tfl.modeNameTram, tfl.modeNameRiver, tfl.modeNameCableCar, tfl.modeNameMultiModal];


    // SSPObject definition 
    o.SSPObject = function(naptanId, mode, props) {
        var props = props || { };
        if (!isDefined(naptanId) || !isDefined(mode)) return { error: "naptanId and mode are mandatory" };
        if (o.modes.indexOf(mode) < 0) return { error: "invalid mode supplied" };
        this.naptanId = naptanId;
        this.mode = mode;

        this.props = $.extend({ lines: [], name: "", towards: "" }, props);
    };



    tfl.logs.create("tfl.objects: loaded");
           
})(window.tfl.objects = window.tfl.objects || {});
var tfl = tfl || {};
(function (tfl) {
    "use strict";
    tfl.logs.create("tfl.core: loaded");

    tfl.init = function () {
        tfl.logs.create("tfl.core: started");
        tfl.responsive.init();
        tfl.interactions.init();
    };
    tfl.getQueryParam = function (name, url) {
        if (!url) {
            url = window.location.search;
        }
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]").toLowerCase();
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url.toLowerCase());
        if (results == null) return "";
        else return decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    tfl.interactions = {
        init: function () {
            tfl.logs.create("tfl.interactions: started");
            tfl.interactions.externalLinks();
            $(".top-row .more").click(tfl.interactions.toggleNavigation);
            $(".show-mobile-search").click(tfl.interactions.toggleMobileSearch);
            $("#footer h2.heading").wrap('<a href="#info-for" class="info-for-link" />');
            $("#footer a.info-for-link").click(tfl.interactions.toggleFooter);
           



            //new FastClick(document.body);

            //cookie policy notice
            $(".cookie-policy-button a").click(tfl.interactions.hideCookiesPolicyNotice);
            tfl.storage.showIfNotDisabled("cookiePolicyNoticeHidden", function () { $(".cookie-policy-notice").show(); });
            //if ("localStorage" in window && window["localStorage"] !== null) {
            //    try {
            //        var noticeHidden = JSON.parse(window.localStorage.getItem("cookiePolicyNoticeHidden"));
            //        if (!noticeHidden.hidden) {
            //            $(".cookie-policy-notice").show();
            //        }
            //    } catch (e) {
            //        $(".cookie-policy-notice").show();
            //    }
            //}
            //key press for tabbing
            $(document).keydown(function (e) {
                var el = [],
                    $active = $(document.activeElement);
                if (e.shiftKey && e.keyCode == 9) { //shift+tab
                    var back = $active.attr('data-jumpback') || $active.data('jumpback');
                    if (back !== undefined){
                        el = typeof (back) === "string" ? $(back) : el = back;
                    }
                } else if (e.which == 9) { //tab
                    var forward = $active.attr("data-jumpto") || $active.data('jumpto');
                    if (forward !== undefined) {
                        el = typeof (forward) === "string" ? $(forward) : el = forward;
                    }
                }
                if (el.length > 0) {
                    el = el.length > 1? el.first() : el;
                    el.focus();
                    $(".ui-menu-item").hide();//hide autocomplete options
                    return false;
                }
            });
            // add "autocomplete = off" to text boxes (browser autocomplete)
            $("input[type='text']").attr("autocomplete", "off");
        },

        hideCookiesPolicyNotice: function () {
            $(".cookie-policy-notice").hide();
            tfl.storage.set("cookiePolicyNoticeHidden", "true");
            if ($("html.lt-ie8").length > 0) {
                var ieFixEls = $(".top-row, #full-width-content");
                ieFixEls.addClass("ie7-fix");
                window.setTimeout(function () {
                    ieFixEls.removeClass("ie7-fix");
                }, 5);
            }
            return false;
        },
        toggleNavigation: function () {

            var $extraNav = $(".extra-nav");
            if ($(".top-row.show-search").is(":visible")) {
                tfl.interactions.toggleMobileSearch();
            }
            $(".top-row .more").children("a").toggleClass("expanded");
            $extraNav.toggleClass("expanded");
            $("#container").toggleClass("menu-visible");
            $extraNav
                .find('.menu-sub-section:last')
                .find('ul').find('li:last').find('a')
                .blur(function () {
                    $('input#q').focus()
                });
            return false;
        },

        externalLinks: function () {
            tfl.logs.create("external link classes: initialised");
            $('a').filter(function () {
                return this.hostname && this.hostname !== location.hostname;
            }).addClass("external-link");
            //over-ride browser and set both external links and document downloads to open in the same tab
            $("a.external-link,a.document-download-wrap").attr("target", "_parent");
            tfl.logs.create("external link classes: added");

            var eachExtLink = $("p a.external-link").each(function () {
                var spanLink = $(this).attr("href");
                $(this).after("<a class='ext-span' href=" + spanLink + "></a>");
            });
            
         
            
        },

        toggleMobileSearch: function () {
            if ($(".extra-nav.expanded").is(":visible")) {
                tfl.interactions.toggleNavigation();
            }
            var el = $(".show-mobile-search");
            var journeyPlannerButton = ".journey-form #plan-a-journey tabbable:first,#main-hero :tabbable:first";
            //var homePageElement = "#main-hero :tabbable:first";
            var searchBox = "#query";
            if (el.attr("data-jumpto") === journeyPlannerButton) {
                el.attr("data-jumpto", searchBox);
            } else if (el.attr("data-jumpto") === searchBox) {
                el.attr("data-jumpto", journeyPlannerButton);
            }
            $(".search-tools").find("a").css("top","5px");
            $(".top-row").toggleClass("show-search");
            return false;
            
        },
        toggleFooter: function () {
            $(".primary-footer").toggleClass("expanded");
            return false;
            }
                };
    tfl.responsive = {
        init: function () {
            tfl.logs.create("tfl.responsive: started");
            tfl.responsive.setupBreakpoints();

            $(".top-row .logo").after("<ul class='collapsible-menu clearfix'>&nbsp;</ul>");
            var menu = $(".collapsible-menu");
            menu.append($(".plan-journey").clone());
            menu.append($(".status-update").clone());
            menu.append($(".maps").clone());
            menu.append($(".fares-and-payments").clone());
            $(".collapsible-menu a").removeAttr("data-jumpback");
            menu.append("<li class='more'><a href='javascript:void(0)' data-jumpto='.extra-nav a:visible:first'><span class='text'>More...</span><span class='arrow'>&nbsp;</span></a></li></li>");
            $(".texts").append('<div class="search"><a href="javascript:void(0);" class="show-mobile-search" data-jumpto=".journey-form #plan-a-journey tabbable:first,#main-hero :tabbable:first"><span class="search-icon hide-text">Search</span><span class="collapse"></span><span class="expand"></span></a></div>');
            $(".top-row-extras").prepend("<div class='more'><a href='javascript:void(0)' data-jumpto='.extra-nav a:first:visible'><span class='text'>Menu</span><span class='arrow'>&nbsp;</span></a></li></div>");
            //make sidenav move to bottom for mobile
            $(".moving-source-order").appendAround();
            tfl.responsive.initLazyLoadedImages();
        },
        setupBreakpoints: function () {
            $(window).setBreakpoints({
                distinct: false,
                breakpoints: tfl.settings.devices
            });
        },

        initLazyLoadedImages: function () {
            $("[data-img]").each(function () {
                var that = $(this);
                var showImg = function () {
                    $(that).children("img").remove();
                    var img = $('<img>').attr({ 'src': that.attr("data-img"), 'alt': that.attr("data-img-alt") }).load(function () {

                        if (that.data('img-background')) {
                            that.css('background-image', 'url('+that.attr("data-img")+')');
                        } else {
                            that.prepend(img);
                            img.attr({ 'width': img.width(), 'height': img.height() });
                        }
                    });
                    if (img[0].width) img.load();
                };

                if ($(this).attr("data-img-breakpoint") === "medium") {
                    $(window).one("enterBreakpointMedium", showImg);
                    if ($("body.breakpoint-Medium").length > 0) {
                        $(window).trigger('enterBreakpointMedium');
                    }
                } else {
                    $(window).one("enterBreakpointLarge", showImg);
                    if ($("body.breakpoint-Large").length > 0) {
                        $(window).trigger('enterBreakpointLarge');
                    }
                }
            });
        }
    };
    $.fn.tflPopup = function (options) {
        var obj = $(this);
        var settings = $.extend({
            title: 'This is the default title',
            content: '',
            showingPercentage: 100,
            displayNoThanksLink: true,
            displayNotAgainLink: true,
            noThanksLinkText: 'No thanks',
            notAgainLinkText: "No thanks, and don't ask me again",
            links: [],
            campaignId: "DefaultPopup",
        }, options);

        if (tfl.storage.get("Popups." + settings.campaignId)) {
            return;
        }

        if (settings.showingPercentage < 100) {
            var rdn = Math.floor(Math.random() * 100);
            if (rdn > settings.showingPercentage) return;
        }


        var popup = $('<div></div>').addClass('popup');
        var title = $('<div></div>').addClass('popup-title').text(settings.title);
        var icon = $('<span class="popup-title-icon white-up-arrow"></span>');
        var content = $('<div></div>').addClass('popup-content');
        if (settings.content.length > 0) {
            content.append($('<p></p>').text(settings.content));
        }

        for (var i = 0; i < settings.links.length; i++) {
            var l = settings.links[i];
            var link = $('<a></a>').attr({ 'href': l.url, 'title': l.title }).addClass('plain-button').text(l.title);
            content.append(link);
        }

        var hidePopup = function (e) {
            popup.addClass("hidden");
            e.preventDefault();
        };

        var cancelPopup = function (e) {
            tfl.storage.set("Popups." + settings.campaignId, true);
            e.preventDefault();
        };

        if (settings.displayNoThanksLink) {
            var noThanksLink = $('<a></a>').attr({ 'href': '#', 'title': settings.noThanksLinkText }).addClass('plain-button').text(settings.noThanksLinkText);
            content.append(noThanksLink);
            noThanksLink.click(hidePopup);
        }
        if (settings.displayNotAgainLink && tfl.storage.isLocalStorageSupported()) {
            var notAgainLink = $('<a></a>').attr({ 'href': '#', 'title': settings.notAgainLinkText }).addClass('plain-button').text(settings.notAgainLinkText);
            content.append(notAgainLink);
            notAgainLink.click(hidePopup).click(cancelPopup);
        }

        popup.append(title.append(icon)).append(content);
        obj.append(popup);

        var height = content.outerHeight(true);
        var cssDown = { 'bottom': (height * -1) + 'px' };
        var cssUp = { 'bottom': 0 };

        popup.click(function () {
            var el = $(this);
            if (el.css('bottom') === '0px') {
                el.css(cssDown);
                icon.attr("class", "popup-title-icon white-up-arrow");
            } else {
                el.css(cssUp);
                icon.attr("class", "popup-title-icon white-down-arrow");
            }
        }).css(cssDown);
    };

    $.fn.tflBanner = function (options) {
        var obj = $(this);
        var settings = $.extend({
            title: 'This is the default title',
            showingPercentage: 100,
            links: [],
            campaignId: "DefaultBanner"
        }, options);

        if (settings.showingPercentage === 0 || tfl.storage.get("Banners." + settings.campaignId)) {
            return;
        }

        if (settings.showingPercentage < 100) {
            var rdn = Math.floor(Math.random() * 100);
            if (rdn > settings.showingPercentage) return;
        }

        var hideBanner = function (e) {
            popup.addClass("hidden");
            e.preventDefault();
        };

        var cancelBanner = function (e) {
            tfl.storage.set("Banners." + settings.campaignId, true);
            e.preventDefault();
        };

        var popup = $('<div></div>').addClass("popup-banner");
        var title = $('<span></span>').addClass('popup-title').text(settings.title);
        var icon = $('<a href="#" class="popup-title-icon close-icon-white hide-text"><span>Close this banner</span></a>');
        icon.click(hideBanner).click(cancelBanner);

        for (var i = 0; i < settings.links.length; i++) {
            var l = settings.links[i];
            var link = $('<a></a>').attr({ 'href': l.url, 'title': l.title, 'class': 'popup-link' }).text(l.title);
            title.append(link);
        }
        popup.append(title).append(icon);
        obj.append(popup);
    };
    tfl.init();
})(tfl);
(function (tfl) {
    "use strict";
    
    var autoRefreshTimers = new Array();

    tfl.api = {
        BikePoint: tfl.apiUrl + "BikePoint",

        LineStatus: tfl.apiUrl + "Line/Mode/{0}/Status?detail=true",
        LinePlannedWorks: tfl.apiUrl + "Line/Mode/{0}/Status/{1}/to/{2}?detail=true",
        Routes: tfl.apiUrl + "Routes",
        RoutesSearch: tfl.apiUrl + "Search/Route/%QUERY?includelines=true&includestations=false&modes={0}",

        StopPointsDisruptions: tfl.apiUrl + "StopPoint/{0}/Disruption",
        StopPointsSearch: tfl.apiUrl + "StopPoint/search/%QUERY?modes={0}&maxResults=25&oysterOnly={1}",
        StopPointsDisruptionsTimePeriod: tfl.apiUrl + "StopPoint/{0}/Disruption/{1}/to/{2}",
        StopPointsDisruptionsByModeAndTimePeriod: tfl.apiUrl + "StopPoint/Mode/{0}/Disruption/{1}/to/{2}"

    };

    tfl.autoRefresh = {
        BikePoint: 65000,
        Predictions: 10000, // remove when predictions AJAX polling removed
        ServiceBoard: 65000
    };

    var defaultData = tfl.settings.debug ? { } : { app_id: tfl.appId, app_key: tfl.appKey };

    tfl.addAppIdAndKey = function (url) {
        if (!tfl.settings.debug) {
            if (url.indexOf('?') != -1) {
                return url + "&app_id=" + tfl.appId + "&app_key=" + tfl.appKey;
            } else {
                return url + "?app_id=" + tfl.appId + "&app_key=" + tfl.appKey;
            }
        } else {
            return url;
        }
    };

    tfl.ajax = function (opts) {
        if (typeof (opts) !== "object" || !opts.url || !opts.success) {
            tfl.logs.create('invalid paramaters passed to tfl.ajax');
            tfl.logs.create(opts);
            if (typeof (opts.error) === "function") { opts.error() };
            return false;
        }
        var defaults = {
            data: defaultData,
            dataType: 'json',
            success: null,
            error: function(jqXHR, textStatus, errorThrown) {
                tfl.logs.create('tfl.ajax: Error with ajax call');
                tfl.logs.create(textStatus);
                tfl.logs.create(errorThrown);
                tfl.logs.create(jqXHR);
            },
            autoRefreshInterval: null
        };
        var settings = $.extend(true, {}, defaults, opts);

        // add query string arguments to data collection and remove query string from URL
        //var param = settings.url.substring(settings.url.indexOf('?') + 1, settings.url.length);
        //if (param.length !== settings.url.length) {
        //    var paramArray = param.split('&');

        //    for (var i = 0; i < paramArray.length; i++) {
        //        var spl = paramArray[i].split('=');
        //        settings.data[spl[0]] = spl[1];
        //    }
        //    settings.url = settings.url.substring(0, settings.url.indexOf('?'));
        //}

        //// encode URL
        //var splitUrl = settings.url.split('/');
        //for (var i = 0; i < splitUrl.length; i++) {
        //    if (splitUrl[i] !== "http:" && splitUrl[i] !== '') {
        //        splitUrl[i] = encodeURIComponent(decodeURIComponent(splitUrl[i]));
        //    }
        //}
        //settings.url = splitUrl.join('/');

        //// encode paramaters
        //for (var dat in settings.data) {
        //    if (settings.data.hasOwnProperty(dat)) {
        //        settings.data[dat] = encodeURIComponent(decodeURIComponent(settings.data[dat]));
        //    }
        //}

        if (settings.autoRefreshInterval !== null) {
            settings.complete = function () {
                autoRefreshTimers[settings.autoRefreshId] =
                    setTimeout(
                        function () { tfl.ajax(opts); },
                        parseInt(settings.autoRefreshInterval));
            };
        }
        var callback = function () {
            tfl.logs.create("tfl.ajax: " + settings.url);
            $.ajax(settings);
        };

        tfl.utils.requestAnimFrame(callback);
    };
    
    tfl.stopAjaxAutoRefresh = function (autoRefreshId) {
        clearTimeout(autoRefreshTimers[autoRefreshId]);
    };

    tfl.logs.create("tfl.ajax: loaded");

})(window.tfl = window.tfl || {});
(function (o) {

    o.settings = function() {
        $.validator.setDefaults({
            onfocusout: false,
            onfocusin: false,
            onkeyup: false,
            onclick: false
        });
    };

    o.setSelectBoxSpan = function (selectbox) {
        var text = $(selectbox).children("option:selected").text();
        $(selectbox).attr('title', text).siblings("span").text(text);
    };
    o.updateSelectBox = function () {
        o.setSelectBoxSpan(this);
    },
    o.setupSelectBoxes = function () {
        $(".selector select").before("<span />").each(function () {
            o.setSelectBoxSpan(this);
            $(this).focus(function () { $(this).parent().addClass("focus"); });
            $(this).blur(function () { $(this).parent().removeClass("focus"); });
        }).change(o.updateSelectBox);
    };
    
    o.setupSelectBox = function (selector, text) {
        $(selector + " select").before("<span />");
        $(selector + " select").attr('title', text).siblings("span").text(text);
        $(selector).focus(function () { $(selector).parent().addClass("focus"); });
        $(selector).blur(function () { $(selector).parent().removeClass("focus"); });
        $(selector + " select").change(o.updateSelectBox);
    };
    
    o.modeSelectAll = function (el) {
        $(el).click(function () {
            var list = $(this).parent().siblings("ul"); 
            if (!$(this).hasClass('select-all')) {
                list.children("li.ticked").each(function () {
                    $(this).children("input").trigger("click");
                });
            } else {
                list.children("li").not(".ticked").each(function () {
                    $(this).children("input").trigger("click");
                });
                $(this).removeClass("select-all").text("Deselect all");
            }
        });
    };

    o.setupCheckBoxSelectall = function (el) {
        var div = $("<div class='select-deselect-option'><a href='javascript:void(0);'>Deselect All</a></div>");
        var link = div.children("a");
        $(el).parent().prepend(div);
        var inputs = $(el).find("input");
        var clickHandler = function () {
            var allTicked = true;
            for (var i = 0; i < inputs.length; i++) {
                if (!$(inputs[i]).is(":checked")) {
                    allTicked = false;
                    break;
                }
            }
            if (allTicked) {
                link.text("Deselect all");
                link.removeClass("select-all");
            } else {
                link.text("Select all");
                link.addClass("select-all");
            }
        };
        inputs.click(clickHandler);
        clickHandler();
        o.modeSelectAll(link);
    };
    o.setupCheckboxLists = function () {
        tfl.logs.create("tfl.forms: setup checkbox lists");
        $(".to-checkbox-list").each(function () {
            var list = $("<ul class='clearfix'></ul>");
            var i = 1;
            var numItems = $(this).children("option").length;
            $(this).children().each(function () {
                var item = $("<li></li>");
                if (i % 2 === 1) {
                    item.addClass("odd");
                }
                var value = $(this).attr("value");
                var caption = $(this).text();
                var input = $("<input type='checkbox' />")
                    .attr("id", value);
                if ($(this).attr("selected") !== undefined) {
                    input.attr("checked", "checked");
                }
                item.append(input);

                var label = $("<label for='" + value + "' class='" + value + "'></label>");
                label.append(caption);
                item.append(label);
                list.append(item);
                i++;
            });
            $(this).after(list);
            if ($(this).hasClass("select-all")) {
                list.addClass("select-all");
                o.setupCheckBoxSelectall(list);
            }

            $(this).hide();
        });
    };
    o.setupHorizontalToggles = function () {
        tfl.logs.create("tfl.forms: setup horizontal toggles");
        $(".horizontal-toggle-buttons").each(function () {
            var inputs = $(this).find("input");
            inputs.filter(":checked").parent().addClass("selected");
            inputs.focus(function () { $(this).parent().addClass("focus"); });
            inputs.blur(function () { $(this).parent().removeClass("focus"); });
            var parents = inputs.parent();
            inputs.change(function () {
                parents.removeClass("selected");
                $(this).parent().addClass("selected");
            });

        });
    };
    
        
    o.setupCustomInputs = function () {
        $(".checkbox-list input[type='checkbox'], .radiobutton-list input[type='radio'], .styled-checkbox input[type='checkbox']").each(function () {
            if ($(this).attr("checked") === "checked") {
                $(this).parent().addClass("ticked");
            }
            $(this).focus(function () { $(this).parent().addClass("focus"); });
            $(this).blur(function () { $(this).parent().removeClass("focus"); });
        });
    };
    
    o.toggleCustomInput = function (e) {
        var radiobuttonList = $(this).parents(".radiobutton-list");
        if (radiobuttonList.length > 0) {
            $(this).parent().parent().children("li,.radiobutton-list-item").removeClass("ticked");
        }
        $(this).parent().toggleClass("ticked");
        var toCheckboxList = $(this).parent().parent().prev("select.to-checkbox-list");
        if (toCheckboxList.length > 0) {
            var checkbox = $(this);
            var waitToUpdate = function () {
                var selected = checkbox.attr("checked") === "checked";
                if (selected) {
                    toCheckboxList.find("option[value='" + checkbox.attr("id") + "']").attr("selected", "selected");
                } else {
                    toCheckboxList.find("option[value='" + checkbox.attr("id") + "']").removeAttr("selected");
                }
            };
            setTimeout(waitToUpdate, 10);
        }
    };

    o.toggleMoreInfo = function (e) {
        e.preventDefault();
        $(this).closest('.more-info-header').toggleClass('expanded');
    }


    o.init = function(selector) {
        o.settings();

        o.setupSelectBoxes();
        o.setupCheckboxLists();
        o.setupHorizontalToggles();
        o.setupCustomInputs();

        $(".checkbox-list input[type='checkbox'], .radiobutton-list input[type='radio']").click(o.toggleCustomInput);
        $(".styled-checkbox input[type='checkbox']").click(o.toggleCustomInput);
        $('.more-info-header .show-more-info').click(o.toggleMoreInfo);


        

    }

    
    o.init();

}(window.tfl.forms = window.tfl.forms || {}));
(function (o) {
    "use strict";
    tfl.logs.create("tfl.geolocation: loaded");

    o.minAccuracy = 1000;

    o.geocoder = null;

    o.geolocationTimeout = 10000;


    /*o.geolocateMe = function (success, failure) {
        if (o.isGeolocationSupported) {
            navigator.geolocation.getCurrentPosition(success, failure);
        }
    };*/

    o.isGeolocationSupported = function () {
        if ("geolocation" in navigator && navigator["geolocation"] !== null) {
            tfl.logs.create("tfl.geolocation: isGeolocationSupported true");
            return true;
        } else {
            tfl.logs.create("tfl.geolocation: isGeolocationSupported false");
            return false;
        }
    };
    
    o.geolocateMe = function (inputEl, callback) {
        tfl.logs.create("tfl.geolocation: geolocate me");
        o.clearGeolocationError();
        var el = $(inputEl);
        el.typeahead("setQuery", "");
        el.originalPlaceholder = el.attr("placeholder");
        el.attr("placeholder", "Finding address...");
        var success = function (position) {
            if (position.coords && position.coords.accuracy && position.coords.accuracy > tfl.geolocation.minAccuracy) {
                tfl.logs.create("tfl.geolocation.geolocate me: ERROR: inaccuracy too high: " + position.coords.accuracy + "m");
                o.geolocationError("We cannot find your current location. Please try again", el);
                el.parent().siblings(tfl.removableContent.RemoveContentClass).hide();
                return;
            }
            $(inputEl + "Geolocation").val(position.coords.longitude + "," + position.coords.latitude);
            o.setupInputBoxForGeolocation(el);
            if (callback) {
                callback();
            }
        };
        var failure = function (err) {
            el.parent().siblings(tfl.removableContent.RemoveContentClass).hide();
            el.closest('[data-current-location]').removeAttr("data-current-location");
            if (err.code) {
                if (err.code === 1) {
                    tfl.logs.create("tfl.geolocation.geolocateMe: ERROR: permission denied");
                    o.geolocationError("Permission from browser needed before finding your location", el);
                } else if (err.code === 2) {
                    tfl.logs.create("tfl.geolocation.geolocateMe: ERROR: position unavailable");
                    o.geolocationError("We cannot find your current location. Please try again", el);
                } else if (err.code === 3) {
                    tfl.logs.create("tfl.geolocation.geolocateMe: ERROR: timeout");
                    o.geolocationError("We cannot find your current location. Please try again", el);
                }
            } else {
                o.geolocationError("We cannot find your current location. Please try again", el);
            }
        };
        try {
            navigator.geolocation.getCurrentPosition(success, failure, { timeout: o.geolocationTimeout });
        } catch (e) {
            o.geolocationError("Your device does not support the location feature", el);
        }
    };

    o.geolocationError = function (msg, el) {
        $(".geolocation-error").text(msg).removeClass("hidden");
        el.attr("placeholder", el.originalPlaceholder);
    };

    o.clearGeolocationError = function() {
        $(".geolocation-error").addClass("hidden");
    };

    o.setupInputBoxForGeolocation = function (el) {
        //ignoreKeys variable contains keycodes for keys like tab, ctrl etc which shouldn't clear the input box
        //see http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
        var ignoreKeys = [9, 16, 17, 18, 19, 20, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 91, 92, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 144, 145];
        var parent = el.parent();
        parent.attr("data-current-location", "true");
        parent.addClass("geocoded");
        el.typeahead("setQuery", tfl.dictionary.CurrentLocationText);
        //clear the box on input
        el.on("keydown", function (e) {
            if (ignoreKeys.indexOf(e.keyCode) > -1) {
                return;
            }
            if (parent.attr("data-current-location")) {
                parent.removeAttr("data-current-location");
                parent.removeClass("geocoded");
                el.typeahead("setQuery", "");
                $(el.selector + "Geolocation").val("");
            }
        });
    };
}(window.tfl.geolocation = window.tfl.geolocation || {}));
window.tfl.autocomplete = window.tfl.autocomplete || {};
(function (o) {
    "use strict";
    tfl.logs.create("tfl.autocomplete.sources: loaded");
    o.autocompleteDisplayNumberLimit = 10;

    //stations stops functions
    o.stationsStopsSelectionCallback = function (inputEl, datum) {
        var el = $(inputEl);
        var a = datum.a || datum.placeId;
        el.attr("data-" + el.attr("id").toLowerCase() + "-id", a);
        var c = JSON.stringify(datum.c ? datum.c : datum.placeModes);
        el.attr("data-" + el.attr("id").toLowerCase() + "-modes", c);
    };
    o.stationsStopsRemoveContent = function(inputEl) {
        var el = $(inputEl);
        el.removeAttr("data-" + el.attr("id").toLowerCase() + "-id");
        el.removeAttr("data-" + el.attr("id").toLowerCase() + "-modes");
    };
    function compareStringLengths(a, b) {
        if (a.a.length < b.a.length) return -1;
        if (a.a.length > b.a.length) return 1;
        return 0; // a and b are the same length
    }
    
    // consumer should define this if they wish to do stuff (e.g. submit form) after geo has executed
    o.geoCallback = function () { };

    //Geolocation (used specifically by JP)
    var geolocationName = "geolocation";
    var geolocationLinkText = "Use my location";
    o.geolocation = {
        name: geolocationName,
        local: [{
            value: geolocationLinkText,
            dataset: geolocationName
        }],
        valueKey: "value",
        minLength: 0,
        limit: 1,
        template: "<a class='geolocation-link' href='javascript:void(0)'><span class='geolocation-icon'>&nbsp</span>{{value}}</a>",
        engine: Hogan,
        footer: "<span class='source-footer'>&nbsp</span>"
    };
    
    // GeoLocation (used everywhere other than JP)
    o.geoLocation = {
        name: geolocationName,
        local: [{
            value: geolocationLinkText,
            dataset: geolocationName
        }],
        prefetch: "",
        remote: "",
        valueKey: "value",
        minLength: 0,
        limit: 1,
        template: "<a class='geolocation-link' href='javascript:void(0)'><span class='geolocation-icon'>&nbsp</span>{{value}}</a>",
        engine: Hogan,
        header: "",
        footer: "<span class='source-footer'>&nbsp</span>",
        callback: function (inputEl) {
            $(inputEl).removeAttr("data-dataset-name");
            o.stationsStopsRemoveContent(inputEl);
            tfl.geolocation.geolocateMe(inputEl, o.geoCallback);
        }
    };

    //recent searches
    o.getRecentSearches = function (name, local, callback, template) {
        return {
            callback: callback,
            engine: Hogan,
            footer: "<span class='source-footer'>&nbsp</span>",
            header: "<span class='source-header'>Recent searches</span>",
            limit: 5,
            local: local,
            minLength: 0,
            name: name,
            template: template,
            valueKey: "name"
        };
    };

    // used for JP only:
    o.recentSearches = {
        engine: Hogan,
        footer: "<span class='source-footer'>&nbsp</span>",
        header: "<span class='source-header'>Recent searches</span>",
        limit: 5,
        minLength: 0,
        name: "recent-searches",
        valueKey: "name"
    };
    
    //turn on recent searches
    o.getTurnOnOffRecentSearches = function(turnOnNotTurnOff, local) {
        local[0].dataset = turnOnNotTurnOff ? "recent-searches-footer-on" : "recent-searches-footer-off";
        return {
            engine: Hogan,
            footer: "<span class='source-footer'>&nbsp</span>",
            limit: 1,
            local: local,
            minLength: 0,
            name: turnOnNotTurnOff ? "recent-searches-footer-on" : "recent-searches-footer-off",
            template: "<span class='recent-searches-on-off-footer'><a href='javascript:void(0)'>{{linkText}}</a></span>",
            valueKey: "linkText"
        };
    };
    
    //JP Suggestions
    o.journeyPlannerSuggestions = {
        name: "journey-planner-suggestions",
        local: "",
        prefetch: {
            url: "../cdn/static/feed/stations-list_typeahead.json",
            ttl: 2629740000 //1 month in milliseconds
        },
        remote: "",
        valueKey: "b",
        minLength: 1,
        limit: o.autocompleteDisplayNumberLimit,
        template: "<div class='mode-icons'>{{#c}}<span class='mode-icon {{.}}-icon'>&nbsp;</span>{{/c}}</div><span class='stop-name'>{{b}}</span>",
        engine: Hogan,
        header: "",
        footer: "",
        callback: o.stationsStopsSelectionCallback,
        removeContent: o.stationsStopsRemoveContent
    };
    
    o.routesSearchFactory = function (modes, callback, regexCharacterString) {
        return {
            name: "routes-search",
            local: "",
            prefetch: "",
            remote: {
                url: tfl.addAppIdAndKey(tfl.api.RoutesSearch.format(modes)),
                cache: true,
                replace: function(url, uriEncodedQuery) { /* remove url-encoded spaces from input */
                    var rgx = regexCharacterString == null ? new RegExp("[^a-zA-Z0-9 /().']", "g") : new RegExp(regexCharacterString, "g");
                    return url.replace("%QUERY", decodeURIComponent(uriEncodedQuery).replace(rgx, ""));
                },
                filter: function (response) { /* parse suggestions out of response  */
                    var results = [];
                    var searchMatches = response.searchMatches;
                    for (var i = 0; i < searchMatches.length; i++) {
                        var searchMatch = searchMatches[i];
                        // add 'lineCssClass' for tube
                        if (searchMatch.mode === tfl.modeNameTube) {
                            searchMatch.cssClass = searchMatch.lineName.indexOf(" ") != -1 ? searchMatch.lineName.substring(0, searchMatch.lineName.indexOf(" ")).toLowerCase() : searchMatch.lineName.toLowerCase();
                        } else {
                            searchMatch.cssClass = "";
                        }
                        
                        results.push(
                            {
                                "a": searchMatch.lineName + (searchMatch.mode == tfl.modeNameTube ? " line" : ""),
                                "b": searchMatch.lineId,
                                "c": searchMatch.mode,
                                "f": searchMatch.cssClass
                            });
                        results.sort(compareStringLengths);
                    }
                    return results;
                }
            },
            valueKey: "a",
            template: "<span class='mode-icon {{c}}-icon'>&nbsp;<span class='{{f}}'>&nbsp;</span></span><span class='stop-name' data-id='{{b}}'>{{a}}</span>",
            engine: Hogan,
            minLength: 1,
            limit: 10,
            header: "",
            footer: "",
            callback: callback
        };
    };
    o.stopPointsSearchFactory = function (modes, callback, excludeHubsAndPlatforms, oysterOnly, name) {
        oysterOnly = oysterOnly != true ? false : true;
        if (name == null) name = "stop-points-search";
        return {
            name: name,
            local: "",
            prefetch: "",
            remote: {
                url: tfl.addAppIdAndKey(tfl.api.StopPointsSearch.format(modes, oysterOnly)),
                cache: true,
                replace: function (url, uriEncodedQuery) { /* remove url-encoded spaces from input */
                    var rgx = new RegExp("[^a-zA-Z0-9 &-/().']", "g");
                    return url.replace("%QUERY", decodeURIComponent(uriEncodedQuery).replace(rgx, ""));
                },
                filter: function (response) { /* parse suggestions out of response  */
                    function mostModesComparator(a, b) {
                        var modesDiff = b["c"].length - a["c"].length;
                        if (modesDiff === 0) {
                            return a["a"] > b["a"] ? 1 : -1;
                        } else {
                            return modesDiff;
                        }
                    }
                    function isSearchMatchTopLevel(matchedStop, matchedStops) {
                        for (var j = 0; j < matchedStops.length; j++) {
                            if (matchedStops[j].id == matchedStop.parentId) {
                                return false;
                            }
                        }
                        return true;
                    }
                    //exclude hubs and platforms
                    function searchStationsOnly(matchedStop) {
                        //Hubs are defined as having 3 or more modes.
                        if (matchedStop.modes && matchedStop.modes.length > 2) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                        
                    var searchMatches = response.matches;
                    var results = [];
                    
                    for (var i = 0; i < searchMatches.length; i++) {
                        var searchMatch = searchMatches[i];
                        //var isHub = searchMatch.id == searchMatch.topMostParentId;
                        if (excludeHubsAndPlatforms) {
                            if (searchStationsOnly(searchMatch)) {
                                results.push({
                                    "a": searchMatch.name,
                                    "b": searchMatch.id,
                                    "c": searchMatch.modes,
                                    "d": searchMatch.lat,
                                    "e": searchMatch.lon
                                });
                            }
                        } else {
                            if (isSearchMatchTopLevel(searchMatch, searchMatches)) {
                                results.push({
                                    "a": searchMatch.name,
                                    "b": searchMatch.id,
                                    "c": searchMatch.modes,
                                    "d": searchMatch.lat,
                                    "e": searchMatch.lon
                                });
                            }
                        }
                    }
                    results.sort(mostModesComparator);
                    return results;
                }
            },
            valueKey: "a",
            template: "<div class='mode-icons'>{{#c}}<span class='mode-icon {{.}}-icon'>&nbsp;</span>{{/c}}</div><span class='stop-name' data-id='{{b}}'>{{a}}</span>",
            engine: Hogan,
            minLength: 3,
            limit: 10,
            header: "",
            footer: "",
            callback: callback
        };
    };

})(window.tfl.autocomplete.sources = window.tfl.autocomplete.sources || {});
(function (o) {
    "use strict";
    tfl.logs.create("tfl.autocomplete: loaded");
    o.ClearSearchBox = 'clear-search-box';
    o.setup = function (inputEl, dataSources, binding) {

        var el = $(inputEl);
        //no autocomplete for IE7 - it's too buggy
        if ($("html").hasClass("lt-ie8")) {
            return;
        }
        // modify replace and filter to add/remove throbber to indication data retrieval.
        $(dataSources).each(function () {
            if (this.remote && this.remote["filter"] && this.remote["replace"]) {
                var originalReplace = this.remote["replace"];
                var replace = function (url, uriEncodedQuery) {
                    el.parent(".twitter-typeahead").addClass("downloading");
                    return originalReplace(url, uriEncodedQuery);
                };
                this.remote["replace"] = replace;
                var originalFilter = this.remote["filter"];
                var filter = function (response) {
                    // remove throbber
                    el.parent(".twitter-typeahead").removeClass("downloading");
                    return originalFilter(response);
                };
                this.remote["filter"] = filter;
            }
        });

        tfl.logs.create("tfl.autocomplete.setup: started");
        el.typeahead(dataSources)
        .on("keydown.autocomplete", function (e) { //only relevant to where item from a dataset has already been selected
            var dataset = el.attr("data-dataset-name");
            if (dataset) {
                for (var i = 0; i < dataSources.length; i++) {
                    var dataSource = dataSources[i];
                    if (dataset === dataSource.name) {
                        if (dataSources[i].keydown) {
                            dataSources[i].keydown(e, inputEl);
                        }
                        break;
                    }
                }
            }
        }).on("typeahead:selected typeahead:autocompleted", function (e, datum, dataset) {
            if (dataset) {
                for (var i = 0; i < dataSources.length; i++) {
                    var dataSource = dataSources[i];
                    if (dataset === dataSource.name) {
                        if (dataSource.callback) {
                            dataSource.callback(inputEl, datum, dataset);
                        }
                        if (dataSource.contextCallback) {
                            dataSource.contextCallback(inputEl, datum, dataset);
                        }
                        break;
                    }
                }
                el.attr("data-dataset-name", dataset);
            }
        }).parent().siblings(tfl.dictionary.RemoveContentClass).bind(o.ClearSearchBox, function () {
            $(this).click();
        });

        //bind 'remove-content' click to input element.
        if (binding) {
            el.parent().siblings(tfl.dictionary.RemoveContentClass).click(function() {
                var dataset = el.attr("data-dataset-name");
                if (dataset) {
                    for (var i = 0; i < dataSources.length; i++) {
                        var dataSource = dataSources[i];
                        if (dataset === dataSource.name) {
                            if (dataSources[i].removeContent) {
                                dataSources[i].removeContent(el);
                            }
                            break;
                        }
                    }
                    el.removeAttr("data-dataset-name");
                }
                el.typeahead("setQuery", "");
            });
        };
    };// end of setup function

    o.tokenize = function(datums, name) {
        var charsThatNeedTokens = ["'", "(", "&", "-"];
        for (var a = 0; a < datums.length; a++) {
            var datum = datums[a];
            var datumNameSplit = datum[name].trim().split(" ");
            var datumTokens = datumNameSplit;
            var needsTokens = false;
            for (var b = 0; b < datumNameSplit.length; b++) {
                var datumNamePiece = datumNameSplit[b];
                for (var c = 0; c < charsThatNeedTokens.length; c++) {
                    var tokenChar = charsThatNeedTokens[c];
                    if (datumNamePiece.indexOf(tokenChar) !== -1) {
                        datumTokens.push.apply(datumTokens, datumNamePiece.trim().split(tokenChar));
                        needsTokens = true;
                    }
                }
            }

            if (needsTokens && datumTokens.length > 0) {
                // clean up datumTokens
                var cleanTokens = [];
                for (var d = 0; d < datumTokens.length; d++) {
                    var addToken = true;
                    var datumToken = datumTokens[d];
                    // join "s" onto datumToken if next datumToken is "s" (e.g. king's > ["king","s"]
                    if (datumTokens.length >= d + 1 && datumTokens[d + 1] === "s") {
                        datumToken += "s";
                    }
                    // check dataToken has not already been added
                    for (var e = 0; e < cleanTokens.length; e++) {
                        if (datumToken === cleanTokens[e]) {
                            addToken = false;
                            break;
                        }
                    }
                    if (datumToken !== "s" && datumToken !== "" && addToken) {
                        cleanTokens.push(datumToken);
                    }
                }
                if (cleanTokens.length > 0) {
                    datum.tokens = cleanTokens;
                }
            }
        }

        return datums;
    };

    o.addBlankTokens = function(datums) {
        for (var a = 0; a < datums.length; a++) {
            datums[a].tokens = [];
        }
        
        return datums;
    };

})(window.tfl.autocomplete = window.tfl.autocomplete || {});
window.tfl.autocomplete = window.tfl.autocomplete || {};
(function (o) {
    "use strict";
    tfl.logs.create("tfl.autocomplete.recentMagicSearches: loaded");
    o.searches = {};
    o.usingRecentSearches = tfl.storage.get('usingRecentMagicSearches', true);
    o.isLoaded = false;
    o.recentSearchNumberLimit = 5;
    o.recentSearchTimeLimit = 2629740000; //1 month in milliseconds

    o.useRecentSearches = function (on) {
        o.usingRecentSearches = on;
        tfl.storage.set("usingRecentMagicSearches", o.usingRecentSearches);
        o.searches = {};
        tfl.storage.set("recentMagicSearches", o.searches);
        return false;
    };

    o.loadSearches = function () {
        tfl.logs.create("tfl.autocomplete.recentMagicSearches.loadSearches: initialised");
        if (!o.isLoaded) {
            if (o.usingRecentSearches) {
                o.searches = tfl.storage.get("recentMagicSearches", {});
                // remove old searches
                var timeNow = new Date().getTime();
                var itemRemoved;
                for (var type in o.searches) {
                    if (o.searches.hasOwnProperty(type)) {
                        for (var mode in o.searches[type]) {
                            if (o.searches[type].hasOwnProperty(mode)) {
                                for (var i = 0; i < o.searches[type][mode].length; i++) {
                                    if (o.searches[type][mode][i] !== undefined) {
                                        var item = o.searches[type][mode][i];

                                        if (!item.hasOwnProperty('lastSearchDate') || item.lastSearchDate < (timeNow - o.recentSearchTimeLimit)) {
                                            tfl.logs.create("tfl.autocomplete.recentMagicSearches: removing old searches");
                                            o.searches[type][mode].splice(i, 1); //remove from local memory
                                            itemRemoved = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
                if (itemRemoved) tfl.storage.set("recentMagicSearches", o.searches);
            }
            o.isLoaded = true;
        }
    };

    o.saveSearch = function (newName, newId, newModes, newType, lat, lon, cssClass) {
        tfl.logs.create("tfl.autocomplete.recentMagicSearches.saveSearch: initialised");

        // load recent searches
        o.loadSearches();

        if (newName === "") return true;
        if (newId === null) newId = "";
        if (cssClass === null) cssClass = "";
        if (typeof newModes == "string" && newModes !== "") {
            newModes = jQuery.parseJSON(newModes);
        }
        if (newModes === null) newModes = [];
        var timeNow = new Date().getTime();
        if (newType == "lines") {
        // mode part of object properties (e.g. type: Lines)
            var newMode = newModes[0].toString();
            // check whether object exists within o.searches, and if not then add it
            if (o.searches[newType]) {
                if (o.searches[newType][newMode]) {
                    // is search aleardy in recent searches? if so, remove (it will be added back in at top of list later)
                    for (var b = 0; b < o.searches[newType][newMode].length; b++) {
                        var line = o.searches[newType][newMode][b];
                        if (line.id.toLowerCase() == newId.toLowerCase()) {
                            o.searches[newType][newMode].splice(b, 1); //remove from array
                            break;
                        }
                    }
                } else {
                    o.searches[newType][newMode] = [];
                }
            } else {
                o.searches[newType] = {};
                o.searches[newType][newMode] = [];
            }
            
            //new search line
            var newLine = {
                lastSearchDate: timeNow,
                name: newName,
                id: newId,
                mode: newMode,
                cssClass: cssClass,
                type: newType
            };

            //insert into array and into local memory
            o.searches[newType][newMode].splice(0, 0, newLine);

            //limit number of recent searches that are stored in the autocomplete list
            if (o.searches[newType][newMode].length > o.recentSearchNumberLimit) {
                o.searches[newType][newMode].length = o.recentSearchNumberLimit;
            }

        } else if (newType == "stops") {
        // modes stored as array (e.g. type: Stops)
            // check whether object exists within o.searches, and if not then add it
            if (o.searches[newType]) {
                // is search aleardy in recent searches? if so, remove (it will be added back in at top of list later)
                for (var c = 0; c < o.searches[newType].length; c++) {
                    var stopPoint = o.searches[newType][c];
                    if (stopPoint.id.toLowerCase() == newId.toLowerCase()) {
                        o.searches[newType].splice(c, 1); //remove from array
                        break;
                    }
                }
            } else {
                o.searches[newType] = [];
            }

            //new search item
            var newStop = {
                lastSearchDate: timeNow,
                name: newName,
                id: newId,
                modes: newModes,
                lat: lat,
                lon: lon,
                type: newType
            };

            //insert into array and into local memory
            o.searches[newType].splice(0, 0, newStop);

            //limit number of recent searches that are stored in the autocomplete list
            if (o.searches[newType].length > o.recentSearchNumberLimit) {
                o.searches[newType].length = o.recentSearchNumberLimit;
            }
        }

        tfl.storage.set("recentMagicSearches", o.searches);
        return true;
    };
    
    o.geolocateMe = function (inputEl, callback) {
        var geolocationError = function(msg) {
            $(".geolocation-error").text(msg).removeClass("hidden");
        };

        tfl.logs.create("tfl.autocomplete.recentMagicSearches.geolocateMe: initialised");
        var el = $(inputEl);
        el.typeahead("setQuery", "");
        el.attr("placeholder", "Finding address...");
        var success = function (position) {
            //if (position.coords && position.coords.accuracy && position.coords.accuracy > tfl.geolocation.minAccuracy) {
            if (position.coords && position.coords.accuracy && position.coords.accuracy > 1000000) {
                tfl.logs.create("tfl.journeyPlanner.searchForm.geolocate me: ERROR: inaccuracy too high: " + position.coords.accuracy + "m");
                geolocationError("We cannot find your current location. Please try again");

                return;
            }
            //el.typeahead("setQuery", position.coords.longitude + "," + position.coords.latitude);
            el.val(position.coords.longitude + "," + position.coords.latitude);
            $(inputEl).append("<input type='hidden' id='lat' name='lat' value='" + position.coords.latitude + "' />");
            $(inputEl).append("<input type='hidden' id='lon' name='lon' value='" + position.coords.longitude + "' />");
            //o.setupInputBoxForGeolocation(el);
            if (callback) {
                callback();
            }
        };
        
        var failure = function (err) {
            if (err.code) {
                if (err.code === 1) {
                    tfl.logs.create("tfl.journeyPlanner.searchForm.geolocateMe: ERROR: permission denied");
                    geolocationError("Permission from browser needed before finding your location");
                } else if (err.code === 2) {
                    tfl.logs.create("tfl.journeyPlanner.searchForm.geolocateMe: ERROR: position unavailable");
                    geolocationError("We cannot find your current location. Please try again");
                } else if (err.code === 3) {
                    tfl.logs.create("tfl.journeyPlanner.searchForm.geolocateMe: ERROR: timeout");
                    geolocationError("We cannot find your current location. Please try again");
                }
            } else {
                geolocationError("We cannot find your current location. Please try again");
            }
        };
        
        try {
            navigator.geolocation.getCurrentPosition(success, failure);
        } catch (e) {
            geolocationError("Your device does not support the location feature");
        }
    };

    o.test = function() {
        o.saveSearch("211", "502", ["bus"], "lines");
        o.saveSearch("36", "609", ["bus"], "lines");
        o.saveSearch("Emirates Greenwich Peninsula (Air Line Terminal)", "9400ZZALGWP1", ["cable-car"], "stops");
        o.saveSearch("Victoria Underground Station", "9400ZZLUVIC1", ["tube"], "stops");
        o.saveSearch("Southwark Underground Station", "9400ZZLUSWK1", ["tube"], "stops");
    };

})(window.tfl.autocomplete.recentMagicSearches = window.tfl.autocomplete.recentMagicSearches || {});
(function(o) {
    var imageAttr = 'data-highlight-image';
    var fileAttr = 'data-highlight-file';

    o.init = function() {
        var noBackgroundImageClass = 'no-background-image';
        var heroObjs = $('[' + imageAttr + ']');
        heroObjs.push($('[' + fileAttr + ']'));

        var containers = [];
        $(window).one("enterBreakpointMedium", function() {
            $.each(heroObjs, function(k, v) {
                var obj = $(v), imgFor = $(obj.attr('data-highlight-for'));
                containers.push(imgFor);

                if (obj.attr(imageAttr)) {
                    imgFor.attr('style', 'background-image: url(' + obj.attr(imageAttr) + ')');
                } else if (obj.attr(fileAttr)) {
                    tfl.ajax({ url: obj.attr(fileAttr), success: setImageFromSource });
                }

                function setImageFromSource(objs) {
                    var activeObjs = $.grep(objs, function(o) {
                        return o.active;
                    });
                    var selectedObj = activeObjs[Math.floor(Math.random() * (activeObjs.length))];
                    imgFor.attr('style', 'background-image: url(' + selectedObj.backgroundImage + ')');
                    var advLinkBox = imgFor.find('.advert-link-box').attr('href', selectedObj.link).show();
                    advLinkBox.find('h2').text(selectedObj.headline);
                    advLinkBox.find('p').text(selectedObj.text);
                    advLinkBox.find('img').attr('src', selectedObj.imageURL);
                }
                var newObj = obj.clone();
                newObj.find('img').each(function() {
                    $(this).remove();
                });
                imgFor.find('.content-area').append(newObj);
                obj.addClass(obj.attr('data-highlight-size'));

                var caption = obj.find(".caption");
                if (caption) {
                    if (caption.parent().hasClass("small")) {
                        var contentArea = imgFor.find(".content-area.medium-large");
                        contentArea.addClass("no-caption");
                        var heroHeight = Math.max(415, imgFor.find(".hero-row").height());
                        contentArea.find(".advert-tile").css({ height: heroHeight + "px" });
                    }
                }

            });
        });
        $(window).bind("exitBreakpointMedium", function() {
            $.each(containers, function(k, v) {
                $(v).addClass(noBackgroundImageClass);
            });
        });
        $(window).bind("enterBreakpointMedium", function() {
            $.each(containers, function(k, v) {
                $(v).removeClass(noBackgroundImageClass);
            });
        });
        if ($("body.breakpoint-Medium").length > 0) {
            $(window).trigger('enterBreakpointMedium');
        }
        if ($("body.breakpoint-Large").length > 0) {
            $(window).trigger('enterBreakpointLarge');
        }
    };

    o.init();

}(window.tfl.heroTakeover = window.tfl.heroTakeover || {}));
(function (o) {
    "use strict";

    tfl.logs.create("tfl.recent: loaded");

    var recentCap = 5;

    // helper method 
    function toCamelCase(myString) {
        return myString.replace(/-([a-z])/g, function (g) { return g[1] !== undefined ? g[1].toUpperCase() : g[1]; });
    }

    // recent structure
    function initRecent() {
        var k;
        o.values = {};
        for (k = 0; k < tfl.objects.modes.length; k += 1) {
            o.values[toCamelCase(tfl.objects.modes[k])] = [];
        }
    };

    // get recent from storage
    function retrieveRecent() {
        var rec = tfl.storage.get("recent");
        if (rec != null) {
            for (var prop in rec) {
                if (rec.hasOwnProperty(prop)) {
                    if (!o.values.hasOwnProperty(prop)) {
                        delete rec[prop];
                    }
                }
            }
            o.values = $.extend(o.values, rec);
        }
    };

    // save recent in memory to storage
    o.saveRecent = function () {
        tfl.storage.set("recent", o.values);
    };

    Array.prototype.remove = function (from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };


    // add or update a recent with new data
    o.addRecent = function (obj) {
        if (typeof (obj) !== "object"
            || !obj.hasOwnProperty('mode')
            || obj.mode === ""
            || !obj.hasOwnProperty('naptanId')
            || obj.naptanId === "") {
            tfl.logs.create('Add recent expects object defined in tfl.objects');
            return false;
        } else {
            var alreadyRecent = false;
            for (var i = 0; i < o.values[toCamelCase(obj.mode)].length ; i += 1) {
                if (o.values[toCamelCase(obj.mode)][i].naptanId === obj.naptanId) {
                    // already in recent - bump to top.
                    alreadyRecent = true;
                    o.values[toCamelCase(obj.mode)].remove(i);
                    o.values[toCamelCase(obj.mode)].unshift(obj);
                    break;
                }
            }
            if (!alreadyRecent) {
                o.values[toCamelCase(obj.mode)].unshift(obj);
                if (o.values[toCamelCase(obj.mode)].length > recentCap) {
                    o.values[toCamelCase(obj.mode)].remove(recentCap);
                }
            }
            o.saveRecent();
            return true;
        }
    };

    // get recent by naptan id
    o.getRecent = function (naptanId) {
        if (typeof (naptanId) === "string") {
            for (var mode in o.values) {
                if (o.values.hasOwnProperty(mode)) {
                    for (var i = 0; i < o.values[mode].length ; i += 1) {
                        if (o.values[mode][i].naptanId === naptanId) return o.values[mode][i];
                    }
                }
            }
        } else {
            tfl.logs.create('Error in tfl.favourites.getRecent - Expected naptanId');
            return false;
        }
        return false;
    };

    // get recent as array, mode is optional to get one specitic mode
    o.getRecentArray = function (mode) {
        var returnArray = [];
        if (o.values.hasOwnProperty(mode)) {
            returnArray = o.values[mode];
        } else {
            for (var mode in o.values) {
                if (o.values.hasOwnProperty(mode)) {
                    returnArray = returnArray.concat(tfl.recent.values[mode]);
                }
            }
        }
        return returnArray;
    };

    //remove recent by naptan id
    o.removeRecent = function (naptanId) {
        if (typeof (naptanId) === "string" || typeof (naptanId) === "number") {
            for (var mode in o.values) {
                if (o.values.hasOwnProperty(mode)) {
                    for (var i = 0; i < o.values[mode].length ; i += 1) {
                        if (o.values[mode][i].naptanId === naptanId) delete o.values[mode][i];
                    }
                }
            }
        } else {
            tfl.logs.create('Error in tfl.recent.removeRecent - Expected naptanId');
            return false;
        }
        o.saveRecent();
        return true;
    };

    // clear all recent
    o.clearRecent = function () {
        initRecent();
        o.saveRecent();
    };

    function init() {
        if (tfl.storage.isLocalStorageSupported()) {
            initRecent();
            retrieveRecent();
        }
        tfl.logs.create("tfl.recent: setup");
    }

    init();

})(window.tfl.recent = window.tfl.recent || {});
(function (o) {
    "use strict";

    tfl.logs.create("tfl.favourites: loaded");

    var buttons = {};

    // helper method 
    function toCamelCase(myString) {
        return myString.replace(/-([a-z])/g, function (g) { return g[1] !== undefined ? g[1].toUpperCase() : g[1]; });
    }
    
    // favourites structure
    function initFavourites() {
        var k;
        o.values = {};
        for (k = 0; k < tfl.objects.modes.length; k+=1) {
            o.values[toCamelCase(tfl.objects.modes[k])] = {};
        }
    };
     
    // get favourites from storage
    function retrieveFavourites() {
        var fav = tfl.storage.get("favourites");
        if (fav != null) {
            for (var prop in fav) {
                if (fav.hasOwnProperty(prop)) {
                    if (!o.values.hasOwnProperty(prop)) {
                        delete fav[prop];
                    }
                }
            }
            o.values = $.extend(o.values, fav);
        }
    };
    
    // save favourites in memory to storage
    o.saveFavourites = function() {
        tfl.storage.set("favourites", o.values);
    };
    
    // add or update a favourite with new data
    o.addFavourite = function (obj) {
        if (typeof(obj) !== "object"
            || !obj.hasOwnProperty('mode')
            || obj.mode === ""
            || !obj.hasOwnProperty('naptanId')
            || obj.naptanId === "") {
            tfl.logs.create('Add Favourite expects object defined in tfl.objects');
            return false;
        } else {
            o.values[toCamelCase(obj.mode)][obj.naptanId] = obj;
            o.saveFavourites();
            // style all buttons relating to that naptan
            if (buttons.hasOwnProperty(obj.naptanId)) {
                for (var i = 0; i < buttons[obj.naptanId].dom.length; i += 1) {
                    buttons[obj.naptanId].dom[i].addClass('active');
                }
            }
            return true;
        }
    };
    
    // get favourite by naptan id
    o.getFavourite = function(naptanId){
        if (typeof (naptanId) === "string") {
            for (mode in o.values) {
                if (o.values.hasOwnProperty(mode)) {
                    if (o.values[mode][naptanId] !== undefined) return o.values[mode][naptanId];
                }
            }            
        } else {
            tfl.logs.create('Error in tfl.favourites.getFavourite - Expected naptanId');
            return false;
        }
        return false;
    };

    // get favourites as array, mode is optional to get one specitic mode
    o.getFavouritesArray = function(mode) {
        var returnArray = [];
        if (o.values.hasOwnProperty(mode)) {
            for (var val in o.values[mode]) {
                if (o.values[mode].hasOwnProperty(val)) {
                    returnArray.push(o.values[mode][val]);
                }
            }
        } else {
            for (var mode in o.values) {
                if (o.values.hasOwnProperty(mode)) {
                    for (var val in o.values[mode]) {
                        if (tfl.favourites.values[mode].hasOwnProperty(val)) {
                            returnArray.push(tfl.favourites.values[mode][val]);
                        }
                    }
                }
            }
        }
        return returnArray;
    };

    //remove favourite by naptan id
    o.removeFavourite = function (naptanId) {
        if (typeof (naptanId) === "string" || typeof (naptanId) === "number") {
            for (var mode in o.values) {
                if (o.values.hasOwnProperty(mode)) {
                    delete o.values[mode][naptanId];
                }
            }            
        } else {
            tfl.logs.create('Error in tfl.favourites.removeFavourite - Expected naptanId');
            return false;
        }
        o.saveFavourites();
        // style all buttons relating to that naptan
        if (buttons.hasOwnProperty(naptanId)) {
            for (var i = 0; i < buttons[naptanId].dom.length; i += 1) {
                buttons[naptanId].dom[i].removeClass('active');
            }
        }
        return true;
    };

    // clear all favourites
    o.clearFavourites = function () {
        initFavourites();
        o.saveFavourites();
        for (var naptanId in buttons) {
            if (buttons.hasOwnProperty(naptanId)) {
                for (var i = 0; i < buttons[naptanId].dom.length; i += 1) {
                    buttons[naptanId].dom[i].removeClass('active');
                }
            }
        }
        
    };

    function appendButton($placeholder, active) {
        var classes = active ? 'active' : '';

        // inject a button
        $placeholder.append('<a href="javascript:void(0)" class="plain-link with-icon favourite ' + classes + '">' +
                            '<span class="i favourite-icon"></span>' +
                            '<span class="inactive">Add Favourite</span>' +
                            '<span class="active">Favourited <span class="visually-hidden">Click to remove from favourites</span></span>' +
                        '</a>');
        return $placeholder.find('>.favourite');
    }

    // click handlers for favourite buttons
    o.setupButtons = function() {
        var $placeholders = $('[data-favourite]'),
            i;
        $placeholders.each(function () {

            var $this = $(this),
                data = $this.data('favourite'),
                fromExisting = false,
                obj, $button, favClass;
            
            if (typeof(data) === "string"){
                var matchedFavourite = o.getFavourite(data);
                if (!matchedFavourite) {
                    $this.removeAttr('data-favourite');
                    tfl.logs.create('tfl.favourites: fail to set up button, string provided - doesnt match existing favourite');
                    return true;
                }
                fromExisting = true;
                obj = matchedFavourite;
            } else if (typeof (data) !== "object") {
                $this.removeAttr('data-favourite');
                tfl.logs.create('tfl.favourites: neither string nor object passed to setupButtons');
                return true;
            }

            if (!fromExisting) {
                // check this object has a naptan id and a mode associated (both mandatory);
                if (!data.hasOwnProperty('naptanId')
                    || !data.hasOwnProperty('mode')) {
                    $this.removeAttr('data-favourite');
                    tfl.logs.create('tfl.favourites: object passed to setup button has no mode or naptanId');
                    return true;
                }

                // make it into a new SSP object
                obj = new tfl.objects.SSPObject(data.naptanId, data.mode, data.props);

                if (obj.hasOwnProperty('error')) {
                    $this.removeAttr('data-favourite');
                    tfl.logs.create('tfl.favourites: properties passed to setup button generate invalid SSPObject');
                    return true;
                }
            }

            $button = appendButton($this, o.values[toCamelCase(obj.mode)].hasOwnProperty(obj.naptanId));

            if (!buttons.hasOwnProperty(obj.naptanId)) {
                // fresh registration
                buttons[obj.naptanId] = {
                    data: obj,
                    dom: [$button]
                }
            } else {
                // already registered
                if (fromExisting) {
                    buttons[obj.naptanId].data = $.extend(obj, buttons[obj.naptanId].data); // just in case more properties in second
                } else {
                    buttons[obj.naptanId].data = $.extend(buttons[obj.naptanId].data, obj); // just in case more properties in second
                }
                buttons[obj.naptanId].dom.push($button); // add button
            }
            
            // add click to newly created child
            $button.on('click', function (e) {
                e.preventDefault();
                if ($(this).hasClass('active')) {
                    o.removeFavourite(obj.naptanId);
                } else {
                    o.addFavourite(buttons[obj.naptanId].data);
                }
            });
            
            // specific classes for fav button
            favClass = $this.data('favourite-class');
            if (favClass !== undefined) $button.addClass(favClass);

            // condtional styles should be done with with-favourite
            $this.parent().addClass('with-favourite');
                
            // clean up
            $this.removeAttr('data-favourite');

            // add to recent (all favouritable things count towards recent)
            tfl.recent.addRecent(obj);

        });

    };



    function injectFavouriteAndRecent($favs, markup) {
        var template = Hogan.compile(markup);
        var busFavsData = o.getFavouritesArray(tfl.modeNameBus);
        var recentBusData = tfl.recent.getRecentArray(tfl.modeNameBus);

        function renderFavouriteAndRecent() {
            var result = template.render({ favourites: busFavsData, recent: recentBusData });
            $favs.append(result);
            o.setupButtons();
            if (busFavsData.length > 5) {
                tfl.navigation.pagination.setup($favs.find('.favourite .bus-stops').parent(), ".bus-stops", 5, busFavsData.length);
            }
            if (recentBusData.length > 5) {
                tfl.navigation.pagination.setup($favs.find('.recent .bus-stops').parent(), ".bus-stops", 5, recentBusData.length);
            }
            var $tabs = $favs.find('.tabs-style-2 > li:not(.not-for-beta)');
            $tabs.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $this = $(this);
                if (!$this.hasClass('selected')) {
                    var $sibs = $this.parent().siblings();
                    $sibs.addClass('hidden');
                    $sibs.filter('.' + $this.data('target')).removeClass('hidden');
                    $this.addClass('selected').siblings('.selected').removeClass('selected');
                }
            });
            if (!$(markup).find('.links-only').length) {
                tfl.expandableBox.init();
                $('.close-status', $favs).on('click', function () {
                    $(this).closest('.content.expanded').removeClass('expanded');
                });
            }
        }

        var busData = busFavsData.concat(recentBusData);

        if (busData.length) {
            var max = busData.length;
            var count = 0;
            var ajaxData = {};

            var ajaxStopPoints = [];
            for (var i = 0; i < max; i += 1) {
                ajaxStopPoints.push(busData[i].naptanId);
            };

            var startDate = tfl.tools.getQueryStringParameter('startDate');

            if (startDate !== null) {
                ajaxData.url = tfl.api.StopPointsDisruptionsTimePeriod.format(ajaxStopPoints.join(","), startDate, tfl.tools.getQueryStringParameter('endDate'));
                //ajaxData.url = "/PlannedWorks";
                //ajaxData.data.startDate = startDate;
                //ajaxData.data.endDate = tfl.tools.getQueryStringParameter('endDate');
                //ajaxData.data.naptanCodes = ajaxData.data.stopPointIds.join(",");

            }else{
                ajaxData.url = tfl.api.StopPointsDisruptions.format(ajaxStopPoints.join(","));
            }

            ajaxData.success = function (response) {
                for (var a = 0; a < response.length; a += 1) {
                    if (response[a].affectedStops != null) {
                        for (var i = 0; i < response[a].affectedStops.length; i += 1) {
                            favs: for (var j = 0; j < busFavsData.length; j += 1) {
                                if (busFavsData[j].naptanId === response[a].affectedStops[i].id) {

                                    busFavsData[j].props.disrupted = "disrupted";

                                    if (!busFavsData[j].props.hasOwnProperty('disruptionInfo')) {
                                        busFavsData[j].props.disruptionInfo = "";
                                    }

                                    busFavsData[j].props.disruptionInfo += "<p>" + response[a].description + "</p>";

                                    break favs;
                                }
                            }
                            rec: for (var j = 0; j < recentBusData.length; j += 1) {
                                if (recentBusData[j].naptanId === response[a].affectedStops[i].id) {

                                    recentBusData[j].props.disrupted = "disrupted";

                                    if (!recentBusData[j].props.hasOwnProperty('disruptionInfo')) {
                                        recentBusData[j].props.disruptionInfo = "";
                                    }

                                    recentBusData[j].props.disruptionInfo += "<p>" + response[a].description + "</p>";

                                    break rec;
                                }
                            }
                        }
                    }
                }
                renderFavouriteAndRecent();
            };

            tfl.ajax(ajaxData);
        }
    }

    o.setupFavouritesAndRecent = function(opts) {
        var $target = $(opts.selector);
        if ($target.length) {
            tfl.ajax({
                url: '/static/' + tfl.settings.version + '/templates/' + opts.markup + '.html',
                success: function (response) {
                    injectFavouriteAndRecent($target, response)
                },
                dataType: 'html'
            });
        }
    };

    function init() {
        if (tfl.storage.isLocalStorageSupported()) {
            initFavourites();
            retrieveFavourites();
            o.setupButtons();
            o.setupFavouritesAndRecent({
                selector: ".favourite-and-recent",
                markup: "favourite-and-recent-links"
            });
        }
        tfl.logs.create("tfl.favourites: setup");
    }
    
    init();
   
})(window.tfl.favourites = window.tfl.favourites || {});
(function (o) {
    tfl.logs.create("tfl.navigation.pullContent: started");
    var lightBox,
        contentWrap,
        closeLink,
        obj;

    o.dataAttr = 'data-pull-content';
    var dataStorage = 'data-pull-content-storage';

    o.pullContentHandler = function (event) {
        event.preventDefault();

        obj = $(this);
        var storageKey = obj.attr(dataStorage),
            storage;
        if (storageKey) {
            storage = tfl.storage.get(storageKey);
            if (storage) {
                return false;
            } else {
                tfl.storage.set(storageKey, 'true');
            }
        }

        var content = obj.attr(o.dataAttr).split(','),
            url = obj.attr('href'),
            lightBoxType = obj.attr("data-light-box-type"),
            lightBoxMinWidth = parseInt(obj.attr("data-light-box-min-width"),10);

        tfl.logs.create("tfl.navigation.pullContent: Clicked a pull link for " + url);


        // if there is a minimum width specified and the window is too small, don't use a lightbox, just display the item in a new window.
        if(!isNaN(lightBoxMinWidth) && lightBoxMinWidth > $(window).width()){
            window.open(url, '_blank');
            return false;
        }

        lightBoxType = lightBoxType === undefined ? "alert" : lightBoxType; // default light box is  an alert.
        lightBox.attr('data-type', lightBoxType);

        var ajaxSuccess = function (response) {
            var html = $(response),
                hasContent = false,
                tabbables;
            for (var i = 0; i < content.length; i++) {
                $.each(html.find($.trim(content[i])), function(k, v) {
                    hasContent = true;
                    var snipet = $('<p></p>').append($(v)).html();
                    contentWrap.append(snipet);
                    /// ?
                });
            }
            if (!hasContent) {
                document.location.href = url;
                return true;
            }
            closeLink.focus();
            tabbables = contentWrap.find(":tabbable");
            $(tabbables[tabbables.length - 1]).addClass("light-box-last-tab-target").attr("data-jumpto", ".close-light-box");
        };

        if (url.length > 0) {

            if (lightBoxType === "image") {
                var img = new Image();
                img.src = url;
                img.alt = obj.text();
                contentWrap.append(img);

                lightBox.addClass('active');
                closeLink.focus();

            } else {

                tfl.ajax({ url: url, success: ajaxSuccess, dataType:"text" });
                lightBox.addClass("active");

            }
        }
    };
    o.initialised = false;
    o.init = function () {
        var lightBoxes = $('[' + o.dataAttr + ']');

        var ajaxSuccess = function (response) {
            
            lightBox = $(response);
            closeLink = lightBox.find('.close-light-box');
            contentWrap = lightBox.find('.content');

            lightBox.on('click.lightBox', function(e) {
                closeLink.trigger('click.lightBox');
            });
            lightBox.find('.content-wrap').on('click.lightBox', function(e) {
                e.stopPropagation();
            });
            closeLink.on('click.lightBox', function() {
                contentWrap.empty();
                lightBox.removeClass("active");
                obj.focus();
            });
            $(document.body).append(lightBox);
            lightBoxes.click(o.pullContentHandler);
            o.initialised = true;
            tfl.logs.create("tfl.navigation.pullContent: initialised");
        };
        
        if (lightBoxes.length && !o.initialised) {
            tfl.ajax({url: '/static/' + tfl.settings.version + '/templates/light-box.html', success: ajaxSuccess, dataType:"text"});
        } else {
            lightBoxes.off('click').click(o.pullContentHandler);
        }
    };

    o.init();
})(window.tfl.navigation = window.tfl.navigation || {});
var tfl = tfl || {};
(function (tfl) {
    "use strict";
    tfl.logs.create("tfl.serviceStatus: loaded");

    var clickLine = function (row) {
        var rainbowBoard = $('.rainbow-list-wrapper, .rainbow-board.roads');
        if (row.parent('.rainbow-list-item').hasClass('expandable')) {
            var parent = row.parent('.rainbow-list-item');
            if (!parent.hasClass('expanded')) {
                var lineId = parent.data('line-id');
                $('.rainbow-list-item.expanded', rainbowBoard).removeClass('expanded');
                parent.addClass("expanded");
                rainbowBoard.addClass("fade-to-black");
                if (tfl.hasOwnProperty('tubeMap')) {
                    tfl.tubeMap.zoomToLineId(lineId);
                }
                parent.trigger('rainbow-list.expanded');
                window.location.hash = lineId;
            } else {
                parent.removeClass("expanded");
                rainbowBoard.removeClass("fade-to-black");
                if (tfl.hasOwnProperty('tubeMap')) {
                    tfl.tubeMap.resetToInitialView();
                }
                parent.trigger('rainbow-list.collapsed');
                window.location.hash = "-";
            }
        }
    };

    tfl.serviceStatus = {

        initServiceBoardPage: function () {
            tfl.logs.create("tfl.serviceStatus: initialised");
            tfl.serviceStatus.serviceUpdatesBoard();
        },
        pageSetup: function () {
            var rainbowBoard = $('.rainbow-list-wrapper, .rainbow-board.roads')

            $(".lines-stations-tab li").click(function () {
                clickTab($(this));
                rainbowBoard.removeClass("fade-to-black");
                //tfl.serviceStatus.appendHashToDatePickerAnchors("");
            });

            $(".lines-stations-tab .lines-tab").click(function () {
                tfl.serviceStatus.appendHashToDatePickerAnchors("");
            });

            $(".lines-stations-tab .stations-tab").click(function () {
                tfl.serviceStatus.appendHashToDatePickerAnchors("#stations-status");
            });

            var clickTab = function (tab) {
                tfl.logs.create("tfl.serviceStatus: click on tab");


                if (tab.hasClass("selected")) {
                    return;
                }

                var linesStatus = $(".lines-status"),
                stationsStatus = $(".stations-status"),
                linesTab = $(".lines-tab"),
                stationsTab = $(".stations-tab");

                if (linesStatus.hasClass("visible")) {
                    linesStatus.removeClass("visible");
                    stationsStatus.addClass("visible");
                    linesTab.removeClass("selected");
                    stationsTab.addClass("selected");
                } else {
                    stationsStatus.removeClass("visible");
                    linesStatus.addClass("visible");
                    stationsTab.removeClass("selected");
                    linesTab.addClass("selected");
                }
            };

            //on a click through from the home-page check if a specific line has been selected and if so expand it on open.
            if (window.location.hash !== "") {
                var lineHash = window.location.hash;
                tfl.logs.create("tfl.serviceStatus: page hash is " + lineHash);
                var lineVar = lineHash.substr(1);
                if (lineVar === "stations-status") {
                    $(".lines-stations-tab .stations-tab").click();
                } else {
                    var clickThroughLine = $('[data-line-class=' + lineVar.toLowerCase() + ']');
                    if (clickThroughLine.length > 0) {
                        clickLine(clickThroughLine);
                    } else {
                        var clickThroughStation = $('[data-station-class=' + lineVar.toLowerCase() + ']');
                        if (clickThroughStation.length > 0) {
                            clickTab(stationsTab);
                            clickLine(clickThroughStation);
                        }
                    }
                }
            }
        },
        serviceUpdatesBoard: function () {
            var rainbowBoard = $('.rainbow-list-wrapper, .rainbow-board.roads');
            //close message closes its respective dropdown
            $(".close-disruption-info").click(function () {
                $(this).closest('.info-dropdown').prev().removeClass('selected');
                $(".rainbow-board").removeClass("fade-to-black");
            });
            $('.rainbow-list-content .close-message', rainbowBoard).on('click', function (e) {
                e.preventDefault();
                $(this).closest('.rainbow-list-item').removeClass('expanded');
                rainbowBoard.removeClass("fade-to-black");
            });

            $("[data-line-class], [data-station-class]").click(function (e) {
                clickLine($(this));
                e.preventDefault();
                e.stopPropagation();
            });

        },
        updateServiceBoard: function (boardId, response) {
            $("#" + boardId).parent().html(response);

            var $datePicker = $(".datepicker-dropdown.dropdown-button");

            if ($datePicker.length) {
                tfl.serviceStatus.initServiceBoardPage();
                $datePicker.html(tfl.tools.getTime(new Date()));
            }
        },
        ajaxServiceBoard: function (ajaxUrl, boardId) {
            tfl.ajax({
                url: ajaxUrl,
                success: function (response) { tfl.serviceStatus.updateServiceBoard(boardId, response); },
                autoRefreshInterval: tfl.autoRefresh.ServiceBoard,
                autoRefreshId: boardId,
                dataType: 'text'
            });
        },
        initServiceBoardAutoRefresh: function (ajaxUrl, boardId) {
            var $expandableBox = $("#" + boardId).parents('.expandable-box');

            if ($expandableBox.length) {

                // status board is contained within an expandable box so we only want to auto refresh when box is expanded
                var $expandableBoxLink = $expandableBox.find(".always-visible");

                $expandableBoxLink.on("expandable-box.expanded", function () {
                    tfl.serviceStatus.ajaxServiceBoard(ajaxUrl, boardId);
                });
                $expandableBoxLink.on("expandable-box.collapsed", function () {
                    tfl.stopAjaxAutoRefresh(boardId);
                });

                // check if box is already expanded
                var $expandedBox = $expandableBox.find(".content.expanded");

                if ($expandedBox.length) {
                    tfl.serviceStatus.ajaxServiceBoard(ajaxUrl, boardId);
                }
            }
            else {
                window.setTimeout(function () {
                    tfl.serviceStatus.ajaxServiceBoard(ajaxUrl, boardId);
                }, tfl.autoRefresh.ServiceBoard);
            }
        },
        appendHashToDatePickerAnchors: function (hashValue) {
            // if there is a hash anchor on the Url, then add it to the end of the dropdown links hrefs
            if (window.location.hash !== "" || hashValue !== null) {
                $(".datepicker-dropdown a").each(function () {
                    var href = $(this).attr("href");
                    href = href.indexOf('#') !== -1 ? href.substr(0, href.indexOf('#')) : href;
                    hashValue = hashValue != null ? hashValue : window.location.hash;
                    $(this).attr("href", href + hashValue);
                });
            }
        }

    };
    tfl.serviceStatus.pageSetup();

})(tfl);
(function (o) {
    tfl.logs.create("tfl.socialMedia: loaded");
    o.init = function () {
        var wrapper = $(".share-widget-wrapper");
        if (wrapper.length > 0) {
            //move the share widget up on section pages
            var overview = $(".section-overview");
            if (overview.length > 0 && !overview.hasClass("full-width")) {
                wrapper.css({ marginTop: 0, display: "block", cssFloat: "none" });
            }
            wrapper.append('<a href="javascript:void(0)" class="share-widget clearfix"><div class="twitter-icon icon"></div><div class="facebook-icon icon"></div><div class="share-icon icon"></div><span class="share-text">Share <span class="visually-hidden">on social media</span></span><span class="down-arrow icon"></span></a>');
            var url = window.location.href;
            var title = $("h1").text();
            var list = $('<ul class="share-list"></ul>');

            list.append('<li><a href="http://www.facebook.com/share.php?u=' + url + '&t=' + title + '" class="share-facebook clearfix" tabindex="0"><span class="facebook-icon icon"></span><span class="text">Facebook</span></a></li>');
            list.append('<li><a href="http://twitter.com/home?status=' + title + ' ' + url + '" class="share-twitter clearfix" tabindex="0"><span class="twitter-icon icon"></span><span class="text">Twitter</span></a></li>');
            wrapper.append(list);
            list.find("a").focus(function () { list.addClass("visible-for-focus") }).blur(function () { list.removeClass("visible-for-focus"); });
            wrapper.removeClass("hidden");
        }
    };
    o.init();
}(window.tfl.socialMedia = window.tfl.socialMedia || {}));
window.tfl.journeyPlanner = window.tfl.journeyPlanner || {};
(function (o) {
    "use strict";
    tfl.logs.create("tfl.journeyPlanner.recentJourneys: loaded");
    o.journeys = [];
    o.usingRecentJourneys = tfl.storage.get('usingRecentJourneys', true);
    o.isLoaded = false;
    o.recentJourneyNumberLimit = 5;

    o.loadJourneys = function () {
        if (!o.isLoaded) {
            if (o.usingRecentJourneys) {
                o.journeys = tfl.storage.get('recentJourneys', []);
            }
            o.isLoaded = true;
        }
    };

    o.useJourneys = function (on) {
        tfl.journeyPlanner.recentJourneys.usingRecentJourneys = on;
        //if (on) {
        //tfl.journeyPlanner.autocomplete.setupAutocomplete(); //clear autocomplete recent search options
        //}
        tfl.storage.set("usingRecentJourneys", o.usingRecentJourneys);
        o.journeys = [];
        tfl.storage.set("recentJourneys", o.journeys);
        tfl.journeyPlanner.recentSearches.searches = [];
        tfl.storage.set("recentSearches", tfl.journeyPlanner.recentSearches.searches);
        return false;
    };

    o.saveJourney = function (fromId, fromModes, toId, toModes, viaId, viaModes) {
        if ($("#From").val() === tfl.dictionary.CurrentLocationText || 
            $("#From").val() === tfl.dictionary.CurrentLocationText ||
            $("#From").val() === tfl.dictionary.CurrentLocationText) {
                return true;
        }
        //load journeys
        o.loadJourneys();
        var newItem = {
            //from: $("#From").val().replace(/^\s+|\s+$/g, '').replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }),
            from: $("#From").val().replace(/^\s+|\s+$/g, ''),
            fromId: fromId,
            fromModes: fromModes ? jQuery.parseJSON(fromModes) : "",
            to: $("#To").val().replace(/^\s+|\s+$/g, ''),
            toId: toId,
            toModes: toModes ? jQuery.parseJSON(toModes) : "",
            via: $("#Via").val().replace(/^\s+|\s+$/g, ''),
            viaId: viaId,
            viaModes: viaModes ? jQuery.parseJSON(viaModes) : ""
        };
        //blank from and to aren't allowed, but these will be picked up by validation,
        //so we'll just return true and let the validation pick up the errors.
        if (newItem.from === "" || newItem.to === "") {
            return true;
        }
        for (var i = 0; i < tfl.journeyPlanner.recentJourneys.journeys.length; i++) {
            var j = tfl.journeyPlanner.recentJourneys.journeys[i];
            if (j.from.toLowerCase().replace(/ /g, "") === newItem.from.toLowerCase().replace(/ /g, "") && j.to.toLowerCase().replace(/ /g, "") === newItem.to.toLowerCase().replace(/ /g, "") && j.via.toLowerCase().replace(/ /g, "") === newItem.via.toLowerCase().replace(/ /g, "")) {
                //check modes and ids and keep if already exist
                if (newItem.fromId == "" && j.fromId !== "") {
                    newItem.fromId = j.fromId;
                }
                if (newItem.fromModes == "" && j.fromModes !== "") {
                    newItem.fromModes = j.fromModes;
                }
                if (newItem.toId == "" && j.toId !== "") {
                    newItem.toId = j.toId;
                }
                if (newItem.toModes == "" && j.toModes !== "") {
                    newItem.toModes = j.toModes;
                }
                if (newItem.viaId == "" && j.viaId !== "") {
                    newItem.viaId = j.viaId;
                }
                if (newItem.viaModes == "" && j.viaModes !== "") {
                    newItem.viaModes = j.viaModes;
                }
                tfl.journeyPlanner.recentJourneys.journeys.splice(i, 1);
                break;
            }
        }
        tfl.journeyPlanner.recentJourneys.journeys.splice(0, 0, newItem);
        if (tfl.journeyPlanner.recentJourneys.journeys.length > o.recentJourneyNumberLimit) {
            tfl.journeyPlanner.recentJourneys.journeys.length = o.recentJourneyNumberLimit;
        }
        tfl.storage.set("recentJourneys", tfl.journeyPlanner.recentJourneys.journeys);
        return true;
    };

})(window.tfl.journeyPlanner.recentJourneys = window.tfl.journeyPlanner.recentJourneys || {});
window.tfl.journeyPlanner = window.tfl.journeyPlanner || {};
(function (o) {
    "use strict";
    tfl.logs.create("tfl.journeyPlanner.recentSearches: loaded");
    o.searches = [];
    o.isLoaded = false;
    o.recentSearchNumberLimit = 5;
    o.recentSearchTimeLimit = 2629740000; //1 month in milliseconds

    o.loadSearches = function () {
        if (!o.isLoaded) {
            if (tfl.journeyPlanner.recentJourneys.usingRecentJourneys) {
                o.searches = tfl.storage.get("recentSearches", []);
                if (o.searches.length > 0) {
                    // remove old searches
                    var timeNow = new Date().getTime();
                    for (var i = 0; i < o.searches.length; i++) {
                        var j = o.searches[i];
                        if (j.lastSearchDate < (timeNow - o.recentSearchTimeLimit)) {
                            o.searches.splice(i, 1); //remove from local memory
                        }
                    }
                }
            }
            o.isLoaded = true;
        }
    };

    o.saveSearch = function (newPlaceName, newPlaceId, newPlaceModes) {
        if (newPlaceName === "" || newPlaceName === tfl.dictionary.CurrentLocationText) return true;
        newPlaceName = newPlaceName.replace(/^\s+|\s+$/g, '');

        if (newPlaceId === null) newPlaceId = "";
        if (typeof newPlaceModes == "string" && newPlaceModes !== "") {
            newPlaceModes = jQuery.parseJSON(newPlaceModes);
        }
        var timeNow = new Date().getTime();
        // is search aleardy in recent searches?
        for (var i = 0; i < tfl.journeyPlanner.recentSearches.searches.length; i++) {
            var j = tfl.journeyPlanner.recentSearches.searches[i];
            if (j.placeName.toLowerCase() === newPlaceName.toLowerCase()) {
                if (newPlaceId == "" && j.placeId !== "") {
                    newPlaceId = j.placeId;
                }
                if (newPlaceModes == "" && j.placeModes !== "") {
                    newPlaceModes = j.placeModes;
                }
                tfl.journeyPlanner.recentSearches.searches.splice(i, 1);//remove from local memory
                break;
            }
        }
        //new search item
        var newSearch = {
            placeName: newPlaceName,
            placeId: newPlaceId,
            placeModes: newPlaceModes,
            lastSearchDate: timeNow
        };

        //insert into array and into local memory
        tfl.journeyPlanner.recentSearches.searches.splice(0, 0, newSearch);
        //limit number of recent searches that are stored in the autocomplete list
        if (tfl.journeyPlanner.recentSearches.searches.length > o.recentSearchNumberLimit) {
            tfl.journeyPlanner.recentSearches.searches.length = o.recentSearchNumberLimit;
        }
        tfl.storage.set("recentSearches", tfl.journeyPlanner.recentSearches.searches);

        return true;
    };

})(window.tfl.journeyPlanner.recentSearches = window.tfl.journeyPlanner.recentSearches || {});
(function (o) {
    "use strict";
    tfl.logs.create("tfl.journeyPlanner: loaded");

    tfl.cachingSettings = { daily: getCachingKey() };

    function getCachingKey() {
        var d = new Date();
        var n = String(d.getFullYear()) + String(d.getMonth()) + String(d.getDay()) + String(d.getHours());
        return n;
    }

    o.settings = {
        disambiguationItemsPerPage: 9
    };

    o.init = function () {
        tfl.logs.create("tfl.journeyPlanner.init: started");
        o.createJourneys();
    };

 
    o.createJourneys = function () {
        if (!tfl.storage.isLocalStorageSupported()) {
            tfl.logs.create("tfl.journeyplanner: Not creating recent journeys box - localStorage not present.");
            return;
        }
        tfl.logs.create("tfl.journeyplanner: Creating recent journeys box");
        $("#recent-journeys").empty();
        if ($("div[data-set=recent-journeys]").length === 0) {
            $("#more-journey-options").after("<div class='small' data-set='recent-journeys' />");
            $("#plan-a-journey").after("<div class='medium-large' data-set='recent-journeys'><div id='recent-journeys' class='moving-source-order' /></div>");
        }
        var recentJourneysBox = $("#recent-journeys");
        recentJourneysBox.empty();
        recentJourneysBox.append("<h3>Recent journeys</h3>");
        if (!tfl.journeyPlanner.recentJourneys.usingRecentJourneys) {
            recentJourneysBox.append("<p>Turn on recent searches so you can access them easily again<br/><a href='javascript:void(0)' class='turn-on-recent-journeys' data-jumpback='#SavePreferences:visible' data-jumpto='#footer a:first'>Turn on recent journeys</a></p>");
        } else {
            tfl.journeyPlanner.recentJourneys.loadJourneys();
            if (tfl.journeyPlanner.recentJourneys.journeys.length > 0) {
                var journeyList = $("<div class='vertical-button-container' />");

                $(tfl.journeyPlanner.recentJourneys.journeys).each(function (i) {
                    var text = "<strong>" + this.from + "</strong> to <strong>" + this.to + "</strong>";
                    if (this.via !== "") {
                        text += " via <strong>" + this.via + "</strong>";
                    }
                    //tab back
                    var link;
                    if (i === 0) {
                        link = $("<a href='javscript:void(0)' class='plain-button' data-jumpback='#SavePreferences:visible'>" + text + "</a>");
                    } else {
                        link = $("<a href='javscript:void(0)' class='plain-button'>" + text + "</a>");
                    }
                    link.click(function () {
                        o.redoJourney(i); return false;
                    });
                    journeyList.append(link);
                });
                recentJourneysBox.append(journeyList);
                recentJourneysBox.append("<p><a href='javascript:void(0)' class='turn-off-recent-journeys' data-jumpto='#footer a:first' data-jumpback='#SavePreferences:visible'>Turn off and clear recent journeys</a></p>");
            } else {
                recentJourneysBox.append("<p>You currently have no saved journeys<br/><a href='javascript:void(0)' class='turn-off-recent-journeys' data-jumpto='#footer a:first' data-jumpback='#SavePreferences:visible'>Turn off recent journeys</a></p>");
            }
        }

        $("div.medium-large[data-set=recent-journeys]").append(recentJourneysBox);

        $(".moving-source-order").appendAround();
        $(".turn-on-recent-journeys").click(function (event) {
            event.preventDefault();
            tfl.journeyPlanner.recentJourneys.useJourneys(true);
            tfl.journeyPlanner.searchForm.destroyAutocomplete();
            tfl.journeyPlanner.searchForm.setupAutocomplete(false);
            if ($("#recent-journeys").length != 0) {
                o.createJourneys();
            }
        });
        $(".turn-off-recent-journeys").click(function (event) {
            event.preventDefault();
            tfl.journeyPlanner.recentJourneys.useJourneys(false);
            tfl.journeyPlanner.searchForm.destroyAutocomplete();
            tfl.journeyPlanner.searchForm.setupAutocomplete(false);
            if ($("#recent-journeys").length != 0) {
                o.createJourneys();
            }
        });
    };

    o.redoJourney = function (idx) {
        var journey = tfl.journeyPlanner.recentJourneys.journeys[idx];
        var async = false;
        var doJourney = function () {
            $("#jp-search-form").submit();
        }
        if (journey.from === tfl.dictionary.CurrentLocationText) {
            async = true;
            tfl.journeyPlanner.searchForm.geolocateMe("#From", doJourney);
        } else {
            $("#From").val(journey.from);
            $("#From").attr("data-from-id", journey.fromId);
            $("#From").attr("data-from-modes", JSON.stringify(journey.fromModes));
        }
        if (journey.to === tfl.dictionary.CurrentLocationText) {
            async = true;
            tfl.journeyPlanner.searchForm.geolocateMe("#To", doJourney);
        } else {
            $("#To").val(journey.to);
            $("#To").attr("data-to-id", journey.toId);
            $("#To").attr("data-to-modes", JSON.stringify(journey.toModes));
        }
        if (journey.via !== null) {
            if (journey.via === tfl.dictionary.CurrentLocationText) {
                async = true;
                tfl.journeyPlanner.searchForm.geolocateMe("#Via", doJourney);
            } else {
                $("#Via").val(journey.via);
                $("#Via").attr("data-via-id", journey.viaId);
                $("#Via").attr("data-via-modes", JSON.stringify(journey.viaModes))
            }
        } else {
            $("#Via").val("");
        }
        if (!async) {
            doJourney();
        }
    };

    
})(window.tfl.journeyPlanner = window.tfl.journeyPlanner || {});

(function (o) {
    "use strict";
    tfl.logs.create("tfl.journeyPlanner.results: loaded");

    o.init = function (loadedViaAjax) {
        tfl.logs.create("tfl.journeyPlanner.results.init: started (isAjax: " + loadedViaAjax + ")");
        //if we haven't ajax loaded, we'll need to initalise the search form
        if (!loadedViaAjax) {
            o.resultsFormInit();
            o.processResults();
            o.initSteal();
        } else {
            o.initAjaxPage();
        }
        if ($("html").hasClass("lt-ie8")) {
            o.initIE7();
        }
    };

    o.initGlobal = function () {
        tfl.logs.create("tfl.journeyPlanner.initGlobal: started");
        //stop duplication of events by unbinding before binding
        tfl.expandableBox.init();
    };

    o.initAjaxPage = function () {
        tfl.logs.create("tfl.journeyPlanner.results.initAjaxPage: started");
        var loaderType = $('#JpType').val() == '' ? 'publictransport' : $('#JpType').val();
        o.setupLoader(loaderType);
        o.resultsFormInit();
        var url = window.location.href, resultsUrl = tfl.jPResultsPageUrl;
        url = url.substring(url.indexOf('?'), url.length);
        //var dataArray = url.split('&');
        //var data =  {};
        //for (var i = 0; i < dataArray.length; i++) {
        //    var spl = dataArray[i].split('=');
        //    if (!data[spl[0]]) {
        //        data[spl[0]] = [];
        //    }
        //    data[spl[0]].push(spl[1]);
        //}
        //data.ispostback = true;

        var ajaxSuccess = function (response) {
            data = $(response).find('.ajax-response');
            $(".journey-details-ajax").replaceWith($(data));

            // populate walk tab with time
            var journeyTimeWalking = $('.walking-box .journey-time');
            if (journeyTimeWalking.length == 1 && $('[data-jp-tabs="true"] .walking.selected').length < 1) {
                journeyTimeWalking.find('.visually-hidden').remove();
                journeyTimeWalking = $('<span></span>').addClass('tabs-time').text('Walk this in ' + journeyTimeWalking.text());
                $('[data-jp-tabs="true"] [data-jptype="walking"]').addClass('has-time').append(journeyTimeWalking);
            }

            // populate cycle tab with time
            var journeyTimeCycle = $('.cycling-box .journey-time');
            if (journeyTimeCycle.length == 1 && $('[data-jp-tabs="true"] .cycling.selected').length < 1) {
                journeyTimeCycle.find('.visually-hidden').remove();
                journeyTimeCycle = $('<span></span>').addClass('tabs-time').text('Cycle in ' + journeyTimeCycle.text());
                $('[data-jp-tabs="true"] [data-jptype="cycling"]').addClass('has-time').append(journeyTimeCycle);
            }

            o.processResults();
            o.initGlobal();
            if ($(".disambiguation-form").length > 0) {
                tfl.journeyPlanner.disambiguation.init();
            } else {
                $('.summary-results > .expandable-box').css({ opacity: 0 }).each(function (i) {
                    $(this).delay(150 * i).animate({ opacity: 1 }, 100, function () {
                        $(this).removeAttr("style");
                    });
                });
            }
            o.initSteal();
            $("#alternatives").find("[data-pull-content]").click(tfl.navigation.pullContentHandler);
        };
        tfl.ajax({
            url: resultsUrl + url + "&ispostback=true",
            success: ajaxSuccess,
            dataType: 'html'
        });
        //tfl.ajax({
        //    url: resultsUrl,
        //    data: data,
        //    success: ajaxSuccess,
        //    dataType: 'html'
        //});
    };

    o.initSteal = function () {
        // we have to use the steal.js script loader to make sure the mapping code doesn't run until the mapping framework has loaded
        steal(tfl.mapScriptPath)
        .then(function () {
            tfl.logs.create("tfl.journeyPlanner.results.initSteal: started");
            var mapLoaded = false;
            var legMapElement = null;
            var legMap = null;
            function fullScreenLegMap() {
                tfl.fullscreen.display(legMapElement, false, true);
                legMapElement.controller().divResized();
            }
            $(".view-on-a-map").click(function (event, data) {
                var $this = $(this);
                $(".view-on-a-map").not(this).removeClass("show-all");
                $this.toggleClass("show-all");
                var mapLinks;
                if (data && data.isHideAll) {
                    mapLinks = $(".view-on-a-map.hide-map");
                } else {
                    mapLinks = $(".view-on-a-map.hide-map").not(this);
                }
                mapLinks.text("View on a map").removeClass("hide-map");
                if ($this.hasClass("hide-map")) {
                    $this.text("View on a map").removeClass("hide-map");
                    legMapElement.hide();
                } else {
                    if (!mapLoaded) {
                        $this.after("<div id='leg_map' class='leg-map'></div>");
                        $.fixture.on = false; // TODO really need to be able to take this out
                        legMapElement = $('#leg_map').tfl_maps_journey_planner_leg_map({
                            url: $(".journey-results").data("api-uri"),
                            isNationalBounds: tfl.getQueryParam('NationalSearch') === 'true',
                            mapDeactivated: function () {
                                if (!$(document.body).hasClass("breakpoint-Medium")) {
                                    tfl.fullscreen.hide();
                                }
                                legMapElement.siblings(".view-on-a-map").trigger('click');
                            }
                        });
                        legMap = legMapElement.controller();
                        legMap.mapLoading.done(function () {
                            $(window).on("enterBreakpointSmall exitBreakpointMedium", function () {
                                if (legMapElement.is(":visible")) {
                                    fullScreenLegMap();
                                }
                            }).on("enterBreakpointMedium", function () {
                                tfl.fullscreen.hide();
                            });
                            if (!$(document.body).hasClass("breakpoint-Medium")) {
                                fullScreenLegMap();
                            }
                        });
                        mapLoaded = true;
                        
                    } else {
                        legMapElement.show();
                        legMapElement.insertAfter($(this));
                        if (!$(document.body).hasClass("breakpoint-Medium")) {
                            fullScreenLegMap();
                        }
                    }
                    legMap.chooseLeg($this.data("journeyindex"), $this.data("legindex"));
                    $this.text("Hide map").addClass("hide-map");
                }
                event.preventDefault();
            });
        });
    };

    //Initialise for IE7, which has rendering problems when the page
    //height changes (triggered by editing the journey form)
    o.initIE7 = function () {
        $(".cancel-button, .toggle-options, .edit-button").click(function () {
            var row = $(".journey-form").parents(".r").next();
            row.attr("class", row.attr("class"));
        });
    };

    o.maps = function (type) {
        var cyclingType = 'cycling';
        var walkingType = 'walking';
        if (type == cyclingType || type == walkingType) {
            var result = (type == cyclingType) ? $('.summary-results.cycling .cycling-box') : $('.summary-results.walking .walking-box');
            if (result.length == 1) {
                // it's cycling or walking and has only one result, so expand the options and map
                result.find('.always-visible .show-detailed-results').click();
                o.triggerMapLink($('.full-results-container .view-on-a-map'));
            }
        }
    };

    o.triggerMapLink = function (el) {
        tfl.logs.create("tfl.journeyPlanner.results: trigger click on map link");
        el.trigger('click', { isHideAll: true });
    };

    o.setupLoader = function (loaderClass) {
        var bg = $('<div id="loader-background"></div>');
        var bird = $('<div id="loader-birds"></div>');
        var trees = $('<div id="loader-trees"></div>');
        var tSegment = $('<div class="tree-segment"></div>');
        var i;
        for (i = 0; i < 8; i++) {
            trees.append(tSegment.clone());
        }
        var transport = $('<div id="loader-transport-method"></div>');
        var grass = $('<div id="loader-grass"></div>');
        var gSegment = $('<div class="grass-segment"></div>');
        for (i = 0; i < 18; i++) {
            grass.append(gSegment.clone());
        }
        var message = $('<div id="loader-message">Fetching results</div>');
        $("#loader-window").addClass(loaderClass).append(bg).append(trees).append(bird).append(transport).append(grass).append(message);
    };

    o.processResults = function () {
        $(".summary-results > .expandable-box > .content > .always-visible").click(function () {
            if ($(this).parents(".not-selected").length > 0) {
                o.unshowAllDetailedResults();
                o.currentlyShowing = null;
            }
        });
        var summaryResults = $('.summary-results');
        if (summaryResults.hasClass('cycling')) {
            o.maps('cycling');
        } else if (summaryResults.hasClass('walking')) {
            o.maps('walking');
        }

        $(".always-visible .journey-price").after("<button class='primary-button show-detailed-results' data-jumpto=''>" + tfl.dictionary.ShowDetailedView + "</button>");
        $(".back-to-link").click(o.unshowAllDetailedResults);
        var i = 1;
        if ($(".journey-details").length > 0) {
            if (tfl.journeyPlanner.recentJourneys.usingRecentJourneys) {
                tfl.journeyPlanner.recentJourneys.saveJourney($("#From").attr("data-from-id"), $("#From").attr("data-from-modes"), $("#To").attr("data-to-id"), $("#To").attr("data-to-modes"));
                tfl.journeyPlanner.recentSearches.saveSearch($("#From").val(), $("#From").attr("data-from-id"), $("#From").attr("data-from-modes"));
                tfl.journeyPlanner.recentSearches.saveSearch($("#To").val(), $("#To").attr("data-to-id"), $("#To").attr("data-to-modes"));
                if ($("#Via").val() !== "") {
                    tfl.journeyPlanner.recentSearches.saveSearch($("#Via").val(), $("#Via").attr("data-via-id"), $("#Via").attr("data-via-modes"));
                }
            }
        }
        $(".journey-details").each(o.generateJourneySummary);

        //status-disruption click events
        var statusMsgs = $(".journey-steps .message-toggle");
        var statusMsgsDetailedView = $(".journey-detail-step .line-status .message-toggle");
        var el;
        for (var j = 0; j < statusMsgs.length; j++) {
            el = $(statusMsgs[j]);
            (function () {
                var id = j;
                el.click(function () {
                    if (!$(statusMsgsDetailedView[id]).parent().parent().hasClass("expanded")) {
                        $(statusMsgsDetailedView[id]).click();
                    }
                    $(this).parents(".summary").find(".show-detailed-results").click();
                });
            })();
        }
        $(".line-status-info .start-hidden");
        var hideLinks = $(".line-status-info .hide-link");
        for (var k = 0; k < statusMsgs.length; k++) {
            el = $(hideLinks[k]);
            (function () {
                var id = k;
                el.click(function () {
                    $(statusMsgsDetailedView[id]).click();
                });
            })();
        }

        $(".show-detailed-results").click(o.viewDetailsClick);
        o.expandableBoxes = $(".summary-results > .expandable-box");
        $(".json-all-stops").click(o.showAllStops);
        $(".text-instructions-link").click(o.showTextInstructions);
        //add show/hide text to disruptions info
        $(".disruption-heading").append('<span class="link-style show-details">Show details...</span><span class="link-style hide-details">Hide details...</span>');
        $(".accessibility-details").append('<div class="show-hide-links"><a href="javascript:void(0)" class="show-link">Show details...</a><a href="javascript:void(0)" class="hide-link">Hide details...</a></div>');
        $(".show-hide-links a").click(function (e) {
            $(".accessibility-details").toggleClass("expanded");
            e.preventDefault();
        });
        $(".journey-detail-step.terminus").after("<div class='jp-print-button clearfix'><a href='javascript:window.print()' class='secondary-button print-button'>Print this route</a></div>");
    };

    o.generateJourneySummary = function () {
        var summary = $("<table></table>")
            .attr("class", "journey-steps")
            .append("<caption class='visually-hidden'>Steps for journey option " + i + "</caption><thead><tr><th>Time</th><th>Mode of Transport</th><th>Instructions</th></tr></thead>");

        $(this).find(".journey-detail-step:not(.terminus)").each(function (i) {
            var description = "";
            var mode = $(this).find(".step-heading .time-and-mode .centred").html();
            var row = $("<tr></tr>");
            var isDisrupted = false;
            if ($(this).find(".details .instructions .line-status").length > 0) {
                isDisrupted = true;
            }
            var className = "time";
            if ($(this).find(".duration").text().indexOf("hour") > 0) {
                className = className + " wide";
            }
            row.append("<td class='" + className + "'><strong>" + $(this).find(".duration").text().replace("minute", "min").replace("hour", "hr") + "</strong></td>");
            var logo = isDisrupted ? $("<td class='logo disrupted'></td>") : $("<td class='logo'></td>");
            logo.append($(this).find(".time-and-mode .centred").clone());
            row.append(logo);

            if (isDisrupted) {
                row.append("<td class='description disrupted'>" + $(this).find(".step-summary").html() + "</td>");
            } else {
                row.append("<td class='description'>" + $(this).find(".step-summary").html() + "</td>");
            }

            summary.append(row);
            //get status info
            if ($(this).find(".line-status").length > 0) {
                var td = $("<td class='disrupted'></td>").append($(this).find(".disruption-messages .line-status .message-toggle").eq(0).clone());
                summary.append($("<tr><td class='time'>&nbsp;</td><td class='logo disrupted'><div class='disruption-icon centred hide-text'>Disruption</div></td></tr>").append(td));
            }
        });

        summary.insertBefore(this);
        summary.after($(this).parents(".content").find(".price-and-details").clone());
        i++;
    };

    o.viewDetailsClick = function (e) {
        e.stopPropagation();
        var idx = 0;
        idx = $.inArray($(this).parents(".expandable-box").get(0), o.expandableBoxes);
        o.unshowAllDetailedResults();
        tfl.logs.create("tfl.journeyPlanner.results: view details clicked: (index: " + idx + ", currentlyshowing: " + o.currentlyShowing + ")");
        if (idx != o.currentlyShowing) {
            o.showDetailedResults(idx);
        } else {
            o.currentlyShowing = null;
        }
        return false;
    };

    o.showDetailedResults = function (idx) {
        tfl.logs.create("tfl.journeyPlanner.results: Show detailed results. Index: " + idx);
        var expandableBoxes = o.expandableBoxes;
        o.currentlyShowing = idx;
        expandableBoxes.removeClass("selected").addClass("not-selected");
        var parentBox = $(expandableBoxes[idx]);
        var nextParentBox = $(expandableBoxes[idx + 1]);
        var lastParentBox = $(expandableBoxes[expandableBoxes.length - 1]);
        $(lastParentBox).find(".show-detailed-results").attr("data-jumpto", ".earlier:tabbable:first");
        $(lastParentBox).find(".show-detailed-results").addClass("last-show-details");
        parentBox.removeClass("not-selected").addClass("selected");
        var link = parentBox.find(".show-detailed-results:visible");
        $(".show-detailed-results").text(tfl.dictionary.ShowDetailedView);
        $(parentBox).find(".show-detailed-results").text(tfl.dictionary.HideDetailedView);
        $(parentBox).find(".show-detailed-results").addClass("hide-details");
        $(nextParentBox).find(".show-detailed-results").addClass("next-show-details");
        $(parentBox).find(".show-detailed-results").attr("data-jumpto", ".journey-details :tabbable:first:visible");
        $(parentBox).find(".show-detailed-results").removeClass("last-show-details");
        $(expandableBoxes[o.currentlyShowing]).children(".content").children(".start-hidden").appendTo(".full-results-container");
        $(".replan-route").remove();
        $(".full-results-container").append("<div class='replan-route'><a href='javascript:void(0)' class='replan-from-current-location' data-jumpto='.next-show-details:visible'>Replan route from current location</a></div>");
        $(".replan-from-current-location").click(function () {
            tfl.geolocation.geolocateMe("#From", function () {
                var el = $("#From");
                el.removeAttr("data-from-id");
                el.removeAttr("data-from-modes");
                el.removeAttr("data-dataset-name");
                $('#jp-search-form').submit();
            });
            $(".secondary-button.edit-button").click();
            return false;
        });
        $(".full-results-container").removeClass("hidden").addClass($("#JpType").val());
        $(document.body).addClass("showing-full-details");
        var detailsTop = $(".full-results-container").offset().top;
        $("html, body").animate({ scrollTop: detailsTop - 10 });
        //tab focus
        $(".journey-details :tabbable:first").focus();
        //if walking or cycling and there is only one leg, click view map
        var frc = $(".full-results-container");
        var steps = frc.find('.journey-detail-step');
        //if mobile, hijack the back button here
        if (!$("html").hasClass("breakpoint-Medium")) {
            if (history.pushState) {
                var backToLink = $(".back-to-link");
                var backLinkHandler = function () {
                    window.onpopstate = null;
                    history.go(-1);
                    backToLink.off("click", this);
                };
                history.pushState({}, null);
                backToLink.on("click", backLinkHandler);
                window.onpopstate = function () {
                    o.unshowAllDetailedResults();
                    window.onpopstate = null;
                };
            }
        }
        return false;
    };

    o.unshowAllDetailedResults = function () {
        tfl.logs.create("tfl.journeyPlanner.results: Unshow all detailed results.");
        var expandableBoxes = o.expandableBoxes;
        $(".full-results-container").addClass("hidden");
        $(".full-results-container > .start-hidden").appendTo($(expandableBoxes[o.currentlyShowing]).children(".content"));
        $(".show-detailed-results").text(tfl.dictionary.ShowDetailedView);
        $(".show-detailed-results").removeClass("hide-details");
        $(".show-detailed-results").removeClass("next-show-details");
        $(".show-detailed-results").attr("data-jumpto", "");
        expandableBoxes.removeClass("not-selected selected");
        $(document.body).removeClass("showing-full-details");

        $(".json-all-stops").text(tfl.dictionary.ShowAllStops);
        $(".json-all-stops").parent().siblings(".all-stops").hide();
        
        $(".text-instructions-link").text(tfl.dictionary.ShowTextInstructions).removeClass('hide');
        $('.details .text-instructions-list').hide();
        
        return false;
    };

    o.showAllStops = function () {
        var linkClicked = this;
        if ($(linkClicked).text() == tfl.dictionary.ShowAllStops) {
            $(linkClicked).text(tfl.dictionary.HideAllStops);
            $(linkClicked).parent().siblings(".all-stops").show();
        } else {
            $(linkClicked).text(tfl.dictionary.ShowAllStops);
            $(linkClicked).parent().siblings(".all-stops").hide();
        }

        $(linkClicked).toggleClass("hide");
        return false;
    };

    o.showTextInstructions = function () {
        var linkClicked = $(this);
        var els = linkClicked.parent().siblings(".text-instructions-list");
        if (linkClicked.text() == tfl.dictionary.ShowTextInstructions) {
            linkClicked.text(tfl.dictionary.HideTextInstructions);
            els.show();
        } else {
            linkClicked.text(tfl.dictionary.ShowTextInstructions);
            els.hide();
        }

        linkClicked.toggleClass("hide");
        return false;
    };

    o.resultsFormInit = function () {
        tfl.logs.create("tfl.journeyPlanner.results: resultsFormInit started");
        $(".plan-journey-button").wrap("<div class='clearfix update-buttons' />").before("<input type='button' class='secondary-button cancel-button' value='Cancel' />");
        $(".plan-journey-button").val("Update journey").submit(function () {
            $(".cancel-button").remove();
        });
        $(".plan-journey-button-second").val("Update journey");
        tfl.journeyPlanner.searchForm.buildSwitchButton();
        $(".switch-button").click(tfl.journeyPlanner.searchForm.switchFromTo);
        var isTouch = tfl.utils.isTouchDevice();
        if ($("#From").val() !== "" && $("#To").val() !== "") {
            var touchClass = "";
            if (isTouch) {
                touchClass = " touch";
            }
            var journeyResultSummary = $("<div class='journey-result-summary" + touchClass + "' ><div class='from-to-wrapper'></div></div>");
            journeyResultSummary.children(".from-to-wrapper").append("<div class='summary-row clearfix'><span class='label'>From:</span><strong>" + $("#From").val() + "</strong></div>");
            journeyResultSummary.children(".from-to-wrapper").append("<div class='summary-row clearfix'><span class='label'>To:</span><strong>" + $("#To").val() + "</strong></div>");
            var leavingOrArriving = $(".leaving-or-arriving li.selected").text().replace(/^\s+|\s+$/g, '');
            var date = $("#Date").val();
            if (date !== null) {
                var month = parseInt(date.substring(4, 6), 10);
                month--;
                date = new Date(parseInt(date.substring(0, 4), 10), month, parseInt(date.substring(6, 8), 10));
            } else {
                date = new Date();
            }
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var sup = "<sup>th</sup>";

            var day = date.getDate();
            var mod = day % 10;
            if (mod === 1 && day !== 11) {
                sup = "<sup>st</sup>";
            } else if (mod === 2 && day !== 12) {
                sup = "<sup>nd</sup>";
            } else if (mod === 3 && day !== 13) {
                sup = "<sup>rd</sup>";
            }
            //var timeText = days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate() + sup;
            var timeText = days[date.getDay()] + " " + date.getDate() + sup + " " + months[date.getMonth()];
            timeText += ", " + $("#Time option:selected").text();

            var travelPrefsText = "";
            var via = $("#Via").val();
            if (via !== "") {
                travelPrefsText += "<strong class='via-destination'>Via " + via + "</strong> ";
            }

            // cycling
            var ticked = $('.jp-mode-cycling .accessibility-options .ticked label').html();
            travelPrefsText += '<strong class="travelpreferences-cycling">' + ticked + '</strong>';

            // walking
            var optionSelected = $('#WalkingSpeed :selected').text();
            travelPrefsText += '<strong class="travelpreferences-walking">' + optionSelected + ' walking speed</strong>';

            // public transport
            travelPrefsText += '<strong class="travelpreferences-publictransport">Showing ' + $("#JourneyPreference option:selected").text().toLowerCase() + '</strong> ';
            var using = $(".modes-of-transport option:selected");

            travelPrefsText += '<strong class="travelpreferences-publictransport">Using ';
            var i = 0;
            if ($(".modes-of-transport option:not(:selected)").length === 0) {
                travelPrefsText += "all transport modes";
            } else if (using.length <= 4) {
                for (i = 0; i < using.length; i++) {
                    if (i > 0 && i === using.length - 1) {
                        travelPrefsText += " and ";
                    } else if (i > 0) {
                        travelPrefsText += ", ";
                    }
                    travelPrefsText += $(using[i]).text().replace(/^\s+|\s+$/g, '');
                }
            } else {
                for (i = 0; i < 3; i++) {
                    if (i > 0) {
                        travelPrefsText += ", ";
                    }
                    travelPrefsText += $(using[i]).text().replace(/^\s+|\s+$/g, '');
                }
                travelPrefsText += " and " + (using.length - 3) + " others";
            }
            travelPrefsText += "</strong> ";

            var accessibilityPref = $(".accessibility-options li.ticked input").val();
            if (accessibilityPref && accessibilityPref !== "" && accessibilityPref.toLowerCase() !== "norequirements") {
                travelPrefsText += '<strong class="travelpreferences-publictransport">Step free access required</strong> ';
            }
            travelPrefsText += '<strong class="travelpreferences-publictransport">Max walk time ' + $("#MaxWalkingMinutes").val() + " mins</strong>";

            journeyResultSummary.append("<div class='summary-row clearfix'><span class='label'>" + leavingOrArriving + ":</span><strong>" + timeText + "</strong></div>");

            var editButton = $('<button></button>').addClass('secondary-button edit-button').text('Edit').click(function (e) {
                e.preventDefault();
                $("#plan-a-journey").addClass("editing");
                //tabbing focus - #From field
                $("#plan-a-journey :tabbable:first:visible").focus();
                $('#From, #To, #Via').trigger("change");
            });

            journeyResultSummary.append($('<div></div>').addClass('summary-row').append(editButton));

            journeyResultSummary.append("<div class='travel-preferences clearfix'><div class='left-shadow' /><div class='scroller'><div><span>Travel preferences: </span>" + travelPrefsText + "</div></div><div class='right-shadow' /></div>");
            $("#plan-a-journey").append(journeyResultSummary);
        }

        if (isTouch) {
            tfl.journeyPlanner.travelPrefsInnerWidth = $(".scroller > div").get(0).scrollWidth;
            tfl.journeyPlanner.travelPrefsScrollMax = tfl.journeyPlanner.travelPrefsInnerWidth - $(".scroller").width();
            tfl.journeyPlanner.travelPrefsLeftShadow = $(".left-shadow");
            tfl.journeyPlanner.travelPrefsRightShadow = $(".right-shadow");
            $(".scroller").scroll(function () {
                var scrollLeft = $(this).scrollLeft();
                tfl.journeyPlanner.travelPrefsLeftShadow.css({ left: Math.min(0, -40 + scrollLeft) });
                tfl.journeyPlanner.travelPrefsRightShadow.css({ right: Math.min(0, tfl.journeyPlanner.travelPrefsScrollMax - scrollLeft - 40) });
            }).scroll();

            $(window).resize(function () {
                tfl.journeyPlanner.travelPrefsScrollMax = tfl.journeyPlanner.travelPrefsInnerWidth - $(".scroller").width();
                $(".scroller").scroll();
            });
        }
        $(".cancel-button").click(function () {
            //hide more options if it's displayed
            $('.toggle-options.less-options').click();

            $("#plan-a-journey").removeClass("editing").parents(".r").removeClass("expanded");

            //tabbing focus - edit button
            $(".journey-result-summary .secondary-button").focus();
            return false;
        });
    };
})(window.tfl.journeyPlanner.results = window.tfl.journeyPlanner.results || {});
window.tfl.journeyPlanner = window.tfl.journeyPlanner || {};
(function (o) {
    "use strict";
    tfl.logs.create("tfl.journeyPlanner.disambiguation: loaded");

    o.init = function () {
        tfl.logs.create("tfl.journeyPlanner.disambiguation: initialised");
        var disambiguations = $(".disambiguation-wrapper");
        var numDisambiguations = disambiguations.length;
        var i = 0;
        if (numDisambiguations > 0) {
            $(".disambiguation-extras").prepend("<div class='pagination' />");
            $(".disambiguation-box").each(function () {
                var numItems = $(this).find(".disambiguation-option").length;
                if (numItems > tfl.journeyPlanner.settings.disambiguationItemsPerPage) {
                    tfl.navigation.pagination.setup($(this), ".disambiguation-items", tfl.journeyPlanner.settings.disambiguationItemsPerPage, numItems, true);
                }
                var wrapper = $(this).parents(".disambiguation-wrapper");
                var isFrom = wrapper.hasClass("from-results");
                if (isFrom) {
                    $(".summary-row").eq(0).addClass("disambiguating");
                } else {
                    var isTo = wrapper.hasClass("to-results");
                    if (isTo) {
                        $(".summary-row").eq(1).addClass("disambiguating");
                    } else {
                        $(".via-destination").addClass("disambiguating");
                    }
                }
            });
        }
        $(".disambiguation-link").click(function () {
            var row = $(this).parents(".disambiguation-wrapper");
            if (row.hasClass("from-results")) {
                $("#From").val($(this).find(".place-name").text()).after("<input type='hidden' name='FromId' value='" + $(this).attr("data-param") + "' />");
                $("#disambiguation-map-from").html("");
            } else if (row.hasClass("to-results")) {
                $("#To").val($(this).find(".place-name").text()).after("<input type='hidden' name='ToId' value='" + $(this).attr("data-param") + "' />");
                $("#disambiguation-map-to").html("");
            } else if (row.hasClass("via-results")) {
                $("#Via").val($(this).find(".place-name").text()).after("<input type='hidden' name='ViaId' value='" + $(this).attr("data-param") + "' />");
                $("#disambiguation-map-via").html("");
            }

            var next = row.next(".disambiguation-wrapper");
            if (next.length >= 1) {
                row.hide();
                next.show();
                next.find(".disambiguation-map").controller().divResized();
            } else {
                $("#jp-search-form").submit();
            }
            return false;
        });
        disambiguations.each(function () {
            if (i > 0) {
                $(this).hide();
            }
            i++;
        });
        
        tfl.mapInteractions.init();
        
        function setupMapInteractions(id, $options) {
            var mapObject = tfl.maps[id].googleMap;
            mapObject.on('optionChosen', function (option) {
                $options.find(".disambiguation-option[data-id='" + option.id + "'] .disambiguation-link")[0].click();
            });

            var $pagination = $options.parent().find(".pagination");
            if ($pagination.length) {
                tfl.navigation.pagination.addMapControls($pagination, mapObject.controller);
            }
        }

        $("#disambiguation-options-from, #disambiguation-options-to, #disambiguation-options-via").each(function () {
            var $this = $(this);
            if ($this.find(".disambiguation-option").length > 0) {
                var id = $(this).attr('id').replace('-options-', '-map-').replace('-', '');
                if (tfl.maps[id] !== undefined) {
                    setupMapInteractions(id, $this);
                } else {
                    $(window).on('map-object-created-' + id, function () {
                        setupMapInteractions(id, $this);
                    });
                }
            }
        });

    };

})(window.tfl.journeyPlanner.disambiguation = window.tfl.disambiguation || {});
window.tfl.journeyPlanner = window.tfl.journeyPlanner || {};

(function (o) {
    "use strict";
    tfl.logs.create("tfl.journeyPlanner.searchForm: loaded");

    o.isWidget;

    o.widgetInit = function () {
        tfl.logs.create("tfl.journeyPlanner.searchForm: started widgetInit");

        $(".toggle-options, .change-departure-time").click(function (e) {
            var button = $(this);
            var href = button.attr('href');
            var uri = href.substr(0, href.indexOf('#'));
            var hash = href.substr(href.indexOf('#'));
            $.each(['From', 'To', 'FromId', 'ToId', 'FromGeolocation', 'ToGeolocation'], function (k, v) {
                var val = $('#' + v).val();
                if (val !== undefined && val !== '') {
                    if (k == 0) uri += '?';
                    if (k > 0) uri += '&';
                    uri += v + '=' + val;
                }
            });
            button.attr('href', uri + hash);
        });
    };

    o.setupDateOptions = function () {
        //increment the current time at 01,16,31,46 mins past the hour
        var d = new Date();

        var mins = ((15 - d.getMinutes() % 15) * 60000);
        var secs = ((60 - d.getSeconds() % 60) * 1000);
        setTimeout(o.incrementCurrentTime, (mins - secs));
    };

    o.processTempLocalStorage = function () { //el, attr name, attr value
        var tempJPLocalStorage = tfl.storage.get("tempJPLocalStorage", [[]]);
        if (tempJPLocalStorage.length > 0) {
            for (var i = 0; i < tempJPLocalStorage.length; i++) {
                $(tempJPLocalStorage[i][0]).attr(tempJPLocalStorage[i][1], tempJPLocalStorage[i][2]);
            }
        }
    };

    o.submitSearchForm = function () {
        var fromEl = $("#From");
        var toEl = $("#To");
        var viaEl = $("#Via");
        if (fromEl.attr("data-from-id")) {
            if ($("#FromId").length == 0) {
                $(this).append("<input type='hidden' id='FromId' name='FromId' value='" + fromEl.attr("data-from-id") + "' />");
            } else {
                $("#FromId").val(fromEl.attr("data-from-id"));
            }
        }
        if (toEl.attr("data-to-id")) {
            if ($("#ToId").length == 0) {
                $(this).append("<input type='hidden' id='ToId' name='ToId' value='" + toEl.attr("data-to-id") + "' />");
            }
            else {
                $("#ToId").val(toEl.attr("data-to-id"));
            }
        }
        if (viaEl.attr("data-via-id")) {
            $(this).append("<input type='hidden' id='ViaId' name='ViaId' value='" + viaEl.attr("data-via-id") + "' />");
        }
        var tempJPLocalStorage = [[]];
        if (fromEl.attr("data-from-modes")) {
            tempJPLocalStorage.push(["#From", "data-from-modes", fromEl.attr("data-from-modes")]);
        }
        if (fromEl.attr("data-dataset-name")) {
            tempJPLocalStorage.push(["#From", "data-dataset-name", fromEl.attr("data-dataset-name")]);
        }
        if (toEl.attr("data-to-modes")) {
            tempJPLocalStorage.push(["#To", "data-to-modes", toEl.attr("data-to-modes")]);
        }
        if (toEl.attr("data-dataset-name")) {
            tempJPLocalStorage.push(["#To", "data-dataset-name", toEl.attr("data-dataset-name")]);
        }
        if (viaEl.attr("data-via-modes")) {
            tempJPLocalStorage.push(["#Via", "data-via-modes", viaEl.attr("data-via-modes")]);
        }
        if (viaEl.attr("data-dataset-name")) {
            tempJPLocalStorage.push(["#Via", "data-dataset-name", viaEl.attr("data-dataset-name")]);
        }
        if (tempJPLocalStorage.length > 0) {
            tfl.storage.set("tempJPLocalStorage", tempJPLocalStorage);
        }
        
        if (fromEl.val() !== tfl.dictionary.CurrentLocationText) {
            $("#FromGeolocation").val("");
        }
        if (toEl.val() !== tfl.dictionary.CurrentLocationText) {
            $("#ToGeolocation").val("");
        }
        if (viaEl.val() !== tfl.dictionary.CurrentLocationText) {
            $("#ViaGeolocation").val("");
        }
        
        return true;
    };

    o.changeTabs = function () {
        var obj = $('[data-jp-tabs="true"]');
        var isResultsPage = obj.parents('.journey-planner-results').length > 0;
        obj.children().click(function () {
            var jpType = $("#JpType");
            var oldType = jpType.val();
            var link = $(this).children("a");
            var newType = link.attr("data-jptype");
            obj.removeClass(oldType).addClass(newType);
            $("#jp-search-form").removeClass(oldType).addClass(newType);
            jpType.val(newType);
            if (isResultsPage) {
                var optionsForPt = $('#OptionsForPublictransport');
                if (jpType.val() == tfl.dictionary.JpTypeCycling || jpType.val() == tfl.dictionary.JpTypeWalking) {
                    optionsForPt.hide();
                } else {
                    optionsForPt.show();
                }
                // if it has a time it means it has a result for walking/cycling otherwise submit to search for results
                if (link.hasClass('has-time')) {
                    $('.summary-results').removeClass(oldType).addClass(newType);
                    window.tfl.journeyPlanner.results.unshowAllDetailedResults();
                    window.tfl.journeyPlanner.results.currentlyShowing = null;
                } else {
                    $("#jp-search-form").submit();
                }
                window.tfl.journeyPlanner.results.maps(newType);
                
                // hide show 'no public transport results found' message
                if(newType === "publictransport") {
                    $(".no-public-transport").show();
                } else {
                    $(".no-public-transport").hide();
                }
            }
        });
    };

    o.incrementCurrentTime = function () {
        if ($(".time-options.change-time").length === 0) {
            o.setCurrentTime();
        }
        setTimeout(o.incrementCurrentTime, 900000);
    };

    o.getCurrentDate = function () {
        var d = new Date();
        var yyyy = d.getFullYear().toString();
        var mm = (d.getMonth() + 1).toString();
        var dd = d.getDate().toString();
        return yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0])
    };

    o.getCurrentTime = function () {
        var d = new Date();
        var mins = d.getMinutes();
        mins = mins = 0 ? mins : (mins + (15 - (mins % 15)));
        var hrs = d.getHours();

        if (mins === 60) {
            mins = 0;
            hrs++;
            if (hrs === 24) {
                hrs = 0;
            }
        }

        var minStr = "" + mins;
        if (minStr.length === 1) {
            minStr = "0" + minStr;
        }

        var hrStr = "" + hrs;
        if (hrStr.length === 1) {
            hrStr = "0" + hrStr;
        }

        return hrStr + minStr;
    };

    o.setCurrentTime = function () {
        var d = new Date();
        var mins = d.getMinutes();
        mins = (mins + (15 - (mins % 15)));
        var hrs = d.getHours();

        if (mins === 60) {
            mins = 0;
            hrs++;
            if (hrs === 24) {
                hrs = 0;
                $("#Date").val($("#Date option:selected").next().val());
                $(".date-of-departure > span").text("Tomorrow");
            }
        }

        var minStr = "" + mins;
        if (minStr.length === 1) {
            minStr = "0" + minStr;
        }

        var hrStr = "" + hrs;
        if (hrStr.length === 1) {
            hrStr = "0" + hrStr;
        }

        $("#Time").val(hrStr + minStr);
        $(".hours span").text(hrStr + ":" + minStr);
    };

    o.changeDepartureTime = function () {
        $(".time-options").toggleClass("change-time");
        return false;
    };

    o.toggleMoreOptions = function () {
        $(this).parents(".r").toggleClass("expanded");
        var link = $(".toggle-options");
        if (link.hasClass("more-options")) {
            link.removeClass("more-options").addClass("less-options").text(tfl.dictionary.LessOptions);
        } else {
            link.removeClass("less-options").addClass("more-options").text(tfl.dictionary.MoreOptions + tfl.dictionary.CustomisedOptions);
        }
        return false;
    };

    o.toggleMoreOptionsIsWidget = function () {
        var button = $(this);
        var href = button.attr('href');
        var hrefStart = href;
        if (href.indexOf('?') != -1) {
            hrefStart = href.substr(0, href.indexOf('?'))
        } else {
            hrefStart = href.substr(0, href.indexOf('#'))
        }
        //var uri = href.substr(0, href.indexOf('#'));
        var uri = "";
        var hash = href.substr(href.indexOf('#'));
        $.each(['From', 'To', 'FromGeolocation', 'ToGelocation'], function (k, v) {
            var val = $('#' + v).val();
            if (val !== undefined && val !== '') {
                if (k == 0) uri += '?';
                if (k > 0) uri += '&';
                uri += v + '=' + val;
            }
        });
        var data = [];
        var fromEl = $("#From");
        var toEl = $("#To");
        if (fromEl.attr("data-from-id")) data.push(["fromId", fromEl.attr("data-from-id")]);
        if (toEl.attr("data-to-id")) data.push(["toId", toEl.attr("data-to-id")]);
        data.push(["date", $("#Date").find("option:selected").val()]);
        data.push(["timeIs", $(".leaving-or-arriving .selected input").val()]);
        data.push(["time", $("#Time").find("option:selected").val()]);
        if (uri.indexOf("?") == -1) {
            uri += "?";
        }
        for (var i = 0; i < data.length; i++) {
            uri += "&" + data[i][0] + "=" + data[i][1];
        }
        button.attr('href', hrefStart + uri + hash);

        var tempJpLocalStorage = [[]];
        if (fromEl.attr("data-from-modes")) {
            tempJpLocalStorage.push(["#From", "data-from-modes", fromEl.attr("data-from-modes")]);
        }
        if (fromEl.attr("data-dataset-name")) {
            tempJpLocalStorage.push(["#From", "data-dataset-name", fromEl.attr("data-dataset-name")]);
        }
        if (toEl.attr("data-to-modes")) {
            tempJpLocalStorage.push(["#To", "data-to-modes", toEl.attr("data-to-modes")]);
        }
        if (toEl.attr("data-dataset-name")) {
            tempJpLocalStorage.push(["#To", "data-dataset-name", toEl.attr("data-dataset-name")]);
        }
        if (tempJpLocalStorage.length > 0) {
            tfl.storage.set("tempJPLocalStorage", tempJpLocalStorage);
        }
    };

    o.buildSwitchButton = function () {
        $(".geolocation-box").after("<a href='javascript:void(0)' class='switch-button hide-text'>Switch from and to<a>");
    };

    o.switchFromTo = function () {
        var fromEl = $("#From");
        var fromGeoEl = $("#FromGeolocation");
        var toEl = $("#To");
        var toGeoEl = $("#ToGeolocation");
        var from = fromEl.val();
        var fromId = fromEl.attr("data-from-id") ? fromEl.attr("data-from-id") : "";
        var fromModes = fromEl.attr("data-from-modes") ? fromEl.attr("data-from-modes") : "";
        var fromDatasetName = fromEl.attr("data-dataset-name") ? fromEl.attr("data-dataset-name") : "";
        var fromDataCurrentLocation = fromEl.parent().attr("data-current-location") ? fromEl.parent().attr("data-current-location") : "";
        var fromGeolocation = fromGeoEl.val();
        var to = toEl.val();
        var toId = toEl.attr("data-to-id") ? toEl.attr("data-to-id") : "";
        var toModes = toEl.attr("data-to-modes") ? toEl.attr("data-to-modes") : "";
        var toDatasetName = toEl.attr("data-dataset-name") ? toEl.attr("data-dataset-name") : "";
        var toDataCurrentLocation = toEl.parent().attr("data-current-location") ? toEl.parent().attr("data-current-location") : "";
        var toGeolocation = toGeoEl.val();
        fromEl.typeahead("setQuery", to);
        fromEl.attr("data-from-id", toId);
        fromEl.attr("data-from-modes", toModes);
        fromEl.attr("data-dataset-name", toDatasetName);
        if (toDataCurrentLocation !== "") {
            fromEl.parent().attr("data-current-location", toDataCurrentLocation);
        } else {
            fromEl.parent().removeAttr("data-current-location");
        }
        fromEl.trigger("change");
        toEl.typeahead("setQuery", from);
        toEl.val(from);
        toEl.attr("data-to-id", fromId);
        toEl.attr("data-to-modes", fromModes);
        toEl.attr("data-dataset-name", fromDatasetName);
        if (fromDataCurrentLocation !== "") {
            toEl.parent().attr("data-current-location", fromDataCurrentLocation);
        } else {
            toEl.parent().removeAttr("data-current-location");
        }
        toEl.trigger("change");
        fromGeoEl.val(toGeolocation);
        toGeoEl.val(fromGeolocation);
    };

    // autocomplete variables
    var sourceRecentSearches = tfl.autocomplete.sources.recentSearches;
    // create 'turn-off' recent searches
    var sourceTurnOffRecentSearches = tfl.autocomplete.sources.getTurnOnOffRecentSearches(false, [{ linkText: "Turn off recent journeys" }]);
    var sourcesTurnRecentSearchesOff = [tfl.autocomplete.sources.journeyPlannerSuggestions];
    // create 'turn-on' recent searches
    var sourceTurnOnRecentSearches = tfl.autocomplete.sources.getTurnOnOffRecentSearches(true, [{ linkText: "Turn on recent journeys" }]);
    var sourcesTurnRecentSearchesOn = [tfl.autocomplete.sources.journeyPlannerSuggestions];

    o.setupAutocomplete = function (freshPageLoad) {
        //recent searches object properties
        sourceRecentSearches.name = "journey-planner-recent-searches";
        sourceRecentSearches.local = tfl.autocomplete.addBlankTokens(tfl.journeyPlanner.recentSearches.searches);
        sourceRecentSearches.template = "<div class='mode-icons'>{{#placeModes}}<span class='mode-icon {{.}}-icon'>&nbsp;</span>{{/placeModes}}</div><span class='stop-name'>{{placeName}}</span>";
        sourceRecentSearches.limit = tfl.journeyPlanner.recentSearches.recentSearchNumberLimit;
        sourceRecentSearches.valueKey = "placeName";
        sourceRecentSearches.callback = tfl.autocomplete.sources.stationsStopsSelectionCallback;
        sourceRecentSearches.removeContent = tfl.autocomplete.sources.stationsStopsRemoveContent;

        //setup sources
        o.autocompleteAddRecentSearches(!freshPageLoad);
        o.autocompleteAddGeolocation();

        sourceTurnOffRecentSearches.callback = function (inputEl) {
            tfl.journeyPlanner.recentJourneys.useJourneys(false);
            if ($("#recent-journeys").length != 0) {
                tfl.journeyPlanner.createJourneys();
            }
            $(inputEl).parent().siblings(tfl.dictionary.RemoveContentClass).trigger("clear-search-box");
            o.destroyAutocomplete();
            $("#From, #To, #Via").each(function () {
                tfl.autocomplete.setup("#" + $(this).attr("id"), sourcesTurnRecentSearchesOn);
                $("#" + $(this).attr("id")).attr("placeholder", $(this).attr("id"));
            });
        };
        sourceTurnOnRecentSearches.callback = function (inputEl) {
            tfl.journeyPlanner.recentJourneys.useJourneys(true);
            if ($("#recent-journeys").length != 0) {
                tfl.journeyPlanner.createJourneys();
            }
            $(inputEl).parent().siblings(tfl.dictionary.RemoveContentClass).trigger("clear-search-box");
            o.destroyAutocomplete();
            $("#From, #To, #Via").each(function () {
                tfl.autocomplete.setup("#" + $(this).attr("id"), sourcesTurnRecentSearchesOff);
                $("#" + $(this).attr("id")).attr("placeholder", $(this).attr("id"));
            });
        };
        
        if (tfl.journeyPlanner.recentJourneys.usingRecentJourneys) {
            tfl.autocomplete.setup("#From", sourcesTurnRecentSearchesOff, freshPageLoad);
            //remove geolocation
            //sources.splice(0, 1);
            tfl.autocomplete.setup("#To", sourcesTurnRecentSearchesOff, freshPageLoad);
            tfl.autocomplete.setup("#Via", sourcesTurnRecentSearchesOff, freshPageLoad);
        } else {
            tfl.autocomplete.setup("#From", sourcesTurnRecentSearchesOn, freshPageLoad);
            //remove geolocation
            //sources.splice(0, 1);
            tfl.autocomplete.setup("#To", sourcesTurnRecentSearchesOn, freshPageLoad);
            tfl.autocomplete.setup("#Via", sourcesTurnRecentSearchesOn, freshPageLoad);
        }
    };

    o.destroyAutocomplete = function () {
        $("#From, #To, #Via").each(function () {
            $(this).parent().siblings(tfl.dictionary.RemoveContentClass).unbind("clear-search-box");
            $(this).typeahead("destroy");
            $(this).off("typeahead:selected typeahead:autocompleted keydown.autocomplete");
        });
        sourcesTurnRecentSearchesOff = [tfl.autocomplete.sources.journeyPlannerSuggestions];
        o.autocompleteAddRecentSearches(true);
        o.autocompleteAddGeolocation();
    };

    o.autocompleteAddRecentSearches = function (excludeRecentSearches) {
        if (tfl.storage.isLocalStorageSupported()) {
            sourcesTurnRecentSearchesOff.splice(0, 0, sourceTurnOffRecentSearches);
            if (tfl.journeyPlanner.recentJourneys.usingRecentJourneys && !excludeRecentSearches) {
                sourcesTurnRecentSearchesOff.splice(0, 0, sourceRecentSearches);
            }
            sourcesTurnRecentSearchesOn.splice(0, 0, sourceTurnOnRecentSearches);
        }
    };

    o.autocompleteAddGeolocation = function () {
        var sourceGeolocation = tfl.autocomplete.sources.geolocation;
        sourceGeolocation.callback = function(inputEl) {
            $(inputEl).removeAttr("data-dataset-name");
            tfl.autocomplete.sources.stationsStopsRemoveContent(inputEl);
            tfl.geolocation.geolocateMe(inputEl);
        };
        if (tfl.geolocation.isGeolocationSupported()) {
            sourcesTurnRecentSearchesOff.splice(0, 0, sourceGeolocation);
            sourcesTurnRecentSearchesOn.splice(0, 0, sourceGeolocation);
        }
    };

    function inputKeydownCallbackSetup() {
        $("#From, #To, #Via").each(function () {
            $(this).on("keydown", function (e) {
                //tab (9), enter key (13), cursor keys (37-40), pg up (33), pg dwn (34), end (35), home (36), (shift,ctr,alt,caps lock 16-20), insert (45), win key (91)
                if (e.which !== 9 && e.which !== 13 && (e.which < 33 || e.which > 40) && (e.which < 16 || e.which > 20) && e.which !== 45 && e.which !== 91) {
                    //remove ID if user changes value
                    removeAttributes($(this));
                };
            });
            $(this).on('paste', function () {
                removeAttributes($(this));
            });
        });

        function removeAttributes($el) {
            $el.removeAttr("data-" + $el.attr("id").toLowerCase() + "-id");
            $el.removeAttr("data-" + $el.attr("id").toLowerCase() + "-modes");
            $el.removeAttr("data-dataset-name");
        }
    };

    o.init = function (isWidget) {
        tfl.logs.create("tfl.journeyPlanner.searchForm.init: started (widget = " + isWidget + ")");
        o.isWidget = isWidget || false;

        o.processTempLocalStorage();

        var arrivingOrLeaving = $(".leaving-or-arriving .selected label").text();

        $(".time-options").prepend("<div class='time-defaults'><p><strong>" + arrivingOrLeaving + ":</strong> <span>now</span></p><a href='javascript:void(0)' class='change-departure-time'>change time</a></div>");
        if (!String.prototype.indexOf || window.location.href.indexOf("&time=") > 0) {
            $(".change-time-options").show();
            $(".time-defaults").hide();
        }

        $(".extra-options").prepend('<a href="' + tfl.jPLandingPageUrl + '#more-options" class="toggle-options more-options">Accessibility &amp; travel options</a>');

        $("#jp-search-form").submit(o.submitSearchForm);

        tfl.journeyPlanner.recentSearches.loadSearches();

        // var jpMap = $('<div class="hidden"><div class="geolocation-map hidden"><div class="image-container"></div></div></div>');
        // $("#FromGeolocation").after(jpMap);

        $(".change-departure-time").click(o.changeDepartureTime);
        o.setupDateOptions();

        if (!o.isWidget) {
            o.changeTabs();
            $(".toggle-options").click(o.toggleMoreOptions);
        } else {
            $(".toggle-options").click(o.toggleMoreOptionsIsWidget);
        }

        if (window.location.hash === "#more-options") {
            $(".toggle-options").click();
        } else if (window.location.hash === "#change-time") {
            o.changeDepartureTime();
        }

        $("#IsAsync").val(true);

        //add autocomplete
        o.setupAutocomplete(true);
        inputKeydownCallbackSetup();

        var fromEl = $("#From"), toEl = $("#To"), viaEl = $("#Via");
        $([fromEl, toEl, viaEl]).each(function () {
            if (this.val() === tfl.dictionary.CurrentLocationText) {
                tfl.geolocation.setupInputBoxForGeolocation(this);
            }
        });

    };

}(window.tfl.journeyPlanner.searchForm = window.tfl.journeyPlanner.searchForm || {}));
(function (o) {
    "use strict";
    o.initialize = function () {
        o.setUpResultTags();
        //$(".results-list-all").find("data-pull-content").click(tfl.navigation.pullContentHandler);
        //o.setUpSelectBoxes();
        o.populateSearchBoxes();
        o.resetSelectBoxes();
        o.checkQueryString();
        o.selectBoxFiltering();
        o.selectBoxChange();
        // o.PaginateSearchFilters();
    };

    o.resetSelectBoxes = function () {
        $('.reset-filters').click(function () {
            $(".selector").children(".filter-box").each(function () {
                $(this).prop('selectedIndex', 0);
                $(this).siblings("span").text($(this).children("option:first-child").text());
                o.selectBoxFiltering();
            });
        });

    };

    o.checkQueryString = function () {
        //gets the current url
        var url = $(location).attr('href');
        //checks it for ? if there isnt any, just runs as usual if there is...
        if (url.indexOf("?") >= 0) {
            //splits url at ? 
            var urlSplit = url.split("?");
            //Splits that by & 
            var ampSplit = urlSplit[1].split("&");
            //the number of & will tell us how many filters are in the url
            var numFilters = (ampSplit.length);
            var i = 0;
            var preFilterArray = new Array();
            while (i < numFilters){
               preFilterArray.push(ampSplit[i].replace(/%20/g,' '));
                i++;
            }
            var filterCount = 0;
            $(".filter-box").each(function() {
                //gets this boxes name
                var filterName = $(this).attr("name");
                //for every item in the array
                for (x = 0; x < preFilterArray.length; x++) {
                    var arrayFilterValue = preFilterArray[x].split("=");
                    if (arrayFilterValue[0] == filterName) {
                        var allOptions = $(this).children().text();
                        if (allOptions.indexOf(arrayFilterValue[1]) <= 0) {
                        }
                        else {
                            $(this).siblings("span").text(arrayFilterValue[1]);
                        }
                    }
                    else {

                    }
                    o.selectBoxFiltering();
                }

            });
            
        }
        else{
           
        }
    };

    o.tagSet = function() {
        var selectedTag = $(this).text();
    };

    o.selectBoxChange = function () {
        $("select.filter-box").change(function () {
            o.selectBoxFiltering();
        });
    };

    o.setUpResultTags = function () {
        $(".results-list-all").find("data-pull-content").click(tfl.navigation.pullContentHandler);
        $(".results-list-all").hide();
        $(".results-list-all").children("#results-list").children("li.search-results").each(function () {
            //take the list of tags provided and turn them into tag links
            var tagString = $(this).children(".search-tags");
            var tagStringValue = tagString.text();
            var tagStringSplit = tagStringValue.split(",")
            var numTags = (tagStringSplit.length);
            for (var y = 0; y < numTags; y++) {
                tagString.append("<a class='result-tag'>" + tagStringSplit[y] + "</a>");
            }
            var $tmp = tagString.children().remove();
            tagString.text('').append($tmp);
        });
    };

    o.selectBoxFiltering = function () {
        $("#pagination-items").empty();
        $(".pagination").remove();
        //for each result

        $(".search-results").each(function () {
            var hide = false;
            //create an array
            var ResultTags = new Array();
            //look for all links in the result - these will be the tags - for each of these...
            $(this).find("a.result-tag").each(function () {
                //get its value
                var tag = $(this).text();
                //put it into the array
                ResultTags[ResultTags.length] = tag;
            });

            //for each selector
            $(".selector").children(".filter-box").each(function () {
                //get its selected value
                var selectedValue = $(this).siblings("span").text();
                //if the value is All then go to the next iteration
                if (selectedValue == "All") {
                    return true;
                }
                //Check the array for the value if its not in there break out
                var inArrayCheck = ($.inArray(selectedValue, ResultTags)); //returns -1 if not in array or otherwise returns the index of the element
                if (inArrayCheck == -1) {
                    hide = true;
                    //$(this).addClass("not-here-anymore");
                    return false;
                }
            });

            if (!hide) {
                $(this).clone(true).appendTo("#pagination-items")
            }

        });
        var numItems = $("#pagination-items > li").length;
        if (numItems === 0) {
            //if the field validation text is already there dont add it again
            if ($(".field-validation-information").length < 1) {
                $(".results-wrapper").append("<p class='field-validation-information' id='search-filters-no-results'>There is nothing matching your search.</p>");              
            }
         }
          else {
            $("#search-filters-no-results").remove();
        }
        o.PaginateSearchFilters();
        //});
    };

    o.PaginateSearchFilters = function () {
        //check that there are rows to paginate
        var itemsPerPage = 5;
        $(".pagination-controls").remove();
        if ($("#pagination-items .search-results").length > itemsPerPage) {
            $(".results-wrapper ul").after("<div class='pagination' />");
            tfl.navigation.pagination.setup($(".results-wrapper"), "#pagination-items", itemsPerPage, $("#pagination-items .search-results").length, true);
        }
    };

    o.populateSearchBoxes = function () {
        $(".search-filters-wrapper").append("<div class='search-filter filter-by-box'><a class='reset-filters'>Reset</a><p class='heading'>Filter by:</p>");
        for (var i = 0; i <= filters.length; i++) {
            for (var categoryName in filters[i]) {
                $(".filter-by-box").append("<div class='filter-box-wrap'></div");
                $(".filter-box-wrap").eq(i).append("<label for='" + categoryName + "' class='heading'>" + categoryName + ":</label><div class='selector'><select class='filter-box' name=" + categoryName + " class='valid'><option selected='selected'>All</option></select></div>");
                for (var j = 0; j < filters[i][categoryName].length; j++) {
                    $(".filter-box-wrap").eq(i).find(".filter-box").append("<option>" + filters[i][categoryName][j] + "</option>");
                }
            }
        }
        tfl.forms.setupSelectBoxes();
    };

    $(document).ready(function () {
        tfl.logs.create("tfl.searchFilters: looking for search filters");
        var selector = $(".search-filters-wrapper");
        if (selector.length > 0) {
            tfl.logs.create("tfl.searchFilters: loading search filters");
            o.initialize();
        }
    });

})(window.tfl.searchFilters = window.tfl.searchFilters || {});
(function (o) {
    o.tabs = function (elm) {
        tfl.logs.create("tfl.navigation.tabs: loaded");
        var tabs = $(elm).children();
        tabs.click(function (event) {
            event.preventDefault();
            tabs.removeClass('selected');
            $(this).addClass('selected');
            tfl.logs.create("tfl.navigation.tabs: " + $(this).find('a').attr('href'));
        });
    };
    o.tabs("[data-tabs='true']");
}(window.tfl.navigation = window.tfl.navigation || {}));
// Author: Steven Swinbank
// Date: 04/03/2013
// Description: Javascript function create the grey cross to the right of input[type="text"] of class 'removable-content'

(function (o) {
    "use strict";
    o.RemoveContentClass = ".remove-content";

    tfl.logs.create("tfl.removableContent.initRemoveContents: loaded");
    o.initRemoveContents = function () {
        tfl.logs.create("tfl.removableContent.initRemoveContents: started");
        var $targets = $(":input:text").not(".disable-removable-content");
        $targets.clearSearch({ divClass: "remove-content-container", clearClass: "remove-content", linkText: "Clear search" });
        $targets.not(".tt-hint").each(function () {
            if ($(this).val() === "") {
                $(this).closest(".remove-content-container").addClass("empty");
            }
        }).on("keyup", function () {
            if ($(this).val() === "") {
                $(this).closest(".remove-content-container").addClass("empty");
            } else {
                $(this).closest(".remove-content-container").removeClass("empty");
            }
        });

        $('.remove-content').addClass('hide-text').click(function () {
            var $currentLocationBoxes = $(this).siblings("[data-current-location]");
            if ($currentLocationBoxes.length === 0) {
                $currentLocationBoxes = $(this).parent("[data-current-location]");
            }
            if ($currentLocationBoxes.length > 0) {
                $currentLocationBoxes.removeAttr("data-current-location");
                $currentLocationBoxes.find("input[type='text']").trigger("geolocation-cleared");
            }
            $(this).closest(".remove-content-container").addClass("empty");
        });
    };

    o.initRemoveContents();
}(window.tfl.removableContent = window.tfl.removableContent || {}));


(function (o) {
    tfl.logs.create("tfl.survey: started");

    o.success = function () {
        $('#survey').removeAttr("src");
        toggleSurvey(true);
    };
    $.ajax({
        url: '/corporate/feedback/'
    }).done(function (response) {
        $('.cookie-policy-notice').after(response);
        //setSrc();
        $('.beta-banner-link').click(function () {
            setSrc();
            toggleSurvey(false);
        });
    });

    function toggleSurvey(isSuccess) {
        if ($("html.lt-ie8").length > 0) {
            $(".beta-banner-form").toggle();
            toggleLinkIcon();
        } else {
            $(".beta-banner-form").slideToggle("slow", function () {
                if (isSuccess) {
                    $('.beta-banner-submit').slideDown("slow", function () {
                        toggleLinkIcon();
                    }).delay(1000).slideUp("slow", function () {
                        toggleLinkIcon();
                    });
                }
                toggleLinkIcon();
            });
        }
    }
    function setSrc() {
        var body = $('body');
        var size = 'small';
        if (body.hasClass('breakpoint-Large')) {
            size = 'large';
        } else if (body.hasClass('breakpoint-Medium')) {
            size = 'medium';
        }
        var surveyIframe = $('#survey');
        if (surveyIframe.attr('src') === null || surveyIframe.attr('src') === undefined || surveyIframe.attr('src') === "") {
            var surveySrc = 'https://www.research.net/s/tfl_beta?layout=' + size + '&page=' + encodeURIComponent(location.href) + '&device=' + encodeURIComponent(navigator.userAgent);
            surveyIframe.attr('src', surveySrc);
        }
    }
    function toggleLinkIcon() {
        var link = $('.beta-banner-link');
        var expandedClass = 'link-accordion-expanded';
        link.toggleClass(expandedClass);
        if ($("html.lt-ie8").length > 0) {
            var ieFixEls = $(".top-row, #full-width-content");
            ieFixEls.addClass("ie7-fix");
            window.setTimeout(function () {
                ieFixEls.removeClass("ie7-fix");
            }, 5);
        }
    }
})(tfl.survey = tfl.survey || {});
window.tfl.navigation = window.tfl.navigation || {};
(function (o) {
    "use strict";
    tfl.logs.create("tfl.navigation.pagination: loaded");


    o.setup = function (containerEl, itemClass, itemsPerPage, totNumItems, dontAddPaginationEl, mapController) {
        var numPages = totNumItems % itemsPerPage > 0
            ? Math.floor(totNumItems / itemsPerPage) + 1
            : Math.floor(totNumItems / itemsPerPage);
        var numPagesToDisplay = numPages > 5 ? 3 : numPages;
        if (!dontAddPaginationEl) {
            containerEl.append("<div class='pagination' />");
        }
        containerEl.pajinate({
            items_per_page: itemsPerPage,
            item_container_id: itemClass,
            nav_panel_id: '.pagination',
            num_page_links_to_display: numPagesToDisplay,
            nav_label_first: '1',
            nav_label_prev: '',
            nav_label_next: '',
            nav_label_last: numPages,
            show_first_last: true,
            show_prev_next: false,
            abort_on_small_lists: true
        });
        //customize pagination controls
        containerEl.find(".pagination").wrap("<div class='pagination-controls' />");
        containerEl.find(".previous_link").prependTo(containerEl.find(".pagination"));
        containerEl.find(".next_link").appendTo(containerEl.find(".pagination"));

        //containerEl.find(".first_link").after("<span class='separator'></span>");
        //containerEl.find(".last_link").before("<span class='separator'></span>");
        o.checkPageLinks(containerEl,numPages);
        containerEl.find(".pagination a").click(function () {
            o.checkPageLinks(containerEl, numPages);
            //scroll to top of list
            if ($(window).scrollTop() > containerEl.offset().top) {
                window.scrollTo(0, containerEl.offset().top);
            }
        });

    };

    o.addMapControls = function ($pagination, mapController) {
        var page = 1;
        if (mapController) {
            $pagination.find(".page_link").click(
                function () {
                    page = parseInt($(this).attr("data-longdesc"), 10);
                    mapController.choosePage(page);
                }
            );
            $pagination.find(".previous_link").click(
                function () {
                    mapController.choosePage(--page);
                }
            );
            $pagination.find(".next_link").click(
                function () {
                    mapController.choosePage(++page);
                }
            );
            $pagination.find(".first_link").click(
                function () {
                    page = 1;
                    mapController.choosePage(1);
                }
            );
            $pagination.find(".last_link").click(
                function () {
                    $pagination.find(".page_link.last").trigger('click');
                }
            );
        }
    }
    o.checkPageLinks = function (containerEl, numPages) {
        if (numPages < 6) {

            containerEl.find(".first_link,.last_link").hide();
        } else {
  
            var pageLinks = containerEl.find(".page_link");
            //first page is select - hide first page selector
            if ($(pageLinks[0]).hasClass("active_page")) {
                $(pageLinks[0]).hide();
                $(pageLinks[3]).show();
                containerEl.find(".next_link").prepend("<span>next-page</span>");
                containerEl.find(".previous_link").prepend("<span>previous-page</span>");
                containerEl.find(".first_link").addClass("active_page");
            } else if ($(pageLinks[pageLinks.length - 1]).hasClass("active_page")) {
                $(pageLinks[pageLinks.length - 1]).hide();
                $(pageLinks[pageLinks.length - 4]).show();
                
                containerEl.find(".last_link").addClass("active_page");
            } else {
                for (var i = 2; i < pageLinks.length - 2; i++) {
                    if ($(pageLinks[i]).hasClass("active_page")) {
                        $(pageLinks[i + 2]).hide();
                        $(pageLinks[i + 1]).show();
                        $(pageLinks[i - 1]).show();
                        $(pageLinks[i - 2]).hide();
                        break;
                    }
                }
            }
        }
    };

}(window.tfl.navigation.pagination = window.tfl.navigation.pagination || {}));
(function (o) {
    o.getQueryStringParameter = function (param) {
        var queryString = window.location.search.substring(1),
	    	vars = queryString.split('&'),
	    	i;

        for (i = 0; i < vars.length; i += 1) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) === param) {
                return decodeURIComponent(pair[1]);
            }
        }

        return null;
    };
    o.setQueryStringParameter = function (param, value) {
        if (window.history.pushState !== undefined) {

            var queryString = window.location.search.substring(1),
                vars = queryString.split('&'),
                i,
                found = false;

            for (i = 0; i < vars.length; i += 1) {
                var pair = vars[i].split('=');
                if (decodeURIComponent(pair[0]) === param) {

                    pair[1] = encodeURIComponent(value);
                    vars[i] = pair.join("=");
                    //window.history.pushState({ "html": $('html').html() }, "", "?" + vars.join("&"));
                    window.history.pushState({}, "", "?" + vars.join("&"));
                    found = true;
                    break;
                }
            }

            if (!found) {
                if (queryString.length === 0) {
                    queryString += "?" + encodeURIComponent(param) + "=" + encodeURIComponent(value);
                    //window.history.pushState({ "html": $('html').html() }, "", queryString);
                    window.history.pushState({}, "", queryString);
                } else {
                    queryString += "&" + encodeURIComponent(param) + "=" + encodeURIComponent(value);
                    //window.history.pushState({ "html": $('html').html() }, "", queryString);
                    window.history.pushState({}, "", "?" + queryString);
                }
            }
        }
    };
    o.removeQueryStringParameter = function (param) {
        if (window.history.pushState !== undefined) {

            var queryString = window.location.search.substring(1),
                vars = queryString.split('&'),
                i,
                found = false;

            for (i = 0; i < vars.length; i += 1) {
                var pair = vars[i].split('=');
                if (decodeURIComponent(pair[0]) === param) {
                    vars.splice(i, 1);
                    //window.history.pushState({ "html": $('html').html() }, "", "?" + vars.join("&"));
                    window.history.pushState({}, "", "?" + vars.join("&"));
                    found = true;
                    break;
                }
            }
        }
    };

    o.measureElementHeight = function ($element, displayType) {
        var originalStyle = $element.attr('style');
        
        $element.removeAttr('style').css({
            position: 'fixed',
            left: '-10000px',
            display: displayType || 'block'
        });

        var h = $element.height();
        //$element.removeAttr('style').attr('style', originalStyle);
        return h;
    };
    o.measureElementWidth = function ($element, displayType) {
        var originalStyle = $element.attr('style');

        $element.removeAttr('style').css({
            position: 'fixed',
            left: '-10000px',
            display: displayType || 'block'
        });

        var h = $element.width();
        $element.removeAttr('style').attr('style', originalStyle);
        return h;
    };
    
    o.makeMVCDate = function (date) {
        function addLeadingZero(prop) {
            var s = "";
            if (prop < 10) {
                s += "0";
            }
            s += prop;
            return s;
        }
        var s = "";
        s += date.getFullYear() + "-";
        s += addLeadingZero(date.getMonth() + 1) +  "-";
        s += addLeadingZero(date.getDate()) + "T";
        s += addLeadingZero(date.getHours()) + ":";
        s += addLeadingZero(date.getMinutes()) + ":";
        s += addLeadingZero(date.getSeconds());
        return s;
    };

    o.makeDateFromQueryStringDate = function(dateStr) {
        var date = new Date();
        date.setDate(dateStr.substring(8, 10));
        date.setMonth(dateStr.substring(5, 7) - 1);
        date.setYear(dateStr.substring(0, 4));
        date.setHours(dateStr.substring(11, 13));
        date.setMinutes(dateStr.substring(14, 16));
        date.setSeconds(dateStr.substring(17, 19));
        return date;
    };

    o.getTime = function(dateTime) {
        return (dateTime.getHours() < 10 ? '0' : '') + dateTime.getHours() + ":" + (dateTime.getMinutes() < 10 ? '0' : '') + dateTime.getMinutes();
    };
    
    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined'
                  ? args[number]
                  : match
                ;
            });
        };
    }

}(window.tfl.tools = window.tfl.tools || {}));
(function (o) {
    
    // No need to include this script with the module, as it is combined into the global set. If you wish to refresh the handles due to a dom change, just call tfl.expandableBox.init.

    o.init = function () {
        $(".always-visible").off("click.expandableBox").on("click.expandableBox", function () {
            var $par = $(this).parent();
            if (!$par.hasClass("expanded")) {
                $par.addClass("expanded");
                $(this).attr('aria-expanded', 'true')
                    .trigger("expandable-box.expanded");
            } else {
                $par.removeClass("expanded");
                $(this).attr('aria-expanded', 'false')
                    .trigger("expandable-box.collapsed");
            }
            return false;
        })
        .keypress(function (e) {
            if (e.which == 13) {
                $(this).click();
            }
        })
    }

    o.init();

}(window.tfl.expandableBox = window.tfl.expandableBox || {}));
(function (o) {
    
    // No need to include this script with the module, as it is combined into the global set. If you wish to refresh the handles due to a dom change, just call tfl.expandableBox.init.
    function breadcrumb($el) {
        var $breadcrumbs = $el,
            $parent = $breadcrumbs.parent(),
            $items = $breadcrumbs.find(">li"),
            $ellipsis = null,
            ellipsisWidth = 0,
            breakpointArrowWidth = 13,
            measurements = [],
            breakpoints = [],
            totalWidth = 0,
            width = 0,
            currentBreakpoint = 0,
            hiding = false,
            scrolling = false,
            resizeFunc = null;
        return {
            init: function () {
                $ellipsis = $("<li class='ellipsis hidden'><a href='javascript:void(0)'>...</a></li>");
                $items.eq(0).after($ellipsis);
                ellipsisWidth = $ellipsis.width();
                $ellipsis.click(this.makeScrollable);
                $items.each(function () {
                    var w = $(this).width()
                    measurements.push(w);
                    totalWidth += w;
                });
                totalWidth += breakpointArrowWidth;  
                breakpoints.push(totalWidth);              
                var c = totalWidth;
                for (var i = 1; i < measurements.length; i++) {
                    c -= measurements[i];                    
                    breakpoints.push(c + ellipsisWidth);
                }
                resizeFunc = $.proxy(this.onResize, this);
                $(window).on("resize", resizeFunc);
                this.onResize();
            },
            onResize: function () {
                width = $breadcrumbs.width();
                if (width < totalWidth) {
                    if (width <= breakpoints[currentBreakpoint]) {
                        hiding = true;
                        $ellipsis.removeClass("hidden");
                        while (width <= breakpoints[currentBreakpoint]) {
                            this.hideItem(currentBreakpoint);
                            currentBreakpoint++;
                        }
                    } else if (width > breakpoints[currentBreakpoint]) {
                        while (width > breakpoints[currentBreakpoint]) {
                            this.showItem(currentBreakpoint);
                            currentBreakpoint--;
                        }
                    }
                } else if (hiding) {
                    $ellipsis.addClass("hidden");
                    hiding = false;
                    while (width >= breakpoints[currentBreakpoint]) {
                        this.showItem(currentBreakpoint);
                        currentBreakpoint--;
                    }
                    if (currentBreakpoint < 0) {
                        currentBreakpoint = 0;
                    }
                } 
            },
            hideItem: function (idx) {
                $items.eq(idx + 1).hide();
            },
            showItem: function (idx) {
                $items.eq(idx + 1).show();
            },
            makeScrollable: function () {
                if (tfl.utils.isTouchDevice()) {
                    $parent.addClass("scrolling");
                    $breadcrumbs.css({ width: totalWidth + "px" });
                }
                $ellipsis.addClass("hidden");
                $items.each(function () {
                    $(this).show();
                });
                $(window).off("resize", resizeFunc);
                return false;
            }
        };
    };

    o.init = function () {
        var $breadcrumbs = $("ul.breadcrumbs");
        var $breadcrumbCount = $breadcrumbs.length;
        
        $("ul.breadcrumbs").each(function () {
            $breadcrumbs = $(this);
                   new breadcrumb($breadcrumbs).init();
        })
    }

    o.init();

}(window.tfl.breadcrumb = window.tfl.breadcrumb || {}));
(function (o) {
    o.init = function(selector) {
        $(selector).each(function () {
            var $this = $(this);
            $this.wrap('<div class="fc-calendar-wrapper clearfix" />');
            var $wrap = $this.parent();
            var $cal = $this.calendario({
                weekabbrs: ["S", "M", "T", "W", "T", "F", "S"],
                displayWeekAbbr: true,
                month: $this.attr("data-month"),
                year: $this.attr("data-year")
            });
            $wrap.prepend("<div class='current-month'><a href='javascript:void(0);' class='calendar-previous-month hide-text'>Previous month</a><span class='calendar-month'>" + $cal.getMonthName() + "</span> <span class='calendar-year'>" + $cal.getYear() + "</span><a href='javascript:void(0);' class='calendar-next-month hide-text'>Next month</a></div>");
            $wrap.find('.calendar-next-month').on('click', function () {
                if (!$(this).hasClass('disabled')) {
                    $cal.gotoNextMonth(function () {
                        updateMonthYear();
                        $this.attr("data-month", $cal.getMonth());
                        $this.attr("data-year", $cal.getYear());
                        $(window).trigger('calendar-next-month');
                    });
                }
            });
            $wrap.find('.calendar-previous-month').on('click', function () {
                if (!$(this).hasClass('disabled')) {
                    $cal.gotoPreviousMonth(function () {
                        updateMonthYear();
                        $this.attr("data-month", $cal.getMonth());
                        $this.attr("data-year", $cal.getYear());
                        $(window).trigger('calendar-previous-month');
                    });
                }
            });
            var $month = $wrap.find('.calendar-month');
            var $year = $wrap.find('.calendar-year');
            var updateMonthYear = function () {
                $month.html($cal.getMonthName());
                $year.html($cal.getYear());
            }
        });
    }
    
    o.init(".fc-calendar-container");

}(window.tfl.calendar = window.tfl.calendar || {}));
(function (o) {
    o.allTables = [];
    o.tableCellPadding = 5;
    o.tableShadowWidth = 15;

    o.ResponsiveTable = function(el) {
        var table = el;
        var parent = $(table).parent();
        var left = null;
        var top = null;
        var width = null;
        var height = null;
        var hiding = false;
        var leftShadow = null;
        var rightShadow = null;
        var parentWidth = null;
        var scrollMax = null;
        var firstRow = null;
        var firstRowHeight = 0;
        var firstRowTop = 0;
        var firstRowLeft = 0;
        var firstRowFixed = false;
        var firstCol = null;
        var firstColWidth = 0;
        var firstColLeft = 0;
        return {
            init: function () {
                var t = this;
                t.onResize();
                parent.scroll(t.onParentScroll);
                if ($(parent).closest('.expandable-box').length) {
                    $(parent).closest('.expandable-box').find('.always-visible').on('click', function () { t.onResize();});
                }
            },
            onResize: function () {
                
                var wasVisible = this.isVisible;
                if ($(parent).is(':visible')) {
                    this.isVisible = true;
                } else {
                    this.isVisible = false;
                }
                if (!wasVisible && this.isVisible) {
                    this.stopHiding();
                    this.startHiding();
                }
                
                var offset = $(parent).offset();
                left = offset.left;
                top = offset.top;

                width = $(table).width();
                height = $(table).height();

                parentWidth = $(parent).width();
                if (firstRow) {
                    firstRowHeight = firstRow.height() ? firstRow.height() : firstRowHeight;
                    var toffset = $(table).offset();
                    firstRowTop = toffset.top;
                    firstRowLeft = toffset.left;
                    if (hiding) {
                        firstRow.parent().css({ width: parentWidth, left: left });
                        this.onWindowScroll($(window).scrollTop());
                    }
                }
                if (firstCol) {
                    firstColWidth = firstCol.width() - 2 * o.tableCellPadding;
                }
                if (width > parentWidth) {
                    if (!hiding) {
                        this.startHiding();
                    } else {
                        scrollMax = width - parentWidth;
                        this.onParentScroll();
                    }
                } else if (hiding) {
                    this.stopHiding();
                }
            },
            onWindowScroll: function (scrollTop) {
                var offset = $(parent).offset();
                left = offset.left;
                top = offset.top;
                if (hiding && !firstRowFixed && (top < scrollTop && scrollTop <= top + height - firstRowHeight)) {
                    firstRowFixed = true;
                    $(firstRow).css({ marginLeft: -1 * $(parent).scrollLeft() });
                    $(firstRow).parent().removeClass("hidden");
                } else if (firstRowFixed) {
                    //if we scroll above or below the table, get rid of the fixed heading
                    if (top >= scrollTop || scrollTop > top + height - firstRowHeight) {
                        firstRowFixed = false;
                        $(firstRow).parent().addClass("hidden");
                    }
                }
            },
            onParentScroll: function () {
                var pScrollLeft = $(parent).scrollLeft();
                $(firstRow).css({ marginLeft: (-1 * pScrollLeft) });
                leftShadow.css({ left: firstColWidth + 2 * o.tableCellPadding - o.tableShadowWidth + Math.min(pScrollLeft, o.tableShadowWidth) });
                var r = Math.min(scrollMax - pScrollLeft, o.tableShadowWidth) - o.tableShadowWidth;
                //Hack to fix a bug on Chrome for Android. Without this if statement, the right shadow
                //starts off visible, but never comes back if you scroll it out of view.
                if (r === -1 * o.tableShadowWidth) {
                    r++;
                }
                rightShadow.css({ right: r });
            },
            startHiding: function () {
                hiding = true;
                parent.addClass("hiding");
                if (parent.children(".hiding-table").length > 0) {
                    firstRow.css({ width: width });
                    parent.children(".hiding-table").show();
                } else {
                    this.createFixedHeadings();
                }
                parent.parent().addClass("hiding");
            },
            stopHiding: function () {
                hiding = false;
                parent.removeClass("hiding");
                parent.parent().removeClass("hiding");
                parent.parent().find(".hiding-table").hide();
                firstRowFixed = false;
                $(firstRow).parent().addClass("hidden");
            },
            createFixedHeadings: function () {
                width = $(table).width();

                firstRow = $("<table class='first-row'></table>");
                var fr = $(table).find("tr:first-child");
                firstRowHeight = fr.height();
                firstRow.append(fr.clone().css({ height: firstRowHeight, width:  width}));

                firstRow.find("th").replaceWith(function () {
                    return $("<td />", { html: $(this).html() });
                });

                var frCells = fr.find("th, td");
                $(firstRow).find("th, td").each(function (i) {
                    if (i === 0) {
                        $(this).html("<span>" + $(this).html() + "</span>");
                    }
                    $(this).width($(frCells.get(i)).width());
                });

                firstCol = $("<table class='hiding-table first-col'></table>").css({ top: 0 });
                firstColWidth = 0;
                firstColLeft = 0;
                $(table).find("th:first-child,td:first-child").each(function (i) {
                    if (i === 0) {
                        firstColWidth = $(this).width();
                        firstColLeft = $(this).offset().left;
                    }
                    var r = $("<tr></tr>");
                    //$(this).css({height : $(this).height()});
                    r.append($(this).clone().css({ height: $(this).height() }));
                    firstCol.append(r);
                });
                parent.wrap("<div class='responsive-table-wrapper'></div>");
                parent.parent().append(firstCol.css({ width: firstColWidth, position: "absolute" }));

                firstRow.wrap("<div class='hidden'></div>");
                firstCol.after(firstRow.css({ width: width }).parent().css({
                    overflow: "hidden",
                    width: parentWidth,
                    position: "fixed",
                    top: 0,
                    boxShadow: "0px 5px 5px -3px rgba(0, 0, 0, 0.3)"
                }));
                //parent.append(firstRow.css({ width: width }));

                height = $(table).height();

                firstRowTop = $(firstRow).parent().offset().top;
                firstRowLeft = $(table).offset().left;
                leftShadow = $("<div class='responsive-table-shadow left-shadow' />");
                leftShadow.css({ left: firstColWidth + 2 * o.tableCellPadding - o.tableShadowWidth, height: height });
                rightShadow = $("<div class='responsive-table-shadow right-shadow' />");
                rightShadow.css({ right: 0, height: height });
                firstCol.before(leftShadow);
                firstCol.before(rightShadow);

                scrollMax = width - parentWidth;
                //call the window scroll event in case resizing the window triggered
                //the creation of the top and left bars and we need to make them fixed
                this.onWindowScroll($(window).scrollTop());
            }
        };
    };

    o.init = function(selector) {
        //only tables in a table-container div will be made responsive
        $(selector).each(function (i) {
            var t = new o.ResponsiveTable(this);
            t.init();
            o.allTables.push(t); 
        });
        if (o.allTables.length > 0) {
            $(window).resize(function () {
                for (var i = 0; i < o.allTables.length; i++) {
                    o.allTables[i].onResize();
                }
            });
            $(window).scroll(function () {
                var scrollTop = $(this).scrollTop();
                for (var i = 0; i < o.allTables.length; i++) {
                    o.allTables[i].onWindowScroll(scrollTop);
                }
            });
        }
    }
    
    o.init(".table-container table");

}(window.tfl.responsiveTables = window.tfl.responsiveTables || {}));
(function (o) {
    tfl.logs.create("tfl.fullscreen stage: loaded");

    var $stage,
        $panZoomStage,
        $closeButton,
        elements = [],
        initialized = false,
        panZoomInitialized = false,
        originalPositions = [],
        originalPositionsAreParents = [],
        withPanZoom = false,
        previousScrollTop = 0,
        options = {
            id: "fullscreen-stage",
            stageActiveClass: "stage-active"
        };

    // private setup function on first fullscreen
    function setupStage(noButton) {
        var $stageElement = $('<div id="' + options.id + '"></div>');
        if(!noButton){
            $closeButton = $('<button id="close-fullscreen-stage" class="fullscreen-stage-button"><span class="icon close-icon"></span></button>');
            $stageElement.append($closeButton);
            $closeButton.on("click", removeFromStage);
        }
        $(document.body).append($stageElement);
        initialized = true;
        return $stageElement;
    }

    function addToStage($el) {
        tfl.logs.create("tfl.fullscreen: enter fullscreen stage");
        o.addItemToStage($el);

        $(document.body).addClass(options.stageActiveClass);
        $(window).trigger("enter-fullscreen-stage");

        //only set up panzoom on the first element if we have to set it up
        if (withPanZoom && elements.length === 1) {
            $(document.body).addClass("panzoom");
            tfl.zoomableContent.init($el);
        }

    }

    function removeFromStage() {
        tfl.logs.create("tfl.fullscreen: exit fullscreen stage");
        var $element;
        for (var i = elements.length - 1; i >= 0; i--) {
            $element = elements[i];
            if (originalPositionsAreParents[i]) {
                originalPositions[i].append($element);
            } else {
                originalPositions[i].before($element);
            }        
        }
        elements = [];
        originalPositions = [];
        originalPositionsAreParents = [];
        if (withPanZoom) {
            $(document.body).removeClass("panzoom");
            $element.trigger("destroy-panzoom");
        }
        $(document.body).removeClass(options.stageActiveClass);
        $(window).trigger("exit-fullscreen-stage");
    }

    o.addItemToStage = function ($element) {
        if (!$stage) {
            tfl.logs.create("tfl.fullscreen: Tried to add item to stage before stage was initialised");
            return;
        }

        var $next = $element.next();
        if ($next.length === 0) {
            originalPositions[originalPositions.length] = $element.parent();
            originalPositionsAreParents[originalPositionsAreParents.length] = true;
        } else {
            originalPositions[originalPositions.length] = $next;
            originalPositionsAreParents[originalPositionsAreParents.length] = false;
        }
        elements.push($element);
        $stage.append($element);
    };

    o.hide = function () {
        if (elements.length !== 0) {
            removeFromStage();
        }
        document.body.scrollTop = previousScrollTop;
    }

    o.display = function ($el, wPZ, noButton) {
        if (!initialized) {
            $stage = setupStage(noButton || false);
        }

        withPanZoom = wPZ;

        if (elements.length !== 0) {
            removeFromStage();
        }

        previousScrollTop = document.body.scrollTop;
        addToStage($el);

    }

})(window.tfl.fullscreen = window.tfl.fullscreen || {});
(function (o) {
    "use strict";
    tfl.logs.create("tfl.listToDropdown: loaded");

    var throttle,
        $throttleTarget;
    o.init = function () {
        tfl.logs.create("tfl.listToDropdown: initialised");
        o.buildHtmlDropdown();
        o.dropDownMouseFunctionality();
        o.hideShowList();
        o.datePickerDropdownBuilding();
    };

    o.buildHtmlDropdown = function() {
        $(".links-list").each(function() {
            var linkList = $(this);
            linkList.addClass("hidden");
            var dropDownTarget = linkList.data('dropdown-target');
            var dropDownLabel = linkList.data('dropdown-label');
            var selectedItem = linkList.data('selected-item-id');
            var dropdownStyling = linkList.data('dropdown-option');
            //in the special case dropdown is datpicker, add a class
            var datesClass = "";
            if (dropDownTarget == "date-dropdown-placeholder") {
                datesClass = "datepicker-dropdown";
                linkList.addClass(datesClass);
            }
            linkList.find('li[data-item-id="' + selectedItem + '"]').hide();
            linkList.wrap('<div class="for-dropdown" />');
            //special case for GLA
            if (linkList.attr("id") == "gla-list") {
                linkList.parent().prepend('<div role="button" tabindex="0"  class="dropdown-button ' + dropdownStyling + ' dropdown-closed ' + datesClass + '"><img src="/assets/images/tfl/MoL.png" alt="Mayor of London"><span class="mol-gla">GLA</span></div>');
               }
            else {
                linkList.parent().prepend('<div tabindex="0" role="button" ' + 'aria-label="' + dropDownLabel + '" ' + 'class="dropdown-button ' + dropdownStyling + ' dropdown-closed ' + datesClass + '" >' + selectedItem + '</div>');
            }
            $("." + dropDownTarget).append(linkList.parent());
            //special case for !GLA
            if (!linkList.attr("id") == "gla-list" || !linkList.attr("id")) {
                $(linkList).find('li:visible:first').css('border-top', 'solid 1px #cacaca');
            }
            linkList.siblings(".dropdown-button").click(function() {
                o.hideShowList(linkList.siblings(".dropdown-button"));
            })
            .keypress(function (e) {
                if (e.which == 13) {
                    $(this).click();
                }
            });
            
            //return false;d
        });
    };

    o.hideShowList = function (el) {
        if ($(el).hasClass('dropdown-closed')) {
            clearTimeout(throttle);
            throttle = 0;
            $throttleTarget = undefined;
            $('ul.links-list:not(".hidden")').addClass("hidden").prev('.dropdown-button').addClass('dropdown-closed');
        }
        $(el).next("ul.links-list").toggleClass("hidden");
        $('ul.links-list li:visible:first').css("border-top-width","1px");
        $(el).toggleClass("dropdown-closed");
        clearTimeout(throttle);
        throttle = 0;
        $throttleTarget = undefined;
    };

    o.dropDownMouseFunctionality = function() { // mouse entering/leaving drop-down hiding
        //hide drop-down if move out of drop-down and drop-down-button
        $(".for-dropdown").on("mouseleave", function () {
            var $this = $(this);
            $throttleTarget = $this;
            throttle = setTimeout(function () {
                if (!$this.children(".dropdown-button").hasClass("dropdown-closed")) {
                    o.hideShowList($this.children(".dropdown-button"));
                }
            }, 500);
        }).on("mouseenter", function () {
            if (throttle && $(this).is($throttleTarget)) {
                clearTimeout(throttle);
                throttle = 0;
                $throttleTarget = undefined;
            }
        });

    };

    o.datePickerDropdownBuilding = function() {
        //find parent of this element and takes the li hover off
        $(".advance-month-container").parent().addClass("no-hover");
    };
    o.init();
})(window.tfl.listToDropdown = window.tfl.listToDropdown || {});

(function (o) {
    tfl.logs.create("tfl.search-icon-toggle: loaded");
    var searchBox = $(".search-tools input:text");
    var searchBoxContent = searchBox.val();
    searchBox.on("keyup", function () {
        o.toggleSearchIcon();
    }),
    $(".search-tools a.remove-content").click(function () {
        o.toggleSearchIcon();
    });
    o.toggleSearchIcon = function () {
        var searchBoxContent = searchBox.val();
        if (searchBoxContent.length == 0) {
            $("#search-button").show();
        }
        else {
            $("#search-button").hide();
        }
    }
    o.h1Fix = function () {
        var searchTitle = $(".search-title");
        var dots = $(".dots").length;
        if (dots == 0) {
            searchTitle.append("<span class='hero-headline dots visually-hidden'>...</span>");
        }
        searchTitle.css("display", "inline-block");
        var searchTitleWidth = searchTitle.outerWidth();
        var pageWidth = searchTitle.parent().outerWidth();
        pageWidth = pageWidth * 0.95;
        pageWidth = pageWidth - 20;
        if (searchTitleWidth > pageWidth) {
            searchTitle.css("display", "block");
            $(".dots").removeClass("visually-hidden");
        }
        else {
            searchTitle.css("display", "inline-block");
            $(".dots").addClass("visually-hidden");
        }
    }
    o.toggleSearchIcon();
    o.h1Fix();

    $(window).on('resize', function () {
        o.h1Fix();

    })
   
        
    
}(window.tfl.searchIcon = window.tfl.searchIcon || {}));
