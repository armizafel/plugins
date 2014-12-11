
(function (a) {
    var arrObjError = new Array();
    var objThis;
    $.fn.extend({
        validateForm: function () {
            return this.each(function () {

                objThis = $(this);
                // $.each(objThis.children("input[type=text]"), function (index, item) {
                /*
                pgText : solo texto s1n numeros ni caracteres especiales
                pgText2 : solo texto sin numeros pero si permite caracteres como -_?=)(/%$#+-*.;:
                pgAlfa : texto alfanumerico con caracteres como -_?=)(/%$#+-*.;:
                pgNum : soloNumeros sin espacios ni caracteres especiales
                pgNum2 : Solo numeros pero si permite espacios y caracteres como -_?=)(/%$#+-*.;:
                pgDec : solo numeros con dos decimales
                pgEmail : valida email
                */

                $(objThis).find("input[type=text]").change(function () {

                    var value = $(this).val();
                    var regEx = null;
                    var msg = "";
                    if ($(this).hasClass("pgText")) {
                        regEx = /^[a-zA-Z ]+$/;
                        msg = "No puede escribir numeros ni caracteres especiales";
                    } else if ($(this).hasClass("pgText2")) {
                        regEx = /^[a-zA-z-_?=)(\/%$#+-.;: ]+$/;
                        msg = "No puede escribir numeros";
                    } else if ($(this).hasClass("pgAlfa")) {
                        regEx = /^[0-9a-zA-z-_?=)(\/%$#+-.;: ]+$/;
                        msg = "No pueden escribir caracteres especiales";
                    } else if ($(this).hasClass("pgNum")) {
                        regEx = /^[0-9]+$/
                        msg = "Solo puede escribir numeros enteros";
                    } else if ($(this).hasClass("pgNum2")) {
                        regEx = /^[0-9-_?=)(\/%$#+-.;: ]+$/
                        msg = "No se permiten letras";
                    } else if ($(this).hasClass("pgDec")) {
                        var dec = $(item).val
                        regEx = /^\d+\.?\d{0,2}$/
                        msg = "Solo se permiten numeros y decimales";
                    } else if ($(this).hasClass("pgEmail")) {
                        regEx = /[a-z0-9_\-]+(\.[_a-z0-9\-]+)*@([_a-z0-9\-]+\.)+([a-z]{2}|aero|asia|arpa|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|xxx)/;
                    } else if ($(this).hasClass("pgRfc")) {
                        value = value.split("-").join("");
                        $(this).val(value);
                        regEx = /^(([a-z]|[A-Z]|[0-9]){3,4})([0-9]{6})(([a-z]|[A-Z]|[0-9]){3})$/; ;
                    }
                    if (!value.match(regEx)) {

                        $(this).addClass("pgValFormError");
                        if (arrObjError.indexOf($(this).attr("id")) == -1) {
                            arrObjError.push($(this).attr("id"));
                        }

                    } else {
                        $(this).removeClass("pgValFormError");
                        var index = arrObjError.indexOf($(this).attr("id"));
                        if (index != -1) {
                            arrObjError.splice(index, 1);
                        }
                    }
                });
            });
        }
    });
    jQuery.getFormErrors = function () {
        return arrObjError;
    };
    jQuery.chkEmptyElements = function () {
        $(objThis).find("input[type=text]").each(function (index, item) {
            if ($(item).hasClass("pgReq")) {
                if ($(item).val() === "") {
                    $(item).addClass("pgValFormError");
                    if (arrObjError.indexOf($(item).attr("id")) == -1) {
                        arrObjError.push($(item).attr("id"));
                    }
                } else {
                    $(item).removeClass("pgValFormError");
                    var index = arrObjError.indexOf($(item).attr("id"));
                    if (index != -1) {
                        arrObjError.splice(index, 1);
                    }
                }
            }
        });
    };
})(jQuery)
