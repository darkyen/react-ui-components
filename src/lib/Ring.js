/* 
  @class : Ring
   @desc  : A circular linked list like data structure
            only implemented as per our needs no need to
            implement all methods. you must not play 
            with this._elements treat it as pure immutable 
            datastructure.
*/
class Ring{
  constructor(length){
    // For link list
    // now the problem is how to make the 
    // constructor work faster better stronger
    this._start = null;
    this._originalStart = null;
    this._originalEnd   = null;
    this._end   = null;
  }

  _wrap(data, next, prev){
    return {data, next, prev};
  }
  
  push(data){
    let el = this._wrap(data, this._start, this._end);
    
    if( this._end ){
      this._end.next = el;
    }
    this._originalEnd = this._end = el;  
    
    if( ! this._start ){
      this._originalStart = this._start = this._end;
    }
    this._adjust();
  }  
  
  _adjust(){
    this._end.next = this._start;
    this._start.prev = this._end;
  }
  
  pop(){
    this._end = this._end.prev;
    this._adjust();
  }
  
  shift(){
    this._start = this._start.next;
    this._adjust();
  }

  // just for the lulz
  unshift(data){
    let el = this._wrap(data, this._start, this._end);
    if( this._start ){
      this._start.prev = el;
    }
    this._start = el;
    if( ! this._end ){
      this._end = this._start;
    }
    this._adjust();
  }
  
  turnAntiClockwise(times, visitFn){
    var el = null;
    for( let i = 0; i < times; i++ ){
      el = this._end;
      this._start = el;
      this._end    = el.prev;
      visitFn && visitFn(el.data, i);
    }
  }
  
  turnClockwise(times, visitFn){
    var el = null;
    for( let i = 0; i < times; i++ ){
      el = this._start;
      this._end = el;
      this._start = el.next;
      visitFn && visitFn(el.data, i);
    }
  }

  // travellers work irrespective
  // of teh alignment
  travelClockwise(visitor){
    let el = this._originalStart;
    let i  = 0;
    do{
      visitor(el, i++);
      el = el.next;
    }while(el !== this._originalStart);
  }
  
  travelAnticlockwise(visitor){
    let el = this._originalEnd;
    let i = 0;
    do{
      visitor(el, i);
      el = el.prev;
    }while(el !== this._originalEnd);
  }
  
  mapClockwise(visitor){
    let el = this._originalStart,i = 0, arr = [];
    do{
      arr.push(visitor(el.data, i++));
      el = el.next;
    }while(el !== this._originalStart);
    return arr;
  }
  
  mapAntiClockwise(visitor){
    let el = this._originalEnd, i = 0, arr = [];
    do{
      arr.push(visitor(el.data, i++));
      el = el.prev;
    }while(el !== this._originalEnd);
    return arr;
  }
};


export default Ring;