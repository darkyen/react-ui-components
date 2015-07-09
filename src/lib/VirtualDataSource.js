import DataSource from './DataSource.js';
import DataSourceElementErrors from './DataSourceElementErrors.js';

class VirtualDataSource extends DataSource{
    constructor(){
        super();
        if( this.constructor === VirtualDataSource.prototype.constructor ){
            throw new Error('Abstract class', this.constructor.name ,' don\'t create object of this class directly');    
        }
        this.cache = new LRUCache();
    }
    
    getSetForIndex(){
        // async.  
    }

    getItemsAtIndex(){
        __unImpl('getItemsAtIndex()')
    }
    getItemAtIndex(index){
        let el = this.cache.get(index);
        if( el ){
            return el;
        }
        return getSetForIndex();
    }
    
    getLength(){
        
    }
    
    // Somehow re-use the original one ?
    // composition does sounds more promising
    // by creating 2 seperate elements 
    // but meh.
    get length(){
        return this.getLength();
    }
}

export default VirtualDataSource;