<?php

$demo = isset($_REQUEST['demo']) ? $_REQUEST['demo'] : '';

$dir = dirname(dirname(__FILE__));
$dir = str_replace('\\', '/', $dir);

$files = array(
		'index' => $dir . '/download/index/' . $demo . '.html',
		'index_zip' => $demo . '/index.html',
		'js' => $dir . '/js/' . $demo . '.js',
		'js_zip' => $demo . '/js/' . $demo . '.js',
		'jquery_js' => $dir . '/js/jquery.js',
		'jquery_js_zip' => $demo . '/js/jquery.js',
		'simplemodal_js' => $dir . '/js/jquery.simplemodal.js',
		'simplemodal_js_zip' => $demo . '/js/jquery.simplemodal.js',
		'css' => $dir . '/css/' . $demo . '.css',
		'css_zip' => $demo . '/css/' . $demo . '.css',
		'css_ie' => $dir . '/css/' . $demo . '_ie.css',
		'css_ie_zip' => $demo . '/css/' . $demo . '_ie.css',
		'data' => $dir . '/data/' . $demo . '-dist.php',
		'data_zip' => $demo . '/data/' . $demo . '.php',
		'img_match' => $dir . '/img/' . $demo . '/{*.gif,*.jpg,*.png}'
	);

/* Create the zip file */
$now = time();
$zip = new ZipArchive();
$res = $zip->open($now . $demo . '.zip', ZipArchive::CREATE);
if ($res === TRUE) {
	if (file_exists($files['index'])) {
		$zip->addFile($files['index'], $files['index_zip']);
	}
	if (file_exists($files['js'])) {
		$zip->addFile($files['js'], $files['js_zip']);
	}
	if (file_exists($files['jquery_js'])) {
		$zip->addFile($files['jquery_js'], $files['jquery_js_zip']);
	}
	if (file_exists($files['simplemodal_js'])) {
		$zip->addFile($files['simplemodal_js'], $files['simplemodal_js_zip']);
	}
	if (file_exists($files['css'])) {
		$zip->addFile($files['css'], $files['css_zip']);
	}
	if (file_exists($files['css_ie'])) {
		$zip->addFile($files['css_ie'], $files['css_ie_zip']);
	}
	if (file_exists($files['data'])) {
		$zip->addFile($files['data'], $files['data_zip']);
	}

	$images = glob($files['img_match'], GLOB_BRACE);

	foreach ($images as $image) {
		$img = str_replace($dir.'/', '', $image);
		$zip->addFile($image, "$demo/$img");
	}
	$zip->close();
}

/* Open for download */
$file = dirname(__FILE__) . '/' . $now . $demo . '.zip';
$fp = fopen($file, 'r');
if (!$fp) {
    exit("cannot open\n");
}
while (!feof($fp)) {
    $contents .= fread($fp, 2);
}
fclose($fp);

/* Delete file */
unlink($file);

/* Send to browser */
Header("Content-type: application/octet-stream");
Header ("Content-disposition: attachment; filename=SimpleModal-$demo.zip");
echo $contents;

exit;

?>