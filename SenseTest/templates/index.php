<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" ng-app='app'>
<head>

	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
	<meta name="apple-mobile-web-app-capable" content="yes">

	<!-- HTML5 base -->
	<base href="<?php base();?>/">

		<title><?php info('title');?></title>

		<!-- Facebook -->
		<meta property="og:title"       	content="<?php info('title'); ?>">
		<meta property="og:type"        	content="website">
		<meta property="og:url"         	content="<?php info('url'); ?>/">
		<meta property="og:image"       	content="<?php info('image'); ?>">
		<meta property="og:description" 	content="<?php info('description'); ?>">
		<!-- Google etc -->
		<meta name="description"     		content="<?php info('description'); ?>" />
		<meta name="keywords"        		content="<?php info('keywords'); ?>" />
		<meta name="author"          		content="<?php info('title'); ?>" />
		<meta name="application-name"		content="<?php info('title');?>" />
		<!-- Twitter -->
		<meta name="twitter:card"         	content="summary">
		<meta name="twitter:site"         	content="<?php info('title'); ?>">
		<meta name="twitter:url"          	content="<?php info('url'); ?>">
		<meta name="twitter:title"        	content="<?php info('title'); ?>">
		<meta name="twitter:description"  	content="<?php info('description'); ?>">
		<meta name="twitter:image"        	content="<?php info('image'); ?>">

	<!-- styling -->
	<link rel="stylesheet" type="text/css" href="css/_main.css" media="screen" />

	<link rel="shortcut icon" type="image/png" href="data/images/icon.png"/>

</head>
<body ng-class="{'static':state()}">

	<!--[if lt IE 9]>
		<div id="ie8">
			<div id='box'>
				<img src='data/images/logok-zw.png' width='100px'><BR><Br>
				Your browser does not seem to support the functionality needed to run this test.<Br><br>

				We recommend you update your browser or visit the site using another device.<br><br>

			</div>
		</div>
	<![endif]-->

	<div popup></div>

	<div cookies></div>

	<!-- main content -->
	<div id='gradient'>
		<section id='container' class='row' ui-view></section>
	</div>


	<?php /* preload templates */ templates(); ?>
	<?php /* preload testinfo */ testinfo(); ?>
	<?php /* preload talen */ json_talen(); ?>

	<script> 
		var defaultstorage = <?php defaultstorage("print");?> 
	</script>

	<!-- soundmanager -->
	<script src="bower_components/soundmanager2/script/soundmanager2-jsmin.js"></script>
	<script src="bower_components/jquery/dist/jquery.min.js"></script>
	<script src="bower_components/angular/angular.min.js"></script>

	<script src="bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
	<script src="bower_components/ngstorage/ngStorage.min.js"></script>
	<script src="bower_components/jquery.scrollTo/jquery.scrollTo.min.js"></script>

	<!-- custom -->
	<script src="js/app.js"></script>
	<script src="js/service.js"></script>
	<script src="js/directives.js"></script>
	<script src="js/test_directives.js"></script>
	<script src="js/result_directives.js"></script>

</body>
</html>
