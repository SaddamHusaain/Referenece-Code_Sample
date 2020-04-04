var leave = {};
leave.clientLeaveSchedules = [];
var _schedule;
var scheduleDialogInitialized = false;
var _phaseRestrictions;
var _scheduleRestrictions;



function Schedule(actionType, leave, schedIndex) {

    if (actionType == 'new' || schedIndex > 0) {
        this.actionType = actionType;
        this.schedIndex = schedIndex;
        this.scheduleType = !schedIndex ? null : leave.clientLeaveSchedules[schedIndex].scheduleType;
        this.destination = !schedIndex ? null : leave.clientLeaveSchedules[schedIndex].destination;
        this.destinationText = !schedIndex ? null : leave.clientLeaveSchedules[schedIndex].destinationText;
        this.startDate = !schedIndex ? null : leave.clientLeaveSchedules[schedIndex].startDate;
        this.endDate = !schedIndex ? null : leave.clientLeaveSchedules[schedIndex].endDate;
        this.interimTransMode = !schedIndex ? null : leave.clientLeaveSchedules[schedIndex - 1].interimTransMode;
        this.interimTransModeText = !schedIndex ? null : leave.clientLeaveSchedules[schedIndex - 1].interimTransModeText;
        this.interimTransVehicle = !schedIndex ? null : leave.clientLeaveSchedules[schedIndex - 1].interimTransVehicle;
        this.interimTransDriver = !schedIndex ? null : leave.clientLeaveSchedules[schedIndex - 1].interimTransDriver;
        this.interimTravelTime = !schedIndex ? null : leave.clientLeaveSchedules[schedIndex - 1].interimTravelTime;
        this.comments = !schedIndex ? null : leave.clientLeaveSchedules[schedIndex].comments;

    } else {
        this.actionType = 'edit';
        this.schedIndex = schedIndex;
        this.scheduleType = leave.clientLeaveSchedules[0].scheduleType;
        this.destination = leave.clientLeaveSchedules[0].destination;
        this.destinationText = leave.clientLeaveSchedules[0].destinationText;
        this.interimTransMode = leave.departTransMode;
        this.interimTransModeText = leave.departTransModeText;
        this.interimTransVehicle = leave.departTransVehicle;
        this.interimTransDriver = leave.departTransDriver;
        this.interimTravelTime = leave.departTravelTime;
        this.startDate = leave.clientLeaveSchedules[0].startDate;
        this.endDate = leave.clientLeaveSchedules[0].endDate;
        this.comments = leave.clientLeaveSchedules[0].comments;
    };
}

