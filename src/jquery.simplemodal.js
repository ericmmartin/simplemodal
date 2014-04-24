/*
 * SimpleModal @VERSION - jQuery Plugin
 * http://simplemodal.com/
 * Copyright (c) 2013 Eric Martin
 * Licensed under MIT and GPL
 * Date:
 */

/**
 * SimpleModal is a lightweight jQuery plugin that provides a simple
 * interface to create a modal dialog.
 *
 * The goal of SimpleModal is to provide developers with a cross-browser
 * overlay and container that will be populated with data provided to
 * SimpleModal.
 *
 * There are two ways to call SimpleModal:
 * 1) As a chained function on a jQuery object, like $('#myDiv').modal();.
 * This call would place the DOM object, #myDiv, inside a modal dialog.
 * Chaining requires a jQuery object. An optional options object can be
 * passed as a parameter.
 *
 * @example $('<div>my data</div>').modal({options});
 * @example $('#myDiv').modal({options});
 * @example jQueryObject.modal({options});
 *
 * 2) As a stand-alone function, like $.modal(data). The data parameter
 * is required and an optional options object can be passed as a second
 * parameter. This method provides more flexibility in the types of data
 * that are allowed. The data could be a DOM object, a jQuery object, HTML
 * or a string.
 *
 * @example $.modal('<div>my data</div>', {options});
 * @example $.modal('my data', {options});
 * @example $.modal($('#myDiv'), {options});
 * @example $.modal(jQueryObject, {options});
 * @example $.modal(document.getElementById('myDiv'), {options});
 *
 * A SimpleModal call can contain multiple elements, but only one modal
 * dialog can be created at a time. Which means that all of the matched
 * elements will be displayed within the modal container.
 *
 * SimpleModal does not set any styling on modals, but rather provides the
 * developer with the flexibility to easily control the look and feel by
 * creating their own CSS in combination with the overlayCss, containerCss,
 * and dataCss options.
 *
 * @name SimpleModal
 * @type jQuery
 * @requires jQuery v1.3
 * @cat Plugins/Windows and Overlays
 * @author Eric Martin (http://ericmmartin.com)
 * @version @VERSION
 */

