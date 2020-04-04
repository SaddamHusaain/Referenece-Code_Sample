function hideTray() {
    $(".task_container").slideToggle("slow");
    $(".c_h .right_c .mini").text("+");
    $("#TaskTrayPanel").addClass('hidewidth');
}

function showTray() {
    $(".c_h .right_c .mini").text("-");
    $("#TaskTrayPanel").removeClass('hidewidth');
    $(".task_container").slideToggle("slow");
}

$(document).ready(function () {
    $("#TaskTrayPanel").addClass('hidden');
    $(".c_h").click(function (e) {
        if ($(".task_container").is(":visible")) {
            hideTray();
        } else {
            showTray();
        }
        return false;
    });
});

function OnTaskEdit(obj) {
    hideTray();
    TaskDetailModal.OnEdit({
        TaskId: $(obj).attr("data-taskid"),
        TaskType: $(obj).attr("data-tasktypeid"),
        TaskStatus: $(obj).attr("data-taskstatusid"),
        ProgramEnrollmentId: $(obj).attr("data-clientprogramenrollmentid"),
        ClientId: $(obj).attr("data-clientid"),
        StaffId: $(obj).attr("data-staffid"),
        DueDate: $(obj).attr("data-duedate") != '' ? new Date($(obj).attr("data-duedate")) : '',
        CompletionDate: $(obj).attr("data-completiondate") != '' ? new Date($(obj).attr("data-completiondate")) : null,
        Comments: $(obj).attr("data-comments")
    }, OnTaskEditComplete, {});
}

function OnTaskEditComplete() {
    GetClientTaskTray();
}

function SetTaskStatus(TaskId, Status) {
    if (IsWritePermission()) {
        if (confirm("Do you wish to mark the status " + Status + "?")) {
            $.post("/Ajax/AjaxServer.aspx?Page=ClientTasks&Action=SetStatus&TaskId=" + TaskId + "&Status=" + Status, SetTaskStatusDone, 'xml');
        }
    }
}

function SetTaskStatusDone(xml) {
    hideTray();
    if ($(xml).find('Message').text() == 'True') {
        if ($(xml).find('Status').text() == 'Canceled') {
            showRecordSaved('Task has been successfully canceled');
        } else if ($(xml).find('Status').text() == 'Complete') {
            showRecordSaved('Task has been successfully completed');
        }
        GetClientTaskTray();
    } else {
        showErrorMessage("An error has occurred while saving this record: " + $(xml).find('Message').text());
    }
}

setTimeout(function () {
    if (_SelectedClient > 0) {
        GetClientTaskTray();
    }
}, 3000);

function GetClientTaskTray() {
    RequestUrl = "../Ajax/AjaxRequestController.aspx?Page=TaskMapping&Action=GetClientTaskTray";
    RequestUrl += "&ScreenId=" + _ScreenId;
    var stamp = new Date();
    RequestUrl += "&stamp=" + stamp.getTime();
    $.post(RequestUrl, ShowClientTaskTray, 'xml');
}

function ShowClientTaskTray(xml) {
    var string = '';
    var $taskTray = $(xml).find("ClientTaskTray");
    if ($taskTray.length > 0) {
        $taskTray.each(function () {
            var TaskId =  $(this).find("TaskId").text();
            var TaskType =  $(this).find("TaskType").text();
            var TaskTypeId =  $(this).find("TaskTypeId").text();
            var TaskStatusId =  $(this).find("TaskStatusId").text();
            var ClientProgramEnrollmentId =  $(this).find("ClientProgramEnrollmentId").text();
            var ClientId =  $(this).find("ClientId").text();
            var StaffId =  $(this).find("StaffId").text();
            var DueDate =  $(this).find("DueDate").text();
            var CompletionDate =  $(this).find("CompletionDate").text();
            var Comments =  $(this).find("Comments").text();

            string += '<div class="listing">';
            string += '<a href="javascript:void(0)" onclick="OnTaskEdit(this)"';
            string += 'data-taskid="' + TaskId + '"';
            string += 'data-tasktypeid="' + TaskTypeId + '"';
            string += 'data-taskstatusid="' + TaskStatusId + '"';
            string += 'data-clientprogramenrollmentid="' + ClientProgramEnrollmentId + '"';
            string += 'data-clientid="' + ClientId + '"';
            string += 'data-staffid="' + StaffId + '"';
            string += 'data-duedate="' + DueDate + '"';
            string += 'data-completiondate="' + CompletionDate + '"';
            string += 'data-comments="' + Comments + '"';
            string += 'title="' + TaskType + '"';
            string += 'class="a_task pull-left">' + TaskType + '</a>';
            string += '<span class="TaskAction pull-right">';
            if (DueDate != "") {
                string += '(' + DueDate + ')';
            }
            string += '<a href="javascript:void(0)" onclick="SetTaskStatus(' + TaskId + ', \'Complete\')">Complete</a>';
            string += '<a href="javascript:void(0)" onclick="SetTaskStatus(' + TaskId + ',\'Canceled\')">Cancel</a>';
            string += '</span>';
            string += '</div>';
        });
        $(".task_container").html(string);
        $("#TaskTrayPanel").removeClass('hidden');
    }
    else {
        $("#TaskTrayPanel").addClass('hidden');
    }
}
