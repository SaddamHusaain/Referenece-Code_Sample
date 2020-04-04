var LabelId = '';
//var isEdit = 'N';
var tableRow = '';
var tablename = '';
var updatedTemplateName = '';
function DeleteTemplate(object, SurveyTemplateId, RowIndex, TableName) {

    var ErrorMessage = '';
    if (!IsWritePermission()) return false;
    if ($('#' + TableName + ' tr:eq(' + (RowIndex + 1) + ') td').length == 1)
        RowIndex = RowIndex + 1;

    var _NewImage = $('#' + TableName + ' tr:eq(' + (RowIndex + 1) + ') td:eq(0)').html();

    if (_NewImage.indexOf("deleteIcon.gif") >= 0) {
        ErrorMessage = "Are you sure you want to delete this Template?";
        RequestUrl = "../Ajax/AjaxServer.aspx?Page=Clients&TabName=SurveyTemplates&Id=" + SurveyTemplateId + "&Action=DeleteChildRecord&Active=Y";
    }
    else {
        ErrorMessage = "Are you sure you want to Rollback delete of this Survey Template ?"
        RequestUrl = "../Ajax/AjaxServer.aspx?Page=Clients&TabName=SurveyTemplates&Id=" + SurveyTemplateId + "&Action=DeleteChildRecord&Active=N";
    }
    var stamp = new Date();
    RequestUrl += "&stamp=" + stamp.getTime();
    if (confirm(ErrorMessage)) {
        _TableName = TableName;
        _Action = "Delete";
        _CurrentRow = RowIndex;
        $.post(RequestUrl, DeleteTemplateRecord, 'xml');
    }

}

function EditTemplate(SurveyTemplateId) {

    location.href = 'SurveyTemplateDetail.aspx?SurveyTemplateId=' + SurveyTemplateId;
}

function DeleteTemplateRecord(xml) {
    if ($(xml).find("Result").length < 1) {
        showErrorMessage("An error has occurred.");
        return;
    }
    if ($(xml).find("Result").text() == "True") {

        var _NewImage = $('#' + _TableName + ' tr:eq(' + (_CurrentRow + 1) + ') td:eq(0)').html();

        if (_NewImage.indexOf("deleteIcon.gif") >= 0) {
            _NewImage = _NewImage.replace("deleteIcon.gif", "True.gif");
            _NewImage = _NewImage.replace("Delete", '"Rollback Delete"');
        }
        else {
            _NewImage = _NewImage.replace("True.gif", "deleteIcon.gif");
            _NewImage = _NewImage.replace("Rollback Delete", "Delete");
        }

        $('#' + _TableName + ' tr:eq(' + (_CurrentRow + 1) + ') td:eq(0)').html(_NewImage);

    }
    else {
        // In Case Error Occurred
    }

}

function ShowModal() {
    $("#TextBoxSurveyTemplateName").val("");
    $('#DivSurveyTemplate').modal('show');
}
function EditSurveyTemplate(SurveyTemplateId, RowIndex, GridName) {

    tableRow = RowIndex;
    tablename = GridName;
    $('#TextBoxSurveyTemplateName').val($.trim(document.getElementById(GridName).rows[RowIndex + 1].cells[1].textContent));
    $('#ButtonSurveyTemplate').text("Update Template");
    $('#TextSurveyTemplateId').val(SurveyTemplateId);
    $('#DivSurveyTemplate').modal('show');
}

