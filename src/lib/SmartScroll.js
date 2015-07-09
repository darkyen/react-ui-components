import EventEmitter from './EventEmitter';
class SmartScroll extends EventEmitter{
	constructor(element, options){
		// figure out how will we fix this on le-ios
		super();
		this._element = element;
		element.addEventListener('scroll', options.raf?this._handleNativeRAF.bind(this):this._handleNativeTimeout.bind(this));
		if( !this.raf ){
			this._throttleBy = (1000 / (options.eventPerSecond || 60 ));
		}
		this._isScrolling = false;
		this._lastEventAt = 0;
		console.log(element);
	}

	_throttledScroll(e){
		let last = this._lastEventAt;
		let now  = e.timeStamp;
		let scrollTop = this._element.scrollTop;
		let scrollLeft = this._element.scrollLeft;
		if( ! this._isScrolling ){
			this._isScrolling = true;
			this.emit('scroll.start', {
				scrollTop: scrollTop,
				scrollLeft: scrollLeft 
			});
		}

		this.emit('scroll.move', {
			scrollTop: scrollTop,
			scrollLeft: scrollLeft
		});

		if( now - last > 100 ){
			this._isScrolling = false;
			console.log("Scrolling Ended");
			this.emit('scroll.end',{
				scrollTop: scrollTop,
				scrollLeft: scrollLeft				
			});
		}
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