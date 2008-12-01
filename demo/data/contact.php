<?php

/*
 * SimpleModal Contact Form
 * http://www.ericmmartin.com/projects/simplemodal/
 * http://code.google.com/p/simplemodal/
 *
 * Copyright (c) 2008 Eric Martin - http://ericmmartin.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Revision: $Id$
 *
 */

// Process
$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : '';
if (empty($action)) {
	// Send back the contact form HTML
	echo "<div style='display:none'>
	<a href='#' title='Close' class='modalCloseX simplemodal-close'>x</a>
	<div class='contact-top'></div>
	<div class='contact-content'>
		<h1 class='contact-title'>Send us a message:</h1>
		<div class='contact-loading' style='display:none'></div>
		<div class='contact-message' style='display:none'></div>
		<form action='#' style='display:none'>
			<label for='name'>*Name:</label>
			<input type='text' id='contact-name' class='contact-input' name='name' tabindex='1001' />
			<label for='email'>*Email:</label>
			<input type='text' id='contact-email' class='contact-input' name='email' tabindex='1002' />
			<label for='message'>*Message:</label>
			<textarea id='contact-message' class='contact-input' name='message' cols='40' rows='4' tabindex='1003'></textarea>
			<br/>
			<label>&nbsp;</label>
			<button type='submit' class='contact-send contact-button' tabindex='1004'>Send</button>
			<button type='submit' class='contact-cancel contact-button simplemodal-close' tabindex='1005'>Cancel</button>
			<br/>
		</form>
	</div>
	<div class='contact-bottom'><a href='http://www.ericmmartin.com/projects/simplemodal/'>Powered by SimpleModal</a></div>
</div>";
}
else if ($action == 'send') {
	echo "Message successfully sent.";
}

exit;

?>