$(document).ready(function () {

    if (AgendaId > 0) {
        $.get('/agenda/GetAgendaDetails?AgendaId=' + AgendaId + '&DateTime=' + DateTime + '&AgendaSource=' + AgendaSource, function (data) {
            if (data.success == true) {
                data.leave.scheduledDeparture = new Date(data.leave.ScheduledDepartureString);
                //parseDate(data.leave.scheduledDeparture);
                data.leave.scheduledReturn = new Date(data.leave.ScheduledReturnString);
                //parseDate(data.leave.scheduledReturn);

                var tempClientLeaveSchedules = [];
                var tempClientLeaveSchedule = {};

                if (data.schedules && data.schedules.length > 0) {
                    $.each(data.schedules, function (index, schedule) {
                        tempClientLeaveSchedule = {};

                        if (!DateTime || DateTime == '') {
                            tempClientLeaveSchedule.Id = schedule.Id;
                            tempClientLeaveSchedule.clientLeaveId = AgendaId;
                        }

                        tempClientLeaveSchedule.scheduleType = schedule.ScheduleTypeId;
                        tempClientLeaveSchedule.destination = schedule.DestinationId;
                        tempClientLeaveSchedule.destinationText = schedule.Destination;
                        tempClientLeaveSchedule.startDate = new Date(schedule.StartDateString);
                        tempClientLeaveSchedule.endDate = new Date(schedule.EndDateString);
                        tempClientLeaveSchedule.comments = schedule.Comments;
                        tempClientLeaveSchedule.returnsToCenter = schedule.ReturnsToCenter;

                        if (schedule.ReturnsToCenter == 'N') {
                            tempClientLeaveSchedule.interimTravelTime = schedule.TravelTime;
                            tempClientLeaveSchedule.interimTransMode = schedule.InterimTransMode;
                            tempClientLeaveSchedule.interimTransModeText = schedule.TransMode;
                            tempClientLeaveSchedule.interimTransDriver = schedule.InterimTransDriver;
                            tempClientLeaveSchedule.interimTransVehicle = schedule.InterimTransVehicle;
                        }

                        tempClientLeaveSchedules.push(tempClientLeaveSchedule);

                    });
                }
                leave = data.leave;

                if (!DateTime || DateTime == '')
                    leave.Id = AgendaId;

                leave.clientLeaveSchedules = tempClientLeaveSchedules;

                $('#leave-type').val(leave.leaveType);

                var deptscheduledDeparture;
                if (!leave.scheduledDeparture)
                    deptscheduledDeparture = moment(new Date()).add(1, 'h').toDate().setMinutes(0, 0, 0);
                else
                    deptscheduledDeparture = moment(leave.scheduledDeparture);


                if ($('#depart-date-time-picker').data("DateTimePicker") != undefined)
                    $('#depart-date-time-picker').data("DateTimePicker").destroy();

                $('#depart-date-time-picker').datetimepicker({
                    inline: true,
                    sideBySide: true,
                    // can't request a leave starting before now or after 30 days in the future
                    minDate: moment(),
                    maxDate: moment(new Date()).add(30, 'd').toDate().setHours(23, 59, 59, 999),
                    // default time to start of next hour
                    defaultDate: deptscheduledDeparture
                });

                updatePhaseRestrictions();
                if (!DateTime || DateTime == '') {
                    $('#rootwizard').bootstrapWizard('show', 0);
                } else {

                    $('.lblDepartDestination, .lblReturnDestination').text(tempClientLeaveSchedule.destinationText);

                    $('#rootwizard').bootstrapWizard('show', 10);
                }
            }
        }).error(function () {

        });
    }

    $('#leave-type').change(function () {
        updatePhaseRestrictions();
    });

    $('#rootwizard #schedule-type').change(function () {
        var schedulePoup = $(this).val();
        if (schedulePoup && schedulePoup != "") {
            $.post('/agenda/leavevalidationcriteria/scheduletype', { scheduleType: $(this).val(), date: leave.scheduledDeparture.toJSON() }, function (data) {
                _scheduleRestrictions = data;
                if (_scheduleRestrictions.IsFull == true) {
                    $.growl.error({
                        message: 'You have already requested the maximum weekly number of trips to "' + $('#rootwizard #schedule-type').find('option:selected').text() + '" destinations', location: 'br', size: 'large', duration: '5000'
                    });
                    $('#rootwizard #schedule-type').val('');
                }
                else if (_scheduleRestrictions.IsMonthlyFull == true) {
                    $.growl.error({
                        message: 'You have already requested the maximum monthly number of trips to "' + $('#rootwizard #schedule-type').find('option:selected').text() + '" destinations', location: 'br', size: 'large', duration: '5000'
                    });
                    $('#rootwizard #schedule-type').val('');
                }
            }).error(function () {
                _scheduleRestrictions = null;
            });
        }
    });

    $('#schedule-wizard #schedule-type').change(function () {
        var schedulePoup = $(this).val();
        if (schedulePoup && schedulePoup != "") {
            $.post('/agenda/leavevalidationcriteria/scheduletype', { scheduleType: $(this).val(), date: leave.scheduledDeparture.toJSON() }, function (data) {
                _scheduleRestrictions = data;
                var newSchedTypeCount = $.grep(leave.clientLeaveSchedules, function (e) { return e.scheduleType == $('#schedule-wizard #schedule-type').find('option:selected').val() }).length;
                if (_scheduleRestrictions.IsFull == true || _scheduleRestrictions.RunningCount + newSchedTypeCount >= _scheduleRestrictions.WeeklyCount) {
                    $.growl.error({
                        message: 'You have already requested the maximum weekly number of trips to "' + $('#schedule-wizard #schedule-type').find('option:selected').text() + '" destinations', location: 'br', size: 'large', duration: '5000'
                    });
                    $('#schedule-wizard #schedule-type').val('');
                }
                else if (_scheduleRestrictions.IsMonthlyFull == true || _scheduleRestrictions.MonthlyRunningCount + newSchedTypeCount >= _scheduleRestrictions.MonthlyCount) {
                    $.growl.error({
                        message: 'You have already requested the maximum monthly number of trips to "' + $('#schedule-wizard #schedule-type').find('option:selected').text() + '" destinations', location: 'br', size: 'large', duration: '5000'
                    });
                    $('#schedule-wizard #schedule-type').val('');
                }
            }).error(function () {
                _scheduleRestrictions = null;
            });
        }
    });


    $('#rootwizard').bootstrapWizard({
        onInit: function () {
            $('.start-over').hide();
            $('.next').show();
        },
        onTabShow: function (tab, navigation, index) {

            // Index represents the tab you are showing.
            var $total = navigation.find('li').length;
            var $current = index + 1;
            var $percent = ($current / $total) * 100;
            $('#rootwizard .progress-bar').css({ width: $percent + '%' });

            if ($current == $total) {
                $('#rootwizard .finish').show();
                $('.next').hide();
            } else {
                $('#rootwizard .finish').hide();
                $('.next').show();
            }

            if ($current == 1) {
                $('.start-over').hide();
                $('.previous').hide();
            } else {
                $('.start-over').show();
                $('.previous').show();
            }

            if (index == 0) {

                if (leave.leaveType)
                    $('#leave-type').val(leave.leaveType);


                if ($('#depart-date-time-picker').data("DateTimePicker") != undefined)
                    $('#depart-date-time-picker').data("DateTimePicker").destroy();

                var defaultDate;
                if (leave.scheduledDeparture)


                    defaultDate = moment(new Date(leave.scheduledDeparture));
                else
                    defaultDate = moment(new Date()).add(1, 'h').toDate().setMinutes(0, 0, 0);


                $('#depart-date-time-picker').datetimepicker({
                    inline: true,
                    sideBySide: true,
                    // can't request a leave starting before now or after 30 days in the future
                    minDate: moment(),
                    maxDate: moment(new Date()).add(30, 'd').toDate().setHours(23, 59, 59, 999),
                    // default time to start of next hour
                    defaultDate: defaultDate
                });
            }
            else if (index == 1) {
                // Save leave object data
                if (leave.clientLeaveSchedules && leave.clientLeaveSchedules.length > 0) {
                    $('#rootwizard #schedule-type').val(leave.clientLeaveSchedules[0].scheduleType);
                    $('#rootwizard #destination').attr('data-selected', leave.clientLeaveSchedules[0].destination);
                    $('#rootwizard #schedule-type').trigger('change');
                }
            }
            else if (index == 2) {
                $('#departure-transportation-mode').val(leave.departTransMode);
                $('#departure-transportation-mode').trigger('change');

                $('#departure-client-contact').val(leave.departTransDriver);
                $('#departure-client-vehicle').val(leave.departTransVehicle);
            }
            else if (index == 3) {

                if ($('#departure-travel-time').data("DateTimePicker") != undefined)
                    $('#departure-travel-time').data("DateTimePicker").destroy();

                var defaultDate;
                if (leave.clientLeaveSchedules.length > 0 && leave.clientLeaveSchedules[0].startDate)
                    defaultDate = new Date(leave.clientLeaveSchedules[0].startDate);
                else
                    defaultDate = new Date(leave.scheduledDeparture);

                $('#departure-travel-time').datetimepicker({
                    inline: true,
                    sideBySide: true,
                    minDate: moment(new Date(leave.scheduledDeparture)).toDate(),
                    maxDate: moment(new Date(leave.scheduledDeparture)).add(30, 'd').toDate().setHours(23, 59, 59, 999),
                    defaultDate: moment(defaultDate)
                });
            }
            else if (index == 4) {

                if ($('#first-schedule-end-date-time').data("DateTimePicker") != undefined)
                    $('#first-schedule-end-date-time').data("DateTimePicker").destroy();
                var defaultDate;
                if (leave.clientLeaveSchedules.length > 0 && leave.clientLeaveSchedules[0].endDate)
                    defaultDate = new Date(leave.clientLeaveSchedules[0].endDate);
                else
                    defaultDate = new Date(leave.clientLeaveSchedules[0].startDate);


                $('#first-schedule-end-date-time').datetimepicker({
                    inline: true,
                    sideBySide: true,
                    // can't schedule a destination end date/time before before start date/time or lasting more than 30 days
                    minDate: moment(new Date(leave.clientLeaveSchedules[0].startDate)).toDate(),
                    maxDate: moment(new Date(leave.clientLeaveSchedules[0].startDate)).add(30, 'd').toDate().setHours(23, 59, 59, 999),
                    defaultDate: moment(new Date(defaultDate))
                });

            }
            else if (index == 5) {
                if (leave.clientLeaveSchedules.length > 0 && leave.clientLeaveSchedules[0].comments)
                    $('#rootwizard #schedeuleComments').val(leave.clientLeaveSchedules[0].comments);
            }
            else if (index == 6) {

                fillSchedules(false);

                $('#rootwizard .previous').hide();
                $('#rootwizard .next').hide();

            } else if (index == 7) {
                if (leave.returnTransMode && leave.returnTransMode > 0) {
                    $('#rootwizard #return-transportation-mode').val(leave.returnTransMode).trigger("change");

                    if (leave.returnTransModeText == "Car") {
                        $('#rootwizard #return-client-vehicle').val(leave.returnTransVehicle);
                        $('#rootwizard #return-client-contact').val(leave.returnTransDriver);
                    }
                }

            } else if (index == 8) {
                var returnDate;

                if (leave.scheduledReturn)
                    returnDate = new Date(leave.scheduledReturn);
                else if (leave.clientLeaveSchedules)
                    returnDate = new Date(leave.clientLeaveSchedules[leave.clientLeaveSchedules.length - 1].endDate.getTime());

                if ($('#return-travel-time').data("DateTimePicker") != undefined)
                    $('#return-travel-time').data("DateTimePicker").destroy();

                $('#return-travel-time').datetimepicker({
                    inline: true,
                    sideBySide: true,
                    minDate: moment(new Date(returnDate)).toDate(),
                    maxDate: moment(new Date(returnDate)).add(30, 'd').toDate().setHours(23, 59, 59, 999),
                    defaultDate: moment(new Date(returnDate))
                });
            } else if (index == 9) {
                $('#rootwizard #leaveComments').val(leave.comments);
            } else if (index == 10) {
                fillSchedules(true);
            } else {

            }
        },
        onNext: function (tab, navigation, index) {
            // Set index to be consistent with onShow. Represents the tab you are leaving.
            index--;

            if (index == 0) {

                // Field validation
                if (!$('#leave-type').tomRequired('Primary purpose is required'))
                    return false;

                var schedDepart = new Date($('#depart-date-time-picker').data("DateTimePicker").date());

                if (moment.duration(moment(schedDepart).diff($.now())).asMinutes() < _phaseRestrictions.AdvanceNoticeMinutes) {
                    $.growl.error({ message: 'Must give at least ' + _phaseRestrictions.AdvanceNoticeMinutes + ' minutes notice', location: 'br', size: 'large', duration: '5000' });
                    return false;
                }

                jQuery.ajaxSetup({ async: false });
                updatePhaseRestrictions();

                if (_phaseRestrictions.IsFull == true) {
                    $.growl.error({
                        message: 'You have already requested the maximum weekly agendas of type "' + $('#leave-type').find('option:selected').text() + '"', location: 'br', size: 'large', duration: '5000'
                    });
                    return false;
                }

                // Save leave object data
                leave.leaveType = $('#leave-type').val();
                leave.scheduledDeparture = schedDepart;

                if (leave.clientLeaveSchedules && leave.clientLeaveSchedules.length > 0)
                    adjustLeaveTimes(true);

                return validateAgenda(false);

            }
            else if (index == 1) {
                jQuery.ajaxSetup({ async: true });
                // Field validation
                if (!$('#rootwizard #schedule-type').tomRequired('Destination type is required'))
                    return false;
                if (!$('#rootwizard #destination').tomRequired('Destination is required'))
                    return false;

                $('.lblDepartDestination, .lblReturnDestination').text($('#rootwizard #destination option:selected').text());


                // Save leave object data
                if (leave.clientLeaveSchedules && leave.clientLeaveSchedules.length > 0) {
                    leave.clientLeaveSchedules[0].scheduleType = $('#rootwizard #schedule-type').val();
                    leave.clientLeaveSchedules[0].destination = $('#rootwizard #destination').val();
                    leave.clientLeaveSchedules[0].destinationText = $('#rootwizard #destination option:selected').text();
                } else {
                    leave.clientLeaveSchedules.push({
                        scheduleType: $('#rootwizard #schedule-type').val(),
                        destination: $('#rootwizard #destination').val(),
                        destinationText: $('#rootwizard #destination option:selected').text()
                    });
                }

                //jQuery.ajaxSetup({ async: false });

                //if (!validateAgenda(false)) {
                //    leave.clientLeaveSchedules.pop();
                //    return false;
                //}
            }
            else if (index == 2) {

                // Field validation
                if (!$('#departure-transportation-mode').tomRequired('Transportation mode is required'))
                    return false;

                // Save leave object data
                leave.departTransMode = $('#departure-transportation-mode').val();
                leave.departTransModeText = $('#departure-transportation-mode option:selected').text();
                leave.departTransDriver = $('#departure-client-contact').val();
                leave.departTransVehicle = $('#departure-client-vehicle').val();

            }
            else if (index == 3) {
                var deptTravelTime = new Date($('#departure-travel-time').data("DateTimePicker").date());

                // Field validation
                if (deptTravelTime <= leave.scheduledDeparture) {
                    $('#departure-travel-time').notify('Date/Time should be greater than ' + leave.scheduledDeparture.format("m/d/yyyy H:MM TT"));
                    return false;
                }

                var minimumStart = new Date(leave.scheduledDeparture);
                var deptTravelTimeInMinutes = diff_minutes(deptTravelTime, minimumStart);

                // Save leave object data
                leave.departTravelTime = deptTravelTimeInMinutes;


                var schedule = leave.clientLeaveSchedules[0];
                var previousStartDate = schedule.startDate;
                schedule.startDate = deptTravelTime;

                if (schedule.endDate) {
                    var changeInStartDate = diff_minutes(previousStartDate, deptTravelTime);
                    schedule.endDate = moment(new Date(schedule.endDate)).add(changeInStartDate, 'm').toDate();
                }

            }

            else if (index == 4) {

                // Field validation
                var scheduleEnd = new Date($('#first-schedule-end-date-time').data("DateTimePicker").date());
                if (scheduleEnd <= leave.clientLeaveSchedules[0].startDate) {
                    $('#first-schedule-end-date-time').notify('Date/Time should be greater than ' + leave.clientLeaveSchedules[0].startDate.format("m/d/yyyy H:MM TT"));
                    return false;
                }

                if (moment.duration(moment(scheduleEnd).diff(moment(leave.clientLeaveSchedules[0].startDate))).asMinutes() > _scheduleRestrictions.ScheduleTimeMaxMinutes) {
                    $.growl.error({ message: 'The maximum time at this destination is ' + _scheduleRestrictions.ScheduleTimeMaxMinutes + ' minutes', location: 'br', size: 'large', duration: '5000' });
                    return false;
                }

                // Save leave object data
                var schedule = leave.clientLeaveSchedules[0];
                schedule.endDate = new Date(scheduleEnd);

                if (leave.clientLeaveSchedules && leave.clientLeaveSchedules.length > 1) {
                    adjustLeaveTimesAfterSchedule(1);
                }

                jQuery.ajaxSetup({ async: false });
                return validateAgenda(false);

            }
            else if (index == 5) {
                // Save leave object data
                var schedule = leave.clientLeaveSchedules[0];
                schedule.comments = $('#rootwizard #schedeuleComments').val();
            }
            else if (index == 6) {

                // Summary tab. No validation or object data alteration required.

            }
            else if (index == 7) {

                // Field validation
                if (!$('#return-transportation-mode').tomRequired('Transportation mode is required'))
                    return false;

                // Save leave object data
                leave.returnTransMode = $('#return-transportation-mode').val();
                leave.returnTransModeText = $('#return-transportation-mode option:selected').text();
                leave.returnTransVehicle = $('#return-client-vehicle').val();
                leave.returnTransDriver = $('#return-client-contact').val();

            }
            else if (index == 8) {

                var returnTravelTime = new Date($('#return-travel-time').data("DateTimePicker").date());
                var returnDate = new Date(leave.clientLeaveSchedules[leave.clientLeaveSchedules.length - 1].endDate.getTime());

                // Field validation
                if (returnTravelTime <= returnDate) {
                    $('#return-travel-time').notify('Date/Time should be greater than ' + returnDate.format("m/d/yyyy H:MM TT"));
                    return false;
                }

                var returnTravelTimeInMinutes = diff_minutes(returnTravelTime, returnDate);

                returnDate = returnTravelTime;
                // Save leave object data
                leave.returnTravelTime = returnTravelTimeInMinutes;

                leave.scheduledReturn = new Date(returnDate.getTime());

            } else if (index == 9) {
                // Save leave object data
                leave.comments = $("#leaveComments").val();
            }
        },
        onPrevious: function (tab, navigation, index) {
            //if (index == 0) {
            //    $('#rootwizard #schedule-type').val('');
            //    $('#rootwizard #schedule-type').trigger('change');
            //}
        },
        onTabClick: function (tab, navigation, index) {
            return false;
        }
    });

    $('#rootwizard .finish').click(function () {

        var temp = true;
        if (!_phaseRestrictions == null) {
            if (moment.duration(moment(leave.scheduledReturn).diff(leave.scheduledDeparture)).asMinutes() > _phaseRestrictions.LeaveTimeMaxMinutes) {
                $.growl.error({ message: 'Total agenda length cannot be more than ' + _phaseRestrictions.LeaveTimeMaxMinutes + ' minutes', location: 'br', size: 'large', duration: '5000' });
                return false;
            }
        }


        jQuery.ajaxSetup({ async: false });
        temp = validateAgenda(false);
        if (!temp)
            return false;

        jQuery.ajaxSetup({ async: true });

        for (i = 0; i < leave.clientLeaveSchedules.length; i++) {
            var startDate = (new Date(leave.clientLeaveSchedules[i].startDate));
            //leave.clientLeaveSchedules[i].startDate = moment(startDate).add(-startDate.getTimezoneOffset(), 'm').toJSON();
            leave.clientLeaveSchedules[i].startDate = moment(startDate).toJSON();

            var endDate = (new Date(leave.clientLeaveSchedules[i].endDate));
            //leave.clientLeaveSchedules[i].endDate = moment(endDate).add(-endDate.getTimezoneOffset(), 'm').toJSON();
            leave.clientLeaveSchedules[i].endDate = moment(endDate).toJSON();

            leave.clientLeaveSchedules[i].returnsToCenter = (i == leave.clientLeaveSchedules.length - 1 ? 'Y' : 'N');
        }

        var scheduledDeparture = (new Date(leave.scheduledDeparture));
        //leave.scheduledDeparture = moment(scheduledDeparture).add(-scheduledDeparture.getTimezoneOffset(), 'm').toJSON();
        leave.scheduledDeparture = moment(scheduledDeparture).toJSON();

        var scheduledReturn = (new Date(leave.scheduledReturn));
        //leave.scheduledReturn = moment(scheduledReturn).add(-scheduledReturn.getTimezoneOffset(), 'm').toJSON();
        leave.scheduledReturn = moment(scheduledReturn).toJSON();

        $.post('/agenda/add', leave, function (result, textStatus, jqXHR) {
            if (jqXHR.status == 403) {
                window.location.href = '/Account/Login';
            } else {
                if (result.success != undefined && result.success == true) {
                    window.location.href = '/Agenda?saved=true';
                }
                else if (result.success != undefined && result.success == false) {
                    $.growl.error({ message: result.message, location: 'br', size: 'large', duration: '5000' });
                } else {
                    $.growl.error({ message: "Your session has expired! Please login", location: 'br', size: 'large', duration: '5000' });
                    setTimeout(function () { window.location.href = '/Account/Login' }, 3000);
                }
            }


        });
    });

    $('.start-over').click(function () {
        leave = {};
        leave.clientLeaveSchedules = [];
        clearForm();
        $('#rootwizard').bootstrapWizard('show', 0);
        $('#rootwizard #schedule-type').val('');
        $('#schedule-type').trigger('change');
    });

    $('.return-home-no').click(function () {

        if (_phaseRestrictions.MaximumSchedules && leave.clientLeaveSchedules.length >= _phaseRestrictions.MaximumSchedules) {
            $.growl.error({ message: 'The maximum number of destinations for this agenda type has been reached', location: 'br', size: 'large', duration: '5000' });
        } else {
            _schedule = new Schedule('new', leave, null);
            $('#schedule-wizard #schedule-index').val(leave.clientLeaveSchedules.length);
            loadModal();
        }
    });

    $('.return-home-yes').click(function () {
        leave.clientLeaveSchedules[leave.clientLeaveSchedules.length - 1].returnsToCenter = 'Y';
        $('#rootwizard').bootstrapWizard('show', 7);
    });

    $('#rootwizard #schedule-type').on('change', function () {
        getDestinations($(this), $('#rootwizard #destination'));
    });

    $('#departure-transportation-mode').on('change', function () {
        toggleCarFields($(this), $('.depart-vehicle,.depart-driver'));
    });

    $('#return-transportation-mode').on('change', function () {
        toggleCarFields($(this), $('.return-vehicle,.return-driver'));
    });

});

