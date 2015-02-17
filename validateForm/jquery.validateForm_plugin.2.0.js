(function($){
    // **********************************
    // ***** Start: Private Members *****
    var pluginName = 'validateForm',
        pluginSuffix = '-pgVal-',
        tmpTooltip = "<a class='tooltips' href='javascript:;' onclick='$(this).remove();' tabindex='-1'><span></span></a>",
        nameClassError = "alert-danger",
        msgErrorEmptyElement = "El campo no puede estar vacio";
    
    var objValidation = {
        pgTextOnly : {
            regEx : /^[a-zA-Z ]+$/,
            msg : "No puede escribir numeros ni caracteres especiales"
        },
        pgText : {
            regEx : /^[a-zA-z-_?=)(\/%$#+-.;: ]+$/,
            msg : "No puede escribir numeros"
        },
        pgRFC : {
            regEx : /^[A-Z,Ñ,&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Z,0-9]?[A-Z,0-9]?[0-9,A-Z]+$/,
            msg : "El formato del RFC es incorrecto"
        },
        pgAlfa : {
            regEx : /^[0-9a-zA-z-_?=)(\/%$#+-.;: @&]+$/,
            msg : "No se pueden escribir caracteres especiales"
        },
        pgNumOnly : {
            regEx : /^[0-9]+$/,
            msg : "Solo puede escribir numeros enteros"
        },
        pgNum : {
            regEx : /^[0-9-_?=)(\/%$#+-.;: ]+$/,
            msg : "No se permiten letras"
        },
        pgDec : {
            regEx : /^\d+\.?\d{0,2}$/,
            msg : "Solo se permiten numeros y decimales"
        },
        pgEmail : {
            regEx : /[a-z0-9_\-]+(\.[_a-z0-9\-]+)*@([_a-z0-9\-]+\.)+([a-z]{2}|aero|asia|arpa|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|xxx)/,
            msg : "Formato de correo incorrecto"
        }
    }
    // ***** Fin: Private Members *****
    // ********************************
    
    // **********************************
    // ***** Start: Private Methods *****    
    var objectIndexOf = function(myArray, searchTerm, property) {
        for(var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchTerm) return i;
        }
        return -1;
    }
    var isExist = function($this,idElement){
        return ($this.data("elementsErrors").indexOf(idElement)!==-1);
    }
    var generateRandomKeys = function(size,onlyNum,isChar){
        if(typeof(onlyNum) ==='undefined') onlyNum = false;
        if(typeof(isChar) ==='undefined') isChar = false;
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        if(onlyNum) possible = "0123456789" ;
        if(isChar) possible +="@$%&/*+._-?#";
        
        for( var i=0; i < size; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    var generateIds = function(arrInputs){
        $.each(arrInputs,function(ix,it){
            if(!$(it).attr('id')) $(it).attr('id',pluginSuffix+generateRandomKeys(15));
        })
    }
    var showTooltip = function(it,msg){
        var objTT = $(tmpTooltip),
            elemPos = $(it).position(),
            elemWid = $(it).outerWidth();        
        objTT.children("span").text(msg);
        $(it).siblings(".tooltips").remove();
        $(it).parent().append(objTT);
        objTT.css({ "top": elemPos.top - 36, "left": (elemPos.left + elemWid / 2) - objTT.outerWidth() / 2});
    }
    var onInputChange = function(e){        
        var it = $(e.target),
            $this = $(this),
            value = it.val(),            
            idElement = it.attr("id"),
            title = it.attr("title"),
            argValid = "",
            bnValid = true;        
        if (value == "") {
            resetInput($this,it);
            return false;
        }
        
        $.each(it.attr('class').split(/\s+/),function(ix,it){
            argValid = it;
            return bnValid = validExpression(it,value);
        })
        
        if(!bnValid){
            methods.putError.apply($this,[it]);
            if(!title) title = validMessage(argValid);
            showTooltip(it,title);
        }else{ 
            resetInput($this,it);
        }
        if (!validLength(it)) {
            methods.putError.apply($this,[it]);
            showTooltip(it,"La cantidad de caracteres es incorrecta");                    
        } else {
            if(!isExist($this,idElement)){
                resetInput($this,it);
            }
        }
    }
    var resetInput = function(frmThis,input){
        $(input).removeClass(nameClassError);
        $(input).siblings(".tooltips").remove();
        var index = frmThis.data("elementsErrors").indexOf($(input).attr("id"));
        if (index != -1) {
            frmThis.data("elementsErrors").splice(index, 1);
        }        
    }
    var validExpression = function(name,valor){        
        if(typeof objValidation[name] === "object"){            
            return objValidation[name].regEx.test(valor);
        }
        return true;
    }
    var validMessage = function(name){
        return objValidation[name].msg;
    }
    var validLength = function(it){
        var valMin = 0;
        var valMax = 50000;
        var valMaxMin = false;
        if ($(it).is('[class*="pgMax-"]') ||$(it).is('[class*="pgMin-"]') ) {
            var clases = $(it).attr("class").split(" ");
            for (itemKey in clases) {
                if (clases[itemKey].indexOf("pgMax-") !== -1) valMax = clases[itemKey].split("-")[1];                    
                if (clases[itemKey].indexOf("pgMin-") !== -1) valMin = clases[itemKey].split("-")[1];                    
            }
            valMaxMin = true;
        }        
        if (valMaxMin) {              
            return !($(it).val().length > valMax || $(it).val().length < valMin);
        }
        return true;
    }
    // ***** Fin: Private Methods *****
    // ********************************

    // *********************************
    // ***** Start: Public Methods *****
    var methods = {
        init : function(options) {
            return this.each(function(index){                
                $this = $(this);
                generateIds($this.find("input, textarea"));
                var data = $this.data(pluginName);               
                if (!data){
                    var settings = {
                    };
                    if(options) { $.extend(true, settings, options); }

                    $this.data({
                        target : $this,
                        settings: settings,
                        elementsErrors: []
                    });
                } 
                $this.find("input[type=text]").change($.proxy(onInputChange,this));
            });
        },
        getFormErrors: function () {            
            return this.data("elementsErrors");
        },
        chkEmptyElements: function () {
            var valResp = true,
                $this = $(this);            
            $this.find("input[type=text]").each(function (index, item) {
                if ($(item).hasClass("pgReq")) {
                    if ($(item).val() === "") {
                        valResp = false;
                        showTooltip(item,msgErrorEmptyElement);
                        methods.putError.apply($this,[item]);
                    } else {                        
                        resetInput($this,item);
                    }
                }
            });
            return valResp;
        },
        putError: function (it) {
            var IdElement = $(it).attr("id");
            $(it).addClass(nameClassError)
            if(!isExist(this,IdElement)){
                this.data("elementsErrors").push(IdElement);
            }            
        },
        removeError: function (IdElement) {            
            resetInput($(this),$("#"+IdElement));
        },
        chkEmpty: function(){            
            if ($(this).val() === "") {
                showTooltip(this,msgErrorEmptyElement);
                $(this).addClass(nameClassError);
                return false;
            } else {                        
                $(this).removeClass(nameClassError);
                $(this).siblings(".tooltips").remove();
                return true;
            }            
        }
    };
    // ***** Fin: Public Methods *****
    // *******************************

    // *****************************
    // ***** Start: Supervisor *****
    $.fn[pluginName] = function (method) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || !method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' + method + ' does not exist in jQuery.' + pluginName );
        }
    };
    // ***** Fin: Supervisor *****
    // ***************************
})( jQuery );