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

// User settings
$to = "user@yourdomain.com";
$subject = "SimpleModal Contact Form";

// Include extra form fields and/or submitter data?
// false = do not include
$extra = array(
	"form_subject"	=> true,
	"form_cc"		=> true,
	"ip"				=> true,
	"user_agent"	=> true
);

// Process
$action = isset($_POST["action"]) ? $_POST["action"] : "";
if (empty($action)) {
	// Send back the contact form HTML
	$output = "<div style='display:none'>
	<a href='#' title='Close' class='modalCloseX simplemodal-close'>x</a>
	<div class='contact-top'></div>
	<div class='contact-content'>
		<h1 class='contact-title'>Send us a message:</h1>
		<div class='contact-loading' style='display:none'></div>
		<div class='contact-message' style='display:none'></div>
		<form action='#' style='display:none'>
			<label for='contact-name'>*Name:</label>
			<input type='text' id='contact-name' class='contact-input' name='name' tabindex='1001' />
			<label for='contact-email'>*Email:</label>
			<input type='text' id='contact-email' class='contact-input' name='email' tabindex='1002' />";

	if ($extra["form_subject"]) {
		$output .= "
			<label for='contact-subject'>Subject:</label>
			<input type='text' id='contact-subject' class='contact-input' name='subject' value='' tabindex='1003' />";
	}

	$output .= "
			<label for='contact-message'>*Message:</label>
			<textarea id='contact-message' class='contact-input' name='message' cols='40' rows='4' tabindex='1004'></textarea>
			<br/>";

	if ($extra["form_cc"]) {
		$output .= "
			<label>&nbsp;</label>
			<input type='checkbox' id='contact-cc' name='cc' value='1' tabindex='1005' /> <span class='contact-cc'>Send me a copy</span>
			<br/>";
	}

	$output .= "
			<label>&nbsp;</label>
			<button type='submit' class='contact-send contact-button' tabindex='1006'>Send</button>
			<button type='submit' class='contact-cancel contact-button simplemodal-close' tabindex='1007'>Cancel</button>
			<br/>
			<input type='hidden' name='token' value='" . smcf_token($to) . "'/>
		</form>
	</div>
	<div class='contact-bottom'><a href='http://www.ericmmartin.com/projects/simplemodal/'>Powered by SimpleModal</a></div>
</div>";

	echo $output;
}
else if ($action == "send") {
	// Send the email
	$name = isset($_POST["name"]) ? $_POST["name"] : "";
	$email = isset($_POST["email"]) ? $_POST["email"] : "";
	$subject = isset($_POST["subject"]) ? $_POST["subject"] : $subject;
	$message = isset($_POST["message"]) ? $_POST["message"] : "";
	$cc = isset($_POST["cc"]) ? $_POST["cc"] : "";
	$token = isset($_POST["token"]) ? $_POST["token"] : "";

	// make sure the token matches
	if ($token === smcf_token($to)) {
		//smcf_send($name, $email, $subject, $message, $cc);
		echo "Your message was successfully sent.";
	}
	else {
		echo "Unfortunately, your message could not be verified.";
	}
}

function smcf_token($s) {
	return md5("smcf-" . $s . date("WY"));
}

exit;

?>