// From https://www.sitepoint.com/jquery-function-clear-form-data/
function clearForm(form) {
    // iterate over all of the inputs for the form
    // element that was passed in
    $(':input', form).each(function () {
        var type = this.type;
        var tag = this.tagName.toLowerCase(); // normalize case
        // it's ok to reset the value attr of text inputs,
        // password inputs, and textareas
        if (type == 'text' || type == 'password' || tag == 'textarea')
            this.value = "";
        // checkboxes and radios need to have their checked state cleared
        // but should *not* have their 'value' changed
        else if (type == 'checkbox' || type == 'radio')
            this.checked = false;
        // select elements need to have their 'selectedIndex' property set to -1
        // (this works for both single and multiple select elements)
        else if (tag == 'select')
            this.selectedIndex = -1;
    });
};

function updatePhaseRestrictions() {

    $.post('/agenda/leavevalidationcriteria/leavetype', { leaveType: $('#leave-type').val(), date: $('#depart-date-time-picker').data("DateTimePicker").date().format("MM/DD/YYYY") }, function (data) {
        _phaseRestrictions = data;
        return true;
    }).error(function () {
        _phaseRestrictions = null;
        return false;
    });
}

function validateAgenda(allowContinue) {

    //var minStart = moment(leave.scheduledDeparture).add(-leave.scheduledDeparture.getTimezoneOffset(), 'm');
    //var maxEnd = leave.clientLeaveSchedules.length != 0 ? moment(
    //    (leave.scheduledReturn == undefined || leave.scheduledReturn == null)
    //        ? leave.clientLeaveSchedules[leave.clientLeaveSchedules.length - 1].endDate
    //        : leave.scheduledReturn
    //).add(-leave.scheduledDeparture.getTimezoneOffset(), 'm') : null;

    var temp = true;
    $.post('/agenda/validateagenda', {
        message: {
            Id: (!DateTime || DateTime == '') ? AgendaId : 0,
            leaveType: leave.leaveType,
            scheduledDeparture: leave.scheduledDeparture.toJSON(),
            scheduledReturn: leave.scheduledReturn != undefined ? leave.scheduledReturn.toJSON() : null,
            clientLeaveSchedules: $.map(leave.clientLeaveSchedules, function (n, i) {
                return {
                    Id: n.Id,
                    scheduleType: n.scheduleType,
                    destinationType: n.destinationType == undefined ? null : n.detinationType,
                    startDate: n.startDate == undefined ? null : n.startDate.toJSON(),
                    endDate: n.endDate == undefined ? null : n.endDate.toJSON()
                }
            })
        }
    }, function (result, textStatus, jqXHR) {
        if (jqXHR.status == 403) {
            window.location.href = '/Account/Login';
        } else {
            if (result.success != undefined && result.success == false) {
                $.growl.error({ message: result.message, location: 'br', size: 'large', duration: '5000' });
                temp = allowContinue;
            } else if (result.success != undefined && result.success == true) {
                temp = true;
            } else {
                $.growl.error({ message: "Your session has expired! Please login", location: 'br', size: 'large', duration: '5000' });
                setTimeout(function () { window.location.href = '/Account/Login' }, 3000);
                temp = false;
            };
        }

    }).error(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status == 403) {
            window.location.href = '/Account/Login';
        }
    });

    return temp;

}
function fillSchedules(includeReturn) {
    $('.schedules').html('<tr><th>Departing the center at : ' + dateFormat(leave.scheduledDeparture, "m/d h:MM TT") + '</th><th></th></tr>');

    $('.schedules').append('<tr><td>Travel by ' + leave.departTransModeText + ' : <u>' + leave.departTravelTime + ' minutes</u></td><td></td></tr>');

    $(leave.clientLeaveSchedules).each(function (index, value) {
        if (index == 0) {
            $('.schedules').append('<tr><td>At <u>' + this.destinationText + '</u> from <u>' + (this.startDate == undefined ? '' : dateFormat(this.startDate, "m/d h:MM TT")) + '</u> to <u>' + (this.endDate == undefined ? '' : dateFormat(this.endDate, "m/d h:MM TT")) + '</u></td><td>' + (includeReturn ? '' : '<i class="zmdi zmdi-edit scheduleGridIcon" onclick="return editSchedule(' + index + ')"></i>') + '</td></tr>');
        } else {
            $('.schedules').append('<tr><td>At <u>' + this.destinationText + '</u> from <u>' + (this.startDate == undefined ? '' : dateFormat(this.startDate, "m/d h:MM TT")) + '</u> to <u>' + (this.endDate == undefined ? '' : dateFormat(this.endDate, "m/d h:MM TT")) + '</u></td><td>' + (includeReturn ? '' : '<i class="zmdi zmdi-edit scheduleGridIcon" onclick="return editSchedule(' + index + ')"></i><i class="zmdi zmdi-delete" onclick="return deleteSchedule(' + index + ')"></i>') + '</td></tr>');
        }
        if (this.interimTravelTime != undefined) {
            $('.schedules').append('<tr><td>Travel by ' + this.interimTransModeText + ' : <u>' + this.interimTravelTime + ' minutes</u></td><td></td></tr>');
        }
    });

    if (includeReturn) {

        $('.schedules').append('<tr><td>Travel by ' + leave.returnTransModeText + ' : <u>' + leave.returnTravelTime + ' minutes</u></td><td></td></tr>');
        $('.schedules').append('<tr><th>Returning to the center by ' + dateFormat(leave.scheduledReturn, "m/d h:MM TT") + '</th><th></th></tr>');

    }

    // As a courtesy, check to see if the leave the client is working on is going to have an overlap issue
    //var temp = validateAgenda(true);

}

