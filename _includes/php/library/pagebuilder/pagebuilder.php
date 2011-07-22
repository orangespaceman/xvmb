<?php 
/**
 * page builder class.  
 * build page header and footer
 *
*/
class PageBuilder {
	
	var $dbcalls;
	
	/**
	 * The constructor.
	 */
	function __construct() {
		global $dbcalls;
		$this->dbcalls = $dbcalls;
	}

	
	
	/**
	 * Build the page
	 */
	function buildPage() {
		
		$liveNoteCount = $this->dbcalls->getLiveNoteCount();
		$totalNoteCount = $this->dbcalls->getTotalNoteCount();
		
		$return = '<!DOCTYPE html>
<html>
	<head>
		<title>XVMB: XVMB Vault of Marketing Bollocks</title>	
		<meta charset="UTF-8" />
		
		<link rel="stylesheet" href="./_includes/css/site/screen.css" />
		
		<script src="http://www.google.com/jsapi"></script>
		<script>
			google.load("jquery", "1.4.2");
		</script>
		
		<script src="./_includes/js/lib/jquery-ui/jquery-ui-1.8.2.custom.min.js"></script>
		<script src="./_includes/js/lib/manager/manager.js"></script>
		<script src="./_includes/js/site/note.js"></script>
		<script src="./_includes/js/site/overlay.js"></script>
		<script src="./_includes/js/site/overlay-helper.js"></script>
		<script src="./_includes/js/site/init.js"></script>
		
		<script type="text/javascript">

		  var _gaq = _gaq || [];
		  _gaq.push(["_setAccount", "UA-XXXX-1"]);
		  _gaq.push(["_trackPageview"]);

		  (function() {
		    var ga = document.createElement("script"); ga.type = "text/javascript"; ga.async = true;
		    ga.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
		    var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ga, s);
		  })();

		</script>
		
		<link rel="shortcut icon" href="./_includes/icons/favicon.ico" type="image/x-icon" />
		<link rel="icon" href="./_includes/icons/favicon.ico" type="image/x-icon" />
		
	</head>
	<body>
		<div id="wrapper">
			<p id="count">'.$liveNoteCount.'/'.$totalNoteCount.'</p>
			<p id="add"><a href="#form">+</a></p>
			<div id="note-0" class="note font-1 bg-1">
				<p><strong class="what">XVMB</strong></p>
				<p>
					<em class="who">XVMB Vault of Marketing Bollocks</em>
					<em class="where"></em>
					<em class="when">Actioned as a Goodman/Rowbotham <br/>Next Step Delivery</em>
				</p>
			</div>
			
			<div id="add-form" class="inline">
				<p>Add some marketing bollocks</p>
				<form action="" method="post" id="subForm" class="error-check">

					<div class="input-container clearfix">
					    <label for="who">Who:</label>
					    <input type="text" class="text required" name="who" id="who" />
					</div>

					<div class="input-container what-container clearfix">
					    <label for="what">What:</label>
					    <textarea class="required what" name="what" id="what"></textarea>
					</div>
					
					<div class="input-container clearfix">
					    <label for="when">When:</label>
					    <input type="text" class="text required" name="when" id="when" />
					</div>
					
					<div class="input-container clearfix">
					    <label for="where">Where:</label>
					    <input type="text" class="text required" name="where" id="where" />
					</div>

					<div class="input-container clearfix">
						<input type="submit" class="button" value="Submit" />
					</div>
				</form>
			</div>
			
		</div>
	</body>
</html> 
		';

		return $return;
	}
	
}