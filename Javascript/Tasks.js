var _TableName = null;
_Action = new String();
var _TaskId = -1;
var _TableRowTask = null;
var _CurrentRow = -1;
var _AssignedStaff = -1;
var _AssignStaffText;
var _TaskStatus;
var _Pager = false;
CreateXmlHttp();

var indexElem;

function ModifyTaskDetails(TableName) {
    if (!IsWritePermissionWithoutReset()) return false;
    _TableName = TableName;

    if (!ValidateTaskDetails()) return false;

    if ($("#TextBoxTaskId").val() == "") $("#TextBoxTaskId").val("0");
    RequestUrl = "../Ajax/AjaxServer.aspx?Page=ClientTasks";

    if ($.trim($("#ButtonInsert").val()) == "Insert") {
        _Action = "Insert";
    }
    else {
        _Action = "Modify";
    }

    RequestUrl += "&Action=" + _Action;
    var stamp = new Date();
    RequestUrl += "&stamp=" + stamp.getTime();

    $.post(RequestUrl, {
        'TaskId': $("#TextBoxTaskId").val(),
        'ClientId': $("#TextBoxClientId").val(),
        'TaskType': $('#' + _Panel + "_DropDownListTaskType").val(),
        'Active': ($("#CheckBoxActive").prop('checked') == true ? 'Y' : 'N'),
        'ClientProgramEnrollmentId': $('#' + _Panel + "_DropDownListClientProgramEnrollmentId").val(),
        'StaffId': $('#' + _Panel + "_DropDownListStaffId").val(),
        //'GroupId': $('#' + _Panel + "_DropDownListGroupId").val(),
        'TaskStatus': $('#' + _Panel + "_DropDownListTaskStatus").val(),
        'DueDate': $("#TextBoxDueDate").val(),
        'CompletionDate': $("#TextBoxCompletionDate").val(),
        'QueueStepActionId': -1,
        'Comments': $("#TextBoxComments").val()


    }, onTaskCreated, 'json');
}

function onTaskCreated(json) {
    if (json.success == false) {
        showErrorMessage("An error occurred: " + json.message);
        return;
    }
    else {
        localStorage.setItem("savedMessage", "Task created successfully.");
        location.href = 'ClientTasks.aspx';
    }
}

function ValidateTaskDetails() {
    if (document.getElementById(_Panel + '_DropDownListTaskType').value == "-1") {
        showErrorMessage("Please select a Task Type");
        document.getElementById(_Panel + '_DropDownListTaskType').focus();
        return false;
    }
    if (document.getElementById(_Panel + "_DropDownListTaskStatus").selectedIndex == 0) {
        showErrorMessage("Please select a Task Status");
        document.getElementById(_Panel + '_DropDownListTaskStatus').focus();
        return false;
    }
    return true;
}

function CallAjax() {
    //alert(XmlHttp);
    try {
        if (XmlHttp != null) {
            if (Browser == 'IE') {
                XmlHttp.open("POST", RequestUrl, true);
            }
            if (Browser == 'FX') {
                XmlHttp.open("GET", RequestUrl, true);
            }


            XmlHttp.onreadystatechange = ReturnFromAjax;
            XmlHttp.send(null);
        }
    }
    catch (ex) {
        alert(ex);
    }

}

