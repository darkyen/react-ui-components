import DataSourceElementErrors from './DataSourceElementErrors.js';
let __unImpl  = methodName =>  {
  throw new Error('Unimplemented method' + methodName);
}

class DataSource{
  
  constructor(){
    if( this.constructor === DataSource.prototype.constructor ){
      throw new Error('Abstract class, don\'t create object of this');    
    }
  }
  
  getItemAtIndex(index){
    __unImpl('Promise getItemAtIndex(index)');
  }
}

export default DataSource;