import EventEmitter from './EventEmitter';

var ua = /iPhone|iP[oa]d/.test(navigator.userAgent) ? 'iOS' : /Android/.test(navigator.userAgent) ? 'Android' : 'PC';

class SmartScroll extends EventEmitter{

	constructor(element, options){
		// figure out how will we fix this on le-ios
		super();
		this._element = element;
		this._snapEvents  = options.snapEvents;
		element.addEventListener('scroll', options.raf?this._handleNativeRAF.bind(this):this._handleNativeTimeout.bind(this));
		
		if( this._snapEvents && 'ontouchstart' in window ){
			element.addEventListener('touchstart', this._handleTouchStart.bind(this));
			element.addEventListener('touchend', this._handleTouchEnd.bind(this));			
		}

		if( !this.raf ){
			this._throttleBy = (1000 / (options.eventPerSecond || 60 ));
		}
		this._isScrolling = false;
		this._lastEventAt = 0;
		this._lastTop = 0;
		this._lastLeft = 0;
	}
	
	_handleTouchStart(e){
		if( this._snapEvents ){
		}
	}

	_handleTouchEnd(e){
		if( this._snapEvents ){
			this._sendStopped();
			console.log("Whaa");
			this._element.style.overflowX = 'hidden';
			setTimeout((t) => {
				this._element.style.overflowX = 'auto';
				this._element.scrollLeft = this._lastLeft;
				this._sendStopped();
			}, 40);			
		}
	}

	_sendStopped(t){
		console.log("Emit scroll stopped");
		if( this._isScrolling ){		
			console.log("Haha i did");
			this._isScrolling = false;
			this.emit('scroll.end', {
				scrollTop: this._lastTop,
				scrollLeft: this._lastLeft
			});
		}
	}

	_throttledScroll(e){

		let last = this._lastEventAt;
		let now  = e.timeStamp;
		let scrollTop = this._element.scrollTop;
		let scrollLeft = this._element.scrollLeft;

		if( ! this._isScrolling ){
			this._isScrolling = true;
			last = now;
			this.emit('scroll.start', {
				scrollTop: scrollTop,
				scrollLeft: scrollLeft 
			});
		}

		this.emit('scroll.move', {
			scrollTop: scrollTop,
			scrollLeft: scrollLeft
		});

		this._lastTop = scrollTop;
		this._lastLeft = scrollLeft;
		clearTimeout(this._interval);
		this._interval = setTimeout(tx => this._sendStopped(tx), this._throttleBy);
		this._lastEventAt = now;
	}

	_handleNativeRAF(e){
		requestAnimationFrame( t => this._throttledScroll(e) );
	}

	_handleNativeTimeout(e){
		setTimeout(t => this._throttledScroll(e), this._throttleBy);
	}
}

export default SmartScroll;