function ReturnFromAjax() {

    if (XmlHttp.readyState == 4) {
        if (XmlHttp.status == 200) {
            var XMLObject = XmlHttp.responseXML;
            //alert(_Action);
            if (_Action == "Insert") {
                if (XMLObject.getElementsByTagName("Message").length > 0) {
                    showErrorMessage("An error occurred: " + XMLObject.getElementsByTagName("Message")[0].childNodes[0].nodeValue);
                    return;
                }
                else if (XMLObject.getElementsByTagName("TaskId").length < 1) {
                    showErrorMessage("An error occurred while adding this new task");
                    return;
                }

            }
            else if (_Action == "Modify") {
                if (XMLObject.getElementsByTagName("Message").length > 0) {
                    showErrorMessage("An error occurred while updating this record: " + XMLObject.getElementsByTagName("Message")[0].childNodes[0].nodeValue);
                    return;
                }
                location.href = 'ClientTasks.aspx';

            }
            else if (_Action == "Delete") {
                if (XMLObject.getElementsByTagName("TaskId") != null) {

                    var _NewImage = document.getElementById(_TableName).rows[_CurrentRow + 1].cells[0].innerHTML;

                    if (_NewImage.indexOf("deleteIcon.gif") >= 0) {
                        _NewImage = _NewImage.replace("deleteIcon.gif", "True.gif");
                        _NewImage = _NewImage.replace("Delete", '"Rollback Delete"');
                    }
                    else {
                        _NewImage = _NewImage.replace("True.gif", "deleteIcon.gif");
                        _NewImage = _NewImage.replace("Rollback Delete", "Delete");
                    }
                    //alert(_NewImage)
                    document.getElementById(_TableName).rows[_CurrentRow + 1].cells[0].innerHTML = _NewImage;

                }
                else {
                    // In Case Error Occurred
                }
            }
            else if (_Action == "GetClientTaskDetail") {
                ShowTaskDetails();
            }
            else if (_Action == "SetStatus") {
                if (XmlHttp.readyState == 4) {
                    if (XmlHttp.status == 200) {
                        var XMLObject = XmlHttp.responseXML;
                        var CurrentDate = new Date();
                        if (XMLObject.getElementsByTagName("Message").length > 0 && XMLObject.getElementsByTagName("Message")[0].childNodes[0].nodeValue == "True") {
                            if (document.getElementById(_GridViewClientTasks).rows[_CurrentRow].cells[14] != undefined) {
                                document.getElementById(_GridViewClientTasks).rows[_CurrentRow].cells[5].textContent = document.getElementById(_GridViewClientTasks).rows[_CurrentRow].cells[14].textContent;
                                document.getElementById(_GridViewClientTasks).rows[_CurrentRow].cells[12].textContent = _TaskStatus;
                                document.getElementById(_GridViewClientTasks).rows[_CurrentRow].cells[6].textContent = CurrentDate.format("MM/dd/yyyy");
                            }
                            else {
                                document.getElementById(_GridViewClientTasks).rows[_CurrentRow].cells[5].textContent = document.getElementById(_GridViewClientTasks).rows[_CurrentRow].cells[13].textContent;
                                document.getElementById(_GridViewClientTasks).rows[_CurrentRow].cells[11].textContent = _TaskStatus;
                                document.getElementById(_GridViewClientTasks).rows[_CurrentRow].cells[6].textContent = CurrentDate.format("MM/dd/yyyy");
                            }
                        }
                        else
                            showErrorMessage("An error has occurred while setting the new Task Status.");
                    }
                }
            }
            else if (_Action == "ModifyAssignedStaff") {
                if (XmlHttp.readyState == 4) {
                    if (XmlHttp.status == 200) {
                        var XMLObject = XmlHttp.responseXML;
                        if (XMLObject.getElementsByTagName("Message").length > 0 && XMLObject.getElementsByTagName("Message")[0].childNodes[0].nodeValue == "True") {
                            if (_Pager == false) _SelRow.cells[4].innerHTML = "<a href='Javascript:ShowAssignedStaff(" + _AssignedStaff + "," +
                                _TaskId + "," + (_SelRow.rowIndex + 1) + ")'>" + _AssignStaffText + "</a>";
                            else _SelRow.cells[4].innerHTML = _SelRow.cells[4].innerHTML = "<a href='Javascript:ShowAssignedStaff(" + _AssignedStaff + "," +
                                _TaskId + "," + _SelRow.rowIndex + ")'>" + _AssignStaffText + "</a>";
                            document.getElementById("DivAssignStaff").style.display = 'none';

                            $('#DivAssignStaff').modal('hide');

                        }
                        else
                            showErrorMessage("An error has occurred while updating Task Assignee.");
                    }
                }
            }
        }
    }
}

