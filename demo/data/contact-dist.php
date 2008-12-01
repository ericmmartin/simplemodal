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
$to = 'user@yourdomain.com';
$subject = 'SimpleModal Contact Form';

// Include extra submitter data?
// FALSE = do not include
$extra = array(
	'ip'		 => TRUE,
	'user_agent' => TRUE
);

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
	// Send the email
	$name = isset($_REQUEST['name']) ? $_REQUEST['name'] : '';
	$email = isset($_REQUEST['email']) ? $_REQUEST['email'] : '';
	$message = isset($_REQUEST['message']) ? $_REQUEST['message'] : '';

	sendEmail($name, $email, $message);
	echo "Message successfully sent.";
}

// Validate and send email
function sendEmail($name, $email, $message) {
	global $to, $subject, $extra;

	// Filter name
	$name = filter($name);

	// Filter and validate email
	$email = filter($email);
	if (!validateEmail($email)) {
		$subject .= " - invalid email";
		$message .= "\n\nBad email: $email";
		$email = $to;
	}

	// Add additional info to the message
	if ($extra['ip']) {
		$message .= "\n\nIP: " . $_SERVER['REMOTE_ADDR'];
	}
	if ($extra['user_agent']) {
		$message .= "\n\nUSER AGENT: " . $_SERVER['HTTP_USER_AGENT'];
	}

	// Set and wordwrap message body
	$body = "From: $name\n\n";
	$body .= "Message: $message";
	$body = wordwrap($body, 70);

	// Build header
	$header = "From: $email\n";
	$header .= "X-Mailer: PHP/SimpleModalContactForm";

	// Send email
	@mail($to, $subject, $body, $header) or 
		die('Unfortunately, your message could not be delivered.');
}

// Remove any un-safe values to prevent email injection
function filter($value) {
	$pattern = array("/\n/","/\r/","/content-type:/i","/to:/i", "/from:/i", "/cc:/i");
	$value = preg_replace($pattern, '', $value);
	return $value;
}

// Validate email address format in case client-side validation "fails"
// Validate email address format in case client-side validation "fails"
function validateEmail($email) {
	$at = strrpos($email, "@");

	// Make sure the at (@) sybmol exists and  
	// it is not the first or last character
	if ($at && ($at < 1 || ($at + 1) == strlen($email)))
		return false;

	// Make sure there aren't multiple periods together
	if (preg_match('/(\.{2,})/', $email))
		return false;

	// Break up the local and domain portions
	$local = substr($email, 0, $at);
	$domain = substr($email, $at + 1);


	// Check lengths
	$locLen = strlen($local);
	$domLen = strlen($domain);
	if ($locLen < 1 || $locLen > 64 || $domLen < 4 || $domLen > 255)
		return false;

	// Make sure local and domain don't start with or end with a period
	if (preg_match('/(^\.|\.$)/', $local) || preg_match('/(^\.|\.$)/', $domain))
		return false;

	// Check for quoted-string addresses
	// Since almost anything is allowed in a quoted-string address,
	// we're just going to let them go through
	if (!preg_match('/^"(.+)"$/', $local)) {
		// It's a dot-string address...check for valid characters
		if (!preg_match('/^[-a-zA-Z0-9!#$%*\/?|^{}`~&\'+=_\.]*$/', $local))
			return false;
	}

	// Make sure domain contains only valid characters and at least one period
	if (!preg_match('/^[-a-zA-Z0-9\.]*$/', $domain) || !strpos($domain, "."))
		return false;	

	return true;
}

exit;

?>