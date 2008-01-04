/*
 * SimpleModal Contact Form
 * http://www.ericmmartin.com/projects/simplemodal/
 * http://code.google.com/p/simplemodal/
 *
 * Copyright (c) 2007 Eric Martin - http://ericmmartin.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Revision: $Id$
 *
 */

$(document).ready(function () {
	$('#contactForm input:eq(0)').click(function (e) {
		e.preventDefault();
		// load the contact form using ajax
		$.get("data/contact.php", function(data){
			// create a modal dialog with the data
			$(data).modal({
				close: false,
				overlayId: 'contactModalOverlay',
				containerId: 'contactModalContainer',
				onOpen: contact.open,
				onShow: contact.show,
				onClose: contact.close
			});
		});
	});
});

var contact = {
	message: null,
	open: function (dialog) {
		dialog.overlay.fadeIn(200, function () {
			dialog.container.fadeIn(200, function () {
				dialog.data.fadeIn(200, function () {
					$('#contactModalContainer #name').focus();
				});
				// input field font size
				if ($.browser.safari) {
					$('#contactModalContainer #name, #contactModalContainer #email, #contactModalContainer #message').css({
						'font-size': '.9em'
					});
				}
				// fix png's for IE 6
				if ($.browser.msie && $.browser.version < 7) {
					$('#contactModalContainer .send, #contactModalContainer .cancel').each(function () {
						if ($(this).css('backgroundImage').match(/^url[("']+(.*\.png)[)"']+$/i)) {
							var src = RegExp.$1;
							$(this).css({
								backgroundImage: 'none',
								filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' +  src + '", sizingMethod="crop")'
							});
						}
					});
				}
			});
		});
	},
	show: function (dialog) {
		$('#contactModalContainer .send').click(function (e) {
			e.preventDefault();
			// validate form
			if (contact.validate()) {
				$('#contactModalContainer .message').fadeOut(function () {
					$('#contactModalContainer .message').removeClass('error').empty();
				});
				$('#contactModalContainer .title').html('Sending...');
				$('#contactModalContainer form').fadeOut(200);
				$('#contactModalContainer .content').animate({
					height: '80px'
				}, function () {
					$('#contactModalContainer .loading').fadeIn(200, function () {
						$.ajax({
							url: 'data/contact.php',
							data: $('#contactModalContainer form').serialize() + '&action=send',
							dataType: 'html',
							complete: function (xhr) {
								$('#contactModalContainer .loading').fadeOut(200, function () {
									$('#contactModalContainer .title').html('Thank you!');
									$('#contactModalContainer .message').html(xhr.responseText).fadeIn(200);
								});
							},
							error: contact.error
						});
					});
				});
			}
			else {
				if ($('#contactModalContainer .message:visible').length > 0) {
					$('#contactModalContainer .message div').fadeOut(200, function () {
						$('#contactModalContainer .message div').empty();
						contact.showError();
						$('#contactModalContainer .message div').fadeIn(200);
					});
				}
				else {
					$('#contactModalContainer .message').animate({
						height: '30px'
					}, contact.showError);
				}
				
			}
		});
	},
	close: function (dialog) {
		dialog.data.fadeOut(200, function () {
			dialog.container.fadeOut(200, function () {
				dialog.overlay.fadeOut(200, function () {
					$.modal.close();
				});
			});
		});
	},
	error: function (xhr) {
		alert(xhr.statusText);
	},
	validate: function () {
		contact.message = '';
		if (!$('#contactModalContainer #name').val()) {
			contact.message += 'Name is required. ';
		}

		var email = $('#contactModalContainer #email').val();
		if (!email) {
			contact.message += 'Email is required. ';
		}
		else {
			if (!contact.validateEmail(email)) {
				contact.message += 'Email is invalid. ';
			}
		}

		if (!$('#contactModalContainer #message').val()) {
			contact.message += 'Message is required.';
		}

		if (contact.message.length > 0) {
			return false;
		}
		else {
			return true;
		}
	},
	validateEmail: function (email) {
		var at = email.lastIndexOf("@");

		// Make sure the at (@) sybmol exists and  
		// it is not the first or last character
		if (at < 1 || (at + 1) === email.length)
			return false;

		// Make sure there aren't multiple periods together
		if (/(\.{2,})/.test(email))
			return false;

		// Break up the local and domain portions
		var local = email.substring(0, at);
		var domain = email.substring(at + 1);

		// Check lengths
		if (local.length < 1 || local.length > 64 || domain.length < 4 || domain.length > 255)
			return false;

		// Make sure local and domain don't start with or end with a period
		if (/(^\.|\.$)/.test(local) || /(^\.|\.$)/.test(domain))
			return false;

		// Check for quoted-string addresses
		// Since almost anything is allowed in a quoted-string address,
		// we're just going to let them go through
		if (!/^"(.+)"$/.test(local)) {
			// It's a dot-string address...check for valid characters
			if (!/^[-a-zA-Z0-9!#$%*\/?|^{}`~&'+=_\.]*$/.test(local))
				return false;
		}

		// Make sure domain contains only valid characters and at least one period
		if (!/^[-a-zA-Z0-9\.]*$/.test(domain) || domain.indexOf(".") === -1)
			return false;	

		return true;
	},
	showError: function () {
		$('#contactModalContainer .message')
			.html($('<div class="error">').append(contact.message))
			.fadeIn(200);
	}
};