function InsertNewRow(XMLObject) {
    var Tr = document.getElementById(_TableName).rows[1];
    if (document.getElementById(_TableName).rows.length == 2 && Tr.cells[0].innerHTML == "")
        document.getElementById(_TableName).deleteRow(1);
    var Tr = document.getElementById(_TableName).rows[0];
    _TableRowUser = document.getElementById(_TableName).insertRow();
    SetClass(_TableRowUser);
    for (i = 0; i < Tr.cells.length; i++) {
        _TableRowUser.insertCell();
        _TableRowUser.cells[i].align = "left";

    }
    _TableRowUser.cells[8].className = 'Hidden';
    _TableRowUser.cells[9].className = 'Hidden';
    _TableRowUser.cells[10].className = 'Hidden';
    _TableRowUser.cells[11].className = 'Hidden';
    _TableRowUser.cells[12].className = 'Hidden';
    _TableRowUser.cells[14].className = 'Hidden';
    RowLength = new String(document.getElementById(_TableName).rows.length - 2);
    _TableRowUser.cells[0].innerHTML = "<img style='cursor:hand' src='../App_Themes/Images/deleteIcon.gif' title='Delete' onclick=DeleteUser(this," + XMLObject.getElementsByTagName("TaskId")[0].childNodes[0].nodeValue + "," + RowLength + ",'" + _TableName + "') />";
    _TableRowUser.cells[1].innerHTML = "<A href=Javascript:EditTask(" + XMLObject.getElementsByTagName("TaskId")[0].childNodes[0].nodeValue + "," + RowLength + "," + XMLObject.getElementsByTagName("TaskId")[0].childNodes[0].nodeValue + ",'" + _TableName + "')>" + XMLObject.getElementsByTagName("TaskType")[0].childNodes[0].nodeValue + "</A>";
    _TableRowUser.cells[2].textContent = XMLObject.getElementsByTagName("Active")[0].childNodes[0].nodeValue;
    if (XMLObject.getElementsByTagName("ClientProgramEnrollmentId").length > 0)
        _TableRowUser.cells[3].textContent = XMLObject.getElementsByTagName("ClientProgramEnrollmentId")[0].childNodes[0].nodeValue;
    if (XMLObject.getElementsByTagName("StaffId").length > 0)
        _TableRowUser.cells[4].textContent = XMLObject.getElementsByTagName("Staff")[0].childNodes[0].nodeValue;
    //if (XMLObject.getElementsByTagName("GroupId").length > 0)
    //    _TableRowUser.cells[5].textContent = XMLObject.getElementsByTagName("GroupName")[0].childNodes[0].nodeValue;
    if (XMLObject.getElementsByTagName("DueDate").length > 0)
        _TableRowUser.cells[6].textContent = XMLObject.getElementsByTagName("DueDate")[0].childNodes[0].nodeValue;
    if (XMLObject.getElementsByTagName("CompletionDate").length > 0)
        _TableRowUser.cells[7].textContent = XMLObject.getElementsByTagName("CompletionDate")[0].childNodes[0].nodeValue;
    if (XMLObject.getElementsByTagName("Comments").length > 0 && XMLObject.getElementsByTagName("Comments")[0].childNodes.length > 0)
        _TableRowUser.cells[8].textContent = XMLObject.getElementsByTagName("Comments")[0].childNodes[0].nodeValue;
    _TableRowUser.cells[9].textContent = XMLObject.getElementsByTagName("TaskTypeId")[0].childNodes[0].nodeValue;
    if (XMLObject.getElementsByTagName("ClientProgramEnrollmentId").length > 0)
        _TableRowUser.cells[10].textContent = XMLObject.getElementsByTagName("ClientProgramEnrollmentId")[0].childNodes[0].nodeValue;
    if (XMLObject.getElementsByTagName("StaffId").length > 0)
        _TableRowUser.cells[11].textContent = XMLObject.getElementsByTagName("StaffId")[0].childNodes[0].nodeValue;
    if (XMLObject.getElementsByTagName("GroupId").length > 0)
        _TableRowUser.cells[12].textContent = XMLObject.getElementsByTagName("GroupId")[0].childNodes[0].nodeValue;
    if (XMLObject.getElementsByTagName("TaskStatus").length > 0) {
        _TableRowUser.cells[13].textContent = XMLObject.getElementsByTagName("TaskStatus")[0].childNodes[0].nodeValue;
        _TableRowUser.cells[14].textContent = XMLObject.getElementsByTagName("TaskStatusId")[0].childNodes[0].nodeValue;
    }

}

function SetDefaults() {
    document.getElementById("TextBoxTaskId").value = "";
    document.getElementById("CheckBoxActive").checked = true;
    document.getElementById(_Panel + "_DropDownListTaskType").selectedIndex = 0;
    document.getElementById(_Panel + "_DropDownListClientProgramEnrollmentId").selectedIndex = 0;
    document.getElementById(_Panel + "_DropDownListStaffId").selectedIndex = 0;
    //document.getElementById(_Panel + "_DropDownListGroupId").selectedIndex = 0;
    document.getElementById(_Panel + "_DropDownListTaskStatus").selectedIndex = 0;
    document.getElementById("TextBoxDueDate").value = ""
    document.getElementById("TextBoxCompletionDate").value = "";
    document.getElementById("TextBoxComments").value = "";
}

function CancelEdit() {
    document.getElementById("ButtonInsert").textContent = "Insert";
    SetDefaults();

}

