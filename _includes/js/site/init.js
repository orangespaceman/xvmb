/**
 * Site global JS file
 */



	/**
	 * on Dom ready functionality
	 */
		$(document).ready(function() {
		
			// add an extra class to the <body> element for JS-only styling
			$("body").addClass("js");
			
			// start detecting form entry
			note.init({
				ajaxPath: "./_includes/php/ajax/note/",
				interval: 5
			});
			
			
			// create overlays...
			window.overlayManager = {};
				
			// addNote overlay
			overlayManager.addNoteOverlay = new Overlay;
			overlayManager.addNoteOverlay.init({
				element : 'p#add a',
				//ajaxPath : '/',
				ajaxPath : false,
				contentPath : '#add-form',
				id : 'overlay-add-form',
				position : false, 
				trackingText : '/overlay/',
				submitCallback : {
					overlayName : "addNoteOverlay", 
					element : "#ajax-form form", 
					ajaxPath : "./_includes/php/ajax/note/", 
					ajaxMethod : "addNote",
					shadowbox:false, 
					overlayId: "#overlay-add-form",
					overlayContent:".overlay-content"
				}
			});
			
		});


	/*
	 * Window load calls for all pages
	 */
		$(window).load(function() {
			
		});