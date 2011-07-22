/**
 * @fileoverview Get and create new notes
 * 
 */
var note = function(){
	
	/*
	 * loader element
	 */
	var loader = null;
	
	/*
	 * note interval
	 */
	var noteInterval = null;
	
	/*
	 * latest note id 
	 */
	var latestNodeId = 1;
	
	/*
	 * page dimensions, for note placement
	 */
	var pageWidth = null;
	var pageHeight = null;
	
	/*
	 * note dimensions, for note placement
	 */
	var noteWidth = null;
	var noteHeight = null;
	

	/**
	 * The options passed through to this function
	 *
	 * @var Object
	 * @private
	 */
	var options = {
				
		/**
		 * The location of the AJAX script on the server
		 *
		 * @var String
		 */		
		ajaxPath : null,
		
		/**
		 * The interval between new notes, in seconds
		 *
		 * @var Int
		 */		
		interval : null
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
		
		startNotes();
		
		var note = $("#wrapper .note:first");
		noteWidth = note.width();
		noteHeight = note.height();
		initDraggable(note);
		
		setPageDimensions();
		$(window).resize(function() {
			setPageDimensions();
		});
	};
	
	
	/*
	 *  get a new note every x seconds
	 */
	var startNotes = function() {
		if (!noteInterval) {
			noteInterval = setInterval(getNote, options.interval * 1000);
		}
	};


	/*
	 *  get a new note every x seconds
	 */
	var stopNotes = function() {
		if (!!noteInterval) {
			clearInterval(noteInterval);
			noteInterval = null;
		}
	};
	
	
	/*
	 *
	 */
	var setPageDimensions = function() {
		pageWidth = $(window).width();
		pageHeight = $(window).height();
	};

	
	/*
	 * Get another note
	 */
	var getNote = function() {
	
		// condition : create loader?
		if (!loader) {
			loader = $('<img>')
				.appendTo("#wrapper")
				.attr('id', 'loader')
				.attr('src', './_includes/img/site/ajax-loader.gif');
		}
		
		loader
			.css({opacity:0})
			.animate({opacity:1}, 500,
				function() {
					
					var postData = '&method=getNote';
					postData += '&random='+Math.random();
					
					// submit request
					var response = $.post(
						options.ajaxPath, 
						postData,
						function(data, textStatus){

							var result = $.parseJSON(data);

							// condition : if the data has been retrieved successfully, save it
							if (result.success == 1) {

								//set random node bg and font
								var randomFont = Math.floor(Math.random()*10) + 1;
								var randomBg = Math.floor(Math.random()*10) + 1;

								// set note position
								var top = Math.floor(Math.random()*(pageHeight-noteHeight)) + 1;
								var left = Math.floor(Math.random()*(pageWidth-noteWidth)) + 1;
								
								// set anim
								var marginLeft = Math.floor(Math.random()*50) -25;
								var marginTop = Math.floor(Math.random()*50) -25;

								// duplicate an existing note
								var newNote = $('#wrapper .note:last')
									.clone()
									.attr('id', 'note-' + latestNodeId)
									.attr('class', 'note font-'+randomFont+' bg-'+randomBg)
									.css({
										opacity:0,
										zIndex: latestNodeId,
										left: left,
										top: top,
										marginTop:marginTop,
										marginLeft:marginLeft
									})
									.animate({
										opacity:1,
										marginTop:0,
										marginLeft:0
									}, 500);
								
								// set note rotation
								var property = getTransformProperty(newNote[0]);
								if (property) {
									var randomRotateStart = Math.floor(Math.random()*50) - 25;
									var randomRotateEnd = Math.floor(Math.random()*50) - 25;
									
									newNote.css(property, 'rotate('+ randomRotateStart +'deg)');
								}
								

								// change note content
								newNote.find('.what').html("&lsquo;"+result.details.what+"&rsquo;");
								newNote.find('.who').html(result.details.who + ", ");
								newNote.find('.where').html(result.details.where + ", ");
								newNote.find('.when').html(result.details.when);

								$('#wrapper').append(newNote);
								latestNodeId++;
								
								initDraggable(newNote);

							// an error has occurred, prepare to display it
							} else {
								console.log(result.message);
							}

							loader.animate({
								opacity:0
							}, 250);
	
						});
				});
	};
	
	
	/*
	 *
	 */
	var getTransformProperty = function(element) {
		var properties = ['transform', 'WebkitTransform', 'MozTransform' , 'OTransform'];
		var p;
		while (p = properties.shift()) {
			if (typeof element.style[p] != 'undefined') {
				return p;
			}
		}
		return false;
	};
	

	/*
	 * 
	 */
	var initDraggable = function(el) {
		$(el).draggable({
		 
			/* Converting the images into draggable objects */
			//containment: 'parent',
			start: function(e,ui){
				/* This will stop clicks from occuring while dragging */
				preventClick=true;
			},
			stop: function(e, ui) {
				/* Wait for 250 milliseconds before re-enabling the clicks */
				setTimeout(function(){ preventClick=false; }, 250);
			}
		});
		
		$(el).mousedown(function(e){
			$(this).css('zIndex', ++latestNodeId);
		});
	};


	/**
	 * Return value, expose certain methods above
	 */
	return {
		init: init,
		startNotes: startNotes,
		stopNotes: stopNotes
	};
}();