function DeleteTask(object, TaskId, RowIndex, TableName) {
    if (!IsWritePermission()) return false;
    if (document.getElementById(TableName).rows[0].cells.length == 1)
        RowIndex = RowIndex + 1;
    var _NewImage = document.getElementById(TableName).rows[RowIndex + 1].cells[0].innerHTML;
    if (_NewImage.indexOf("deleteIcon.gif") >= 0) {
        var ErrorMessage = "Are you sure you want to delete this Code ?";
        RequestUrl = "../Ajax/AjaxServer.aspx?Page=Tasks&TaskId=" + TaskId + "&Action=Delete&Task=0&Description=0&Active=Y&CannotModifyNameOrDelete=N&SortOrder=0&CateogryId=0";
    }
    else {
        var ErrorMessage = "Are you sure you want to Rollback delete of this Code ?"
        RequestUrl = "../Ajax/AjaxServer.aspx?Page=Tasks&TaskId=" + TaskId + "&Action=Delete&Task=0&Description=0&Active=N&CannotModifyNameOrDelete=N&SortOrder=0&CateogryId=0";
    }
    var stamp = new Date();
    RequestUrl += "&stamp=" + stamp.getTime();
    if (confirm(ErrorMessage)) {
        _TableName = TableName;
        _Action = "Delete";
        _CurrentRow = RowIndex;
        CallAjax();
    }
    else {

    }
}

function SetValues() {
    _TableRowTask.cells[1].innerHTML = "<A href=Javascript:EditTask(" + document.getElementById("TextBoxTaskId").value + "," + _CurrentRow + ",'" + _TableName + "')>" + document.getElementById(_Panel + "_DropDownListTaskType").options[document.getElementById(_Panel + "_DropDownListTaskType").selectedIndex].text + "</A>";
    if (document.getElementById("CheckBoxActive").checked == true) _TableRowTask.cells[2].textContent = "Y";
    else _TableRowTask.cells[2].textContent = "N";


    _TableRowTask.cells[9].textContent = document.getElementById(_Panel + "_DropDownListTaskType").value;
    if (document.getElementById(_Panel + "_DropDownListClientProgramEnrollmentId").selectedIndex > -1)
        _TableRowTask.cells[3].textContent = document.getElementById(_Panel + "_DropDownListClientProgramEnrollmentId").options[document.getElementById(_Panel + "_DropDownListClientProgramEnrollmentId").selectedIndex].text;
    else
        _TableRowTask.cells[3].textContent = "";
    if (document.getElementById(_Panel + "_DropDownListStaffId").selectedIndex > -1)
        _TableRowTask.cells[4].textContent = document.getElementById(_Panel + "_DropDownListStaffId").options[document.getElementById(_Panel + "_DropDownListStaffId").selectedIndex].text;
    else
        _TableRowTask.cells[4].textContent = "";
    //if (document.getElementById(_Panel + "_DropDownListGroupId").selectedIndex > -1)
    //    _TableRowTask.cells[5].textContent = document.getElementById(_Panel + "_DropDownListGroupId").options[document.getElementById(_Panel + "_DropDownListGroupId").selectedIndex].text;
    //else
    //    _TableRowTask.cells[5].textContent = "";
    if (document.getElementById(_Panel + "_DropDownListTaskStatus").selectedIndex > -1)
        _TableRowTask.cells[13].textContent = document.getElementById(_Panel + "_DropDownListTaskStatus").options[document.getElementById(_Panel + "_DropDownListTaskStatus").selectedIndex].text;
    else
        _TableRowTask.cells[13].textContent = "";
    _TableRowTask.cells[10].textContent = document.getElementById(_Panel + "_DropDownListClientProgramEnrollmentId").value;

    _TableRowTask.cells[11].textContent = document.getElementById(_Panel + "_DropDownListStaffId").value;
    //_TableRowTask.cells[12].textContent = document.getElementById(_Panel + "_DropDownListGroupId").value;

    _TableRowTask.cells[6].textContent = document.getElementById("TextBoxDueDate").value;
    _TableRowTask.cells[7].textContent = document.getElementById("TextBoxCompletionDate").value;
    _TableRowTask.cells[8].textContent = document.getElementById("TextBoxComments").value;

    _TableRowTask.cells[14].textContent = document.getElementById(_Panel + "_DropDownListTaskStatus").value;



}

