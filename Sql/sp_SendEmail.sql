USE [PeakSys]
GO
/****** Object:  StoredProcedure [dbo].[sp_SendEmail]    Script Date: 04/04/2020 10:57:30 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================                                          
-- Author:  Saddam                                          
-- Created Date: 13th-Jan-16 // TerminateEnrollment event type added                                          
-- Modifi Date: 27th-Nov-18(743) // Added new case for ChangedSecurityProcedureStatus.                                          
-- Modifi Date: 27th-Nov-18(744) // Added new and for new and Changed Client Grievance.                                        
-- Modifi Date: 28th-Nov-18                                      
-- Description: Added new case for Treatment Group Facilitator. Userstory_726                                          
-- Modifi Date: 28th-Oct-18 // Added identifier and release to inside mail body of enrollments(#750)by: Neeraj Saini                                      
-- Modifi Date: 24th-Nov-18 // Added new case for ChangedMovementStatus(#741)by: Neeraj Saini                                      
-- Description: This procedure will be used to Send Email                                          
-- Modifi Date: 12/03/2018 User story 800                                      
-- Description: Added hours required in the Email for new session note                                      
-- Modifi Date: 12/03/2018 user story 796                                      
-- Description: Added new event 'NewRoomAssignment'                                    
-- Modifi Date: 12/03/2019 user story 991                                      
-- Description: fixed date conversion issue in security procedure event.                                    
-- Modifi Date: 01/24/2019 user story 1099                                      
-- Description: Modified movement case.                                  
-- Modifi Date: 02/04/2019 user story 1138                                      
-- Description: Added new event 'New TOMREX Agenda Request'.                                  
-- Modifi Date: 11th march 2019 user story 1279                                      
-- Description: Adust code for modified function "fn_GetWorkFlowOldAndNewValueWithColumn" for fetching old and new value.                                  
-- Modifi Date: 08th April 2019 user story 1362                                      
-- Description: Added new assignee type of grievance investigator.                                  
-- Modifi Date: 04th June 2019 user story 1532                                      
-- Modifi Date: 08th july 2019 user story 1704                                  
-- Description: Added new event 'Changed Assessment Billing Code'                                  
-- Modifi Date: 17th July 2019 user story 1701     
--Modified Date:26th Aug 2019 user story 1810                                
--Description : Added for event 'ChangedTreatmentGroupRegistarion'                                    
--Modified Date:26th Aug 2019  user story 1819                                
--Description : Added new event 'New Client Sign Out' 
--Modified Date:14th Oct 2019
--Description:added new recipient type 'Probation Officer' 
--Description:added new recipient type 'Probation Officer' Userstory(1991)
--Modified Date:Added niew event 'ChangedScheduledCompletionDate' usertory(1992)  
--ModifiedDate:12th Feb 2020
--Description:Added the new event NewClientServicePeriod                                 
-- =============================================         
-- Drop Proc dbo.sp_SendEmail                                          

CREATE PROCEDURE [dbo].[sp_SendEmail] @recipienttype AS int, @recipientid AS int, @externalemail AS nvarchar(255), @subject AS nvarchar(255), @bodytext AS nvarchar(max), @queuestepactionid AS int, @keyid AS int
AS
BEGIN
    DECLARE @workflowid AS int;
    DECLARE @eventname AS varchar(250);
    DECLARE @recipientemailaddress AS varchar(250);
    DECLARE @multirecipient AS int;
    DECLARE @clientname AS varchar(250);
    DECLARE @clientprogramenrollmentid AS int;
    DECLARE @recipienttypedescription AS varchar(255);
    DECLARE @program AS varchar(50);
    DECLARE @service varchar(50);
    DECLARE @appurl AS varchar(255);
    DECLARE @clientid AS int;
    DECLARE @eventtype AS varchar(6);
    DECLARE @attachment AS varchar(250);
    DECLARE @grievancecategory varchar(50);
    DECLARE @headline varchar(max);
    DECLARE @description varchar(max);
    DECLARE @grievancedate datetime;
    DECLARE @identifier AS varchar(15);
    DECLARE @hoursrequired AS varchar(20);
    DECLARE @building AS varchar(100);
    DECLARE @bed AS varchar(50);
    DECLARE @movementtype AS varchar(50);
    DECLARE @movementdate_est AS char(16);
    DECLARE @movementdate_act AS char(16);
    DECLARE @movementcomments AS varchar(max);
    DECLARE @movementtransport AS varchar(50);
    DECLARE @movement AS varchar(100);
    DECLARE @program_entering AS varchar(100);
    DECLARE @clientprogramenrollment_ending AS varchar(100);
    DECLARE @pointofdeparture AS varchar(50);
    DECLARE @definednotetext AS varchar(max);
    DECLARE @changedmovementtype AS varchar(50);
    DECLARE @changedmovementstatus AS varchar(50);
    DECLARE @estimatedmovementdate AS varchar(10);
    DECLARE @actualmovementdate AS varchar(10);
    DECLARE @scheduleddeparture datetime;
    DECLARE @scheduledreturn datetime;
    DECLARE @actualdeparture datetime;
    SET @multirecipient = 0;
    SET @bodytext = ISNULL(@bodytext, '');
    SET @subject = ISNULL(@subject, 'Workflow Event');
    SET @attachment = '';

    IF @queuestepactionid > -1
    BEGIN
        SELECT @eventname = WFE.EventName, 
               @eventtype = GCEventType.CodeName, 
               @recipienttypedescription = GC.CodeName, 
               @workflowid = W.WorkflowId
          FROM WorkFlowEvents AS WFE
          INNER JOIN WorkFlows AS W ON WFE.WorkFlowEventId = W.WorkFlowEventId
          INNER JOIN WorkFlowSteps AS WS ON W.WorkFlowId = WS.WorkFlowId
          INNER JOIN WorkFlowStepActions AS WFSA ON WS.WorkFlowStepId = WFSA.WorkFlowStepId
          INNER JOIN QueueStepActions AS QSA ON WFSA.WorkFlowStepActionId = QSA.WorkFlowStepActionId
          INNER JOIN GlobalCodes AS GC ON WFSA.ColumnGlobalCode1 = GC.GlobalCodeId
          INNER JOIN GlobalCodes AS GCEventType ON WFE.EventType = GCEventType.GlobalCodeId
         WHERE QSA.QueueStepActionId = @queuestepactionid;
        SELECT @recipientid = CASE @recipienttypedescription
                                  WHEN 'Specific Staff'
                                  THEN U.UserId
                                  WHEN 'Clients Case Manager'
                                  THEN-1
                                  WHEN 'Clients Secondary Case Manager'
                                  THEN-2
                                  WHEN 'External Email'
                                  THEN-3                                        
                              -- Add for User story 726                                      
                                  WHEN 'Treatment Group Facilitator'
                                  THEN-4                                  
                              -- Add for User story 1362                                      
                                  WHEN 'Grievance Investigator'
                                  THEN-5                                  
                              -- Add for User story 1532                                      
                                  WHEN 'Service Manager'
                                  THEN-6 
                              --Add for User story 1991 
                                  WHEN 'Probation Officer'
                                  THEN-7
                              END
          FROM WorkFlowStepActions AS WFSA
          INNER JOIN QueueStepActions AS QSA ON WFSA.WorkFlowStepActionId = QSA.WorkFlowStepActionId
          INNER JOIN GlobalCodes AS G ON WFSA.ColumnGlobalCode1 = G.GlobalCodeId
          LEFT JOIN Users AS U ON WFSA.ColumnInteger1 = U.UserId
         WHERE QSA.QueueStepActionId = @queuestepactionid;
    END;

    IF @eventname = 'NewClientIncidentReports'
       OR @eventname = 'ChangedIncidentReportStatus'
    BEGIN
        DECLARE @ircode AS char(5);
        DECLARE @irdesc AS varchar(max);
        DECLARE @irdate AS datetime;
        SELECT @appurl = ApplicationUrl
          FROM InstallInfo;
        SELECT @clientname = C.LastName + ', ' + C.FirstName, 
               @clientid = C.ClientId, 
               @ircode = IRC.IncidentReportCode, 
               @irdesc = IRC.Description, 
               @irdate = CIR.IncidentDateTime
          FROM ClientProgramEnrollments AS CPE
          INNER JOIN Clients AS C ON CPE.ClientId = C.ClientId
          INNER JOIN ClientIncidentReports AS CIR ON CPE.ClientProgramEnrollmentId = CIR.ClientProgramEnrollmentId
          INNER JOIN IncidentReportCodes AS IRC ON CIR.IncidentReportCodeId = IRC.IncidentReportCodeId
         WHERE CIR.ClientIncidentReportId = @keyid;

        SET @appurl = @appurl + '/Security/IncidentReportDetail.aspx?ClientIncidentReportId=' + CAST(@keyid AS varchar(50)) + '&SelectClientId=' + CAST(@clientid AS varchar(50));
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'IR Code: ' + @ircode + '<br/>';
        SET @bodytext = @bodytext + 'Charge: ' + @irdesc + '<br/>';
        SET @bodytext = @bodytext + 'Date/Time: ' + CONVERT(varchar, @irdate) + '<br/>';
        IF @eventtype = 'Change'
        BEGIN
            SET @bodytext = @bodytext + CAST(dbo.fn_GetWorkFlowOldAndNewValueWithColumn(@workflowid, @queuestepactionid) AS varchar(max)) + '<br/>';
        END;
        SET @bodytext = @bodytext + '<br/><br/><br/><a href=''' + @appurl + '''> Click Here to check </a>';
        IF @clientprogramenrollmentid IS NULL
        BEGIN
            SELECT @clientprogramenrollmentid = CPE.ClientProgramEnrollmentId
              FROM ClientIncidentReports AS CIE
              LEFT JOIN ClientProgramEnrollments AS CPE ON CIE.ClientProgramEnrollmentId = CPE.ClientProgramEnrollmentId
             WHERE ClientIncidentReportId = @keyid;
        END;
    END;

    IF @eventname = 'NewShiftNotes'
    BEGIN
        DECLARE @shiftnotedate datetime;
        DECLARE @shiftnotetype varchar(50);
        DECLARE @priority varchar(50);
        DECLARE @note varchar(max);
        DECLARE @clients varchar(max);
        DECLARE @createdby varchar(50);
        SELECT @shiftnotedate = sn.ShiftNoteDate, 
               @shiftnotetype = snt.ShiftNoteType, 
               @priority = gc.CodeName, 
               @note = REPLACE(CONVERT(varchar(max), sn.Note), CHAR(13) + CHAR(10), '<br>'), 
               @clients = REPLACE(ISNULL(dbo.fn_GetShiftNoteClients(sn.ShiftNoteId), ''), ' <br> ', ', '), 
               @createdby = sn.CreatedBy
          FROM ShiftNotes AS sn
          INNER JOIN ShiftNoteTypes AS snt ON sn.ShiftNoteTypeId = snt.ShiftNoteTypeId
          INNER JOIN GlobalCodes AS gc ON snt.Priority = gc.GlobalCodeId
         WHERE sn.ShiftNoteId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Date/Time: ' + CONVERT(varchar, @shiftnotedate) + '<br/>';
        SET @bodytext = @bodytext + 'Created By: ' + CONVERT(varchar, @createdby) + '<br/>';
        SET @bodytext = @bodytext + 'Note Type (Priority): ' + @shiftnotetype + ' (' + @priority + ')<br/>';
        IF @clients > ''
        BEGIN
            SET @bodytext = @bodytext + 'Clients: ' + @clients + '<br/>';
        END;
        SET @bodytext = @bodytext + 'Note: ' + @note + '<br/>';
        IF @recipientid IS NULL
        BEGIN
            SET @recipientid = 1;
        END;

        -- If shift note details need to be sent to CM/2nd CM and there are clients linked to the note                                    
        -- Then set the @multirecipient flag and get the CMs assigned to clients on the note                                          
        IF @recipientid < 0
           AND @clients > ''
        BEGIN
            SET @multirecipient = 1;
            SET @recipientemailaddress = dbo.fn_GetShiftNoteCMEmailAddresses(@keyid, @recipientid * -1);
        END;
    END;

    IF @eventname = 'NewClientProgramEnrollments'
    BEGIN
        DECLARE @startdate AS datetime;
        SELECT @clientname = c.LastName + ', ' + c.FirstName, 
               @program = p.Program, 
               @startdate = cpe.StartDate, 
               @identifier = ci.Identifier
          FROM ClientProgramEnrollments AS cpe
          INNER JOIN Clients AS c ON cpe.ClientId = c.ClientId
          INNER JOIN Programs AS p ON cpe.ProgramId = p.ProgramId
          LEFT JOIN ClientIdentifiers AS ci ON cpe.ClientIdentifierId = ci.ClientIdentifierId
         WHERE cpe.ClientProgramEnrollmentId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Program: ' + @program + '<br/>';
        SET @bodytext = @bodytext + 'Start Date: ' + CONVERT(varchar, @startdate, 101) + '<br/>';
        SET @bodytext = @bodytext + 'Identifier: ' + ISNULL(@identifier, 'n/a') + '<br/>';
        IF @clientprogramenrollmentid IS NULL
        BEGIN
            SET @clientprogramenrollmentid = @keyid;
        END;
    END;

    IF @eventname = 'NewClientCaseFile'
    BEGIN
        DECLARE @daterange AS varchar(50);
        DECLARE @documenttype AS varchar(50);
        DECLARE @documentdesc AS varchar(50);
        SELECT @clientname = c.LastName + ', ' + c.FirstName, 
               @documenttype = gc.CodeName, 
               @documentdesc = ccf.Description, 
               @program = p.Program, 
               @daterange = CONVERT(varchar, cpe.StartDate, 101) + ' - ' + CASE
                                                                               WHEN cpe.ActualEndDate IS NULL
                                                                               THEN 'Current'
                                                                               ELSE CONVERT(varchar, cpe.ActualEndDate, 101)
                                                                           END
          FROM ClientCaseFile AS ccf
          INNER JOIN ClientProgramEnrollments AS cpe ON ccf.ClientProgramEnrollmentId = cpe.ClientProgramEnrollmentId
          INNER JOIN Clients AS c ON cpe.ClientId = c.ClientId
          INNER JOIN GlobalCodes AS gc ON ccf.DocumentType = gc.GlobalCodeId
          INNER JOIN Programs AS p ON cpe.ProgramId = p.ProgramId
         WHERE ccf.ClientCaseFileId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Document Type: ' + @documenttype + '<br/>';
        SET @bodytext = @bodytext + 'Enrollment: ' + @program + ' (' + @daterange + ')' + '<br/>';
        SET @bodytext = @bodytext + 'Description: ' + @documentdesc + '<br/>';
        IF @clientprogramenrollmentid IS NULL
        BEGIN
            SELECT @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId
              FROM ClientCaseFile AS ccf
              INNER JOIN ClientProgramEnrollments AS CPE ON ccf.ClientProgramEnrollmentId = cpe.ClientProgramEnrollmentId
             WHERE ccf.ClientCaseFileId = @keyid;
        END;
    END;

    IF(@eventname = 'NewClientArrival')  --- Contains only program entering.                                  
    BEGIN
        SELECT TOP 1 @clientname = c.LastName + ', ' + c.FirstName, 
                     @movementtype = gc1.CodeName, 
                     @movementdate_est = ISNULL(CONVERT(varchar, EstimatedMovementDate, 101) + ' ' + SUBSTRING(CONVERT(varchar, EstimatedMovementDate, 108), 1, 5), ''), 
                     @movementdate_act = ISNULL(CONVERT(varchar, ActualMovementDate, 101) + ' ' + SUBSTRING(CONVERT(varchar, ActualMovementDate, 108), 1, 5), ''), 
                     @movementcomments = ISNULL(cm.Comments, ''), 
                     @movementtransport = ISNULL(gc2.CodeName, ''), 
                     @movement = gc1.CodeName + ISNULL(CASE
                                                           WHEN gc3.CodeName IS NULL
                                                           THEN ''
                                                           ELSE ' (' + gc3.CodeName + ')'
                                                       END, ''), 
                     @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId
          FROM ClientMovements AS cm
          INNER JOIN Clients AS c ON cm.ClientId = c.ClientId
          INNER JOIN GlobalCodes AS gc1 ON cm.MovementType = gc1.GlobalCodeId
          LEFT JOIN GlobalCodes AS gc2 ON cm.TransportationMode = gc2.GlobalCodeId
          LEFT JOIN GlobalCodes AS gc3 ON cm.PointOfDeparture = gc3.GlobalCodeId
          LEFT JOIN Programs AS p1 ON cm.Program_Entering = p1.ProgramId
          LEFT JOIN ClientProgramEnrollments AS cpe ON cm.ClientId = cpe.ClientId
                                                       AND cm.Program_Entering = cpe.ProgramId
         WHERE cm.ClientMovementId = @keyid
        ORDER BY cpe.StartDate DESC;

        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;

        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Movement Type: ' + @movementtype + '<br/>';
        SET @bodytext = @bodytext + 'Movement: ' + @movement + '<br/>';
        SET @bodytext = @bodytext + 'Estimated Movement Date: ' + @movementdate_est + '<br/>';
        SET @bodytext = @bodytext + 'Actual Movement Date: ' + @movementdate_act + '<br/>';
        SET @bodytext = @bodytext + 'Transportation: ' + @movementtransport + '<br/>';
        SET @bodytext = @bodytext + 'Comments: ' + @movementcomments + '<br/>';
    END;

    IF(@eventname = 'NewClientTransfer'
       OR @eventname = 'NewClientRelease')
    BEGIN
        SELECT @clientname = c.LastName + ', ' + c.FirstName, 
               @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId, 
               @movementtype = gc1.CodeName, 
               @movementdate_est = ISNULL(CONVERT(varchar, EstimatedMovementDate, 101) + ' ' + SUBSTRING(CONVERT(varchar, EstimatedMovementDate, 108), 1, 5), ''), 
               @movementdate_act = ISNULL(CONVERT(varchar, ActualMovementDate, 101) + ' ' + SUBSTRING(CONVERT(varchar, ActualMovementDate, 108), 1, 5), ''), 
               @movementcomments = ISNULL(cm.Comments, ''), 
               @movementtransport = ISNULL(gc2.CodeName, ''), 
               @movement = gc1.CodeName + ' (' + CASE gc1.CodeName
                                                     WHEN 'Release'
                                                     THEN p2.Program + ' -> ' + ISNULL(gc3.CodeName, '')
                                                     ELSE p2.Program + ' -> ' + ISNULL(p1.Program, '')
                                                 END + ')'
          FROM ClientMovements AS cm
          INNER JOIN Clients AS c ON cm.ClientId = c.ClientId
          INNER JOIN GlobalCodes AS gc1 ON cm.MovementType = gc1.GlobalCodeId
          INNER JOIN ClientProgramEnrollments AS cpe ON cm.ClientProgramEnrollmentId_Ending = cpe.ClientProgramEnrollmentId
          INNER JOIN Programs AS p2 ON cpe.ProgramId = p2.ProgramId
          LEFT JOIN GlobalCodes AS gc2 ON cm.TransportationMode = gc2.GlobalCodeId
          LEFT JOIN Programs AS p1 ON cm.Program_Entering = p1.ProgramId
          LEFT JOIN GlobalCodes AS gc3 ON cpe.ReleaseTo = gc3.GlobalCodeId
         WHERE cm.ClientMovementId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Movement Type: ' + @movementtype + '<br/>';
        SET @bodytext = @bodytext + 'Movement: ' + @movement + '<br/>';
        SET @bodytext = @bodytext + 'Estimated Movement Date: ' + @movementdate_est + '<br/>';
        SET @bodytext = @bodytext + 'Actual Movement Date: ' + @movementdate_act + '<br/>';
        SET @bodytext = @bodytext + 'Transportation: ' + @movementtransport + '<br/>';
        SET @bodytext = @bodytext + 'Comments: ' + @movementcomments + '<br/>';
    END;

    IF @eventname = 'NewTasks'
    BEGIN
        DECLARE @tasktype AS varchar(50);
        DECLARE @taskstatus AS varchar(50);
        DECLARE @taskdue AS varchar(10);
        DECLARE @taskcomments AS varchar(max);
        SELECT @clientname = c.LastName + ', ' + c.FirstName, 
               @tasktype = gc1.CodeName, 
               @taskstatus = gc2.CodeName, 
               @taskdue = CONVERT(varchar, t.DueDate, 101), 
               @taskcomments = ISNULL(t.Comments, 'None')
          FROM Tasks AS t
          INNER JOIN Clients AS c ON t.ClientId = c.ClientId
          INNER JOIN GlobalCodes AS gc1 ON t.TaskType = gc1.GlobalCodeId
          INNER JOIN GlobalCodes AS gc2 ON t.TaskStatus = gc2.GlobalCodeId
         WHERE t.TaskId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Task: ' + @tasktype + '<br/>';
        SET @bodytext = @bodytext + 'Status: ' + @taskstatus + '<br/>';
        SET @bodytext = @bodytext + 'Due Date: ' + @taskdue + '<br/>';
        SET @bodytext = @bodytext + 'Comments: ' + @taskcomments + '<br/>';
        IF @clientprogramenrollmentid IS NULL
        BEGIN
            SELECT @clientprogramenrollmentid = ISNULL(ClientProgramEnrollmentId, -1)
              FROM Tasks
             WHERE TaskId = @keyid;
        END;
    END;

    IF @eventname = 'ChangedTaskStatus'
    BEGIN
        PRINT 'ChangedTaskStatus';
        PRINT 'key ' + CONVERT(varchar, @keyid);
        SELECT @clientname = c.LastName + ', ' + c.FirstName, 
               @clientprogramenrollmentid = T.ClientProgramEnrollmentId, 
               @tasktype = gc1.CodeName, 
               @taskstatus = gc2.CodeName, 
               @taskdue = CONVERT(varchar, t.DueDate, 101), 
               @taskcomments = ISNULL(t.Comments, 'None')
          FROM Tasks AS T
          INNER JOIN Clients AS C ON T.ClientId = C.ClientId
          INNER JOIN GlobalCodes AS gc1 ON t.TaskType = gc1.GlobalCodeId
          INNER JOIN GlobalCodes AS gc2 ON t.TaskStatus = gc2.GlobalCodeId
         WHERE TaskId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Task: ' + @tasktype + '<br/>';
        SET @bodytext = @bodytext + 'Status: ' + @taskstatus + '<br/>';
        SET @bodytext = @bodytext + 'Due Date: ' + @taskdue + '<br/>';
        SET @bodytext = @bodytext + 'Comments: ' + @taskcomments + '<br/>';
    END;

    IF @eventname = 'NewClientContactNotes'
    BEGIN
        DECLARE @notetype AS varchar(50);
        DECLARE @notedate AS varchar(10);
        DECLARE @notestaff AS varchar(100);
        SELECT @clientname = c.LastName + ', ' + c.FirstName, 
               @notetype = gc1.CodeName, 
               @notedate = CONVERT(varchar, ccn.NoteDateTime, 101), 
               @notestaff = u.LastName + ', ' + u.FirstName
          FROM ClientContactNotes AS ccn
          INNER JOIN Clients AS c ON ccn.ClientId = c.ClientId
          INNER JOIN GlobalCodes AS gc1 ON ccn.NoteType = gc1.GlobalCodeId
          INNER JOIN Users AS u ON ccn.StaffId = u.UserId
         WHERE ccn.ContactNoteId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Note Type: ' + @notetype + '<br/>';
        SET @bodytext = @bodytext + 'Note Date: ' + @notedate + '<br/>';
        SET @bodytext = @bodytext + 'Staff: ' + @notestaff + '<br/>';
        IF @clientprogramenrollmentid IS NULL
        BEGIN
            SELECT @clientprogramenrollmentid = ClientProgramEnrollmentId
              FROM ClientContactNotes
             WHERE ContactNoteId = @keyid;
        END;
    END;

    IF @eventname = 'NewClientPositiveIncidents'
    BEGIN
        DECLARE @pirdesc AS varchar(max);
        DECLARE @pirdate AS varchar(max);
        SELECT @appurl = ApplicationUrl
          FROM InstallInfo;
        SELECT @clientname = C.LastName + ', ' + C.FirstName, 
               @clientid = C.ClientId, 
               @pirdesc = CPI.IncidentDescription, 
               @pirdate = CPI.IncidentDateTime, 
               @clientprogramenrollmentid = CPE.ClientProgramEnrollmentId
          FROM ClientProgramEnrollments AS CPE
          INNER JOIN Clients AS C ON CPE.ClientId = C.ClientId
          INNER JOIN ClientPositiveIncidents AS CPI ON CPE.ClientProgramEnrollmentId = CPI.ClientProgramEnrollmentId
         WHERE CPI.ClientPositiveIncidentId = @keyid;
        SET @appurl = @appurl + '/Security/PositiveIncidentDetail.aspx?ClientPositiveIncidentId=' + CAST(@keyid AS varchar(50)) + '&SelectClientId=' + CAST(@clientid AS varchar(50));
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Description: ' + @pirdesc + '<br/>';
        SET @bodytext = @bodytext + 'Date/Time: ' + CONVERT(varchar, @pirdate) + '<br/>';
        SET @bodytext = @bodytext + '<br/><br/><br/><a href=''' + @appurl + '''> Click Here to check </a>';
        IF @clientprogramenrollmentid IS NULL
        BEGIN
            SELECT @clientprogramenrollmentid = ClientProgramEnrollmentId
              FROM ClientPositiveIncidents
             WHERE ClientPositiveIncidentId = @keyid;
        END;
    END;

    IF @eventname = 'NewClientJobHistory'
    BEGIN
        DECLARE @employer AS varchar(50);
        DECLARE @workstart AS date;
        SELECT @clientname = C.LastName + ', ' + C.FirstName, 
               @clientid = C.ClientId, 
               @employer = e.Employer, 
               @workstart = CONVERT(date, cjh.StartDate)
          FROM ClientJobHistory AS cjh
          INNER JOIN Clients AS C ON cjh.ClientId = C.ClientId
          INNER JOIN Employers AS e ON cjh.EmployerId = e.EmployerId
         WHERE cjh.ClientJobHistoryId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Employer: ' + @employer + '<br/>';
        SET @bodytext = @bodytext + 'Start Date: ' + CONVERT(varchar, @workstart) + '<br/>';
        IF @clientprogramenrollmentid IS NULL
        BEGIN
            SELECT TOP 1 @clientprogramenrollmentid = CPE.ClientProgramEnrollmentId
              FROM ClientJobHistory AS cjh
              LEFT JOIN ClientProgramEnrollments AS CPE ON cjh.ClientId = CPE.ClientId
              LEFT JOIN Programs AS p ON CPE.ProgramId = p.ProgramId
             WHERE cjh.ClientJobHistoryId = @keyid
                   AND p.CompanyId = cjh.CompanyId
                   AND CPE.ActualEndDate IS NULL;
        END;
    END;

    IF @eventname = 'NewClientProgramConfinements'
    BEGIN
        DECLARE @confinementtype AS varchar(50);
        DECLARE @confinementstart AS date;
        DECLARE @confinementend AS date;
        DECLARE @confinementdays AS int;
        SELECT @clientname = C.LastName + ', ' + C.FirstName, 
               @clientid = C.ClientId, 
               @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId, 
               @confinementtype = ct.ConfinementType, 
               @confinementstart = CONVERT(date, ISNULL(cpc.StartDate, GETDATE())), 
               @confinementend = CONVERT(date, ISNULL(cpc.EndDate, '12/31/2099')), 
               @confinementdays = ISNULL(cpc.ConfinementDays, 0)
          FROM ClientProgramConfinements AS cpc
          INNER JOIN ClientProgramEnrollments AS cpe ON cpc.ClientProgramEnrollmentId = cpe.ClientProgramEnrollmentId
          INNER JOIN Clients AS C ON cpe.ClientId = C.ClientId
          INNER JOIN ConfinementTypes AS ct ON cpc.ConfinementType = ct.ConfinementTypeId
         WHERE cpc.ClientProgramConfinementId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Confinement Type: ' + @confinementtype + '<br/>';
        SET @bodytext = @bodytext + 'Confinement Period: ' + CONVERT(varchar, @confinementstart) + ' - ' + CONVERT(varchar, @confinementend) + '<br/>';
        SET @bodytext = @bodytext + 'Confinement Days: ' + CONVERT(varchar, @confinementdays) + '<br/>';
    END;

    IF @eventname = 'NewClientFederalIncidentReports'
    BEGIN
        DECLARE @fircode AS char(5);
        DECLARE @firdesc AS varchar(max);
        DECLARE @firdate AS datetime;
        SELECT @appurl = ApplicationUrl
          FROM InstallInfo;
        SELECT @clientname = C.LastName + ', ' + C.FirstName, 
               @clientid = C.ClientId, 
               @fircode = IRC.FederalIncidentReportCode, 
               @firdesc = IRC.Description, 
               @firdate = CFIR.IncidentDateTime
          FROM ClientProgramEnrollments AS CPE
          INNER JOIN Clients AS C ON CPE.ClientId = C.ClientId
          INNER JOIN ClientFederalIncidentReports AS CFIR ON CPE.ClientProgramEnrollmentId = CFIR.ClientProgramEnrollmentId
          INNER JOIN FederalIncidentReportCodes AS IRC ON CFIR.FederalIncidentReportCodeId = IRC.FederalIncidentReportCodeId
         WHERE CFIR.ClientFederalIncidentReportId = @keyid;

        -- Set @AppUrl = @AppUrl + '/Login.aspx?ReturnUrl=/Client/IncidentReportDetail.aspx%3fClientIncidentReportId%3d'                                   
        --  + cast(@KeyId as varchar(50)) +  '%26SelectClientId%3d' + cast(@ClientId as varchar(50)) +                                           
        --  '&Login%20Expired'                                          
        SET @appurl = @appurl + '/Security/FederalIncidentReportDetail.aspx?ClientFederalIncidentReportId=' + CAST(@keyid AS varchar(50)) + '&SelectClientId=' + CAST(@clientid AS varchar(50));
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Federal IR Code: ' + @fircode + '<br/>';
        SET @bodytext = @bodytext + 'Charge: ' + @firdesc + '<br/>';
        SET @bodytext = @bodytext + 'Date/Time: ' + CONVERT(varchar, @firdate) + '<br/>';
        IF @eventtype = 'Change'
        BEGIN
            SET @bodytext = @bodytext + CAST(dbo.fn_GetWorkFlowOldAndNewValueWithColumn(@workflowid, @queuestepactionid) AS varchar(max)) + '<br/>';
        END;
        SET @bodytext = @bodytext + '<br/><br/><br/><a href=''' + @appurl + '''> Click Here to check </a>';
        IF @clientprogramenrollmentid IS NULL
        BEGIN
            SELECT @clientprogramenrollmentid = CPE.ClientProgramEnrollmentId
              FROM ClientFederalIncidentReports AS CFIR
              LEFT JOIN ClientProgramEnrollments AS CPE ON CFIR.ClientProgramEnrollmentId = CPE.ClientProgramEnrollmentId
             WHERE ClientFederalIncidentReportId = @keyid;
        END;
    END;

    IF @eventname = 'NewTreatmentGroupRegistration'
    BEGIN
        DECLARE @treatmentgroup AS varchar(700);
        DECLARE @status AS varchar(100);                                          
        --DECLARE @startDate AS datetime;                                          
        SELECT @appurl = ApplicationUrl
          FROM InstallInfo;
        SELECT @clientname = C.LastName + ', ' + C.FirstName, 
               @clientid = C.ClientId, 
               @clientprogramenrollmentid = CGR.ClientProgramEnrollmentId, 
               @treatmentgroup = T.TreatmentGroup, 
               @startdate = CGR.StartDate, 
               @status = G.CodeName
          FROM ClientProgramEnrollments AS CPE
          INNER JOIN Clients AS C ON CPE.ClientId = C.ClientId
          INNER JOIN ClientGroupRegistrations AS CGR ON CPE.ClientProgramEnrollmentId = CGR.ClientProgramEnrollmentId
          INNER JOIN TreatmentGroups AS T ON CGR.TreatmentGroupId = T.TreatmentGroupId
          INNER JOIN GlobalCodes AS G ON CGR.GroupRegistrationStatus = G.GlobalCodeId
         WHERE CGR.ClientGroupRegistrationId = @keyid;

        -- Set @AppUrl = @AppUrl + '/Login.aspx?ReturnUrl=/Client/IncidentReportDetail.aspx%3fClientIncidentReportId%3d'                                          
        --  + cast(@KeyId as varchar(50)) +  '%26SelectClientId%3d' + cast(@ClientId as varchar(50)) +                                           
        --  '&Login%20Expired'                                          
        SET @appurl = @appurl + '/CaseManagement/ClientGroupRegistrationDetails.aspx?ClientGroupRegistrationId=' + CAST(@keyid AS varchar(50)) + '&ClientProgramEnrollmentId=' + CAST(@clientprogramenrollmentid AS varchar(50)) + '&SelectClientId=' + CAST(@clientid AS varchar(50));
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Treatment Group: ' + @treatmentgroup + '<br/>';
        SET @bodytext = @bodytext + 'Status: ' + @status + '<br/>';
        SET @bodytext = @bodytext + 'Start Date: ' + CONVERT(varchar, @startdate, 101) + '<br/>';
        SET @bodytext = @bodytext + '<br/><br/><br/><a href=''' + @appurl + '''> Click Here to check </a>';
    END;

    IF @eventname = 'ChangedTreatmentGroupRegistrationStatus'
    BEGIN

        DECLARE @enddate AS datetime;

        SELECT @clientname = C.LastName + ', ' + C.FirstName, 
               @clientid = C.ClientId, 
               @clientprogramenrollmentid = CGR.ClientProgramEnrollmentId, 
               @treatmentgroup = T.TreatmentGroup, 
               @startdate = CGR.StartDate, 
               @enddate = CONVERT(date, ISNULL(CGR.EndDate, '12/31/2099'))    
        -- @status = G.CodeName                                  
          FROM ClientProgramEnrollments AS CPE
          INNER JOIN Clients AS C ON CPE.ClientId = C.ClientId
          INNER JOIN ClientGroupRegistrations AS CGR ON CPE.ClientProgramEnrollmentId = CGR.ClientProgramEnrollmentId
          INNER JOIN TreatmentGroups AS T ON CGR.TreatmentGroupId = T.TreatmentGroupId
          INNER JOIN GlobalCodes AS G ON CGR.GroupRegistrationStatus = G.GlobalCodeId
         WHERE CGR.ClientGroupRegistrationId = @keyid;

        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Treatment Group: ' + @treatmentgroup + '<br/>';
        SET @bodytext = @bodytext + 'Start Date: ' + CONVERT(varchar, @startdate, 101) + '<br/>';
        SET @bodytext = @bodytext + 'End Date: ' + CONVERT(varchar, @enddate, 101) + '<br/>';
        SET @bodytext = @bodytext + CAST(dbo.fn_GetWorkFlowOldAndNewValueWithColumn(@workflowid, @queuestepactionid) AS varchar(max)) + '<br/>';
    END;

    IF @eventname = 'NewGroupSessionNote'
    BEGIN
        DECLARE @txgroup AS       varchar(700), 
                @sessiondate AS   varchar(10), 
                @attendance AS    varchar(50), 
                @groupcomplete AS varchar(5);
        SELECT @appurl = ApplicationUrl
          FROM InstallInfo;
        SELECT @clientname = C.LastName + ', ' + C.FirstName, 
               @clientid = C.ClientId, 
               @clientprogramenrollmentid = CGR.ClientProgramEnrollmentId, 
               @txgroup = T.TreatmentGroup, 
               @sessiondate = CONVERT(varchar, CONVERT(date, CSN.SessionDateTime), 101), 
               @attendance = GC.CodeName,                                      
               --User story 800                                      
               @hoursrequired = CAST(CGR.HoursRequired AS varchar(20)), 
               @groupcomplete = CASE
                                    WHEN ISNULL(CSN.GroupCompleted, 'N') = 'Y'
                                    THEN 'Yes'
                                    ELSE 'N'
                                END
          FROM ClientSessionNotes AS CSN
          INNER JOIN ClientGroupRegistrations AS CGR ON CSN.ClientGroupRegistrationId = CGR.ClientGroupRegistrationId
          INNER JOIN ClientProgramEnrollments AS CPE ON CGR.ClientProgramEnrollmentId = CPE.ClientProgramEnrollmentId
          INNER JOIN Clients AS C ON CPE.ClientId = C.ClientId
          INNER JOIN TreatmentGroups AS T ON CGR.TreatmentGroupId = T.TreatmentGroupId
          INNER JOIN GlobalCodes AS GC ON CSN.Attendance = GC.GlobalCodeId
         WHERE CSN.ClientSessionNoteId = @keyid;
        SET @appurl = @appurl + '/CaseManagement/ClientSessionNote.aspx?ClientSessionNoteId=' + CAST(@keyid AS varchar(50)) + '&SelectClientId=' + CAST(@clientid AS varchar(50));
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Treatment Group: ' + @txgroup + '<br/>';
        SET @bodytext = @bodytext + 'Session Date: ' + @sessiondate + '<br/>';
        SET @bodytext = @bodytext + 'Attendance: ' + @attendance + '<br/>';
        SET @bodytext = @bodytext + 'Group Completed: ' + ISNULL(@groupcomplete, 'N') + '<br/>';                                      
        --User story 800                                      
        SET @bodytext = @bodytext + 'Hours Required: ' + ISNULL(@hoursrequired, '') + '<br/>';
        SET @bodytext = @bodytext + '<br/><br/><br/><a href=''' + @appurl + '''> Click Here to review the note</a>';
    END;

    IF @eventname = 'NewClientProgramPhase'
    BEGIN
        DECLARE @programphase AS varchar(50);
        DECLARE @phasestart AS date;
        DECLARE @phaseend AS date;
        SELECT @appurl = ApplicationUrl
          FROM InstallInfo;
        SELECT @clientname = C.LastName + ', ' + C.FirstName, 
               @clientid = C.ClientId, 
               @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId, 
               @programphase = ISNULL(PP.Phase, '') + ' ' + P.Program, 
               @phasestart = CONVERT(date, ISNULL(cpp.StartDate, GETDATE())), 
               @phaseend = CONVERT(date, ISNULL(cpp.EndDate, '12/31/2099'))
          FROM ClientProgramPhases AS CPP
          INNER JOIN ClientProgramEnrollments AS cpe ON cpp.ClientProgramEnrollmentId = cpe.ClientProgramEnrollmentId
          INNER JOIN ProgramPhases AS PP ON CPP.ProgramPhaseId = PP.ProgramPhaseId
          INNER JOIN Programs AS P ON PP.ProgramId = P.ProgramId
          INNER JOIN Clients AS C ON cpe.ClientId = C.ClientId
         WHERE cpp.ClientProgramPhaseId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Phase: ' + @programphase + '<br/>';
        SET @bodytext = @bodytext + 'Phase Start Date: ' + CONVERT(varchar, @phasestart) + '<br/>';
        SET @appurl = @appurl + '/CaseManagement/EnrollmentDetail.aspx?ClientProgramEnrollmentId=' + CAST(@clientprogramenrollmentid AS varchar(50));
        SET @bodytext = @bodytext + '<br/><br/><br/><a href=''' + @appurl + '''> Click Here to check </a>';
    END;

    IF @eventname = 'NewClientProgramStatus'
    BEGIN
        DECLARE @programstatus AS varchar(50);
        DECLARE @statusstart AS date;
        DECLARE @actiondue AS date;
        DECLARE @statuscomments AS varchar(max);
        SELECT @appurl = ApplicationUrl
          FROM InstallInfo;
        SELECT @clientname = c.LastName + ', ' + c.FirstName, 
               @clientid = c.ClientId, 
               @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId, 
               @programstatus = gc.CodeName + ' (' + p.Program + ')', 
               @statusstart = CONVERT(date, ISNULL(cps.StartDate, GETDATE())), 
               @actiondue = cps.ActionDueDate, 
               @statuscomments = cps.Comments
          FROM ClientProgramStatus AS cps
          INNER JOIN ClientProgramEnrollments AS cpe ON cps.ClientProgramEnrollmentId = cpe.ClientProgramEnrollmentId
          INNER JOIN GlobalCodes AS gc ON cps.ProgramStatus = gc.GlobalCodeId
          INNER JOIN Programs AS p ON cpe.ProgramId = p.ProgramId
          INNER JOIN Clients AS c ON cpe.ClientId = c.ClientId
         WHERE cps.ClientProgramStatusId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Status (Program): ' + @programstatus + '<br/>';
        SET @bodytext = @bodytext + 'Status Start Date: ' + ISNULL(CONVERT(varchar, @statusstart), '') + '<br/>';
        SET @bodytext = @bodytext + 'Action Due Date: ' + ISNULL(CONVERT(varchar, @actiondue), '') + '<br/>';
        SET @bodytext = @bodytext + 'Comments: ' + ISNULL(@statuscomments, '') + '<br/>';
        SET @appurl = @appurl + '/CaseManagement/EnrollmentDetail.aspx?ClientProgramEnrollmentId=' + CAST(@clientprogramenrollmentid AS varchar(50));
        SET @bodytext = @bodytext + '<br/><br/><br/><a href=''' + @appurl + '''> Click Here to check </a>';
    END;

    IF @eventname = 'NewClientMeeting'
    BEGIN
        DECLARE @meetingtime datetime;
        DECLARE @loc varchar(50);
        DECLARE @title nvarchar(255);
        SELECT @clientname = c.LastName + ', ' + c.FirstName, 
               @clientid = c.ClientId, 
               @clientprogramenrollmentid = ISNULL(cpe.ClientProgramEnrollmentId, -1), 
               @program = p.Program, 
               @loc = gc.CodeName, 
               @meetingtime = cm.StartTime, 
               @title = cm.Title
          FROM CalendarMeetings AS cm
          INNER JOIN GlobalCodes AS gc ON cm.MeetingLocation = gc.GlobalCodeId
          INNER JOIN Clients AS c ON cm.ClientId = c.ClientId
          LEFT JOIN ClientProgramEnrollments AS cpe ON cm.ClientProgramEnrollmentId = cpe.ClientProgramEnrollmentId
          LEFT JOIN Programs AS p ON cpe.ProgramId = p.ProgramId
         WHERE cm.MeetingId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name / Program: ' + @clientname + ISNULL(' (' + @program + ')', '') + '<br/>';
        SET @bodytext = @bodytext + 'Title: ' + @title + '<br/>';
        SET @bodytext = @bodytext + 'Meeting Date/Time: ' + CONVERT(varchar, @meetingtime) + '<br/>';
        SET @bodytext = @bodytext + 'Location: ' + CONVERT(varchar, @loc) + '<br/>';
    END;

    IF @eventname = 'NewClientDiet'
    BEGIN
        DECLARE @diet varchar(50);
        DECLARE @dietcomments varchar(max);
        SELECT TOP 1 @clientname = c.LastName + ', ' + c.FirstName, 
                     @clientid = c.ClientId, 
                     @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId, 
                     @program = p.Program, 
                     @diet = gc.CodeName, 
                     @dietcomments = cd.Comments
          FROM ClientDiet AS cd
          INNER JOIN GlobalCodes AS gc ON cd.DietaryNeeds = gc.GlobalCodeId
          INNER JOIN Clients AS c ON cd.ClientId = c.ClientId
          LEFT JOIN ClientProgramEnrollments AS cpe ON c.ClientId = cpe.ClientId
                                                       AND cpe.ActualEndDate IS NULL
                                                       AND cpe.RecordDeleted = 'N'
          LEFT JOIN Programs AS p ON cpe.ProgramId = p.ProgramId
         WHERE cd.ClientDietId = @keyid
        ORDER BY cpe.StartDate DESC;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name / Program: ' + @clientname + ISNULL(' (' + @program + ')', '') + '<br/>';
        SET @bodytext = @bodytext + 'Dietary Needs: ' + @diet + '<br/>';
        SET @bodytext = @bodytext + 'Comments: ' + ISNULL(@dietcomments, '') + '<br/>';
    END;

    IF @eventname = 'TerminateEnrollment'
    BEGIN
        DECLARE @terminatedate AS datetime;
        DECLARE @releaseto AS varchar(250);
        SELECT @clientname = c.LastName + ', ' + c.FirstName, 
               @program = p.Program, 
               @terminatedate = cpe.ActualEndDate, 
               @identifier = ci.Identifier, 
               @releaseto = g.CodeName
          FROM ClientProgramEnrollments AS cpe
          INNER JOIN Clients AS c ON cpe.ClientId = c.ClientId
          INNER JOIN Programs AS p ON cpe.ProgramId = p.ProgramId
          LEFT JOIN ClientIdentifiers AS ci ON cpe.ClientIdentifierId = ci.ClientIdentifierId
          LEFT JOIN GlobalCodes AS g ON cpe.ReleaseTo = g.GlobalCodeId
         WHERE cpe.ClientProgramEnrollmentId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Program: ' + @program + '<br/>';
        SET @bodytext = @bodytext + 'Completion Date: ' + CONVERT(varchar, @terminatedate, 101) + '<br/>';
        SET @bodytext = @bodytext + 'Identifier: ' + ISNULL(@identifier, '') + '<br/>';
        SET @bodytext = @bodytext + 'Release To: ' + ISNULL(@releaseto, '') + '<br/>';

        IF @clientprogramenrollmentid IS NULL
        BEGIN
            SET @clientprogramenrollmentid = @keyid;
        END;
    END;

    IF @eventname = 'NewClientWalkaway'
    BEGIN
        PRINT 'NewClientWalkaway';
        PRINT @keyid;
        DECLARE @walkawaydatetime AS     datetime, 
                @walkawayposter AS       varchar(200), 
                @walkawaynotification varchar(50);
        SELECT @clientname = c.LastName + ', ' + c.FirstName, 
               @walkawaydatetime = CW.WalkawayDateTime, 
               @walkawayposter = dbo.fn_FormatWalkawayFileName(CW.ClientId, C.LastName, c.FirstName, 'Walkaway', CW.WalkawayDateTime), 
               @walkawaynotification = CO.WalkawayNotification
          FROM ClientWalkaways AS CW
          INNER JOIN Clients AS C ON CW.ClientId = C.ClientId
          INNER JOIN Companies AS CO ON CW.CompanyId = CO.CompanyId
         WHERE CW.ClientWalkawayId = @keyid;
        SELECT @bodytext = C.WalkawayEmail
          FROM Companies AS C
          INNER JOIN ClientWalkaways AS CW ON C.CompanyId = CW.CompanyId
         WHERE CW.ClientWalkawayId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Walkaway at: ' + CONVERT(varchar, @walkawaydatetime) + '<br/>';
        SELECT @attachment = DocumentsDir + @walkawayposter
          FROM InstallInfo;
        IF @clientprogramenrollmentid IS NULL
        BEGIN
            SELECT TOP 1 @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId
              FROM ClientWalkaways AS cw
              LEFT JOIN ClientProgramEnrollments AS cpe ON cw.ClientId = CPE.ClientId
              LEFT JOIN Programs AS p ON CPE.ProgramId = p.ProgramId
             WHERE cw.ClientWalkawayId = @keyid
                   AND p.CompanyId = cw.CompanyId
                   AND cpe.ActualEndDate IS NULL
                   AND cpe.StartDate < GETDATE()
            ORDER BY cpe.StartDate DESC;
        END;
    END;

    IF @eventname = 'ChangedWalkawayStatus'
    BEGIN
        PRINT 'ChangedWalkawayStatus';
        PRINT CONVERT(varchar, @keyid);
        PRINT CONVERT(varchar, @recipientid);
        DECLARE @captureddatetime AS datetime, 
                @capturedposter AS   varchar(200);
        SELECT @clientname = c.LastName + ', ' + c.FirstName, 
               @captureddatetime = CW.CapturedDateTime, 
               @bodytext = CASE
                               WHEN GC.CodeName = 'Captured'
                               THEN CO.CapturedEmail
                               ELSE CO.CanceledEmail
                           END, 
               @capturedposter = CASE
                                     WHEN GC.CodeName = 'Captured'
                                     THEN dbo.fn_FormatWalkawayFileName(CW.ClientId, C.LastName, c.FirstName, 'Captured', CW.CapturedDateTime)
                                     ELSE NULL
                                 END
          FROM ClientWalkaways AS CW
          INNER JOIN Clients AS C ON CW.ClientId = C.ClientId
          INNER JOIN Companies AS CO ON CW.CompanyId = CO.CompanyId
          INNER JOIN GlobalCodes AS GC ON CW.WalkawayStatus = GC.GlobalCodeId
         WHERE CW.ClientWalkawayId = @keyid;
        IF @capturedposter IS NOT NULL
        BEGIN
            SELECT @attachment = DocumentsDir + @capturedposter
              FROM InstallInfo;
        END;
        IF @clientprogramenrollmentid IS NULL
        BEGIN
            SELECT TOP 1 @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId
              FROM ClientWalkaways AS cw
              LEFT JOIN ClientProgramEnrollments AS cpe ON cw.ClientId = CPE.ClientId
              LEFT JOIN Programs AS p ON CPE.ProgramId = p.ProgramId
             WHERE cw.ClientWalkawayId = @keyid
                   AND p.CompanyId = cw.CompanyId
                   AND cpe.ActualEndDate IS NULL
                   AND cpe.StartDate < GETDATE()
            ORDER BY cpe.StartDate DESC;
        END;
    END;

    IF @eventname = 'NewClientPREAStatus'
    BEGIN
        DECLARE @prea varchar(50);
        DECLARE @preacomments varchar(max);
        SELECT TOP 1 @clientname = c.LastName + ', ' + c.FirstName, 
                     @clientid = c.ClientId, 
                     @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId, 
                     @program = p.Program, 
                     @prea = gc.CodeName, 
                     @preacomments = NULL
          FROM ClientPreaStatus AS cps
          INNER JOIN GlobalCodes AS gc ON cps.PreaStatusType = gc.GlobalCodeId
          INNER JOIN Clients AS c ON cps.ClientId = c.ClientId
          LEFT JOIN ClientProgramEnrollments AS cpe ON c.ClientId = cpe.ClientId
                                                       AND cpe.ActualEndDate IS NULL
                                                       AND cpe.RecordDeleted = 'N'
          LEFT JOIN Programs AS p ON cpe.ProgramId = p.ProgramId
         WHERE cps.ClientPreaStatusId = @keyid
        ORDER BY cpe.StartDate DESC;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name / Program: ' + @clientname + ISNULL(' (' + @program + ')', '') + '<br/>';
        SET @bodytext = @bodytext + 'PREA Status: ' + @prea + '<br/>';
        SET @bodytext = @bodytext + 'Comments: ' + ISNULL(@preacomments, '') + '<br/>';
    END;

    --Agenda                                  

    IF @eventname = 'NewTOMREXAgendaRequest'
    BEGIN
        DECLARE @leavetype varchar(50);

        SELECT @appurl = ApplicationUrl
          FROM InstallInfo;

        SELECT TOP 1 @clientname = c.FirstName + ' ' + c.LastName, 
                     @clientid = c.ClientId, 
                     @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId, 
                     @program = p.Program, 
                     @leavetype = gc.CodeName, 
                     @scheduleddeparture = kcl.ScheduledDeparture, 
                     @scheduledreturn = kcl.ScheduledReturn
          FROM KioskClientLeaves AS kcl
          INNER JOIN GlobalCodes AS gc ON kcl.LeaveType = gc.GlobalCodeId
          INNER JOIN Clients AS c ON kcl.ClientId = c.ClientId
          INNER JOIN ClientProgramEnrollments AS cpe ON c.ClientId = cpe.ClientId
                                                        AND cpe.StartDate < GETDATE()
                                                        AND cpe.ActualEndDate IS NULL
                                                        AND cpe.RecordDeleted = 'N'
          INNER JOIN Programs AS p ON cpe.ProgramId = p.ProgramId
                                      AND kcl.CompanyId = p.CompanyId
         WHERE kcl.KioskId = @keyid
        ORDER BY cpe.StartDate DESC;

        SET @appurl = @appurl + '/Security/AgendaRequests.aspx';
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = 'A new TOMREX agenda request has been submitted by ' + @clientname + '.';
        SET @bodytext = @bodytext + '<br/><br/>The request for a ' + @leavetype + ' agenda begins at ' + CONVERT(varchar, @scheduleddeparture) + ' and returns at ' + CONVERT(varchar, @scheduledreturn) + '.';
        SET @bodytext = @bodytext + '<br/><br/><br/><a href=''' + @appurl + '''> Click Here to review agenda requests </a>';
    END;

    IF @eventname = 'NewClientSecurityLevel'
    BEGIN
        DECLARE @securitylevel AS varchar(255);
        SELECT @clientname = C.LastName + ', ' + C.FirstName, 
               @clientid = C.ClientId, 
               @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId, 
               @program = P.Program, 
               @securitylevel = ISNULL(sl.SecurityLevel, '')
          FROM ClientSecurityLevel AS csl
          INNER JOIN ClientProgramEnrollments AS cpe ON csl.ClientProgramEnrollmentId = cpe.ClientProgramEnrollmentId
          INNER JOIN SecurityLevel AS sl ON csl.SecurityLevelId = sl.SecurityLevelId
          INNER JOIN Programs AS P ON cpe.ProgramId = P.ProgramId
          INNER JOIN Clients AS C ON cpe.ClientId = C.ClientId
         WHERE csl.ClientSecurityLevelId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Program: ' + @program + '<br/>';
        SET @bodytext = @bodytext + 'Security Level: ' + @securitylevel + '<br/>';
    END;

    IF @eventname = 'ChangedSecurityProcedureStatus'
    BEGIN
        DECLARE @securityproceduretype AS varchar(50), 
                @procedurestatus AS       varchar(50), 
                @scheduledate AS          datetime, 
                @completeddate AS         datetime;
        SELECT @clientname = c.LastName + ', ' + c.FirstName, 
               @clientprogramenrollmentid = CSP.ClientProgramEnrollmentId, 
               @securityproceduretype = gc1.CodeName, 
               @procedurestatus = gc2.CodeName, 
               @scheduledate = CONVERT(varchar, CSP.ScheduleDate, 101), 
               @completeddate = CONVERT(varchar, CSP.CompletedDate, 101)
          FROM ClientSecurityProcedures AS CSP
          INNER JOIN ClientProgramEnrollments AS cpe ON CSP.ClientProgramEnrollmentId = cpe.ClientProgramEnrollmentId
          INNER JOIN Clients AS c ON cpe.ClientId = c.ClientId
          INNER JOIN Companies AS CO ON CSP.CompanyId = CO.CompanyId
          INNER JOIN GlobalCodes AS gc1 ON CSP.SecurityProcedureType = gc1.GlobalCodeId
          INNER JOIN GlobalCodes AS gc2 ON CSP.ProcedureStatus = gc2.GlobalCodeId
         WHERE ClientSecurityProcedureId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Security Procedure Type: ' + @securityproceduretype + '<br/>';
        SET @bodytext = @bodytext + 'Schedule Date: ' + CONVERT(varchar, @scheduledate, 101) + '<br/>';
        SET @bodytext = @bodytext + 'Completed Date: ' + CONVERT(varchar, @completeddate, 101) + '<br/>';
        SET @bodytext = @bodytext + CAST(dbo.fn_GetWorkFlowOldAndNewValueWithColumn(@workflowid, @queuestepactionid) AS varchar(max)) + '<br/>';
    END;

    IF(@eventname = 'ChangedArrivalStatus')
    BEGIN

        SELECT @clientid = CM.ClientId, 
               @clientname = c.FirstName + ' ' + c.LastName, 
               @changedmovementtype = ISNULL(gc.CodeName, ''), 
               @changedmovementstatus = ISNULL(gc1.CodeName, ''), 
               @program_entering = P.Program, 
               @pointofdeparture = gc2.CodeName, 
               @estimatedmovementdate = CASE
                                            WHEN ISNULL(CM.EstimatedMovementDate, '') = ''
                                            THEN ''
                                            ELSE CONVERT(varchar, CM.EstimatedMovementDate, 101)
                                        END, 
               @actualmovementdate = CASE
                                         WHEN ISNULL(CM.ActualMovementDate, '') = ''
                                         THEN ''
                                         ELSE CONVERT(varchar, CM.ActualMovementDate, 101)
                                     END
          FROM ClientMovements AS CM
          INNER JOIN Clients AS c ON cm.ClientId = c.ClientId
          INNER JOIN GlobalCodes AS gc ON CM.MovementType = gc.GlobalCodeId
          INNER JOIN GlobalCodes AS gc1 ON CM.MovementStatus = gc1.GlobalCodeId
          INNER JOIN Programs AS P ON cm.Program_Entering = P.ProgramId
          LEFT JOIN GlobalCodes AS gc2 ON CM.PointOfDeparture = gc2.GlobalCodeId
         WHERE CM.ClientMovementId = @keyid;

        SET @definednotetext = @clientname + ' is arriving from ' + @pointofdeparture + ' and entering the ' + @program_entering + ' program.';

        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;

        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Movement Type: ' + @changedmovementtype + '<br/>';
        SET @bodytext = @bodytext + 'Movement Status: ' + @changedmovementstatus + '<br/>';
        SET @bodytext = @bodytext + 'Estimated Date: ' + @estimatedmovementdate + '<br/>';
        SET @bodytext = @bodytext + 'Actual Date: ' + @actualmovementdate + '<br/>';
        SET @bodytext = @bodytext + CAST(dbo.fn_GetWorkFlowOldAndNewValueWithColumn(@workflowid, @queuestepactionid) AS varchar(max)) + '<br/>';
        SET @bodytext = @bodytext + '<br/><br/>' + @definednotetext;

        IF @clientprogramenrollmentid IS NULL
        BEGIN
            SELECT TOP 1 @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId
              FROM ClientMovements AS cm
              LEFT JOIN Programs AS p ON cm.Program_Entering = p.ProgramId
              LEFT JOIN ClientProgramEnrollments AS cpe ON cm.ClientId = CPE.ClientId
             WHERE cm.ClientMovementId = @keyid
                   AND cm.Program_Entering = cpe.ProgramId
                   AND cpe.ActualEndDate IS NULL
                   AND cpe.StartDate < GETDATE()
            ORDER BY cpe.StartDate DESC;
        END;
    END;

    IF(@eventname = 'ChangedTransferStatus'
       OR @eventname = 'ChangedReleaseStatus')
    BEGIN

        SELECT @clientid = CM.ClientId, 
               @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId, 
               @clientname = c.FirstName + ' ' + c.LastName, 
               @changedmovementtype = ISNULL(gc.CodeName, ''), 
               @changedmovementstatus = ISNULL(gc1.CodeName, ''), 
               @estimatedmovementdate = CASE
                                            WHEN ISNULL(CM.EstimatedMovementDate, '') = ''
                                            THEN ''
                                            ELSE CONVERT(varchar, CM.EstimatedMovementDate, 101)
                                        END, 
               @actualmovementdate = CASE
                                         WHEN ISNULL(CM.ActualMovementDate, '') = ''
                                         THEN ''
                                         ELSE CONVERT(varchar, CM.ActualMovementDate, 101)
                                     END, 
               @program_entering = ISNULL(p2.Program, ''), 
               @clientprogramenrollment_ending = ISNULL(p.Program, ''), 
               @releaseto = ISNULL(gc3.CodeName, '')
          FROM ClientMovements AS CM
          INNER JOIN Clients AS c ON cm.ClientId = c.ClientId
          INNER JOIN GlobalCodes AS gc ON CM.MovementType = gc.GlobalCodeId
          INNER JOIN GlobalCodes AS gc1 ON CM.MovementStatus = gc1.GlobalCodeId
          INNER JOIN ClientProgramEnrollments AS CPE ON CM.ClientProgramEnrollmentId_Ending = CPE.ClientProgramEnrollmentId
          INNER JOIN Programs AS P ON CPE.ProgramId = P.ProgramId
          LEFT JOIN GlobalCodes AS gc3 ON cpe.releaseto = gc3.globalcodeid
          LEFT JOIN Programs AS P2 ON cm.Program_Entering = P2.ProgramId
         WHERE CM.ClientMovementId = @keyid;

        IF(@changedmovementtype = 'Transfer')
        BEGIN
            SET @definednotetext = @clientname + ' is transferring from the ' + @clientprogramenrollment_ending + ' to the ' + @program_entering + ' program.';
        END;
            ELSE
        BEGIN
            SET @definednotetext = @clientname + ' is releasing from ' + @clientprogramenrollment_ending + CASE
                                                                                                               WHEN ISNULL(@releaseto, '') = ''
                                                                                                               THEN '.'
                                                                                                               ELSE ' and releasing to ' + @releaseto + '.'
                                                                                                           END;
        END;

        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;

        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Movement Type: ' + @changedmovementtype + '<br/>';
        SET @bodytext = @bodytext + 'Movement Status: ' + @changedmovementstatus + '<br/>';
        SET @bodytext = @bodytext + 'Estimated Date: ' + @estimatedmovementdate + '<br/>';
        SET @bodytext = @bodytext + 'Actual Date: ' + @actualmovementdate + '<br/>';
        SET @bodytext = @bodytext + CAST(dbo.fn_GetWorkFlowOldAndNewValueWithColumn(@workflowid, @queuestepactionid) AS varchar(max)) + '<br/>';
        SET @bodytext = @bodytext + '<br/><br/><br/>' + @definednotetext;
    END;

    IF @eventname = 'NewClientProgramViolations'
    BEGIN
        DECLARE @violationtype varchar(50);
        DECLARE @violationcomments varchar(max);
        DECLARE @violationdate datetime;
        SELECT @clientname = C.LastName + ', ' + C.FirstName, 
               @clientid = C.ClientId, 
               @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId, 
               @program = P.Program, 
               @violationtype = gc.CodeName, 
               @violationdate = cpv.ViolationDate, 
               @violationcomments = ISNULL(cpv.Comments, '')
          FROM ClientProgramViolations AS cpv
          INNER JOIN ClientProgramEnrollments AS cpe ON cpv.ClientProgramEnrollmentId = cpe.ClientProgramEnrollmentId
          INNER JOIN GlobalCodes AS gc ON cpv.ViolationType = gc.GlobalCodeId
          INNER JOIN Programs AS P ON cpe.ProgramId = P.ProgramId
          INNER JOIN Clients AS C ON cpe.ClientId = C.ClientId
         WHERE cpv.ClientProgramViolationId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Program: ' + @program + '<br/><br/>';
        SET @bodytext = @bodytext + 'Violation Type: ' + @violationtype + '<br/>';
        SET @bodytext = @bodytext + 'Violation Date: ' + CONVERT(varchar, @violationdate, 101) + '<br/>';
        SET @bodytext = @bodytext + 'Comments: ' + @violationcomments + '<br/>';
    END;

    IF @eventname = 'NewClientGrievance'
    BEGIN
        SELECT @clientname = C.LastName + ', ' + C.FirstName, 
               @clientid = C.ClientId, 
               @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId, 
               @grievancecategory = ISNULL(gc.CodeName, ''), 
               @description = ISNULL(cg.GrievanceDescription, ''), 
               @grievancedate = cg.GrievanceDate, 
               @headline = cg.Headline
          FROM ClientGrievances AS cg
          INNER JOIN ClientProgramEnrollments AS cpe ON cg.ClientProgramEnrollmentId = cpe.ClientProgramEnrollmentId
          INNER JOIN Programs AS P ON cpe.ProgramId = P.ProgramId
          INNER JOIN Clients AS C ON cpe.ClientId = C.ClientId
          LEFT JOIN GlobalCodes AS gc ON cg.GrievanceCategory = gc.GlobalCodeId
         WHERE cg.ClientGrievanceId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Grievance Category: ' + @grievancecategory + '<br/>';
        SET @bodytext = @bodytext + 'Grievance Date: ' + CONVERT(varchar, @grievancedate, 101) + '<br/>';
        SET @bodytext = @bodytext + 'Headline: ' + @headline + '<br/>';
        SET @bodytext = @bodytext + 'Description: ' + @description + '<br/>';
    END;

    IF @eventname = 'ChangedGrievanceStatus'
    BEGIN
        SELECT @clientname = C.LastName + ', ' + C.FirstName, 
               @clientid = C.ClientId, 
               @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId, 
               @grievancecategory = ISNULL(gc.CodeName, ''), 
               @description = ISNULL(cg.GrievanceDescription, ''), 
               @grievancedate = cg.GrievanceDate, 
               @headline = cg.Headline
          FROM ClientGrievances AS cg
          INNER JOIN ClientProgramEnrollments AS cpe ON cg.ClientProgramEnrollmentId = cpe.ClientProgramEnrollmentId
          INNER JOIN Programs AS P ON cpe.ProgramId = P.ProgramId
          INNER JOIN Clients AS C ON cpe.ClientId = C.ClientId
          LEFT JOIN GlobalCodes AS gc ON cg.GrievanceCategory = gc.GlobalCodeId
         WHERE cg.ClientGrievanceId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Grievance Category: ' + @grievancecategory + '<br/>';
        SET @bodytext = @bodytext + 'Grievance Date: ' + CONVERT(varchar, @grievancedate, 101) + '<br/>';
        SET @bodytext = @bodytext + 'Headline: ' + @headline + '<br/>';
        SET @bodytext = @bodytext + 'Description: ' + @description + '<br/>';
        SET @bodytext = @bodytext + CAST(dbo.fn_GetWorkFlowOldAndNewValueWithColumn(@workflowid, @queuestepactionid) AS varchar(max)) + '<br/>';
    END;                                       
    -- user story 1317                                    
    IF @eventname = 'NewClientAssessment'
    BEGIN
        DECLARE @assessmenttype varchar(50);
        DECLARE @assessmentcomments varchar(max);
        DECLARE @assessmentdate datetime;
        SELECT @clientname = C.LastName + ', ' + C.FirstName, 
               @clientid = C.ClientId, 
               @clientprogramenrollmentid = ISNULL(ca.ClientProgramEnrollmentId, ''), 
               @program = ISNULL(P.Program, 'General Assessment'), 
               @assessmenttype = gc.CodeName, 
               @assessmentdate = ca.AssessmentDate, 
               @assessmentcomments = ISNULL(ca.Comments, '')
          FROM ClientAssessments AS ca
          INNER JOIN Clients AS C ON ca.ClientId = C.ClientId
          INNER JOIN GlobalCodes AS gc ON ca.AssessmentType = gc.GlobalCodeId
          LEFT JOIN ClientProgramEnrollments AS cpe ON ca.ClientProgramEnrollmentId = cpe.ClientProgramEnrollmentId
          LEFT JOIN Programs AS P ON cpe.ProgramId = P.ProgramId
         WHERE ca.ClientAssessmentId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Program: ' + @program + '<br/><br/>';
        SET @bodytext = @bodytext + 'Assessment Type: ' + @assessmenttype + '<br/>';
        SET @bodytext = @bodytext + 'Assessment Date: ' + ISNULL(CONVERT(varchar, @assessmentdate, 101), '') + '<br/>';
        SET @bodytext = @bodytext + 'Comments: ' + @assessmentcomments + '<br/>';
    END;                                  
    -- user story 1532                                    
    IF @eventname = 'NewClientService'
    BEGIN
        DECLARE @servicebilling varchar(50);
        DECLARE @servicestartdate datetime;
        SELECT @clientname = C.LastName + ', ' + C.FirstName, 
               @clientid = C.ClientId, 
               @clientprogramenrollmentid = ISNULL(CPS.ClientProgramEnrollmentId, ''), 
               @service = ISNULL(S.Service, ''), 
               @servicestartdate = CPS.StartDate
          FROM ClientProgramServices AS CPS
          INNER JOIN Services AS S ON S.ServiceId = CPS.ServiceId
          INNER JOIN ClientProgramEnrollments AS cpe ON CPS.ClientProgramEnrollmentId = cpe.ClientProgramEnrollmentId
          INNER JOIN Clients AS C ON cpe.ClientId = C.ClientId
         WHERE CPS.ClientProgramServiceId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Service: ' + @service + '<br/>';
        SET @bodytext = @bodytext + 'Start Date: ' + ISNULL(CONVERT(varchar, @servicestartdate, 101), '') + '<br/>';
    END;                                  
    -- user story 796                                      
    IF @eventname = 'NewRoomAssignment'
    BEGIN
        SELECT @clientid = CR.ClientId, 
               @clientname = c.FirstName + ' ' + c.LastName, 
               @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId, 
               @building = GC.CodeName, 
               @bed = R.Room + '-' + GC2.CodeName
          FROM ClientRooms AS CR
          LEFT JOIN ClientProgramEnrollments AS cpe ON cpe.ClientId = CR.ClientId
          INNER JOIN Clients AS c ON CR.ClientId = c.ClientId
          INNER JOIN RoomBeds AS RB ON RB.RoomBedId = CR.RoomBedId
          INNER JOIN Rooms AS R ON R.RoomId = RB.RoomId
          INNER JOIN GlobalCodes AS GC ON GC.GlobalCodeId = R.Building
          INNER JOIN GlobalCodes AS GC2 ON GC2.GlobalCodeId = RB.BedId
         WHERE ClientRoomId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'New Room: ' + @building + ' ' + @bed + '<br/>';
    END;                                       
    -- user story 1704                                  
    IF @eventname = 'ChangedAssessmentBillingCode'
    BEGIN
        DECLARE @assessmentstatus AS varchar(50);
        DECLARE @billingcode AS varchar(20);
        SELECT @clientname = c.LastName + ', ' + c.FirstName, 
               @clientprogramenrollmentid = CA.ClientProgramEnrollmentId, 
               @program = ISNULL(P.Program, 'General Assessment'), 
               @assessmenttype = gc1.CodeName, 
               @assessmentstatus = gc2.CodeName, 
               @assessmentdate = CA.AssessmentDate, 
               @assessmentcomments = ISNULL(CA.Comments, 'None'), 
               @billingcode = ABC.BillingCode
          FROM ClientAssessments AS CA
          INNER JOIN Clients AS C ON CA.ClientId = C.ClientId
          LEFT JOIN ATX_BillingCodes AS ABC ON CA.BillingCodeId = ABC.ATXBillingCodesId
          LEFT JOIN ClientProgramEnrollments AS cpe ON ca.ClientProgramEnrollmentId = cpe.ClientProgramEnrollmentId
          LEFT JOIN Programs AS P ON cpe.ProgramId = P.ProgramId
          INNER JOIN GlobalCodes AS gc1 ON CA.AssessmentType = gc1.GlobalCodeId
          INNER JOIN GlobalCodes AS gc2 ON CA.AssessmentStatus = gc2.GlobalCodeId
         WHERE ClientAssessmentId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Program: ' + @program + '<br/><br/>';
        SET @bodytext = @bodytext + 'Assessment Type: ' + @assessmenttype + '<br/>';
        SET @bodytext = @bodytext + 'Assessment Status: ' + @assessmentstatus + '<br/>';
        SET @bodytext = @bodytext + 'Billing Code: ' + @billingcode + '<br/>';
        SET @bodytext = @bodytext + 'Assessment Date: ' + ISNULL(CONVERT(varchar, @assessmentdate, 101), '') + '<br/>';
        SET @bodytext = @bodytext + 'Comments: ' + @assessmentcomments + '<br/>';
    END;
    IF @eventname = 'NewClientServiceViolation'
    BEGIN

        SELECT @clientname = C.LastName + ', ' + C.FirstName, 
               @clientid = C.ClientId, 
               @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId, 
               @program = P.Program, 
               @service = S.[Service], 
               @violationtype = gc.CodeName, 
               @violationdate = csv.ViolationDate, 
               @violationcomments = ISNULL(csv.Comments, '')
          FROM ClientServiceViolations AS csv
          INNER JOIN ClientProgramServices AS cps ON cps.ClientProgramServiceId = csv.ClientProgramServiceId
          INNER JOIN ClientProgramEnrollments AS cpe ON cps.ClientProgramEnrollmentId = cpe.ClientProgramEnrollmentId
          INNER JOIN GlobalCodes AS gc ON csv.ViolationType = gc.GlobalCodeId
          INNER JOIN [Services] AS S ON cps.ServiceId = S.ServiceId
          INNER JOIN Programs AS P ON cpe.ProgramId = P.ProgramId
          INNER JOIN Clients AS C ON cpe.ClientId = C.ClientId
         WHERE csv.ClientServiceViolationId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Program: ' + @program + '<br/><br/>';
        SET @bodytext = @bodytext + 'Service: ' + @service + '<br/><br/>';
        SET @bodytext = @bodytext + 'Violation Type: ' + @violationtype + '<br/>';
        SET @bodytext = @bodytext + 'Violation Date: ' + CONVERT(varchar, @violationdate, 101) + '<br/>';
        SET @bodytext = @bodytext + 'Comments: ' + @violationcomments + '<br/>';
    END;                                  
    --'Client Sign Out'                                
    IF @eventname = 'NewClientSignOut'
    BEGIN

        SELECT TOP 1 @clientname = c.FirstName + ' ' + c.LastName, 
                     @clientid = c.ClientId, 
                     @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId, 
                     @program = p.Program, 
                     @leavetype = gc.CodeName, 
                     @actualdeparture = cl.ActualDeparture, 
                     @scheduledreturn = cl.ScheduledReturn
          FROM ClientLeaves AS cl
          INNER JOIN GlobalCodes AS gc ON cl.LeaveType = gc.GlobalCodeId
          INNER JOIN Clients AS c ON cl.ClientId = c.ClientId
          INNER JOIN ClientProgramEnrollments AS cpe ON c.ClientId = cpe.ClientId
                                                        AND cpe.StartDate < GETDATE()
                                                        AND cpe.ActualEndDate IS NULL
                                                        AND cpe.RecordDeleted = 'N'
          INNER JOIN Programs AS p ON cpe.ProgramId = p.ProgramId
         WHERE cl.ClientLeaveId = @keyid
        ORDER BY cpe.StartDate DESC;

        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + @clientname;
        SET @bodytext = @bodytext + ' was signed out on a ' + @leavetype + ' leave beginning at ' + CONVERT(varchar, @actualdeparture) + '. They are expected to return at ' + CONVERT(varchar, @scheduledreturn) + '.';
    END;
	
	--Added for new workflow 'changedScheduledEndDate'
	IF @eventname = 'ChangedScheduledCompletionDate'
    BEGIN
        SELECT @clientname = c.LastName + ', ' + c.FirstName, 
               @program = p.Program, 
               @identifier = ci.Identifier
          FROM ClientProgramEnrollments AS cpe
          INNER JOIN Clients AS c ON cpe.ClientId = c.ClientId
          INNER JOIN Programs AS p ON cpe.ProgramId = p.ProgramId
          LEFT JOIN ClientIdentifiers AS ci ON cpe.ClientIdentifierId = ci.ClientIdentifierId
         WHERE cpe.ClientProgramEnrollmentId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Program: ' + @program + '<br/>';
        SET @bodytext = @bodytext + CAST(dbo.fn_GetWorkFlowOldAndNewValueWithColumn(@workflowid, @queuestepactionid) AS varchar(max)) + '<br/>';
        SET @bodytext = @bodytext + 'Identifier: ' + ISNULL(@identifier, '') + '<br/>';
        IF @clientprogramenrollmentid IS NULL
        BEGIN
            SET @clientprogramenrollmentid = @keyid;
        END;
    END;

		--Added for new workflow 'NewClientServicePeriod'
	 IF @eventname = 'NewClientServicePeriod'
    BEGIN
		DECLARE @servicestatus AS varchar(255);
		DECLARE @serviceperiodstartdate AS datetime;
        SELECT @clientname = C.LastName + ', ' + C.FirstName, 
               @clientid = C.ClientId, 
               @clientprogramenrollmentid = cpe.ClientProgramEnrollmentId, 
               @program = P.Program, 
               @service = S.[Service], 
               @servicestatus = gc.CodeName, 
               @serviceperiodstartdate = csp.StartDate, 
               @violationcomments = ISNULL(csp.Comments, '')
          FROM ClientServicePeriods AS csp
          INNER JOIN ClientProgramServices AS cps ON cps.ClientProgramServiceId = csp.ClientProgramServiceId
          INNER JOIN ClientProgramEnrollments AS cpe ON cps.ClientProgramEnrollmentId = cpe.ClientProgramEnrollmentId
          INNER JOIN GlobalCodes AS gc ON csp.ServiceStatus = gc.GlobalCodeId
          INNER JOIN [Services] AS S ON cps.ServiceId = S.ServiceId
          INNER JOIN Programs AS P ON cpe.ProgramId = P.ProgramId
          INNER JOIN Clients AS C ON cpe.ClientId = C.ClientId
         WHERE csp.ClientServicePeriodId = @keyid;
        IF @bodytext > ''
        BEGIN
            SET @bodytext = @bodytext + '<br/><br/><br/>';
        END;
        SET @bodytext = @bodytext + 'Client Name: ' + @clientname + '<br/>';
        SET @bodytext = @bodytext + 'Program: ' + @program + '<br/><br/>';
        SET @bodytext = @bodytext + 'Service: ' + @service + '<br/><br/>';
        SET @bodytext = @bodytext + 'Service Status: ' + @servicestatus + '<br/>';
        SET @bodytext = @bodytext + 'Service Period Start Date: ' + CONVERT(varchar, @serviceperiodstartdate, 101) + '<br/>';
        SET @bodytext = @bodytext + 'Comments: ' + @violationcomments + '<br/>';
    END;                              
                                
    -- If email will only go to single person then get that address.                                           
    -- Otherwise, @recipientemailaddress should be set above                                          
    IF @multirecipient = 0
    BEGIN
        IF @recipientid IS NULL
           OR @recipientid < 0
        BEGIN
            SELECT @recipientid = CASE @recipientid
                                      WHEN-1
                                      THEN CPE.CaseManagerId
                                      WHEN-2
                                      THEN CPE.SecondaryCaseManagerId
                                      WHEN-3
                                      THEN-3
                                      WHEN-4
                                      THEN-4
                                      WHEN-5
                                      THEN-5
                                      WHEN-6
                                      THEN-6
                                      WHEN-7
                                      THEN-7
                                  END
              FROM ClientProgramEnrollments AS CPE
             WHERE ClientProgramEnrollmentId = @clientprogramenrollmentid;
        END;

        IF @recipientid = NULL
           AND @recipientid != -3
        BEGIN
            RETURN;
        END;

        IF @recipientid = -3
        BEGIN
            SET @recipientemailaddress = @externalemail;
        END;                                      
        -- Add for User story 726                                      
        IF @recipientid = -4
        BEGIN
            SELECT @recipientemailaddress = EmailId
              FROM Users AS U
              INNER JOIN TreatmentGroups AS TG ON TG.Facilitator = U.UserId
              INNER JOIN ClientGroupRegistrations AS CGR ON CGR.TreatmentGroupId = TG.TreatmentGroupId
             WHERE CGR.ClientGroupRegistrationId = @keyid;
        END;
        IF @recipientid = -5
        BEGIN
            SELECT @recipientemailaddress = EmailId
              FROM Users AS U
              INNER JOIN ClientGrievances AS CG ON CG.Investigator = U.UserId
             WHERE CG.ClientGrievanceId = @keyid;
        END;                                  
        -- Add for User story 1532                                  
        IF @recipientid = -6
        BEGIN
            SELECT @recipientemailaddress = EmailId
              FROM Users AS U
              INNER JOIN ClientProgramServices AS CPS ON CPS.ServiceManagerId = U.UserId
             WHERE CPS.ClientProgramServiceId = @keyid;
        END;
        IF @recipientid = -7
        BEGIN
            SELECT @recipientemailaddress = CD.ProbationOfficerEmail
              FROM ClientProgramEnrollments AS CPE
		    INNER JOIN ClientProgramEnrollmentDockets AS CPED ON CPE.ClientProgramEnrollmentId = CPED.ClientProgramEnrollmentId
                                                AND CPED.PrimaryDocket = 'Y'
              INNER JOIN ClientDockets AS CD ON CPED.ClientDocketId = CD.ClientDocketId
             WHERE CD.RecordDeleted = 'N'
                   AND CPE.ClientProgramEnrollmentId = @clientprogramenrollmentid;
        END;
            ELSE
        BEGIN
            SELECT @recipientemailaddress = EmailId
              FROM Users
             WHERE UserId = @recipientid;
        END;
    END;

    IF ISNULL(@recipientemailaddress, '') <> ''
    BEGIN
        SELECT @recipientemailaddress, 
               @subject, 
               @bodytext;
        PRINT 'EVENT NAME' + @eventname + ' ' + @recipientemailaddress;
        EXEC msdb.dbo.sp_send_dbmail                                          
        --@profile_name = 'TotalOffenderManagement',                                          
             @profile_name = 'TotalOffenderManagement', 
             @recipients = @recipientemailaddress, 
             @subject = @subject, 
             @body = @bodytext, 
             @body_format = 'HTML', 
             @file_attachments = @attachment;
    END;
END;