function deleteSchedule(idx) {
    var schedule = leave.clientLeaveSchedules[idx];
    if (idx == 0) {

        $.growl.error({ message: "You can't delete the first destination on an agenda request!", location: 'br', size: 'large', duration: '5000' });
        return false;

    } else {

        // Going to simplify this by deleting all schedules on/after the index
        leave.scheduledReturn = null;
        leave.returnTransMode = null;
        leave.returnTransModeText = null;
        leave.returnTransVehicle = null;
        leave.returnTransDriver = null;
        leave.returnTravelTime = null;
        leave.clientLeaveSchedules[idx - 1].interimTransMode = null;
        leave.clientLeaveSchedules[idx - 1].interimTransModeText = null;
        leave.clientLeaveSchedules[idx - 1].interimTransVehicle = null;
        leave.clientLeaveSchedules[idx - 1].interimTransDriver = null;
        leave.clientLeaveSchedules[idx - 1].interimTravelTime = null;
        leave.clientLeaveSchedules[idx - 1].returnsToCenter = 'Y';

        leave.clientLeaveSchedules.splice(idx);

    };

    fillSchedules();

    $('.lblReturnDestination').text(leave.clientLeaveSchedules[leave.clientLeaveSchedules.length - 1].destinationText);

    return false;
}