function GetTaskDetails(TaskId) {
    if (TaskId < 1)
        return;
    else {
        $("#ButtonInsert").val("Modify");
    }
    _Action = "GetClientTaskDetail"

    RequestUrl = "../Ajax/AjaxServer.aspx?Page=ClientTasks&ClientProgramEnrollmentId=-1&StaffId=-1&TaskType=-1&TaskStatus=-1&TaskId=" + TaskId +
        "&Action=" + _Action;
    RequestUrl += "&stamp=" + $.now();
    CallAjax();
}

function ShowTaskDetails() {

    if (XmlHttp.readyState == 4) {
        if (XmlHttp.status == 200) {
            XMLObject = XmlHttp.responseXML;
            if (XMLObject.getElementsByTagName("TaskId").length > 0) {
                document.getElementById("TextBoxTaskId").value = XMLObject.getElementsByTagName("TaskId")[0].childNodes[0].nodeValue;
                document.getElementById("TextBoxClientId").value = XMLObject.getElementsByTagName("ClientId")[0].childNodes[0].nodeValue;
                if (XMLObject.getElementsByTagName("Active")[0].childNodes[0].nodeValue == "Y")
                    document.getElementById("CheckBoxActive").checked = true;
                else
                    document.getElementById("CheckBoxActive").checked = false;

                if (XMLObject.getElementsByTagName("ClientProgramEnrollmentId").length > 0)
                    document.getElementById(_Panel + "_DropDownListClientProgramEnrollmentId").value = XMLObject.getElementsByTagName("ClientProgramEnrollmentId")[0].childNodes[0].nodeValue;
                if (XMLObject.getElementsByTagName("StaffId").length > 0)
                    document.getElementById(_Panel + "_DropDownListStaffId").value = XMLObject.getElementsByTagName("StaffId")[0].childNodes[0].nodeValue;
                //if (XMLObject.getElementsByTagName("GroupId").length > 0)
                //    document.getElementById(_Panel + "_DropDownListGroupId").value = XMLObject.getElementsByTagName("GroupId")[0].childNodes[0].nodeValue;
                if (XMLObject.getElementsByTagName("TaskTypeId").length > 0)
                    document.getElementById(_Panel + "_DropDownListTaskType").value = XMLObject.getElementsByTagName("TaskTypeId")[0].childNodes[0].nodeValue;
                if (XMLObject.getElementsByTagName("TaskStatusId").length > 0)
                    document.getElementById(_Panel + "_DropDownListTaskStatus").value = XMLObject.getElementsByTagName("TaskStatusId")[0].childNodes[0].nodeValue;

                if (XMLObject.getElementsByTagName("DueDate").length > 0) {
                    var dueDate = new Date(XMLObject.getElementsByTagName("DueDate")[0].childNodes[0].nodeValue);
                    document.getElementById('TextBoxDueDate').value = $.datepicker.formatDate("mm/dd/yy", dueDate);
                }
                if (XMLObject.getElementsByTagName("CompletionDate").length > 0) {
                    var dueDate = new Date(XMLObject.getElementsByTagName("CompletionDate")[0].childNodes[0].nodeValue);
                    document.getElementById('TextBoxCompletionDate').value = $.datepicker.formatDate("mm/dd/yy", dueDate);
                }
                if (XMLObject.getElementsByTagName("Comments").length > 0 && XMLObject.getElementsByTagName("Comments")[0].childNodes.length > 0)
                    document.getElementById("TextBoxComments").value = XMLObject.getElementsByTagName("Comments")[0].childNodes[0].nodeValue;

                GetInActiveAndDeletedGlobalCodes();
            }

        }
    }
}

function DeleteClientTask(object, ClientTaskId, RowIndex, TableName) {

    if (!IsWritePermission()) return false;
    if (document.getElementById(TableName).rows[0].cells.length == 1)
        RowIndex = RowIndex + 1;
    var _NewImage = document.getElementById(TableName).rows[RowIndex + 1].cells[0].innerHTML;
    if (_NewImage.indexOf("deleteIcon.gif") >= 0) {
        var ErrorMessage = "Are you sure you want to delete this Client Task?";
        RequestUrl = "../Ajax/AjaxServer.aspx?Page=Clients&TabName=ClientTasks&Id=" + ClientTaskId + "&Action=DeleteChildRecord&Active=Y&Address=0&Address2=0&City=0&State=0&Zip=0&PhoneNumber=0";
    }
    else {
        var ErrorMessage = "Are you sure you want to Rollback delete of this Client Task ?"
        RequestUrl = "../Ajax/AjaxServer.aspx?Page=Clients&TabName=ClientTasks&Id=" + ClientTaskId + "&Action=DeleteChildRecord&ClientLeave=0&Active=N&Address=0&Address2=0&City=0&State=0&Zip=0&PhoneNumber=0";
    }
    var stamp = new Date();
    RequestUrl += "&stamp=" + stamp.getTime();
    if (confirm(ErrorMessage)) {
        _TableName = TableName;
        _Action = "Delete";
        _CurrentRow = RowIndex;
        CallAjax("DeleteClientTaskRecord");
    }
    else {

    }
}

