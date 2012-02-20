Jtmpl.js
=====

A simple and little template engine for Javascript. 

Features
-----

- simple, parsing text on primitive String functions, without regexp.
- little, source lines are less around 100.

Synopsis
-----

  var engine = new Jtmpl(template_src);
  var template = engine.compile({});
  document.write(template.get());

Syntax
-----

### {%=varname%} 

show content of variable.

  var engine = new Jtmpl("Hello, {%=target%}!");
  engine.compile({ target: "World" }).get();
  > Hello, World!

### {% code %}

execute as code, show returing from the code executed.
in the code, any fields in object through `this'.

  var engine = new Jtmpl(
    "1 + 1 = {% var ans = 1 + 1; return ans + ' by ' + this.name %}");
  engine.compile({name: "MATSU Hiroshi"}).get();
  > 1 + 1 = 2

### {%listname}...{listname%} 

create list block. `listname' must be corresponding to a field in 
data source. and the field must be array of object. 
this block are repeated along the array.

in the block, {%=varname%} syntax point fields in a object in array.
if you want refer to parent object, use "_parent".

  var engine = new Jtmpl(
      "{%list}"
    + "{%=_parent.name%} was {%=activity%} at the {%=when%}.\n"
    + "{list%}");
  var template = engine.compile({name: "MATSU Hiroshi", list:[
    { activity: "coding", when: "aftenoon"},
    { activity: "sleeping", when: "night"},
    { activity: "meeting", when: "morning"}
  ]});
  template.get();
  >MATSU Hiroshi was coding at the aftenoon.
   MATSU Hiroshi was sleeping at the night.
   MATSU Hiroshi was meeting at the morning.

### {%?condvar}...{condvar%}

create conditional block. `condvar' must be corresponding to a field in 
data source. if the field evaluated as true, this block shown.

  var engine = new Jtmpl("{%?pass}{%=name%} passed examination!{?pass%}");
  var template = engine.compile({pass: {name : "MATSU Hiroshi"}});
  >MATSU Hiroshi passed examination!

Short History
-----

This library born at 2005. i wanted a light template engine for Javascript 
for my proprietary work, dyanmic web applicationwork. i wroted this module,
aiming not to depend on regexp because there's not any other used to regexp.
but the work did not start. i store the code in my repository and forgot ;)
