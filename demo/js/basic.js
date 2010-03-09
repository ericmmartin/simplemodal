/*
 * SimpleModal Basic Modal Dialog
 * http://www.ericmmartin.com/projects/simplemodal/
 * http://code.google.com/p/simplemodal/
 *
 * Copyright (c) 2010 Eric Martin - http://ericmmartin.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Revision: $Id$
 *
 */

jQuery(function ($) {
	$('#basic-modal input.basic, #basic-modal a.basic').click(function (e) {
		e.preventDefault();
		$('#basic-modal-content').modal();
	});
});