function DeleteClientTaskRecord() {
    if (XmlHttp.readyState == 4) {
        if (XmlHttp.status == 200) {
            var XMLObject = XmlHttp.responseXML;
            if (XMLObject.getElementsByTagName("Result").length < 1) {
                showErrorMessage("An error has occurred.");
                return;
            }

            if (XMLObject.getElementsByTagName("Result")[0].childNodes[0].nodeValue == "True") {

                var _NewImage = document.getElementById(_TableName).rows[_CurrentRow + 1].cells[0].innerHTML;

                if (_NewImage.indexOf("deleteIcon.gif") >= 0) {
                    _NewImage = _NewImage.replace("deleteIcon.gif", "True.gif");
                    _NewImage = _NewImage.replace("Delete", '"Rollback Delete"');
                }
                else {
                    _NewImage = _NewImage.replace("True.gif", "deleteIcon.gif");
                    _NewImage = _NewImage.replace("Rollback Delete", "Delete");
                }
                //alert(_NewImage)
                document.getElementById(_TableName).rows[_CurrentRow + 1].cells[0].innerHTML = _NewImage;
                //document.getElementById("GridViewUserPermissions").rows[_CurrentRow].cells[OtherPermission].innerHTML = NewImage1;
            }
            else {
                // In Case Error Occurred
            }
        }
    }
}
function SetStatus(TaskId, Status, idxelem) {

    if (IsWritePermission()) {
        if (confirm("Do you wish to mark the status " + Status + "?")) {
            indexElem = $(idxelem).closest('tr');
            $.post("/Ajax/AjaxServer.aspx?Page=ClientTasks&Action=SetStatus&TaskId=" + TaskId + "&Status=" + Status, SetStatusDone, 'xml');
        }
    }
}

function SetStatusDone(xml) {
    if ($(xml).find('Message').text() == 'True') {
        if ($(xml).find('Status').text() == 'Canceled') {
            showRecordSaved('Task has been successfully canceled');
            $(indexElem).find('.TaskStatus').text('Canceled');
            $(indexElem).find('.TaskStatusId').text($('[name$="DropDownListTaskStatusFilter"] option:contains("Canceled")').val());
            $(indexElem).find('.CompletionDateText,.CompletionDate').text(formatDate(new Date(), "MM/dd/yyyy"));
           
        } else if ($(xml).find('Status').text() == 'Complete') {
            showRecordSaved('Task has been successfully completed');
            $(indexElem).find('.TaskStatus').text('Complete');
            $(indexElem).find('.TaskStatusId').text($('[name$="DropDownListTaskStatusFilter"] option:contains("Complete")').val());
            $(indexElem).find('.CompletionDateText,.CompletionDate').text(formatDate(new Date(), "MM/dd/yyyy"));
        }
        if ($(indexElem).find('.navigate').length > 0 && !$(indexElem).find('.navigate').hasClass('hidden')) {
            $(indexElem).find('.navigate').addClass('hidden');
        }
    } else {
        showErrorMessage("An error has occurred while saving this record: " + $(xml).find('Message').text());
    }
}


function ShowAssignedStaff(AssignedStaff, TaskId, idxelem) {
    indexElem = $(idxelem).closest('tr');
    if (IsWritePermission()) {
        $('#DivAssignStaff').modal('show');
        $('#DivAssignStaff [id$="DropDownListAssignedStaff"]').select2('destroy');
        $('#DivAssignStaff').on('hide.bs.modal', function (e) {
            $('.temp-add').remove();
            $('#DivAssignStaff [id$="DropDownListAssignedStaff"]').val('-1');
        });
        _AssignedStaff = AssignedStaff;
        _TaskId = TaskId;
        _AssignStaffText = $(idxelem).text();
        if ($('[name$="DropDownListAssignedStaff"] option[value="' + _AssignedStaff + '"]').length == 0) {
            $('<option value="' + _AssignedStaff + '" class="temp-add">' + _AssignStaffText + '</option>').insertAfter('[name$="DropDownListAssignedStaff"] option[value="-1"]');
        }
        $('[name$="DropDownListAssignedStaff"]').val(AssignedStaff);
        GetInActiveAndDeletedGlobalCodes();
        //<userstory>647</userstory>
        $('#DivAssignStaff [id$="DropDownListAssignedStaff"]').select2({ width: '100%' });
    }
}

