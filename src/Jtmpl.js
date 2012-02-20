// Jtmpl.js - a simple template engine for javascript
// MATSUOKA Hiroshi<matsu.osk@gmail.com>

// constructor
var Jtmpl = function(src, opts){
  this.src = src;
  this.o = {
    NL : "\n",
    dummyNL : "/*Jtmpl::newline*/"
  };
  if( opts ){
    for(key in opts){
      this.o[key] = opts[key];
    }
  }
}

// utilities
Jtmpl.prototype.__replaceAll = function(t, b, a){ return t.split(b).join(a) };
Jtmpl.prototype.__escapeNL = function(t){ return this.__replaceAll(t, this.o.NL, this.o.dummyNL); };
Jtmpl.prototype.__unescapeNL = function(t){ return this.__replaceAll(t, this.o.dummyNL, this.o.NL); };
Jtmpl.prototype.__makeGet = function(s, __n){
  return function(){ var __o = "", __i;
    try{ for(__i=0; __i<__n; __i++){ __o+=this[__i]();} return s.__unescapeNL(__o); }
    catch(e){ e.message += " [Jtmpl:execute] " + this[__i]; throw e; } }; };

// single extractions
Jtmpl.prototype.__getPlain = function(s, t, n){
  return s + "[" + n + "]=function(){/*P*/ return \"" + this.__escapeNL(t).replace("\"", "\\\"")+"\";};";
};
Jtmpl.prototype.__getValue = function(s, v, n){
  return s + "[" + n + "]=function(){/*V*/ return this." + this.__escapeNL(v) + ";};";
};
Jtmpl.prototype.__getCode = function(s, c, n){
  return s + "[" + n + "]=function(){/*C*/" + this.__escapeNL(c) + "};";
}

// block extractions
//
Jtmpl.prototype.__getIf = function(s, b, t, n){
  return s + "[" + n + "]=function(){/*I*/ if(this." + b + "){" 
    + "for(var __v in this." + b + "){" + t + "[__v]=this." + b + "[__v];}"
    + "return " + t + ".get()}else{ return \"\"}};";
}
Jtmpl.prototype.__getList = function(s, b, t, n){
  return s + "[" + n + "]=function(){/*L*/ var __o=\"\";"
    + "for(var __i in this." + b + "){for(var __v in this." + b + "[__i]){"
    + t + "[__v]=this." + b + "[__i][__v];} __o +=" + t + ".get()} return __o;}";
}

// compile(inner)
//
Jtmpl.prototype.__compile = function(s){
  var __t={}, __n=0, __i=0, __ni, __li; __t.c=[]; __t.s = s;
  while(__i<s.length){
    __ni=s.indexOf("{%", __i);
    if(__ni<0){
      eval(this.__getPlain("__t", s.slice(__i), __n));
      __n++; __i=s.length; continue;
    }
    eval(this.__getPlain("__t", s.substring(__i, __ni), __n));
    __n++; __i=__ni;

    __ni=s.indexOf("{%", __i);
    if(__ni>=0){
      __li=s.indexOf("}", __ni);
      if(__li>=0 && s.substring(__li-1, __li) != "%"){
        var __bn = s.substring(__ni+2, __li), __id="{" + __bn + "%}";
        __ni=__li+1; __li=s.indexOf(__id, __ni);
        if(__li>=0){
          var __tc=__t.c.length;
          __t.c[__tc] = this.__compile(s.substring(__ni, __li));
          __t.c[__tc]._parent = __t;
          if(__bn.substring(0, 1) == "?"){
            __bn=__bn.slice(1);
            eval(this.__getIf("__t", __bn, "__t.c[" + __tc + "]", __n));
          }else{
            eval(this.__getList("__t", __bn, "__t.c[" + __tc + "]", __n));
          }
          __n++; __i=__li+__id.length; continue;
        }
      }

      __li=s.indexOf("%}", __ni);
      if(__li>=0){
        if(s.substring(__ni+2, __ni+3) == "="){
          eval(this.__getValue("__t", s.substring(__ni+3, __li), __n));
        }else{
          eval(this.__getCode("__t", s.substring(__ni+2, __li), __n));
        }
        __n++; __i=__li+2; continue;
      }
    }
    __i++;
  }
  __t.get = this.__makeGet(this, __n);
  return __t;
};

// compile
//
Jtmpl.prototype.compile = function(obj){
  try{
    var __t = this.__compile(this.src);
    for(var __k in obj){ __t[__k] = obj[__k] }
    return __t;
  }catch(e){
    e.message += " [Jtmpl:compile] " + this.src;
    throw e;
  }
};
