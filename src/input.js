
AC.Input = (function(){
    "use strict";

    var _Dialog;

    var _runValidation = function(condition, errorMsg){
        if (condition){
            return {status: true};
        }
        return {status: false, msg: errorMsg};
    };

    var _validators = {
        type: function(type, input){
            return _runValidation(typeof input === type, 'Expected a ' + type + ' type.');
        },

        min: function(minAllowed, input){
            if (typeof input === 'string'){
                return _runValidation(input.length >= minAllowed, 'Input length must be greater or equal than ' + minAllowed + ' characters.');
            }
            if (typeof input === 'number'){
                return _runValidation(Number(input) >= minAllowed, 'Input must be greater or equal than ' + minAllowed + '.');
            }
            return {status: false, msg: 'Wrong data type!'};
        },

        max: function(maxAllowed, input){
            if (typeof input === 'string'){
                return _runValidation(input.length <= maxAllowed, 'Input length must be less or equal than ' + maxAllowed + ' characters.');
            }
            if (typeof input === 'number'){
                return _runValidation(Number(input) <= maxAllowed, 'Input must be less or equal than ' + maxAllowed + '.');
            }
            return {status: false, msg: 'Wrong data type!'};
        }
    };

    return {
        validate: function(fieldSelector, rules){
            var field = $(fieldSelector),
                fieldValue = $.trim(field.val());
            for (var key in rules){
                var ruleValue = rules[key],
                    ruleFunc = _validators[key],
                    result = ruleFunc(ruleValue, fieldValue);
                _Dialog.alert(result.msg);
                return result.status;
            }
        },

        init: function(modules){
            _Dialog = modules.dialog;
        }
    };

})();
