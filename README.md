# Overload
This is an imetation of operation overload.

### **Examples**

```
const overload = new Overload();

overload.foo = function(test = ''){
    console.log('String',test);
}

overload.foo = function(test = 0){
    console.log('Number',test);
}

overload.foo = function(test = {}){
    console.log('Object',test);
}

overload.foo = function(test = 0, str = ''){
    console.log('multipart',test,str);
}

overload.foo = function(test = '', str1, str2){
    console.log('Any arguments',test, str1, str2);
}
```
```
overload.foo("Hello");

overload.foo(10);

overload.foo({thisis:"object"});

overload.foo(100,'World');

overload.foo('Hello','World','Friends');
```
#### **Console log**
String Hello

Number 10

Object { thisis: 'object' }

multipart 100 World

Any arguments Hello World Friends

