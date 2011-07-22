/**
 * @fileoverview Overlay helper, to refresh overlay content without refreshing page
 * 
 * Should be attached to 'onsubmit' of a form.
 * 
 * @author PG @ Pirata [piratalondon.com]
 * @author MA @ Pirata [piratalondon.com]
 * 
 */
var overlayHelper = function(){

	/*
	 * container for the AJAX loaded data
	 * 
	 * @var Object
	 * @private
	 */
	var loadedData = null;

	/*
	 * The overlay we're working on
	 * 
	 * @var Object
	 * @private
	 */	
	var overlay = null;
	
	/*
	 * Element to display an error message in
	 */
	var errorElement = null;
	

	/**
	 * The options passed through to this function
	 *
	 * @var Object
	 * @private
	 */
	var options = {
		
		/**
		 * Overlay name in the global overlay array 
		 *
		 * @var String
		 */		
		overlayName : null,
		
		/**
		 * Form Element to process
		 *
		 * @var Int
		 */		
		element : null,
		
		/**
		 * The location of the AJAX script on the server
		 *
		 * @var String
		 */		
		ajaxPath : null,
		
		/**
		 * The Ajax method
		 *
		 * @var String
		 */		
		ajaxMethod : null,
		
		/**
		 * Are we using a shadowbox overlay or a home-made one?
		 * 
		 * @var Bool
		 */
		shadowbox:false, 
		
		/**
		 * The overlay container ID
		 * 
		 * @var String
		 */
		overlayId: null,
		
		/**
		 * The block within the overlay that holds the ajax-able content
		 * 
		 * @var string
		 */
		overlayContent:null
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
		
		// get the overlay
		overlay = overlayManager[options.overlayName];

		// error check the form
		var errors = errorCheck();
		
		// condition : if all is good, post!
		if (errors.length < 1) {
			post();
		} else {
			displayErrors(errors);
		}
	};
	
	
	/*
	 * 
	 */
	var errorCheck = function() {
		
		// start error array to return
		var errors = [];
		
		// get the form
		var form = $(options.element);
		
		// find all 'required' form elements
		var requiredFields = form.find('.required');
		
		$(requiredFields).each(function(counter){
			if ($(this).val() == "") {
				errors.push(this.id);
			}
			
			// find any special validation fields - email?
			if ($(this).hasClass('email')) {
				var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
				if(reg.test($(this).val()) === false) {
					errors.push(this.id);
				}
			}
		});
		
		return errors;
	};
	
	
	/*
	 * 
	 */
	var displayErrors = function(errors) {

		// loop through each input, testing whether it's got an error
		$(options.element).find('.required').each(function(counter){
			
			// find the related label
			var label = $(options.element).find('label[for='+this.id+']');
			
			// test whether to add an error
			for (var count = errors.length - 1; count >= 0; count--){
				if (errors[count] == this.id) {
					$(label).addClass('error');
					break;
				} else {
					$(label).removeClass('error');					
				}
			};
		});
		
		// condition : add error element?
		if (!errorElement) {
			errorElement = $('<p class="error" />').text('Please correct the errors marked above');
			$(options.element).append(errorElement);
			
			// display error text below form
			overlay.recalculateHeight();
		}
	};
	
	
	/*
	 * 
	 */
	var removeErrorElement = function() {
		errorElement = null;
	};
	
	
	/*
	 *
	 */
	var post = function() {

		// generate our post data from the form
		var postData = $(options.element).formSerialize();

		postData += '&method='+options.ajaxMethod;
		
		// when submitting, declare that we want the form validated, and prevent ie caching bug
		postData += '&random='+Math.random();
		
		// submit request
		var response = $.post(
			options.ajaxPath, 
			postData,
			function(data, textStatus){
				
				// condition : if the data has been retrieved successfully, save it
				if (textStatus == 'success') {
					contentLoaded = true;
					loadedData = data;
					
					// google analytics custom call
					if (!!window.pageTracker) {
						pageTracker._trackPageview("/_overlay/success/");
					}
					
				// an error has occurred, prepare to display it
				} else {
					contentLoaded = true;
					loadedData = options.errorMessage;
				}
				
				// display the response...
				var overlayContent = $(options.overlayId).find(options.overlayContent);
				
				// semi-fade out the existing content
				overlayContent.animate({opacity:0.25}, 400);
				
				// condition : if this is a home-made overlay we can control it's state
				if (options.shadowbox === false) {
				
					// display the loader (and once that's complete...)
					overlay.showLoader(function(){

						// set the new content
						overlayContent.html(loadedData);
					
						// resize the overlay (and once that's complete...)
						overlay.recalculateHeight(function(){
						
							// hide the loader again (and once that's complete...)
							overlay.hideLoader(function(){
							
								// fade back in the new content
								$(overlayContent).animate({opacity:1}, 400);
							});
						});
					});
				
				// if this is a shadowbox overlay just replace the content
				} else {
					
					// set the new content
					overlayContent.html(loadedData);
					
					// fade back in the new content
					$(overlayContent).animate({opacity:1}, 400);
				}
		});
	};


	/**
	 * Return value, expose certain methods above
	 */
	return {
		init: init,
		removeErrorElement: removeErrorElement
	};
}();

