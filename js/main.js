
$(document).ready(function() {

	
	$(".fancybox").fancybox({
		padding : 0,
	    helpers : {
	        overlay : {
	            css : {
	                'background-color' : 'rgba(0,0,0,0.7',
	            }
	        }
	    }
	});
	var $portfolio = $('#portfolio');
	var $portfolioPadding = $portfolio.css('padding-top');



	$("#arrow-anchor").on('click', function(e) {
		e.preventDefault();

		$('html, body').animate({
        	scrollTop: $portfolio.offset().top
    	}, 500);
	});

	// var $headerSection = $('#header-section');
	var $headerSection = $('#header-section');

	var $firstSection = $('section').eq(0);

	var outerHeight = $(window).outerHeight();

	$headerSection.outerHeight(outerHeight);
	$firstSection.css({
		'margin-top' : outerHeight + 'px'
	});

	console.log($firstSection);
	$(window).on('resize', function() {

		outerHeight = $(window).outerHeight();

		$headerSection.outerHeight(outerHeight);

		$firstSection.css({
			'margin-top' : outerHeight + 'px'
		});
	});
});

