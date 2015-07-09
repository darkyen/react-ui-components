
class EventEmitter{
    on(ev, handler) {
        let events = this._events;
        (events[ev] || (events[ev] = [])).push(handler)
    }

    removeListener(ev, handler) {
        let array = this._events[ev]

        array && array.splice(array.indexOf(handler), 1)
    }

    emit(ev) {
        let args = [].slice.call(arguments, 1),
            array = this._events[ev] || []

        for (let i = 0, len = array.length; i < len; i++) {
            array[i].apply(this, args)
        }
    }

    once(ev, handler) {
        this.on(ev, remover)
        
        function remover() {
            handler.apply(this, arguments)
            this.removeListener(ev, remover)
        }
    }

    constructor() {
        this._events = {}
        return this;
    }
}

export default EventEmitter;