/*
 * Below functions are extracted from the jQuery Form Plugin
 * version: 2.28 (10-MAY-2009)
 * @requires jQuery v1.2.2 or later
 *
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
/**
 * formToArray() gathers form element data into an array of objects that can
 * be passed to any of the following ajax functions: $.get, $.post, or load.
 * Each object in the array has both a 'name' and 'value' property.  An example of
 * an array for a simple login form might be:
 *
 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * It is this array that is passed to pre-submit callback functions provided to the
 * ajaxSubmit() and ajaxForm() methods.
 */
$.fn.formToArray = function(semantic) {
    var a = [];
    if (this.length == 0) return a;

    var form = this[0];
    var els = semantic ? form.getElementsByTagName('*') : form.elements;
    if (!els) return a;
    for(var i=0, max=els.length; i < max; i++) {
        var el = els[i];
        var n = el.name;
        if (!n) continue;

        var v = $.fieldValue(el, true);
        if (v && v.constructor == Array) {
            for(var j=0, jmax=v.length; j < jmax; j++)
                a.push({name: n, value: v[j]});
        }
        else if (v !== null && typeof v != 'undefined')
            a.push({name: n, value: v});
    }

    return a;
};

/**
 * Serializes form data into a 'submittable' string. This method will return a string
 * in the format: name1=value1&amp;name2=value2
 */
$.fn.formSerialize = function(semantic) {
    //hand off to jQuery.param for proper encoding
    return $.param(this.formToArray(semantic));
};


/**
 * Returns the value(s) of the element in the matched set.  For example, consider the following form:
 *
 * Note: This method *always* returns an array.  If no valid value can be determined the
 *       array will be empty, otherwise it will contain one or more values.
 */
$.fn.fieldValue = function(successful) {
    for (var val=[], i=0, max=this.length; i < max; i++) {
        var el = this[i];
        var v = $.fieldValue(el, successful);
        if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length))
            continue;
        v.constructor == Array ? $.merge(val, v) : val.push(v);
    }
    return val;
};

/**
 * Returns the value of the field element.
 */
$.fieldValue = function(el, successful) {
    var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
    if (typeof successful == 'undefined') successful = true;

    if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
        (t == 'checkbox' || t == 'radio') && !el.checked ||
        (t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
        tag == 'select' && el.selectedIndex == -1))
            return null;

    if (tag == 'select') {
        var index = el.selectedIndex;
        if (index < 0) return null;
        var a = [], ops = el.options;
        var one = (t == 'select-one');
        var max = (one ? index+1 : ops.length);
        for(var i=(one ? index : 0); i < max; i++) {
            var op = ops[i];
            if (op.selected) {
				var v = op.value;
				if (!v) // extra pain for IE...
                	v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
                if (one) return v;
                a.push(v);
            }
        }
        return a;
    }
    return el.value;
};