;(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
}
(function ($) {
	var d = [],
		doc = $(document),
		ua = navigator.userAgent.toLowerCase(),
		wndw = $(window),
		w = [];

	/*
	 * Create and display a modal dialog.
	 *
	 * @param {string, object} data A string, jQuery object or DOM object
	 * @param {object} [options] An optional object containing options overrides
	 */
	$.modal = function (data, options) {
		return $.modal.impl.init(data, options);
	};

	/*
	 * Close the modal dialog.
	 */
	$.modal.close = function () {
		$.modal.impl.close();
	};

	/*
	 * Set focus on first or last visible input in the modal dialog. To focus on the last
	 * element, call $.modal.focus('last'). If no input elements are found, focus is placed
	 * on the data element.
	 */
	$.modal.focus = function (pos) {
		$.modal.impl.focus(pos);
	};

	/*
	 * Update the modal dialog. Re-bind events. Focus, if "focus" option is enabled.
	 */
	$.modal.update = function () {
		$.modal.impl.update();
	};

	/*
	 * Chained function to create a modal dialog.
	 *
	 * @param {object} [options] An optional object containing options overrides
	 */
	$.fn.modal = function (options) {
		return $.modal.impl.init(this, options);
	};

	/*
	 * SimpleModal default options
	 *
	 * appendTo:		(String:'body') The jQuery selector to append the elements to. For .NET, use 'form'.
	 * focus:			(Boolean:true) Focus in the first visible, enabled element?
	 * opacity:			(Number:50) The opacity value for the overlay div, from 0 - 100
	 * overlayId:		(String:'simplemodal-overlay') The DOM element id for the overlay div
	 * overlayCss:		(Object:{}) The CSS styling for the overlay div
	 * containerId:		(String:'simplemodal-container') The DOM element id for the container div
	 * containerCss:	(Object:{}) The CSS styling for the container div
	 * dataId:			(String:'simplemodal-data') The DOM element id for the data div
	 * dataCss:			(Object:{}) The CSS styling for the data div
	 * close:			(Boolean:true) If true, closeHTML, escClose and overClose will be used if set.
	 							If false, none of them will be used.
	 * closeHTML:		(String:'<a class="modalCloseImg" title="Close"></a>') The HTML for the default close link.
								SimpleModal will automatically add the closeClass to this element.
	 * closeClass:		(String:'simplemodal-close') The CSS class used to bind to the close event
	 * escClose:		(Boolean:true) Allow Esc keypress to close the dialog?
	 * overlayClose:	(Boolean:false) Allow click on overlay to close the dialog?
	 * fixed:			(Boolean:true) If true, the container will use a fixed position. If false, it will use a
								absolute position (the dialog will scroll with the page)
	 * position:		(Array:null) Position of container [top, left]. Can be number of pixels or percentage
	 * persist:			(Boolean:false) Persist the data across modal calls? Only used for existing
								DOM elements. If true, the data will be maintained across modal calls, if false,
								the data will be reverted to its original state.
	 * modal:			(Boolean:true) User will be unable to interact with the page below the modal or tab away from the dialog.
								If false, the overlay and certain events will be disabled allowing the user to interact
								with the page below the dialog.
	 * onOpen:			(Function:null) The callback function used in place of SimpleModal's open
	 * onShow:			(Function:null) The callback function used after the modal dialog has opened
	 * onClose:			(Function:null) The callback function used in place of SimpleModal's close
	 */
	$.modal.defaults = {
		appendTo: 'body',
		focus: true,
		opacity: 50,
		overlayId: 'simplemodal-overlay',
		overlayCss: {},
		containerId: 'simplemodal-container',
		containerCss: {},
		dataId: 'simplemodal-data',
		dataCss: {},
		close: true,
		closeHTML: '<a class="modalCloseImg" title="Close"></a>',
		closeClass: 'simplemodal-close',
		escClose: true,
		overlayClose: false,
		fixed: true,
		position: null,
		persist: false,
		modal: true,
		onOpen: null,
		onShow: null,
		onClose: null
	};

	/*
	 * Main modal object
	 * o = options
	 */
	$.modal.impl = {
		/*
		 * Contains the modal dialog elements and is the object passed
		 * back to the callback (onOpen, onShow, onClose) functions
		 */
		d: {},
		/*
		 * Initialize the modal dialog
		 */
		init: function (data, options) {
			var s = this;

			// don't allow multiple calls
			if (s.d.data) {
				return false;
			}

			// merge defaults and user options
			s.o = $.extend({}, $.modal.defaults, options);

			// set the onClose callback flag
			s.occb = false;

			// determine how to handle the data based on its type
			if (typeof data === 'object') {
				// convert DOM object to a jQuery object
				data = data instanceof $ ? data : $(data);
				s.d.placeholder = false;

				// if the object came from the DOM, keep track of its parent
				if (data.parent().parent().size() > 0) {
					data.before($('<span></span>')
						.attr('id', 'simplemodal-placeholder')
						.css({display: 'none'}));

					s.d.placeholder = true;
					s.display = data.css('display');

					// persist changes? if not, make a clone of the element
					if (!s.o.persist) {
						s.d.orig = data.clone(true);
					}
				}
			}
			else if (typeof data === 'string' || typeof data === 'number') {
				// just insert the data as innerHTML
				data = $('<div></div>').html(data);
			}
			else {
				// unsupported data type!
				alert('SimpleModal Error: Unsupported data type: ' + typeof data);
				return s;
			}

			// create the modal overlay and container
			s.create(data);
			data = null;

			// display the modal dialog
			s.open();

			// useful for adding events/manipulating data in the modal dialog
			if ($.isFunction(s.o.onShow)) {
				s.o.onShow.apply(s, [s.d]);
			}

			// don't break the chain =)
			return s;
		},
		/*
		 * Create and add the modal overlay and container to the page
		 */
		create: function (data) {
			var s = this;

			// create the overlay
			s.d.overlay = $('<div></div>')
				.attr('id', s.o.overlayId)
				.addClass('simplemodal-overlay')
				.appendTo(s.o.appendTo);

			// create the container
			s.d.container = $('<div></div>')
				.attr('id', s.o.containerId)
				.addClass('simplemodal-container')
				.appendTo(s.o.appendTo);

			if (s.o.close && s.o.closeHTML) {
				// add user specified close button
				s.d.container.append(
					$(s.o.closeHTML).addClass(s.o.closeClass)
				);
			}

			// add attributes to the data
			s.d.data = data
				.attr('id', data.attr('id') || s.o.dataId)
				.addClass('simplemodal-data')
				.hide();

			if (s.o.dataCss) {
				// apply user specified styles
				s.d.data.css(s.o.dataCss);
			}

			s.d.data.appendTo(s.d.container);
		},
		/*
		 * Bind events
		 */
		bindEvents: function () {
			var s = this;

			// bind the close event to any element with the closeClass class
			$('.' + s.o.closeClass).bind('click.simplemodal', function (e) {
				e.preventDefault();
				s.close();
			});

			// bind the overlay click to the close function, if enabled
			if (s.o.modal && s.o.close && s.o.overlayClose) {
				s.d.overlay.bind('click.simplemodal', function (e) {
					e.preventDefault();
					s.close();
				});
			}

			// bind keydown events
			doc.bind('keydown.simplemodal', function (e) {
				if (s.o.modal && e.keyCode === 9) { // TAB
					s.watchTab(e);
				}
				else if ((s.o.close && s.o.escClose) && e.keyCode === 27) { // ESC
					e.preventDefault();
					s.close();
				}
			});
		},
		/*
		 * Unbind events
		 */
		unbindEvents: function () {
			$('.' + this.o.closeClass).unbind('click.simplemodal');
			doc.unbind('keydown.simplemodal');
			wndw.unbind('.simplemodal');
			this.d.overlay.unbind('click.simplemodal');
		},
		/*
		 * Place focus on the first or last visible input
		 */
		focus: function (pos) {
			var s = this, p = pos && $.inArray(pos, ['first', 'last']) !== -1 ? pos : 'first';

			// focus on first visible/enabled input element or dialog
			var input = $(':input:enabled:visible:' + p, s.d.data);
			setTimeout(function () {
				(input.length ? input : s.d.data).focus();
			}, 10);
		},
		/*
		 * Update the container. Focus, if enabled. Re-bind events.
		 */
		update: function () {
			var s = this;

			// prevent update if dialog does not exist
			if (!s.d.data) {
				return false;
			}

			s.d.data.show();
			s.o.focus && s.focus();

			// rebind events
			s.unbindEvents();
			s.bindEvents();
		},
		watchTab: function (e) {
			var s = this;

			if ($(e.target).parents('.simplemodal-container').length > 0) {
				// save the list of inputs
				s.inputs = $(':input:enabled:visible:first, :input:enabled:visible:last', s.d.data[0]);

				// if it's the first or last tabbable element, refocus
				if ((!e.shiftKey && e.target === s.inputs[s.inputs.length -1]) ||
						(e.shiftKey && e.target === s.inputs[0]) ||
						s.inputs.length === 0) {
					e.preventDefault();
					var pos = e.shiftKey ? 'last' : 'first';
					s.focus(pos);
				}
			}
			else {
				// might be necessary when custom onShow callback is used
				e.preventDefault();
				s.focus();
			}
		},
		/*
		 * Open the modal dialog elements
		 * - Note: If you use the onOpen callback, you must "show" the
		 *         overlay and container elements manually
		 */
		open: function () {
			var s = this;

			if ($.isFunction(s.o.onOpen)) {
				// execute the onOpen callback
				s.o.onOpen.apply(s, [s.d]);
			}
			else {
				// display the remaining elements
				s.d.overlay.show();
				s.d.container.show();
				s.d.data.show();
			}

			s.o.focus && s.focus();

			// bind default events
			s.bindEvents();
		},
		/*
		 * Close the modal dialog
		 * - Note: If you use an onClose callback, you must remove the
		 *         overlay and container elements manually
		 *
		 * @param {boolean} external Indicates whether the call to this
		 *     function was internal or external. If it was external, the
		 *     onClose callback will be ignored
		 */
		close: function () {
			var s = this;

			// prevent close when dialog does not exist
			if (!s.d.data) {
				return false;
			}

			// remove the default events
			s.unbindEvents();

			if ($.isFunction(s.o.onClose) && !s.occb) {
				// set the onClose callback flag
				s.occb = true;

				// execute the onClose callback
				s.o.onClose.apply(s, [s.d]);
			}
			else {
				// if the data came from the DOM, put it back
				if (s.d.placeholder) {
					var ph = $('#simplemodal-placeholder');
					// save changes to the data?
					if (s.o.persist) {
						// insert the (possibly) modified data back into the DOM
						ph.replaceWith(s.d.data.removeClass('simplemodal-data').css('display', s.display));
					}
					else {
						// remove the current and insert the original,
						// unmodified data back into the DOM
						s.d.data.hide().remove();
						ph.replaceWith(s.d.orig);
					}
				}
				else {
					// otherwise, remove it
					s.d.data.hide().remove();
				}

				// remove the remaining elements
				s.d.container.hide().remove();
				s.d.overlay.hide().remove();

				// reset the dialog object
				s.d = {};
			}
		}
	};
}));
