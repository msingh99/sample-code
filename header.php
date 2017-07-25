
<!DOCTYPE html>
<html lang="en">
  <head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="../../favicon.ico">
    <title>Driving School</title>
    <link href="/assets/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap theme -->
    <link href="/assets/css/bootstrap-theme.min.css" rel="stylesheet">
    <!-- Custom styles for this template -->
    <link href="/assets/css/theme.css" rel="stylesheet">
	<link href="/assets/css/docs.min.css" rel="stylesheet">
	<link href="/assets/css/style.css" rel="stylesheet">
	<link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css">
    <script src="/assets/js/ie-emulation-modes-warning.js"></script>
	<script src="/assets/js/jquery.min.js"></script>
    <script src="/assets/bootstrap/js/bootstrap.min.js"></script>
    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <script src="/assets/js/ie10-viewport-bug-workaround.js"></script>
	 <style>
		.document {
			background: black !important;
		}
	</style>
  </head>

  <body role="document" class="document">
	<div class="row header-top">
		<div class="col-xs-8 col-sm-4 col-md-3">
			<div class="logo-header">
				<img src="/assets/images/logo.png" class="img-responsive logo-header1" >
			</div>
		</div>
		<div class="col-xs-4 col-sm-8 col-md-9">
			<div class="v4-tease">
				<ul>
					<?php $this->view('top'); ?>
				</ul>
			</div>
		</div>
	</div>


    
	<?php $this->view('menu'); ?>
	<div class="row full-width">