function ModifyAssignedStaff() {
    _AssignedStaff = $('[name$="DropDownListAssignedStaff"]').val();
    _AssignStaffText = $('[name$="DropDownListAssignedStaff"] option:selected').text();

    $.post("/Ajax/AjaxServer.aspx?Page=ClientTasks&&Action=ModifyAssignedStaff&TaskId=" + _TaskId +
        "&Staff=" + $('[name$="DropDownListAssignedStaff"]').val(), ModifyAssignedStaffDone, 'xml');

}

function ModifyAssignedStaffDone(xml) {

    if ($(xml).find("Message").text() == "True") {
        $(indexElem).find('.Staff').html("<a href='#' onclick='ShowAssignedStaff(" + $('[name$="DropDownListAssignedStaff"]').val() + "," +
            $(indexElem).find('.TaskId').text() + ",this)'>" + $('[name$="DropDownListAssignedStaff"] option:selected').text() + "</a>");

        ///Modified By : Ravi
        ///Modified Date :3rd Sep 2018
        /// Fix Bug #439
        $(indexElem).find('.StaffId').html($('[name$="DropDownListAssignedStaff"]').val());

        $('#DivAssignStaff').modal('hide');

        showRecordSaved("Staff assignee has been changed");

    }
    else
        showErrorMessage("An error has occurred while updating Task Assignee.");
}


function ValidateFilter() {
    
    //if ($('#' + _DropDownListPrograms).val() < 1 && $('#' + _DropDownListStaff).val() < 1 && $('#' + _DropDownListTaskTypeFilter).val() < 1 && $('#' + _DropDownListTaskStatusFilter).val() < 1) {
    //    showErrorMessage("Please select at least one filter");
    //    return false;
    //}
    var startDate = Date.parse($('#UpdatePanel1 [name$="TextBoxStartDate"]').val());
    var endDate = Date.parse($('#UpdatePanel1 [name$="TextBoxEndDate"]').val());
    if (startDate > endDate) {
        showErrorMessage('Start Date cannot be greater than End Date.');
        return false;
    }
    // 1026
    return true;
}

// 1026
function FilterWithPagination() {
    if (!ValidateFilter())
        return false;

    $('[id$="ButtonApplyFilter"]').trigger('click');
    
}

function OnAdd(clientId) {
    TaskDetailModal.OnAdd({
        TaskId: "-1",
        ClientId: clientId

    }, OnEditComplete);
}

function OnEdit(id, idxelem) {

    var row = $(idxelem).closest('tr');

    TaskDetailModal.OnEdit({
        TaskId: $(row).find('.TaskId').text(),
        TaskType: $(row).find('.TaskTypeId').text(),
        TaskStatus: $(row).find('.TaskStatusId').text(),
        ProgramEnrollmentId: $(row).find('.ProgramEnrollmentId').text(),
        ClientId: $(row).find('.ClientId').text(),
        StaffId: $(row).find('.StaffId').text(),
        // DueDate: new Date($(row).find('.DueDateFull').text()),
        DueDate: $.trim($(row).find('.DueDateFull').text()) != '' ? new Date($(row).find('.DueDateFull').text()) : '',
        CompletionDate: $.trim($(row).find('.CompletionDate').text()) != '' ? new Date($(row).find('.CompletionDate').text()) : null,
        Comments: $(row).find('.Comments').text().trim(),
        ClientId: $(row).find('.ClientId').text()
    }, OnEditComplete, {
            TaskType: { Id: $(row).find('.TaskTypeId').text(), Text: $(row).find('.TaskType').text() },
            TaskStatus: { Id: $(row).find('.TaskStatusId').text(), Text: $(row).find('.TaskStatus').text() },
            ProgramEnrollment: { Id: $(row).find('.ProgramEnrollmentId').text(), Text: $(row).find('.EnrolledProgram').text() },
            Staff: { Id: $(row).find('.StaffId').text(), Text: $(row).find('.Staff').text() }
        });

    indexElem = row;
}

