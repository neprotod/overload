function Overload(){
    return new Proxy({}, {
        /**
         * And here we are trying to get a function
         * 
         * @param {Object} target 
         * @param {string} name 
         */
        get: function get(target, name) {
            // We should return wrapper function
            return function() {
                let args = arguments;

                if(!target[name]){
                    throw new Error("We don't have this function");
                }

                let obj = target[name];

                let type = '';
               
                // Try create path to the function
                for(let arg of args){
                    type = typeof(arg);
                    if(obj[type]){
                        obj = obj[type];
                    }else if(obj['any']){
                        obj = obj['any'];  
                    }else{
                        throw new Error("We don't have this function");
                    }
                }

                // Ok. Path to the function already made, we must call the function
                if(obj['call']){
                    return (function(){
                        return obj['call'].apply(null,args);
                    })();
                }

                throw new Error("Don't have this function");
            }
        },
        /**
         * 
         * @param {Object}   proxy it parent object
         * @param {string}   name  function name
         * @param {Function} value it is function
         */
        set(proxy, name, value){
            // We can do something only when this is function
            if(typeof(value) === 'function'){
                // Need to parss this to string, becouse I don't know how get function params 
                const func = value.toString();

                let regex = /\(([\s\S]*?)(?:\)[\s]*\{)/;
                //Get function params
                let result = func.match(regex)[1];

                //And we can clear object, we don't need the body of the object
                regex = /\{[^\{\}]*\}/g;
                result = result.replace(regex,'{}');

                let arg = String(result).split(',');
                
                // This we get first function path
                if(!proxy[name]){
                    proxy[name] = {}
                }

                // Create path to the function
                let obj = proxy[name];
                for(let type of arg){
                    type = this._typeReturn(type);
                    if(obj[type]){
                        obj = obj[type];
                    }else{
                        obj[type] = {};
                        obj = obj[type];
                    }
                }

                // Save the function
                obj.call = value;
            }

            return true;
        },

        /**
         * It's function get type or any
         * 
         * @param  {any} _type data from which we want to get the type
         * @return {ant} 
         */
        _typeReturn(_type){
            try{
                const result = eval(`[${_type}]`)[0];
                if(result === null)
                    return 'any';
                return typeof(result);
            }catch(e){
                return 'any';
            }
        }
    });
}

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
overload.foo = function(test = 11, str = ''){
    console.log('multipart',test,str);
}
overload.foo = function(hello = '', str1, str2){
    console.log('Any arguments',hello, str1, str2);
}

overload.foo("Hello");
overload.foo(10);
overload.foo({thisis:"object"});
overload.foo(100,'World');
overload.foo('Hello','World','Friends');