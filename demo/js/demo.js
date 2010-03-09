jQuery(function ($) {
	$('input[name="download"]').click(function (e) {
		$(this).parent().submit();
	});
});