function editSchedule(idx) {

    _schedule = new Schedule('edit', leave, idx);
    loadModal();

}

function getDestinations(schedType, destList) {
    if (schedType.val()) {
        var replacedText = schedType.children('option:selected').text().replace(/\//g, '--');
        $.get('/agenda/getdestinations/' + replacedText + '/' + schedType.children('option:selected').val() + '/' + $.now(), function (data, textStatus, jqXHR) {
            destList.html($.json2html(data, { '<>': 'option', 'value': '${Key}', 'html': '${Value}' }).html);

            var selected = destList.attr('data-selected');
            if (selected) {
                destList.find("option[value='" + selected + "']").attr('selected', 'selected');
                destList.removeAttr('data-selected');
            }

            destList.select2('destroy');
            destList.select2();

        }).error(function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {
                window.location.href = '/Account/Login';
            }
        });
    } else {
        destList[0].options.length = 0;

        destList.select2('destroy');
        destList.select2();
    }
}

function toggleCarFields(transMode, carFields) {
    if (transMode.children('option:selected').text() == 'Car') {
        carFields.show();
    } else {
        // Clear  dropdown values
        $(carFields).find('select').val("");
        carFields.hide();
    }
}

function loadModal() {
    if (!scheduleDialogInitialized) scheduleDialog();
    $('.schedule-wizard').modal({
        backdrop: 'static',
        keyboard: false
    });
}