function CreateSurveyTemplate(Action) {
    updatedTemplateName = $('#TextBoxSurveyTemplateName').val();
    if (!ValidateTreatmentPlanTemplate()) return;
    XML = new String("<MainDataSet xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"><SurveyTemplates>");
    XML += "<SurveyTemplateId>" + $('#TextSurveyTemplateId').val() + "</SurveyTemplateId><SurveyTemplateName>" + $('#TextBoxSurveyTemplateName').val() + "</SurveyTemplateName>";
    XML += "<CompanyId>" + $('#TextCompanyId').val() + "</CompanyId>";
    XML += "<Active>Y</Active>";
    XML += "</SurveyTemplates></MainDataSet>";

    RequestUrl = "../Ajax/AjaxServer.aspx?Page=Clients&Action=SaveClientTab";
    RequestUrl += "&TabName=SurveyTemplates&Active=Y";
    var stamp = new Date();
    RequestUrl += "&stamp=" + stamp.getTime();

    if ($('#TextSurveyTemplateId').val() > 0) {
        $.post(RequestUrl, { XML: XML }, UpdateSurveyTemplateResponse);
    }
    else {
        $.post(RequestUrl, { XML: XML }, CreateSurveyTemplateResponse);
    }

}

function CreateSurveyTemplateResponse(data) {

    var xml = data;
    if ($(xml).find("Result").text() == "True") {
        ("savedMessage", "Survey Template created sucessfully.");
        location.href = 'SurveyTemplateDetail.aspx?SurveyTemplateId=' + $(xml).find("Key").text();
        $('#DivSurveyTemplate').modal('hide');
    }
    else {
        showErrorMessage($(xml).find("Message").text());
    }
}


function UpdateSurveyTemplateResponse(data) {

    var xml = data;
    if ($(xml).find("Result").text() == "True") {

        location.href = "ClientSurveyTemplates.aspx";

        localStorage.setItem("savedMessage", "Survey Template updated sucessfully.");
    }
    else {
        showErrorMessage($(xml).find("Message").text());
    }
}

function ValidateTreatmentPlanTemplate() {
    if (!IsWritePermissionWithoutReset()) return false;
    if (document.getElementById('TextBoxSurveyTemplateName').value == "") {
        showErrorMessage("Please enter template name.");
        document.getElementById('TextBoxSurveyTemplateName').focus();
        return false;
    }
    return true;
}



function ShowTemplateDetails(SurveyTemplateId) {
    _SurveyTemplateId = SurveyTemplateId;
    if (_SurveyTemplateId > 0) {
        RequestUrl = "../Ajax/AjaxRequestController.aspx?Page=SurveyTemplates&Action=GetSelectedTemplate";
        RequestUrl += "&SurveyTemplateId=" + _SurveyTemplateId;
        RequestUrl += "&stamp=" + $.now();
        $.post(RequestUrl, ShowSelectedTempalte, 'xml');
    }
}

function ShowSelectedTempalte(XML) {
    //isEdit = 'Y';

    if ($(XML).find("SurveyTemplateFields").length > 0) {
        $(XML).find('SurveyTemplateFields').each(function () {
                      var data = { count: 1, datatype: 0, showtime: 'Y', required: 'N', columnName: '', globalCodeName: '', reqclass: '', hiddenclass: '', tempid: -1, hideControl: '' };
            var codename = $(this).find('CodeName').text();
            var req = $(this).find('Required').text();
            data.datatype = $(this).find('codenumber').text();
            data.columnName = $(this).find('ColumnName').text();
            data.tempid = $(this).find('SurveyTemplateFieldId').text();
            data.required = req;

            data.hideControl = $(this).find('RecordDeleted').text() == "Y"? "hidden": "";
            if (req == 'Y')
                data.reqclass = 'req_feild';
            if (codename == 'Varchar') {
                $("#form-design-area .TextboxContainer").each(function () {
                    data.count = data.count + 1;
                });
                $("#form-field-Varchar-template").tmpl(data).appendTo("#form-design-area");
                $("#FormControl-Varchar").text('Text Box (' + data.count + '/20)');
            }
            if (codename == 'Text') {
                $("#form-design-area .TextareaContainer").each(function () {
                    data.count = data.count + 1;
                });
                $("#form-field-Text-template").tmpl(data).appendTo("#form-design-area");
                $("#FormControl-Text").text('Text Area (' + data.count + '/20)');
            }
            if (codename == 'Integer') {
                $("#form-design-area .IntegerContainer").each(function () {
                    data.count = data.count + 1;
                });
                $("#form-field-Integer-template").tmpl(data).appendTo("#form-design-area");
                $("#FormControl-Integer").text('Integer (' + data.count + '/20)');
            }
            if (codename == 'Date') {
                $("#form-design-area .DatetimeContainer").each(function () {
                    data.count = data.count + 1;
                });

                if ($(this).find('ShowTime').text() == 'N')
                    data.hiddenclass = 'hidden';
                data.showtime = $(this).find('ShowTime').text();
                $("#form-field-Datetime-template").tmpl(data).appendTo("#form-design-area");
                $("#FormControl-Date").text('Date Time (' + data.count + '/20)');
            }
            if (codename == 'Money') {
                $("#form-design-area .MoneyContainer").each(function () {
                    data.count = data.count + 1;
                });
                $("#form-field-Money-template").tmpl(data).appendTo("#form-design-area");
                $("#FormControl-Money").text('Money / Decimal (' + data.count + '/20)');
            }
            if (codename == 'GlobalCode') {
                $("#form-design-area .GlobalCodeContainer").each(function () {
                    data.count = data.count + 1;
                });
                data.globalCodeName = $(this).find('GlobalCodeCategory').text();
                $("#form-field-GlobalCode-template").tmpl(data).appendTo("#form-design-area");
                $("#FormControl-GlobalCode").text('Global Code (' + data.count + '/20)');
            }
            if (codename == 'HorizontalLine') {
                $("#form-design-area .LineBreakContainer").each(function () {
                    data.count = data.count + 1;
                });
                $("#form-field-LineBreak-template").tmpl(data).appendTo("#form-design-area");
                $("#FormControl-HorizontalLine").text('Horizontal Line (' + data.count + '/20)');
            }
            if (codename == 'StraightText') {
                $("#form-design-area .StraightTextContainer").each(function () {
                    data.count = data.count + 1;
                });
                $("#form-field-StraightText-template").tmpl(data).appendTo("#form-design-area");
                $("#FormControl-StraightText").text('Straight Text (' + data.count + '/20)');
            }
            if (codename == 'Headers') {
                $("#form-design-area .HeadersContainer").each(function () {
                    data.count = data.count + 1;
                });
                data.globalCodeName = $(this).find('GlobalCodeCategory').text();
                $("#form-field-Headers-template").tmpl(data).appendTo("#form-design-area");
                $("#FormControl-Headers").text('Headers (' + data.count + '/20)');
            }
        });
    }
}
//////*******************  Survey Template making Functions ***************************////////////////////////////


$(document).ready(function () {
    $("#FormControlTable td,#FormLayoutControlTable td").draggable({
        revert: "invalid",
        appendTo: 'body',
        helper: "clone",
        cursor: "move",
        scroll: true,
        cursorAt: { left: 5, top: 5 },
        start: function (event, ui) {
            if (!$.browser.chrome) ui.position.top -= $(window).scrollTop();
        },
        drag: function (event, ui) {
            if (!$.browser.chrome) ui.position.top -= $(window).scrollTop();
        }

    });
    $("#form-design-area").droppable({
        opacity: 2,
        hoverClass: 'drag-hover',
        scroll: true,
        drop: function (event, ui) {
            var data = { count: 1, datatype: 0, required: 'N', showtime: 'Y', columnName: '', globalCodeName: '', reqclass: '', hiddenclass: '', tempid: -1 };
            var selectedcontrol = ui.draggable.find("a").attr("data-type");
            data.datatype = ui.draggable.find("a").attr("code-value");
            if (selectedcontrol == 'Varchar') {
                $("#form-design-area .TextboxContainer").each(function () {
                    data.count = data.count + 1;
                });
                data.columnName = 'Input Text';
                if (data.count <= 20) {
                    $("#form-field-Varchar-template").tmpl(data).appendTo("#form-design-area");
                    $("#FormControl-Varchar").text('Text Box (' + data.count + '/20)');
                } else if (data.count > 20)
                    errorMessage();
            }
            else if (selectedcontrol == 'Text') {
                $("#form-design-area .TextareaContainer").each(function () {
                    data.count = data.count + 1;
                });
                data.columnName = 'Text Area';
                if (data.count <= 20) {
                    $("#form-field-Text-template").tmpl(data).appendTo("#form-design-area");
                    $("#FormControl-Text").text('Text Area (' + data.count + '/20)');
                } else if (data.count > 20)
                    errorMessage();
            }
            else if (selectedcontrol == 'Money') {
                $("#form-design-area .MoneyContainer").each(function () {
                    data.count = data.count + 1;
                });
                data.columnName = 'Money';
                if (data.count <= 20) {
                    $("#form-field-Money-template").tmpl(data).appendTo("#form-design-area");
                    $("#FormControl-Money").text('Money / Decimal (' + data.count + '/20)');
                } else if (data.count > 20)
                    errorMessage();
            }
            else if (selectedcontrol == 'Date') {
                $("#form-design-area .DatetimeContainer").each(function () {
                    data.count = data.count + 1;
                });
                data.columnName = 'Date Time';
                if (data.count <= 20) {
                    $("#form-field-Datetime-template").tmpl(data).appendTo("#form-design-area");
                    $("#FormControl-Date").text('Date Time (' + data.count + '/20)');
                } else if (data.count > 20)
                    errorMessage();
            }
            else if (selectedcontrol == 'Integer') {
                $("#form-design-area .IntegerContainer").each(function () {
                    data.count = data.count + 1;
                });
                data.columnName = 'Integer';
                if (data.count <= 20) {
                    $("#form-field-Integer-template").tmpl(data).appendTo("#form-design-area");
                    $("#FormControl-Integer").text('Integer (' + data.count + '/20)');
                } else if (data.count > 20)
                    errorMessage();
            }
            else if (selectedcontrol == 'GlobalCode') {
                $("#form-design-area .GlobalCodeContainer").each(function () {
                    data.count = data.count + 1;
                });
                data.columnName = 'Global Code';
                if (data.count <= 20) {
                    $("#form-field-GlobalCode-template").tmpl(data).appendTo("#form-design-area");
                    $("#FormControl-GlobalCode").text('Global Code (' + data.count + '/20)');
                } else if (data.count > 20)
                    errorMessage();
            }
            else if (selectedcontrol == 'HorizontalLine') {
                $("#form-design-area .LineBreakContainer").each(function () {
                    data.count = data.count + 1;
                });
                data.columnName = 'Horizontal Line';
                if (data.count <= 20) {
                    $("#form-field-LineBreak-template").tmpl(data).appendTo("#form-design-area");
                    $("#FormControl-HorizontalLine").text('Horizontal Line (' + data.count + '/20)');
                } else if (data.count > 20)
                    errorMessage();
            }
            else if (selectedcontrol == 'StraightText') {
                $("#form-design-area .StraightTextContainer").each(function () {
                    data.count = data.count + 1;
                });
                data.columnName = 'Straight Text';
                if (data.count <= 20) {
                    $("#form-field-StraightText-template").tmpl(data).appendTo("#form-design-area");
                    $("#FormControl-StraightText").text('Straight Text (' + data.count + '/20)');
                } else if (data.count > 20)
                    errorMessage();
            }
            else if (selectedcontrol == 'Headers') {
                $("#form-design-area .HeadersContainer").each(function () {
                    data.count = data.count + 1;
                });
                data.columnName = 'Headers';
                if (data.count <= 20) {
                    $("#form-field-Headers-template").tmpl(data).appendTo("#form-design-area");
                    $("#FormControl-Headers").text('Headers (' + data.count + '/20)');
                } else if (data.count > 20)
                    errorMessage();
            }
        }
    }).sortable({ scroll: true }).disableSelection();

    $(window).scroll(function () {
        $("#ControlsTab").css({ "margin-top": ($(window).scrollTop()) + "px" });
        $("#properties-container").css({ "margin-top": ($(window).scrollTop()) + "px" });
    });

});
//sortable().disableSelection()".controlContainer"placeholder:'placeholder-highlight'

function errorMessage() {
    showErrorMessage("Can`t drag more than twenty controls of same Category");
}

function deleteControl(tempid) {

    var clontroltoremove = $(tempid).attr('id')
    var SurveyTemplateFieldId = $(tempid).attr('tempid');

    if (SurveyTemplateFieldId > 0) {
        if (confirm('Are you sure to delete this control. All data related to this control will be lost!')) {
            RequestUrl = "../Ajax/AjaxRequestController.aspx?Page=SurveyTemplates&Action=DeleteSurveyField&SurveyTemplateFieldId=" + SurveyTemplateFieldId;
            RequestUrl += "&stamp=" + $.now();
            $.post(RequestUrl, deleteControlResponse, 'xml');
        }
        HideControl(clontroltoremove);
    }
    else {
        RemoveControl(clontroltoremove);
    }
}

function deleteControlResponse(xml) {

    if ($(xml).find("Result").text() == "True") {
        showRecordSaved("Survey Fields have been removed successfully.", true);
    }
    else
        showErrorMessage("Survey Fields not removed");
}

function HideControl(clontroltoremove) {
    if (clontroltoremove.search("DateTime") != -1)
        $('#' + clontroltoremove).parent().parent().addClass('hidden');
        else
    $('#' + clontroltoremove).parent('div').addClass('hidden');
}

function RemoveControl(clontroltoremove) {

    var count = 0;
    var clontroltoremoveclass = $('#' + clontroltoremove).parents('div').attr('class');


    if (clontroltoremoveclass.search('selectedControl') != -1)
        CloseProperties();

    if (clontroltoremoveclass.search("TextareaContainer") >= 0) {
        $('#' + clontroltoremove).parent('div').remove();
        $("#form-design-area .TextareaContainer").each(function () {
            count = count + 1;
        });
        if (count > 0)
            $("#FormControl-Text").text('Text Area (' + count + '/20)');
        else
            $("#FormControl-Text").text('Text Area');
    }
    else if (clontroltoremoveclass.search("TextboxContainer") >= 0) {
        $('#' + clontroltoremove).parent('div').remove();
        $("#form-design-area .TextboxContainer").each(function () {
            count = count + 1;
        });
        if (count > 0)
            $("#FormControl-Varchar").text('Text Box (' + count + '/20)');
        else
            $("#FormControl-Varchar").text('Text Box');
    }
    else if (clontroltoremoveclass.search("MoneyContainer") >= 0) {
        $('#' + clontroltoremove).parent('div').remove();
        $("#form-design-area .MoneyContainer").each(function () {
            count = count + 1;
        });
        if (count > 0)
            $("#FormControl-Money").text('Money / Decimal (' + count + '/20)');
        else
            $("#FormControl-Money").text('Money / Decimal');
    }
    else if (clontroltoremoveclass.search("DatetimeContainer") >= 0) {
        $('#' + clontroltoremove).parent().parent().remove();
        $("#form-design-area .DatetimeContainer").each(function () {
            count = count + 1;
        });
        if (count > 0)
            $("#FormControl-Date").text('Date Time (' + count + '/20)');
        else
            $("#FormControl-Date").text('Date Time');
    }
    else if (clontroltoremoveclass.search("GlobalCodeContainer") >= 0) {
        $('#' + clontroltoremove).parent('div').remove();
        $("#form-design-area .GlobalCodeContainer").each(function () {
            count = count + 1;
        });
        if (count > 0)
            $("#FormControl-GlobalCode").text('Global Code (' + count + '/20)');
        else
            $("#FormControl-GlobalCode").text('Global Code');
    }
    else if (clontroltoremoveclass.search("IntegerContainer") >= 0) {
        $('#' + clontroltoremove).parent('div').remove();
        $("#form-design-area .IntegerContainer").each(function () {
            count = count + 1;
        });
        if (count > 0)
            $("#FormControl-Integer").text('Integer (' + count + '/20)');
        else
            $("#FormControl-Integer").text('Integer');
    }
    else if (clontroltoremoveclass.search("LineBreakContainer") >= 0) {
        $('#' + clontroltoremove).parent('div').remove();
        $("#form-design-area .LineBreakContainer").each(function () {
            count = count + 1;
        });
        if (count > 0)
            $("#FormControl-HorizontalLine").text('Horizontal Line (' + count + '/20)');
        else
            $("#FormControl-HorizontalLine").text('Horizontal Line');
    }
    else if (clontroltoremoveclass.search("StraightTextContainer") >= 0) {
        $('#' + clontroltoremove).parent('div').remove();
        $("#form-design-area .StraightTextContainer").each(function () {
            count = count + 1;
        });
        if (count > 0)
            $("#FormControl-StraightText").text('Straight Text (' + count + '/20)');
        else
            $("#FormControl-StraightText").text('Straight Text');
    }
    else if (clontroltoremoveclass.search("HeadersContainer") >= 0) {
        $('#' + clontroltoremove).parent('div').remove();
        $("#form-design-area .HeadersContainer").each(function () {
            count = count + 1;
        });
        if (count > 0)
            $("#FormControl-Headers").text('Headers(' + count + '/20)');
        else
            $("#FormControl-Headers").text('Headers');
    }
}


function editProperties(labelId) {

    if (LabelId != '')
        $("#" + LabelId).parent("div").removeClass('selectedControl');
    LabelId = labelId;
    // $("#" + LabelId).parent("div").css("border", "border 1px #eee")
    var IsGlobalCode = 0;
    var IsStraightText = 0;
    var IsHeader = 0;
    $("#properties-container").removeClass("Hidden");
    $("#" + LabelId).parent("div").addClass('selectedControl');
    ClearControlsData();
    IsHeader = LabelId.search("Headers");
    IsStraightText = LabelId.search("StraightText");
    $('#LabelControlType').text($("#" + LabelId).next('input,textarea,label').attr('name'));

    if (IsHeader > 0 || IsStraightText > 0) {
        $(".layoutElements").css("display", "none");
        $("#controlTitle").css("display", "none");
        $("#controlTitleLayouts").removeClass("Hidden");
        $("#controlTitleLayouts").val($("#" + LabelId).text());

    }
    else {
        $(".layoutElements").css("display", "block");
        $("#controlTitle").css("display", "block");
        $("#controlTitleLayouts").addClass("Hidden");

    }
    if (IsHeader > 0) {
        $('#LabelControlType').text($("#" + LabelId).next('label').attr('name'));
        $("#HeaderRow").removeClass("hidden");
        $('[id $=DropDownHeaderType]').val($("#" + LabelId).next('label').attr('GlobalCategory'));

    }
    else {
        $("#HeaderRow").addClass("Hidden");
    }

    IsGlobalCode = LabelId.search("GlobalCode");
    if (IsGlobalCode > 0) {
        $('#LabelControlType').text($("#" + LabelId).next('select').attr('name'));
        $("#GlobalCodeRow").removeClass("hidden");
        $('[id $=DropDownGlobalCode]').val($("#" + LabelId).next('select').attr('GlobalCategory'));
    }
    else
        $("#GlobalCodeRow").addClass("hidden");
    $("#controlTitle").val($("#" + LabelId).text());

    if (LabelId.search('Date') > 0) {
        $("#ShowTimeRow").removeClass("hidden");
        $("#" + LabelId).next().children('input:first-of-type').each(function () {
            $('#LabelControlType').text($(this).attr('name'));
            if ($(this).attr('showtime') == 'Y')
                $('#CheckBoxShowTime').prop('checked', true);
            else
                $('#CheckBoxShowTime').prop('checked', false);
        });
        $("#" + LabelId).parent("div").children().each(function () {
            $(this).children("input").each(function () {
                if ($(this).hasClass("req_feild"))
                    $("#CheckBoxRequired").prop('checked', true);
            });
        });
    }
    else {
        $("#ShowTimeRow").addClass("hidden");
        if ($("#" + LabelId).next("input,select,textarea").hasClass("req_feild")) {
            $("#CheckBoxRequired").prop('checked', true)
        }
    }
}






function ClearControlsData() {
    $("#controlTitle").val("");
    $("#controlTitleLayouts").val("");
    $("#CheckBoxRequired").prop('checked', false)
}

function SaveProperties() {

    if ($("#controlTitle").val() != '')
        $("#" + LabelId).text($("#controlTitle").val());
    if ($("#CheckBoxRequired").prop("checked") == true) {
        if (LabelId.search('DateTime') > 0) {
            $("#" + LabelId).parent("div").children().each(function () {
                $(this).children("input").each(function () {
                    $(this).addClass("req_feild");
                    $(this).attr('isrequired', 'Y');
                });
            });
        }
        else {
            $("#" + LabelId).nextAll("input,select,textarea").addClass("req_feild");
            $("#" + LabelId).nextAll("input,select,textarea").attr('isrequired', 'Y');
        }
    }
    else {
        if (LabelId.search('DateTime') > 0) {
            $("#" + LabelId).parent("div").children().each(function () {
                $(this).children("input").each(function () {
                    $(this).removeClass("req_feild");
                    $(this).attr('isrequired', 'N');
                });
            });
        }
        else {
            $("#" + LabelId).nextAll("input,select,textarea").removeClass("req_feild");
            $("#" + LabelId).nextAll("input,select,textarea").attr('isrequired', 'N');
        }
    }
    if (LabelId.search('Date') > 0 && $("#CheckBoxShowTime").prop("checked") == true) {
        $("#" + LabelId).parent("div").children().each(function () {
            $(this).children("input").each(function () {
                if ($(this).attr('name') == 'DateTime') {
                    $(this).attr('showtime', 'Y');
                } else if ($(this).attr('name') == 'DateTimetime') {
                    $(this).removeClass('hidden');
                    $(this).prev().removeClass('hidden');
                }
            });
        });
    }
    else if (LabelId.search('Date') > 0 && $("#CheckBoxShowTime").prop("checked") == false) {
        $("#" + LabelId).parent("div").children().each(function () {
            $(this).children("input").each(function () {
                if ($(this).attr('name') == 'DateTime') {
                    $(this).attr('showtime', 'N');
                } else if ($(this).attr('name') == 'DateTimetime') {
                    $(this).addClass('hidden');
                    $(this).prev().addClass('hidden');

                }
            });
        });
    }

    if (!$("#GlobalCodeRow").hasClass("hidden")) {
        var GlobalCategory = $('[id $=DropDownGlobalCode]').val();
        if (GlobalCategory != null) {
            $("#" + LabelId).next("select").attr("GlobalCategory", GlobalCategory);
        }
    }
    if (!$("#HeaderRow").hasClass("Hidden")) {
        var HeaderType = $('[id $=DropDownHeaderType]').val();
        if (HeaderType != null) {
            $("#" + LabelId).next("label").attr("GlobalCategory", HeaderType);
        }

    }
    if (!$("#controlTitleLayouts").hasClass("Hidden") && $("#controlTitleLayouts").val() != ''){
        $("#" + LabelId).text($("#controlTitleLayouts").val())
    }
    CloseProperties();

}


function CloseProperties() {
    ClearControlsData();
    $("#" + LabelId).parent("div").removeClass('selectedControl');
    LabelId = '';
    $("#properties-container").addClass("Hidden");
}

function ClearAllControls() {
    location.href = "../Admin/ClientSurveyTemplates.aspx";
}

function SaveClientSuveysTemplate() {
    
    if ($('#form-design-area').children().text()) {
        XML = new String("<MainDataSet xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"><ClientSurveys>");
        var order = 0;
        $(".clientControl").each(function () {
            if (!$(this).parent().hasClass('hidden')) {
                var id = $(this).attr('id');
                order = order + 1;
                XML += '<Field>';
                if (id.search('Date') > 0) {
                    XML += '<ColumnName><![CDATA[' + $('#' + id).parent().parent().find('label:first-of-type').text() + ']]></ColumnName>';
                    XML += '<ShowTime>' + $('#' + id).attr('ShowTime') + '</ShowTime>';
                }
                else if ($("#" + id).attr("name") =="HorizontalLine") {
                    XML += '<Required>N</Required>';
                    XML += '<ColumnName>HorizontalLine</ColumnName>';
                }
   
                else
                    XML += '<ColumnName><![CDATA[' + $('#' + id).parent().find('label').text() + ']]></ColumnName>';
              
                XML += '<Order>' + order + '</Order>';
                XML += '<DataType>' + $('#' + id).attr('datatypecode') + '</DataType>';
                XML += '<Required>' + $('#' + id).attr('isrequired') + '</Required>';
                XML += '<SurveyTemplateFieldId>' + $('#' + id).attr('tempid') + '</SurveyTemplateFieldId>';
                if (id.search('GlobalCode') > 0 && $('#' + id).attr('globalcategory') != '') {
                    XML += '<GlobalCodeCategory>' + $('#' + id).attr('globalcategory') + '</GlobalCodeCategory>';
                }
                if (id.search('Headers') > 0 && $('#' + id).attr('globalcategory') != '') {
                    XML += '<GlobalCodeCategory>' + $('#' + id).attr('globalcategory') + '</GlobalCodeCategory>';

                }
               
                XML += '</Field>';
            }
        });
        XML += "</ClientSurveys></MainDataSet>";
        RequestUrl = "../Ajax/AjaxRequestController.aspx?Page=SurveyTemplates&Action=SaveSurveyFields&SurveyTemplateId=+" + GetURLParameter('SurveyTemplateId');
        RequestUrl += "&stamp=" + $.now();
        $.post(RequestUrl, { XML: XML }, SurveySaved, 'xml');
    }
    else
        showErrorMessage("Drag atleast one Control in form to save template");
}
function SurveySaved(xml) {

    if ($(xml).find("Result").text() == "True") {
        location.href = 'SurveyTemplateDetail.aspx?SurveyTemplateId=' + GetURLParameter('SurveyTemplateId');
        localStorage.setItem("savedMessage", "Survey Fields has been saved successfully.");
    
    }
    else
        showErrorMessage("Survey Fields Data not saved");
}