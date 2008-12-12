/**
 * SimpleModal Test
 * http://www.ericmmartin.com/projects/simplemodal/
 * http://code.google.com/p/simplemodal/
 *
 * Copyright (c) 2008 Eric Martin - http://ericmmartin.com
 *
 * Revision: $Id$
 *
 */
$(document).ready(function () {
	$('a#test1').click(function (e) {
		e.preventDefault();
		$('#modalContentTest').modal();
	});
	$('a#test2').click(function (e) {
		e.preventDefault();
		$.modal($('#modalContentTest'));
	});
	$('a#test3').click(function (e) {
		e.preventDefault();
		$('<div><h1>New DOM Element</h1></div>').modal();
	});
	$('a#test4').click(function (e) {
		e.preventDefault();
		$.modal(document.getElementById('modalContentTest'));
	});
	$('a#test5').click(function (e) {
		e.preventDefault();
		$.modal("<div class='test'>\
					<h1>Sample Content</h1>\
					<p>This can be complex HTML containing <a href='#'>links</a>,\
					<input type='text' value='input boxes' size='8'/>, etc...</p>\
				</div>");
	});
	$('a#test6').click(function (e) {
		e.preventDefault();
		$.modal("Sample Content - just a plain 'ol string");
	});
	$('a#test7').click(function (e) {
		e.preventDefault();
		$.modal("<div class='test'>\
					<h1>Sample Content</h1>\
					<p>This example uses a custom close.</p>\
					<p><a href='#' class='simplemodal-close'>Close</a></p>\
				</div>", {close:false});
	});
	$('a#test8').click(function (e) {
		e.preventDefault();
		$('#modalContentPersistTest').modal({persist: true});
	});
	$('a#test9').click(function (e) {
		e.preventDefault();
		$('#modalContentTest').modal({onOpen: modalOpen});
	});
	$('a#test10').click(function (e) {
		e.preventDefault();
		$('#modalContentTest').modal({onClose: modalClose});
	});
	$('a#test11').click(function (e) {
		e.preventDefault();
		$('#modalContentTest').modal({onShow: modalShow});
	});
	$('a#test12').click(function (e) {
		e.preventDefault();
		$.modal('<div class="test"><h1>IE SELECT bleed test</h1></div>');
	});
	$('a#test13').click(function (e) {
		e.preventDefault();
		$('#modalContentTest').modal({position: [20,20]});
	});
	$('a#test14').click(function (e) {
		e.preventDefault();
		$('#modalContentTest').modal({position: [20,]});
	});
	$('a#test15').click(function (e) {
		e.preventDefault();
		$('#modalContentTest').modal({position: [,20]});
	});
	$('a#test16').click(function (e) {
		e.preventDefault();
		$('#modalContentTest').modal({position: ["40px","40px"]});
	});
	$('a#test17').click(function (e) {
		e.preventDefault();
		$('#modalContentTest').modal({position: ["25%","25%"]});
	});
});

/**
 * When the open event is called, this function will be used to 'open'
 * the overlay, container and data portions of the modal dialog.
 *
 * onOpen callbacks need to handle 'opening' the overlay, container
 * and data.
 */
function modalOpen (dialog) {
	dialog.overlay.fadeIn('slow', function () {
		dialog.container.fadeIn('slow', function () {
			dialog.data.slideDown('slow');
		});
	});
}

/**
 * When the close event is called, this function will be used to 'close'
 * the overlay, container and data portions of the modal dialog.
 *
 * The SimpleModal close function will still perform some actions that
 * don't need to be handled here.
 *
 * onClose callbacks need to handle 'closing' the overlay, container
 * data and iframe.
 */
function modalClose (dialog) {
	dialog.data.fadeOut('slow', function () {
		dialog.container.hide('slow', function () {
			dialog.overlay.slideUp('slow', function () {
				$.modal.close();
			});
		});
	});
}

/**
 * After the dialog is show, this callback will bind some effects
 * to the data when the 'button' button is clicked.
 *
 * This callback is completely user based; SimpleModal does not have
 * a matching function.
 */
function modalShow (dialog) {
	dialog.data.find('input.animate').one('click', function () {
		dialog.data.slideUp('slow', function () {
			dialog.data.slideDown('slow');
		});
	});
}