function adjustLeaveTimes(adjustendtime) {
    for (var i = 0; i < leave.clientLeaveSchedules.length; i++) {
        var priorDeparture = i == 0 ? leave.scheduledDeparture : leave.clientLeaveSchedules[i - 1].endDate;
        var travelTime = i == 0 ? leave.departTravelTime : leave.clientLeaveSchedules[i - 1].interimTravelTime;
        var previousStartDate = leave.clientLeaveSchedules[i].startDate;
        leave.clientLeaveSchedules[i].startDate = moment(priorDeparture).add(travelTime, 'm').toDate();

        if (adjustendtime) {
            // Bug 1341
            var endTime = diff_minutes(leave.clientLeaveSchedules[i].endDate, previousStartDate);
            leave.clientLeaveSchedules[i].endDate = moment(leave.clientLeaveSchedules[i].startDate).add(endTime, 'm').toDate();
        }
    };

    if (leave.scheduledReturn) {
        var returnTravelTime = leave.returnTravelTime;
        leave.scheduledReturn = moment(new Date(leave.clientLeaveSchedules[leave.clientLeaveSchedules.length - 1].endDate)).add(returnTravelTime, 'm').toDate();
    }

}

function adjustLeaveTimesAfterSchedule(index) {

    for (var i = index; i < leave.clientLeaveSchedules.length; i++) {
        var priorDeparture = leave.clientLeaveSchedules[i - 1].endDate;
        var travelTime = leave.clientLeaveSchedules[i - 1].interimTravelTime;
        var previousStartDate = leave.clientLeaveSchedules[i].startDate;
        leave.clientLeaveSchedules[i].startDate = moment(priorDeparture).add(travelTime, 'm').toDate();
        var endTime = diff_minutes(leave.clientLeaveSchedules[i].endDate, previousStartDate);
        leave.clientLeaveSchedules[i].endDate = moment(leave.clientLeaveSchedules[i].startDate).add(endTime, 'm').toDate();
    };

    if (leave.scheduledReturn) {
        var returnTravelTime = leave.returnTravelTime;
        leave.scheduledReturn = moment(new Date(leave.clientLeaveSchedules[leave.clientLeaveSchedules.length - 1].endDate)).add(returnTravelTime, 'm').toDate();
    }

}


