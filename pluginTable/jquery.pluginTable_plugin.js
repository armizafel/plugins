(function (a) {
    $.fn.extend({
        pluginTable: function (params) {
            return this.each(function () {
                if (typeof params.callAdd !== 'undefined') {
                    params.isAdd = true;
                }
                if (typeof params.callEdit !== 'undefined') {
                    params.isEdit = true;
                }
                if (typeof params.callDelete !== 'undefined') {
                    params.isDelete = true;
                }
                var options = {
                    isEdit: false,
                    isAdd: false,
                    isDelete: false,
                    callEdit: null,
                    callAdd: null,
                    callDelete: null
                }
                $.extend(options, params);
                //table object
                var objThis = $(this);
                var objTr = $(objThis.find("tr")[0]).clone();
                objTr.removeAttr("class");
                //var objTr = $("<tr><td></td><td></td><td></td></tr>");
                var objPanelAdd = $("<div class='pgTable_panel' style='display:none;'>" +
            			"<img src='done.png' class='pbTable_btnAdd' border='5'/>" +
            		"</div>");
                var objPanelEditDel = $("<div class='pgTable_panel' style='display:none;'>" +
            			"<img src='done.png' class='pbTable_btnEdit' title='Editar'/>" +
            			"<img src='delete.png' class='pbTable_btnDelete' title='Eliminar'/>" +
            		"</div>");
                //agrega a todas las TD un DIV para poder efectos de animacion
                objThis.find("td").each(function () {
                    $(this).html("<div class='pgTable_value'>" + $(this).text() + "</div>");
                })

                //obtener los nombres de las columnas
                var arrNameColumns = new Array();
                var isColumn = true;
                $.each(objTr.children("td"), function (index, item) {
                    try {
                        arrNameColumns[index] = $(item).attr("id").split("-")[1];
                    }
                    catch (ex) {
                        isColumn = false;
                    }
                })

                //funcion que hace el proceso de cambio de vista en las tr que se dan click cuando esta habilitada la opcion de editar o eliminar
                var fnViewEdit = function () {
                    if (!$(this).hasClass("pgTable_trTmp")) {//bandera para validar que no se ejecute esta funcion cuando venga un click de sus children
                        if (!$(this).hasClass("pgTable_trActive")) {
                            var objTRActive = objThis.find("tr.pgTable_trActive");
                            objTRActive.children("td").find("div.pgTable_inputTxt").remove();
                            objTRActive.children("td").find("div.pgTable_value").show();
                            objTRActive.removeClass("pgTable_trActive");
                            objThis.find(".pgTable_panel").hide().css("right", "-100px");
                            $(this).find(".pgTable_panel").show().animate({ "right": "-8px" });

                            $(this).addClass("pgTable_trActive");
                            //script para que hace el cambio de text a input cuando la opcion edit esta habilitada
                            if (!$(this).hasClass("pgTable_trAdd")) {

                                if (options.isEdit) {
                                    $(this).find("td").each(function (index, item) {
                                        $(item).find("div.pgTable_value").hide();
                                        $(item).prepend("<div class='pgTable_inputTxt'><input type='text' value='" + $(item).find("div.pgTable_value").text() + "'/></div>")
                                    });
                                }
                            }
                        }
                    } else {
                        $(this).removeClass("pgTable_trTmp");
                    }
                }
                var fnCallEdit = function () {
                    var arrInputs = new Array();

                    var objTrThis = $(this).parent().parent().parent();
                    arrInputs["id"] = String(objTrThis.attr("id")).split("-")[1];
                    $.each(objTrThis.children("td"), function (index, item) {
                        if (!isColumn) {
                            arrInputs["column" + index] = $(item).find("div.pgTable_inputTxt input[type=text]").val();
                        } else {
                            arrInputs[arrNameColumns[index]] = $(item).find("div.pgTable_inputTxt input[type=text]").val();
                        }
                    })
                    var valReturn = options.callEdit(arrInputs);
                    if (valReturn) {
                        objTrThis.children("td").each(function (index, item) {
                            var valueInput = $(item).find("div.pgTable_inputTxt input[type=text]").val();
                            $(item).find("div.pgTable_value").text(valueInput);
                        })

                        objTrThis.children("td").find("div.pgTable_inputTxt").remove();
                        objTrThis.children("td").find("div.pgTable_value").show();
                        objTrThis.removeClass("pgTable_trActive");
                        objThis.find(".pgTable_panel").hide();
                        objTrThis.addClass("pgTable_trTmp");

                    }
                }
                var fnCallDelete = function () {
                    var arrInputs = new Array();
                    var objTrThis = $(this).parent().parent().parent();
                    arrInputs["id"] = String(objTrThis.attr("id")).split("-")[1];
                    $.each(objTrThis.children("td"), function (index, item) {
                        if (options.isEdit) {
                            if (!isColumn) {
                                arrInputs["column" + index] = $(item).find("div.pgTable_inputTxt input[type=text]").val();
                            } else {
                                arrInputs[arrNameColumns[index]] = $(item).find("div.pgTable_inputTxt input[type=text]").val();
                            }
                        } else {
                            if (!isColumn) {
                                arrInputs["column" + index] = $(item).find("div.pgTable_value").text();
                            } else {
                                arrInputs[arrNameColumns[index]] = $(item).find("div.pgTable_value").text();
                            }
                        }
                    })
                    var valReturn = options.callDelete(arrInputs);
                    if (valReturn) {
                        objTrThis.find("td > div").slideUp(500, function () {
                            //objTrThis.remove();
                            if (!objTrThis.find("td > div").is(":visible")) {
                                objTrThis.remove();
                            }
                        })
                    }
                }
                if (options.isEdit || options.isDelete) {
                    if (!options.isEdit) {
                        objPanelEditDel.find(".pbTable_btnEdit").remove();
                    }
                    if (!options.isDelete) {
                        objPanelEditDel.find(".pbTable_btnDelete").remove();
                    }
                    objThis.find("tr:not(.pgTable_trAdd) td:last-child").append(objPanelEditDel);
                    objThis.find("tr div.pgTable_panel .pbTable_btnEdit").click(fnCallEdit);
                    objThis.find("tr div.pgTable_panel .pbTable_btnDelete").click(fnCallDelete);
                }

                if (options.isAdd) {

                    var objTrAdd = objTr.clone();
                    objTrAdd.addClass("pgTable_trAdd");
                    objTrAdd.children("td").html("<div><input type='text' class='pgTable_inputTxt'/></div>");
                    objTrAdd.children("td:last-child").append(objPanelAdd);
                    //objThis.prepend($(objTrAdd));                    
                    $(objTrAdd).insertAfter(objThis.find("tr.thead"));
                    //Evento click para cuando se agrea una nueva fila
                    $(objTrAdd).find(".pbTable_btnAdd").click(function (e) {
                        var arrInputs = new Array();
                        $.each($(objTrAdd).find("td"), function (index, item) {
                            if (!isColumn) {
                                arrInputs["column" + index] = $(item).find("input[type=text]").val();
                            } else {
                                arrInputs[arrNameColumns[index]] = $(item).find("input[type=text]").val();
                            }
                        })

                        var valReturn = options.callAdd(arrInputs);
                        if (valReturn != null && valReturn != false) {
                            var newTrHtml = $("<tr id='pgTable_trId-" + valReturn + "'></tr>");
                            $.each(objTrAdd.find("td"), function (index, item) {
                                newTrHtml.append("<td><div class='pgTable_value'>" + $(item).find("input[type=text]").val() + "</div></td>");
                            })
                            newTrHtml.find("td > div").hide();
                            objTrAdd.find("input[type=text]").val("");
                            if (options.isEdit || options.isDelete) {
                                newTrHtml.click(fnViewEdit);
                                newTrHtml.find("td:last-child").append(objPanelEditDel.clone());
                                //agrega las funciones para que se puedan ejecutar en los nuevos objetos creados                                
                                newTrHtml.find("div.pgTable_panel .pbTable_btnEdit").click(fnCallEdit);
                                newTrHtml.find("div.pgTable_panel .pbTable_btnDelete").click(fnCallDelete);
                            }
                            objThis.append(newTrHtml);
                            newTrHtml.find("td > div").slideDown();


                        }
                    })

                }
                //agrego la funcion a todos los TR para cuando se les de click 
                objThis.find("tr:not(.thead)").click(fnViewEdit);
            });
        }
    });
    $.arrayToJSON = function (array) {
        var text = "{";
        for (key in array) {
            text += "\"" + key + "\" : \"" + array[key] + "\",";
        }
        text = text.substring(0, text.length - 1);
        text += "}";
        return JSON.parse(text);
    }
})(jQuery);