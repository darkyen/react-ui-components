// This is most likely an overkill.
// and will make benjamin sad.
class DataSourceElementError{
    constructor(type, message){
        this._type = type;
    }
  
    get type(){
        return this._type;
    }
};

let DataSourceElementErrors = {
    IndexOutOfBound : new DataSourceElementError('IndexOutOfBound'),
};


export default DataSourceElementErrors;