var scheduleDialog = function () {
    $('#schedule-wizard').bootstrapWizard({
        onInit: function () {
            scheduleDialogInitialized = true;
        },
        onTabShow: function (tab, navigation, index) {
            var $total = navigation.find('li').length;
            var $current = index + 1;
            var $percent = ($current / $total) * 100;
            $('#schedule-wizard .progress-bar').css({ width: $percent + '%' });

            if ($current == $total) {
                $('#schedule-wizard .schedule-finish').show();
                $('#schedule-wizard .next').hide();
            } else {
                $('#schedule-wizard .schedule-finish').hide();
                $('#schedule-wizard .next').show();
            }

            if ($current == 1) {
                $('#schedule-wizard .schedule-previous').hide();
            } else {
                $('#schedule-wizard .schedule-previous').show();
            }

            if (index == 0) {

            } else if (index == 1) {
                // Save schedule object data
                $('#schedule-wizard #transportation-mode').val(_schedule.interimTransMode);
                $('#schedule-wizard #client-contact').val(_schedule.interimTransDriver);
                $('#schedule-wizard #client-vehicle').val(_schedule.interimTransVehicle);
                if (_schedule.interimTransMode == null)
                    toggleCarFields($(this), $('.schedule-vehicle,.schedule-driver'));

            } else if (index == 2) {
                var schedStartDate;
                var schedDefaultStartDate;

                if (_schedule.schedIndex == 0) {
                    schedStartDate = new Date(leave.scheduledDeparture.getTime());
                } else {
                    var _previous = leave.clientLeaveSchedules[_schedule.schedIndex == null ? leave.clientLeaveSchedules.length - 1 : _schedule.schedIndex - 1];
                    schedStartDate = new Date(_previous.endDate.getTime());
                }


                if ($('#travel-time').data("DateTimePicker") != undefined)
                    $('#travel-time').data("DateTimePicker").destroy();

                if (!_schedule.startDate) {
                    schedDefaultStartDate = schedStartDate;
                } else {
                    schedDefaultStartDate = new Date(_schedule.startDate);
                }

                $('#travel-time').datetimepicker({
                    inline: true,
                    sideBySide: true,
                    minDate: moment(new Date(schedStartDate)).toDate(),
                    maxDate: moment(new Date(schedStartDate)).add(30, 'd').toDate().setHours(23, 59, 59, 999),
                    defaultDate: moment(new Date(schedDefaultStartDate))
                });
            } else if (index == 3) {

                var endDate;
                if (!_schedule.endDate) {
                    endDate = new Date(_schedule.startDate);
                } else {
                    endDate = new Date(_schedule.endDate);
                }

                if ($('#end-date-time-picker').data("DateTimePicker") != undefined)
                    $('#end-date-time-picker').data("DateTimePicker").destroy();

                $('#end-date-time-picker').datetimepicker({
                    inline: true,
                    sideBySide: true,
                    defaultDate: new Date(endDate.getTime())
                });
            }

        },
        onNext: function (tab, navigation, index) {

            // Set index to be consistent with onShow. Represents the tab you are leaving or showing.
            index--;

            if (index == 0) {

                // Field validation
                if (!$('#schedule-wizard #schedule-type').tomRequired('Destination type is required'))
                    return false;
                if (!$('#schedule-wizard #destination').tomRequired('Destination is required'))
                    return false;

                $('.lblScheduleDestination').text($('#schedule-wizard #destination option:selected').text());

                // Save schedule object data
                _schedule.scheduleType = $('#schedule-wizard #schedule-type').val();
                _schedule.destination = $('#schedule-wizard #destination').val();
                _schedule.destinationText = $('#schedule-wizard #destination option:selected').text();

            }
            else if (index == 1) {

                // Field validation
                if (!$('#schedule-wizard #transportation-mode').tomRequired('Transportation mode is required'))
                    return false;

                // Save schedule object data
                _schedule.interimTransMode = $('#schedule-wizard #transportation-mode').val();
                _schedule.interimTransModeText = $('#schedule-wizard #transportation-mode option:selected').text();
                _schedule.interimTransDriver = $('#schedule-wizard #client-contact').val();
                _schedule.interimTransVehicle = $('#schedule-wizard #client-vehicle').val();

            }
            else if (index == 2) {

                var travelTime = new Date($('#schedule-wizard #travel-time').data("DateTimePicker").date());

                var schedStartDate;
                if (_schedule.schedIndex == 0) {
                    schedStartDate = new Date(leave.scheduledDeparture.getTime());
                } else {
                    var _previous = leave.clientLeaveSchedules[_schedule.schedIndex == null ? leave.clientLeaveSchedules.length - 1 : _schedule.schedIndex - 1];
                    schedStartDate = new Date(_previous.endDate.getTime());
                }


                // Field validation
                if (travelTime <= schedStartDate) {
                    $('#schedule-wizard #travel-time').notify('Date/Time should be greater than ' + schedStartDate.format("m/d/yyyy H:MM TT"));
                    return false;
                }


                var travelTimeInMinutes = diff_minutes(travelTime, schedStartDate);

                schedStartDate = travelTime;


                var previousStartDate = _schedule.startDate;


                if (_schedule.endDate) {
                    var changeInStartDate = diff_minutes(previousStartDate, schedStartDate);
                    _schedule.endDate = moment(new Date(_schedule.endDate)).add(changeInStartDate, 'm').toDate();
                }



                // If we're editing an existing schedule we need to make sure that the travel time does not push the startDate of the schedule out past the original endDate
                //if (_schedule.endDate != null) {

                //    if (schedStartDate > _schedule.endDate) {
                //        $.growl.notice({ message: 'Increased travel time has resulted in an adjustment to the time you are scheduled to leave this destination.', location: 'br', size: 'large', duration: '5000' });
                //        _schedule.endDate = schedStartDate;
                //    }

                //}


                // Save schedule object data
                _schedule.interimTravelTime = travelTimeInMinutes;
                _schedule.startDate = schedStartDate;

            } else if (index == 3) {
                var endDate = new Date($('#end-date-time-picker').data("DateTimePicker").date());

                // Field validation
                if (_schedule.startDate >= endDate) {
                    $('#end-date-time-picker').notify('Start date must be less than end date');
                    return false;
                }

                if (moment.duration(moment(endDate).diff(moment(_schedule.startDate))).asMinutes() > _scheduleRestrictions.ScheduleTimeMaxMinutes) {
                    $.growl.error({ message: 'The maximum time at this destination is ' + _scheduleRestrictions.ScheduleTimeMaxMinutes + ' minutes', location: 'br', size: 'large', duration: '5000' });
                    return false;
                }

                // Save schedule object data
                _schedule.endDate = endDate;
            }
        },
        onPrevious: function (tab, navigation, index) { },
        onTabClick: function (tab, navigation, index) {
            return false;
        }
    });

    $('.schedule-wizard').on('hidden.bs.modal', function (e) {
        fillSchedules();
    });

    $('.schedule-wizard').on('shown.bs.modal', function () {

        if (_schedule.actionType == 'new') {

            $('#schedule-wizard #schedule-type,#schedule-wizard #destination,#schedule-wizard #transportation-mode,#schedule-wizard #client-vehicle,#schedule-wizard #client-contact,#schedule-wizard #travel-time, #schedule-wizard #schedeuleComments').val('');
            $('#schedule-wizard #destination').removeAttr('data-selected');
            $('#schedule-wizard #schedule-type').trigger('change');
        } else {
            $('#schedule-wizard #schedule-index').val(_schedule.schedIndex);
            $('#schedule-wizard #schedule-type').val(_schedule.scheduleType);

            $('#schedule-wizard #destination').attr('data-selected', _schedule.destination);
            $('#schedule-wizard #schedule-type').trigger('change');

            $('#schedule-wizard #transportation-mode').val(_schedule.interimTransMode);
            $('#schedule-wizard #transportation-mode').trigger('change');
            $('#schedule-wizard #client-vehicle').val(_schedule.interimTransVehicle);
            $('#schedule-wizard #client-contact').val(_schedule.interimTransDriver);
            $('#schedule-wizard #travel-time').val(_schedule.interimTravelTime);
            $('#schedule-wizard #schedeuleComments').val(_schedule.comments);
        }
        $('#schedule-wizard').bootstrapWizard('first');
    });

    $('#schedule-wizard .finish').click(function () {
        jQuery.ajaxSetup({ async: false });

        // Save schedule object data
        _schedule.comments = $("#schedule-wizard #schedeuleComments").val();

        var _current;
        var _isNewSchedule;

        if (_schedule.schedIndex == null || _schedule.schedIndex == undefined) {
            _schedule.schedIndex = leave.clientLeaveSchedules.push({}) - 1;
            _isNewSchedule = true;
        }

        _current = leave.clientLeaveSchedules[_schedule.schedIndex];

        if (!DateTime || DateTime == '')
            _current.clientLeaveId = AgendaId;


        if (_schedule.schedIndex == 0) {
            _current.scheduleType = _schedule.scheduleType;
            _current.destination = _schedule.destination;
            _current.destinationText = _schedule.destinationText;
            _current.startDate = _schedule.startDate;
            _current.endDate = _schedule.endDate;
            _current.comments = _schedule.comments;
            leave.departTravelTime = parseInt(_schedule.interimTravelTime);
            leave.departTransMode = _schedule.interimTransMode;
            leave.departTransModeText = _schedule.interimTransModeText;
            leave.departTransDriver = _schedule.interimTransDriver;
            leave.departTransVehicle = _schedule.interimTransVehicle;
        } else {
            var _previous;
            _previous = leave.clientLeaveSchedules[_schedule.schedIndex - 1];

            _current.scheduleType = _schedule.scheduleType;
            _current.destination = _schedule.destination;
            _current.destinationText = _schedule.destinationText;
            _current.startDate = _schedule.startDate;
            _current.endDate = _schedule.endDate;
            _current.comments = _schedule.comments;
            _previous.interimTravelTime = _schedule.interimTravelTime;
            _previous.interimTransMode = _schedule.interimTransMode;
            _previous.interimTransModeText = _schedule.interimTransModeText;
            _previous.interimTransDriver = _schedule.interimTransDriver;
            _previous.interimTransVehicle = _schedule.interimTransVehicle;

        };


        if (validateAgenda(false)) {
            adjustLeaveTimesAfterSchedule(_schedule.schedIndex + 1);

            $('.lblReturnDestination').text(_schedule.destinationText);

            if (_isNewSchedule && leave.scheduledReturn)
                leave.scheduledReturn = null;

        } else {
            leave.clientLeaveSchedules.pop();
        }


        jQuery.ajaxSetup({ async: true });

        $('.schedule-wizard').modal('hide');
    });

    $('#schedule-wizard #schedule-type').on('change', function () {
        getDestinations($(this), $('#schedule-wizard #destination'));
    });

    $('#schedule-wizard #transportation-mode').on('change', function () {
        toggleCarFields($(this), $('.schedule-vehicle,.schedule-driver'));
    });

};

