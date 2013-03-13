(function(window,undefined){
  
	// RubberBand, the object
	var RubberBand = function(cb) {
		
		// for down scope uses of this object
		var $me = this;
		
		this.config = {
			pull_text: 'Pull to Refresh',
			load_text: 'Loading...'
		};
		
		// variables to be used throughout that are set on init (don't edit)
		this.variables = {
			callback: null,
			calling: false,
			e_height: null,
			max_height: null,
			original_top: null,
			scrolling: null,
			closing: null,
			inplay: false,
			$RBe: null,
			images: true,
		};
		
		// Initialize function
		// sets all variables
		this.init = function(cb) {
			
			// if the element doesn't exist, create it
			if(!$('#RubberBandjs').length) {
				
				$('body').prepend( $('<div id="RubberBandjs">')
					.append( $('<div class="rband">')
						.append( $('<h3 class="text">') ) 
					)
				);
				$me.variables.images = false;
			}
			
			// set all necessary variables
			$me.variables.$RBe = $('#RubberBandjs');
			
			$me.variables.$RBe.find('.rband .text').html($me.config.pull_text);
			
			$me.variables.callback = cb;
			
			$me.variables.e_height = parseFloat( $me.variables.$RBe.css('top').replace(/px/, '') ); // this needs to be an integer
			
			$me.variables.max_height = Math.abs( $me.variables.e_height ); // swap to positive
			
			$me.variables.original_top = $me.variables.e_height;
			
			// Bind to the scrolling of the window
			$(window).scrollTop(1).on("scroll touchmove", $me.RB);
		};
		
		// The actual RubberBand function
		this.RB = function() {
			
			// clear the timeout on any scroll
			$me.variables.scrolling = window.clearTimeout($me.variables.scrolling);
			
			// only do something if they're at the top of the page
			if($(window).scrollTop()<=0) {
			
				$me.variables.inplay = true;
				
				var diff;
			
				if($me.variables.e_height<0) {
					
					// tension control for more of a natural feel
					if($me.variables.e_height>=-10) {
				
						diff = 3;
					} else if($me.variables.e_height>=-20) {
				
						diff = 4;
					} else if($me.variables.e_height>=-50) {
				
						diff = 5;
					} else {
				
						diff = 6;
					}
					
					// determine values and set css rules
					$me.variables.e_height = $me.variables.e_height + diff;
				
					$me.variables.$RBe.css('top', $me.variables.e_height +'px');
				
					$('body').css('padding-top', ($me.variables.max_height + $me.variables.e_height) +'px');
					
					// this allows the user to continue to scroll
					$(window).scrollTop(1);
				
				// when the very top has been reached, "refresh"
				} else if($me.variables.e_height>=0) {
					
					// no more scrolling for now
					$(window).unbind("scroll");
					
					// set CSS to avoid "over-scrolling"
					$me.variables.$RBe.css('top', '0px');
				
					$('body').css('padding-top', $me.variables.max_height +'px');
				
					$me.variables.scrolling = window.clearTimeout($me.variables.scrolling);
					
					$me.variables.$RBe.find('.rband .text').html($me.config.load_text);
					
					// switch images, if they exist
					if($me.variables.images) {
					
						$me.variables.$RBe.find('.rband .load').show();
						$me.variables.$RBe.find('.rband .arrow').hide();
					}
					
					// fire the callback, or "on refresh" function
					if($me.variables.callback) {
						
						if(!$me.variables.calling) {
							
							$me.variables.callback($me);
							
							$me.variables.calling = true;
						}
						
					// otherwise just close it
					} else {
						
						$me.close();
					}
					
				}
			}
		
			// if they're not scrolling, the band is showing, and it isn't already closing-- close it
			if(!$me.variables.closing && $me.variables.inplay && $me.variables.e_height<0) {
				
				$me.variables.scrolling = window.setTimeout(function() {
					
					$me.close();
				
				}, 200);
			}
		};
		
		// Close function
		// animates the band to the original closed state
		this.close = function() {
			
			// fire both animations
			$me.variables.$RBe.animate({ top: $me.variables.original_top }, 200);
			
			// reset after the animation has completed
			$('body').animate({ paddingTop: 0 }, 200, function() { 
			
				//$(window).scrollTop(1); 
			
				$(window).on("scroll touchmove", $me.RB); 
			
				$me.variables.e_height = $me.variables.original_top;
		
				$me.variables.inplay = false;
				
				$me.variables.calling = false;
			
				$me.variables.closing = window.clearTimeout($me.variables.closing);
				
				// reset action text
				$me.variables.$RBe.find('.rband .text').html($me.config.pull_text);
				
				if($me.variables.images) {
				
					$me.variables.$RBe.find('.rband .load').hide();
					$me.variables.$RBe.find('.rband .arrow').show();
				}
			});

		};
		
		// Runtime
		this.init(cb);
	};
	
	// set the variable to be accessed
	window.RubberBand = RubberBand;
}(window));