function OnEditComplete(obj) {   
    //if (obj.TaskId != '-1') {
    //    debugger;
    //    $('[id$="ButtonApplyFilter"]').trigger('click');
    //    //$(indexElem).find('.TaskId').text(obj.TaskId);
    //    //$(indexElem).find('.TaskTypeId').text(obj.TaskType);
    //    //if ($(indexElem).find('.TaskType').children('a').length != 0) {
    //    //    $(indexElem).find('.TaskType').html('<a onclick="OnEdit(' + obj.TaskId + ',this)" href="#">' + obj.TaskTypeText + '</a>');
    //    //} else {
    //    //    $(indexElem).find('.TaskType').text(obj.TaskTypeText);
    //    //}
    //    //$(indexElem).find('.TaskStatusId').text(obj.TaskStatus);
    //    //$(indexElem).find('.TaskStatus').text(obj.TaskStatusText);
    //    //$(indexElem).find('.ProgramEnrollmentId').text(obj.ClientProgramEnrollmentId);
    //    //$(indexElem).find('.EnrolledProgram').text(obj.ClientProgramText);
    //    //$(indexElem).find('.DueDateFull').text(obj.DueDate);
    //    //$(indexElem).find('.CompletionDate').text(obj.CompletionDate);
    //    //if ($.trim(obj.CompletionDate) == '') {
    //    //    $(indexElem).find('.CompletionDateText').html('<a href="#" onclick="SetStatus(' + obj.TaskId + ', \'Complete\', this)">Complete Now</a><br/><a href="javascript:SetStatus(' + obj.TaskId + ',\'Canceled\', this)">Cancel Now</a>')
    //    //} else {
    //    //    $(indexElem).find('.CompletionDateText').text($.trim(obj.CompletionDate));
    //    //}
    //    //$(indexElem).find('.Comments').text(obj.Comments);
    //    //$(indexElem).find('.StaffId').text(obj.StaffId);
    //    //$(indexElem).find('.Staff').html('<a href="#" onclick="ShowAssignedStaff(' + obj.StaffId + ',' + obj.TaskId + ',this)">' + obj.StaffText + '</a>');
    //} else {
        __doPostBack('UpdatePanel1', '');
    //}

}

/// <ModifyBy>Saddam</ModifyBy>
/// <ModifedDate>20th-Feb-18</ModifedDate>
/// <Description>Show and hide action or checkbox on gridview header</Description>
/// <Bug>420</Bug>
function onMassUpdate() {
    $('.mass-update, .btn-define-update, .btn-cancel').css('display', 'inline');
    $('.btn-mass-update').css('display', 'none');
    $('.delete,.view,.edit,.navigate').css('display', 'none');
    $('.Actions-label').hide();
    $('.select-all').show();
    return false;
}

/// <ModifyBy>Saddam</ModifyBy>
/// <ModifedDate>20th-Feb-18</ModifedDate>
/// <Description>Added type of checkbox</Description>
/// <Bug>420</Bug>
function onDefineUpdate() {

    if ($('.mass-update input[type="checkbox"]:checked').length == 0) {
        showErrorMessage('Please select one or more tasks to update');
        return false;
    }

    MassUpdateTaskModal.tasks = $('.mass-update input[type="checkbox"]:checked').map(function () { return $(this).val(); }).get();
    MassUpdateTaskModal.OnEdit();
    MassUpdateTaskModal.complete = function () {
        __doPostBack($('[name$="ButtonApplyFilter"]').attr('id'), '');
    }

    return false;

}

/// <ModifyBy>Saddam</ModifyBy>
/// <ModifedDate>20th-Feb-18</ModifedDate>
/// <Description>Show and hide action or checkbox on gridview header</Description>
/// <Bug>420</Bug>
function cancel() {
    $('.mass-update, .btn-define-update, .btn-cancel').css('display', 'none');
    $('.btn-mass-update').css('display', 'inline');
    $('.delete,.view,.edit,.navigate').css('display', 'inline');

    $('.mass-update').prop('checked', false);
    $('.select-all').hide();
    $('.Actions-label').show();
    return false;
}

/// <User Story>#1692</UserStory>
/// <ModifedDate>20th-Feb-18</ModifedDate>
$(document).ready(function () {
    var taskId = GetURLParameter('TaskId');
    if (taskId > -1) {
        $('table .task-data-row').each(function () {
            if ($(this).find('td.TaskId').text() == taskId) {
                $(this).find('td.fourAction').find('.edit').trigger('click');
                return false;
            }
        });
    }
});