function ViewPhaseLeaveCountDetails() {
    $.post('/agenda/GetAllowableLeaves?stamp=' + $.now(), { scheduledDate: $('#depart-date-time-picker').data("DateTimePicker").date().format("MM/DD/YYYY") }, function (json) {
        if (json.success) {
            $("#allowable-leaves-modal .modal-title span").text(json.leaveWeekRangeText);

            var html = '';
            $.each(json.allowedLeavesByLeaveType, function (i, v) {
                //Modify date 11th - Nov - 2018(Kanwaldeep Singh)
                //Add for User story 649 
                html += nano('<tr><td>{LeaveType}</td><td>{AllowableCount}</td><td>{MonthlyCount}</td><td>{ActualUsed}</td><td>{Outstandingleaves}</td></tr>', v);
            });
            $("#allowable-leaves-modal #allowable-leaves tbody").html(html);

            html = '';
            //Modify date 11th - Nov - 2018(Kanwaldeep Singh)
            //Add for User story 649 
            $.each(json.allowedLeavesByScheduleType, function (i, v) {
                html += nano('<tr><td>{ScheduleType}</td><td>{AllowableCount}</td><td>{MonthlyCount}</td><td>{ActualUsed}</td><td>{Outstandingleaves}</td></tr>', v);
            });

            $("#allowable-leaves-modal #allowable-schedule-leaves tbody").html(html);

            $('#allowable-leaves-modal').modal({
                backdrop: 'static',
                keyboard: false
            });
        }
    }).error(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status == 403) {
            window.location.href = '/Account/Login';
        }
    });
}


