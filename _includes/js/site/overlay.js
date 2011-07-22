/**
 * @fileoverview Insert overlay
 * 
 * @author PG @ Pirata [piratalondon.com]
 * @author MA @ Pirata [piratalondon.com]
 * 
 */
var Overlay = function(){
	
	// jquery prototype no conflict shop fix
	var $ = window.jQuery;
		
	/*
	 * The overlay element, only needs creating once
	 *
	 * @var Object
	 * @private
	 */
	var overlay = null;

	/*
	 * The overlay content - the area inserted by AJAX
	 *
	 * @var Object
	 * @private
	 */
	var overlayContent = null;
	
	/*
	 * The overlay id, to differentiate between overlays
	 *
	 * @var String
	 * @private
	 */
	var id = null;
	
	/*
	 * Is the overlay element currently displayed?
	 *
	 * @var Bool
	 * @private
	 */
	var overlayDisplayed = false;
	
	/**
	 * Has the AJAX content been loaded 
	 *
	 * @var Bool
	 * @private
	 */
	var contentLoaded = false;
	
	/*
	 * container for the AJAX loaded data
	 * 
	 * @var Object
	 * @private
	 */
	var loadedData = null;
	
	/*
	 * AJAX timeout interval, for checking whether loaded content has arrived yet
	 * 
	 * @var Object
	 * @private
	 */
	var ajaxInterval = null;
	
	/*
	 * Interval for counting input into 'what' text field
	 */
	var counterInterval =  null;
	
	/*
	 * Is this IE? (needs separate rules if so)
	 * See: http://dean.edwards.name/weblog/2007/03/sniff/
	 *
	 * @var Bool
	 * @private
	 */
	var isMSIE = /*@cc_on!@*/false;
	
	
	/*
	 * If this is IE, what version number is it?
	 *
	 * @var Int
	 * @public
	 */
	var vIE=(navigator.appName=='Microsoft Internet Explorer')?parseFloat((new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})")).exec(navigator.userAgent)[1]):-1; 
	
	/**
	 * The options passed through to this function
	 *
	 * @var Object
	 * @private
	 */
	var options = {
		
		/**
		 * Nav Element to listen for a click on
		 *
		 * @var Int
		 */		
		element : null,
		
		/**
		 * Id to give the new overlay element
		 *
		 * @var String
		 */		
		id : 'overlay',
		
		/**
		 * The location of the AJAX script on the server
		 *
		 * @var String
		 */		
		ajaxPath : false,
		
		/**
		 * The location of the page content to use in the overlay (if not using ajax)
		 *
		 * @var String
		 */		
		contentPath : false,
		
		/**
		 * Animation speed, used throughout the script (lower is quicker)
		 *
		 * @var Int
		 */		
		animationTime : 250,
		
		/**
		 * Message to display if an error is encountered at any point
		 *
		 * @var String
		 */		
		errorMessage : '<p>Sorry, there was an error with this request.  Please try reloading the page.</p>',

		/**
		 * HTML element to attach the overlay to
		 *
		 * @var String
		 */		
		attachTo : '#wrapper',
		
		/**
		 * DOM relationship between the overlay element and attachTo element
		 * possible options: 'parent' (for append) or 'sibling' (for insertAfter)
		 * 
		 * @var String
		 */
		 relationship : 'parent',
		
		
		/**
		 * Should the overlay be positioned automatically based on the positioning of the link element?
		 *
		 * @var bool
		 */
		position : false,
		
		
		/*
		 * Are there are text fields containing default text that needs initialising?
		 * 
		 * @var Array
		 */
		defaultTextFields : [],
		
		/*
		 * Tracking text to use
		 * 
		 * @var Bool/String
		 */
		trackingText: false,
		
		
		/*
		 * Submit button callback function?
		 */
		submitCallback : false,

		/**
		 * The HTML markup to use.
		 *
		 * @var	 String
		 * @public
		 */
		markup: '<div class="overlay-container">' + 
					'<div class="overlay">' +
						'<div class="overlay-header clearfix">' +
							'<a class="overlay-close" href="#" title="Close this overlay">' +
								'<img src="'+LibMan.path+'../img/site/overlay_close_8.png" alt="Close this overlay" />' +
							'</a>' +
							'<div class="overlay-loading">' +
								'<img src="'+LibMan.path+'../img/site/overlay_loading_small.gif" alt="" />' +
							'</div>' +
						'</div>' +
						'<div class="overlay-content-container">' +
							'<div class="overlay-content">' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>'
	};
	
	
	/**
	 * Initialise the functionality
	 * @param {Object} options The initialisation options
	 * @return void
	 * @public
	 */
	var init = function(initOptions) {
		
		// save any options sent through to the intialisation script, if set
		for (var option in options) {
			if (!!initOptions[option] || initOptions[option] === false) {
				options[option] = initOptions[option];
			}
			
			// error check, if no element is specified then stop
			if (!options[option] && options[option] !== false && options[option] !== 0) {
				throw('Required option not specified: ' + option);
				//return false;
			}
		}
		
		// condition : check whether the element we want to attach the overlay to exists
		if ($(options.attachTo).length < 1) {
			return false;
		}
		
		// set a listener on the DOM element
		$(options.element).bind('click', function(e){
			e.preventDefault();
			$(this).blur();
			displayOverlay(this);
		});

		// set a keyboard event on the DOM element too 
		$(options.element).bind('keypress', function(e){
			if(e.keyCode==13){ // enter
				e.preventDefault();
				displayOverlay(this);
			}
		});
		
		// detect keyboard escape
		$(window).bind('keypress', function(e){
			if(e.keyCode==27){
				hideOverlay();
			}
		});
	};


	/**
	 * Work out whether an overlay needs creating, or whether we can show an existing one 
	 *  
	 * @param linkElement {object} the link that has just been clicked
	 * 
	 * @return void
	 * @public
	 */
	var displayOverlay = function(linkElement) {
		
		// calculate whether the overlay needs refreshing
		var refreshOverlay = false;
		
		// condition : detect whether to create an overlay
		if (!overlay) {
			createOverlay();
			refreshOverlay = true;
		}
		
		// before this overlay is displayed, ensure all other overlays are hidden
		closeAllOtherOverlays();
		
		// condition : is the overlay hidden?
		if (!overlayDisplayed) {
			
			// condition : check whether to position the overlay automatically
			if (options.position !== false) {
				positionOverlay(linkElement);
			} else {
				showOverlay();
			}
			refreshOverlay = true;
		} 
		
		// condition : if the overlay needs refreshing, insert the AJAX data
		if (refreshOverlay === true) {

			// condition : if it's ajax, get & set the latest data
			if (options.ajaxPath !== false) {
				retrieveDataAjax();
			} else if (options.contentPath !== false) {
				retrieveDataInline(linkElement);
			}
			ajaxInterval = setInterval(populateOverlay, 250);
		}
		
		// google analytics custom call
		if (!!window.pageTracker && !!options.trackingText) {
			pageTracker._trackPageview("/_overlay" + options.trackingText);
		}
	};
	
	
	/**
	 * Create an overlay, if one doesn't exist already
	 *  
	 * @return void
	 * @private
	 */
	var createOverlay = function() {
				
		// build initial HTML for overlay
		var attachTo = $(options.attachTo);
		overlay = $(options.markup);
		
		// set the overlay ID
		$(overlay).attr('id',options.id);
		id = options.id;
		
		// condition : attach the element to the page in the correct place
		if (options.relationship == 'sibling') {
			$(attachTo).after(overlay);
		} else {
			$(attachTo).append(overlay);
		}
		
		// hide the overlay initially
		if(!isMSIE || vIE > 8){
			$(overlay).css({opacity:0});
		}
		
		// create a variable to contain the close anchor link that will be used to detect click
		var anchor = $(overlay).find('a.overlay-close');
		
		// bind a handler to close the overlay
		$(anchor).bind('click',function(e){
			closeOverlay(e, anchor);
		});
		$(anchor).bind('keypress',function(e){
			if(e.keyCode==13){ // enter
				closeOverlay(e, anchor);
			}
		});
	};
	
	
	
	/*
	 * Show the overlay if one exists but it's hidden
	 * 
	 * @return void
	 * @private
	 */
	var showOverlay = function() {
				
		// reset the overlay height, in case it's been adjusted elsewhere
		$(overlay).find('.overlay-content-container').css({height:'30px'});
		
		// set the animation up, hiding the opacity change from IE
		var anim = { marginTop:0 };
		if(!isMSIE || vIE > 8){
			anim.opacity = 1;
		}
		
		// fade it in, with animation
		$(overlay).css({
			display:'block',
			margin:'-10px'
		}).animate(anim, options.animationTime, function(){
			
			// set boolean to show overlay is now visible
			overlayDisplayed = true;
		});
		
		// customised for notes
		note.stopNotes();
	};



	/*
	 * Hide the overlay 
	 * 
	 * @param func [function] optional callback function once the overlay has been hidden
	 * 
	 * @return void
	 * @public
	 */
	var hideOverlay = function(func) {
		
		// set the animation up, hiding the opacity change from IE
		if(!isMSIE || vIE > 8){
			$(overlay).animate({
				opacity:0,
				marginTop:'-10px'
			}, options.animationTime, function(){
			
				// set boolean to show overlay is now hidden
				overlayDisplayed = false;
			
				// reset content ready for the overlay to be shown again
				showLoader();

				// remove current overlay content
				$(overlay).find('.overlay-content').html('');
				$(overlay).css({ display:'none' });
			
				// condition : if a function has been passed through, call it now
				if (typeof func == "function") {
					func();
				}
			});
		
		// IE - repeat above, but remove animation
		} else {
			$(overlay).css({display:"none"});
			overlayDisplayed = false;
			showLoader();
			$(overlay).find('.overlay-content').html('');
			if (typeof func == "function") {
				func();
			}
		}
		
		overlayHelper.removeErrorElement();
		
		// customised for notes
		note.startNotes();
		clearInterval(counterInterval);
		counterInterval = null;
	};


	
	/*
	 * Show the loading icon
	 * 
	 * @return void
	 * @public
	 */
	var showLoader = function(func) {
		if(!isMSIE  || vIE > 8){
			$(overlay).find('.overlay-loading').css({opacity:1});
		} else {
			$(overlay).find('.overlay-loading').css({visibility:'visible'});
		}

		if (typeof func == "function") {
			func();
		}
	};



	/*
	 * Hide the loading icon 
	 * 
	 * @return void
	 * @public
	 */
	var hideLoader = function(func) {
		if(!isMSIE || vIE > 8){
			$(overlay).find('.overlay-loading').animate({
				opacity:0
			}, options.animationTime, function(){
				if (typeof func == "function") {
					func();
				}
			});
		} else {
			$(overlay).find('.overlay-loading').css({visibility:'hidden'});
			if (typeof func == "function") {
				func();
			}
		}
	};
	
	
	
	/**
	 * Create an AJAX request to create the overlay content
	 * @return void
	 * @private
	 */	
	var retrieveDataAjax = function() {

		var response = $.post(
			options.ajaxPath, 
			{ 'random' : Math.random() },
			function(data, textStatus){
				
				// condition : if the data has been retrieved successfully, save it
				if (textStatus == 'success') {
					contentLoaded = true;
					loadedData = data;
					
					clearInterval(counterInterval);
					counterInterval = null;
					
				// an error has occurred, prepare to display it
				} else {
					contentLoaded = true;
					loadedData = options.errorMessage;
				}
		});
	};



	/**
	 * Retrieve inline content for the overlay
	 * @return void
	 * @private
	 */	
	var retrieveDataInline = function(linkElement) {

		var content = $(options.contentPath);
		
		// condition : if content is found, load it into the overlay
		if(content.length > 0) {
			loadedData = content.clone();
			loadedData.removeClass('inline').attr('id', 'ajax-form').css({display:"block"});
		} else {
			loadedData = options.errorMessage;
		}

		contentLoaded = true;
	};
	
	
	
	/**
	 * Populate the overlay with new data
	 * @return void
	 * @private
	 */	
	var populateOverlay = function() {
		
		// condition : has the AJAX request completed yet?
		if(contentLoaded === true) {

			//run functions and remove timer
			clearInterval(ajaxInterval);
									
			// when content is received, fade out loader
			hideLoader(function(){

				// when loader is faded out, fix size of overlay (temporarily)
				overlayContent = $(overlay).find('.overlay-content');
				$(overlayContent).css({
					opacity:0
				});
			
				// set the content
				$(overlayContent).html(loadedData);
				
				// call JS script to add rounded corners for IE
				//DD_roundies.addRule('.overlay input.text', "3px"); 
				//DD_roundies.addRule('.overlay input.button', "3px");
				
				// check whether to add behaviours for any text fields
				if (options.defaultTextFields.length > 0) {
					toggleDefaultText.init(options.defaultTextFields);
				}
								
				// adjust the height of the overlay
				recalculateHeight();
				
				// set callback function if set
				if (!!options.submitCallback) {
					var btn = $(overlay).find('input.button');
					if (btn.length > 0) {
						btn.unbind('click')
							.bind('click', function(e){
								e.preventDefault();
								overlayHelper.init(options.submitCallback);
							});
					}
				}
				
				
				/* counter used to show how many characters left to type (140 max) */
			    var counterEl = $('<p id="counter"></p>');
			    $('#ajax-form .what-container').append(counterEl);
				counterInterval = setInterval(function() {
					if ($('#ajax-form #what').val()) {
						var diff = 140 - $('#ajax-form #what').val().length;
				        $('#counter').html(diff);
				        if (diff<0) {
				 			$('#counter').addClass('over');
						} else {
				        	$('#counter').removeClass('over');
						}
					} 
				},300);
			});
		}
	};
	
	
	/**
	 * Recalculate the height of the overlay based on it's new content
	 * @return void
	 * @public
	 */
	var recalculateHeight = function(func) {
	
		// get the height of the new content area
		var newHeight = $(overlayContent).height();

		// display new content
		$('.overlay-content-container').animate({
			height:newHeight + 10 + "px"
		},  options.animationTime, function(){

			// show new content
			$(overlayContent).animate({
				opacity:1
			}, options.animationTime, function(){
				if (typeof func == "function") {
					func();
				}
			});
		});
		
	};
	
	
	/**
	 * Handle click event - print the page
	 * @return void
	 * @private
	 */
	var closeOverlay = function(e, anchor) {
		e.preventDefault();
		anchor.blur();
		hideOverlay();
	};
	
	
	/*
	 * Loop through and close any other overlays that may be open
	 * @return void
	 * @private
	 */
	var closeAllOtherOverlays = function() {

		// loop through all overlays initialised in the init file
		for (currentOverlay in overlayManager) {
			
			// get the current overlay ID, and the overlay ID in the loop
			var currentOverlayId = overlayManager[currentOverlay].getId();
			var overlayId = getId();

			// condition : if the overlay isn't the current one
			if (!!currentOverlayId && !!overlayId && currentOverlayId != overlayId) {
				overlayManager[currentOverlay].hideOverlay();
			}
		}
	};
	
	
	
	/*
	 * Loop through and close all overlays
	 * @return void
	 * @private
	 */
	var closeAllOverlays = function() {

		// loop through all overlays initialised in the init file
		for (currentOverlay in overlayManager) {
			
			// get the current overlay ID, and the overlay ID in the loop
			var currentOverlayId = overlayManager[currentOverlay].getId();
			if (!!currentOverlayId) {
				overlayManager[currentOverlay].hideOverlay();
			}
		}
	};
	
	
	/*
	 * If necessary, position the overlay based on the link that has just been clicked
	 * 
	 * @param linkElement {object} the link that has just been clicked
	 * 
	 * @return void
	 * @private
	 */
	var positionOverlay = function(linkElement) {
		
		hideOverlay(function(){
			
			// calculate overlay position
			var offset = $(linkElement).offset();
			var position = $(linkElement).position();
			
			var left = 0;
			var top = 0;
			
			// position - right?
			if (options.position == "right") { 
				left = Math.round(offset.left + linkElement.offsetWidth + 3);
				top = Math.round(offset.top);

			// position - below
			} else {
				left = Math.round(position.left - 3);
				top = Math.round(offset.top + linkElement.offsetHeight + 5);
			}
			
			overlay.css({
				left: left,
				top: top
			});
			
			// all hiding and re-positioning of the overlay is complete, show it again
			showOverlay();
		});
	};
	
	
	/*
	 * Return the id of the current script, to identify this overlay
	 * @return id
	 * @public
	 */
	var getId = function() {
		return id;
	};
	
	
	/**
	 * Return value, expose certain methods above
	 */
	return {
		init: init,
		hideOverlay: hideOverlay,
		hideLoader: hideLoader,
		showLoader: showLoader,
		displayOverlay:displayOverlay,
		recalculateHeight: recalculateHeight,
		getId: getId,
		closeAllOverlays:closeAllOverlays
	};
};


/*
 * Example call:

 $(document).ready(function(){
	 
	TBC

  });

 */