(function (a) {
    $.fn.extend({
        autoComplete: function (options, onClickLi) {
            return this.each(function () {
                // debugger;
                var objHTML = null;
                /*Funcion para verificar el textchange*/
                $(this).bind("keyup", function (e) {
                    $(this).siblings(".pluginAutoComplete").remove();
                    /*var keyChar = String.fromCharCode(e.which);
                    if (!/[ABCDEFGHIJKLMNÑOPQ0123456789 ]/.test(keyChar.toUpperCase()) && e.which != 8) {
                        e.preventDefault();
                        alert("asda")
                        return false;
                    }*/
                    var valInput = $(this).val();
                    var arrFound = new Array();
                    if (valInput == "") {
                        $(this).siblings(".pluginAutoComplete").remove();
                        return false;
                    }
                    if (typeof options.source[0] === "object") {
                        if (options.value == "" || options.nameSearch == "") {
                            console.log("error en los parametros 'value' y 'nameSearch'");
                            return false;
                        }
                    }
                    $.each(options.source, function (index, item) {
                        if (options.nameSearch != "") {
                            item = item[options.nameSearch].toLowerCase();
                        }
                        if (item.indexOf(valInput.toLowerCase()) != -1) {
                            arrFound.push(index);
                        }
                    })


                    objHTML = $("<div class='pluginAutoComplete'></div>");
                    var liHTML = "";
                    var encontro = false;
                    for (var x = 0; x < arrFound.length; x++) {
                        encontro = true;
                        liHTML += "<li ><span class='acValue' style='display:none;'>" + options.source[arrFound[x]][options.value] + "</span><span class='acName'>" + options.source[arrFound[x]][options.nameSearch] + "</span></li>";
                    }
                    $(objHTML).html("<ul>" + liHTML + "</ul>");
                    $(objHTML).css({
                        "width": $(this).outerWidth() + "px",
                        "position": "absolute",
                        "display": "inline-block",
                        "left": $(this).position().left,
                        "top": $(this).position().top + $(this).outerHeight(),
                        "border": "solid #bbb 1px",
                        "overflow": "auto",
                        "display": "none",
                        "max-height": "250px"
                    })
                    $(this).siblings(".pluginAutoComplete").remove();
                    if (encontro) {
                        $(this).parent().append(objHTML);
                        $(objHTML).slideDown();
                    } else {
                        console.log("llego");
                        $(this).siblings(".pluginAutoComplete").remove();
                    }
                    var objLis = $(objHTML).find("li");

                    $(objLis).unbind("click");
                    $(objLis).bind("click", function () {
                        $(this).parent().parent().remove();
                        /*Funcion callback*/
                        onClickLi({ value: $(this).children(".acValue").text(), name: $(this).children(".acName").text() });
                    });
                })
                /*$(this).bind("change", function () {
                /* pendiente resolver este bug!!!! * /
                $(this).siblings(".pluginAutoComplete").remove();
                $(this).val("");
                })*/
                /* Funcion para verificar opciones de teclado, como flechas y enter*/
                $(this).bind("keydown", function (e) {
                    var key = e.which;
                    //alert(key)
                    var objLiActive = $(objHTML).children("ul").children("li.acLiActive");
                    if (key == 40) {
                        e.preventDefault();
                        if (objHTML != null) {
                            if ($(objLiActive).length > 0) {
                                $(objLiActive).removeClass("acLiActive").next().addClass("acLiActive");

                            } else {

                                $(objHTML).children("ul").children("li:first-child").addClass("acLiActive");
                            }
                            return false;
                        }
                    } else if (key == 38) {
                        e.preventDefault();
                        if (objHTML != null) {
                            if ($(objLiActive).length > 0) {
                                $(objLiActive).removeClass("acLiActive").prev().addClass("acLiActive");

                            } else {

                                $(objHTML).children("ul").children("li:last-child").addClass("acLiActive");
                            }
                            return false;
                        }
                    } else if (key == 13) {
                        if (objHTML != null) {
                            if ($(objLiActive).length > 0) {
                                $(objLiActive).click();
                            }
                        }
                    }
                });
            });
        }
    });
})(jQuery)