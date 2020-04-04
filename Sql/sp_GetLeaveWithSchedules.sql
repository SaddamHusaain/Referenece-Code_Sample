---- =============================================      
-- Created By : Saddam       
-- Created Date : 17th Dec. 2019     
-- Description  : Return the complete leave(i.e. leave with all schedules)
---- ============================================= 

CREATE PROCEDURE [dbo].[sp_GetLeaveWithSchedules] @clientleaveid AS int, @agendasource varchar(10), @minutes AS int= 0
AS
BEGIN
    DECLARE @timeoffset nvarchar(6);
    DECLARE @approvedstatus int;
    SELECT @approvedstatus = GlobalCodeId
      FROM GlobalCodes AS GC
      INNER JOIN GlobalCodeCategories AS GCC ON GC.CategoryId = GCC.CategoryId
     WHERE CATEGORYNAME = 'KioskLeaveRequestStatus'
           AND CODENAME = 'Approved';

    SELECT @timeoffset =
                         (
           SELECT TOP 1 T.current_utc_offset
             FROM sys.time_zone_info AS T
             INNER JOIN CompanyConfigurations AS CC ON CC.Timezone = T.name
                         );
    IF(@agendasource = 'CL')
    BEGIN
        SELECT CL.ClientLeaveId AS Id, 
               CL.ClientId, 
               LeaveType, 
               ScheduledDeparture, 
               DepartTransMode, 
               DepartTransDetails, 
               DepartTransDriver, 
               DepartTransVehicle, 
               DepartTravelTime, 
               ScheduledReturn, 
               ReturnTransMode, 
               ReturnTransDetails, 
               ReturnTransDriver, 
               ReturnTransVehicle, 
               ReturnTravelTime, 
               CL.RecordDeleted, 
               @approvedstatus AS RequestStatus, 
               CL.ClientLeaveId, 
               NULL AS DenialReason, 
               CL.Comments, 
               GC2.CodeName AS DepartTransModeDetailsDescription, 
               GC.FriendlyName AS LeaveTypeDescription, 
               GC3.FriendlyName AS ReturnTransModeDetailsDescription, 
               CC.Name AS DepartTransDriverName, 
               CC2.Name AS ReturnTransDriverName, 
               dbo.fn_GetVehicleDescription(CL.DepartTransVehicle) AS DepartTransportVehicleDescription, 
               dbo.fn_GetVehicleDescription(CL.ReturnTransVehicle) AS ReturnTransportVehicleDescription, 
               GC4.CodeName AS RequestStatusDescription
          FROM ClientLeaves AS CL
          LEFT JOIN GlobalCodes AS GC ON GC.GlobalCodeId = CL.LeaveType
          LEFT JOIN GlobalCodes AS GC2 ON GC2.GlobalCodeId = CL.DepartTransMode
          LEFT JOIN GlobalCodes AS GC3 ON GC3.GlobalCodeId = CL.ReturnTransMode
          LEFT JOIN GlobalCodes AS GC4 ON GC4.GlobalCodeId = @approvedstatus
          LEFT JOIN ClientEmergencyContacts AS CC ON CC.ClientEmergencyContactId = CL.DepartTransDriver
          LEFT JOIN ClientEmergencyContacts AS CC2 ON CC2.ClientEmergencyContactId = CL.ReturnTransDriver
         WHERE ClientLeaveId = @clientleaveid;

        SELECT CLS.ClientLeaveScheduleId AS Id,
               CASE
                   WHEN ISNULL(GC2.GlobalCodeId, 0) > 0
                   THEN GC2.CodeName
                   ELSE GC.CodeName
               END AS ScheduleType,
               CASE
                   WHEN ISNULL(GC2.GlobalCodeId, 0) > 0
                   THEN GC2.GlobalCodeId
                   ELSE GC.GlobalCodeId
               END AS ScheduleTypeId, 
               DBO.fn_GetScheduleDestinations(CLS.ClientLeaveScheduleId, @agendasource) AS Destination, 
               CLS.ScheduleDestinationKey AS DestinationId,
               CASE
                   WHEN @minutes = 0
                   THEN CONVERT(datetime, CLS.StartDate, 0)
                   ELSE DATEADD(minute, @minutes, CONVERT(datetime, CLS.StartDate, 0))
               END AS StartDate,
               CASE
                   WHEN @minutes = 0
                   THEN CONVERT(datetime, CLS.EndDate, 0)
                   ELSE DATEADD(minute, @minutes, CONVERT(datetime, CLS.EndDate, 0))
               END AS EndDate, 
               GC1.CodeName AS TransMode, 
               dbo.fn_GetVehicleDescription(InterimTransVehicle) AS Vehicle, 
               CC.Name AS TransDriver, 
               CLS.InterimTravelTime AS TravelTime, 
               CLS.InterimTransDetails AS TransDetails, 
               CLS.InterimTransMode, 
               CLS.InterimTransDriver, 
               CLS.InterimTransVehicle, 
               CLS.ReturnsToCenter, 
               CLS.Comments
          FROM ClientLeaveSchedules AS CLS
          INNER JOIN ClientLeaves AS CL ON CL.ClientLeaveId = CLS.ClientLeaveId
                                           AND CLS.RecordDeleted = 'N'
                                           AND CL.RecordDeleted = 'N'
          INNER JOIN GlobalCodes AS GC ON CLS.ScheduleType = GC.GlobalCodeId
          LEFT JOIN GlobalCodes AS GC2 ON CLS.DestinationType = GC2.GlobalCodeId
          LEFT JOIN GlobalCodes AS GC1 ON CLS.InterimTransMode = GC1.GlobalCodeId
          LEFT JOIN ClientEmergencyContacts AS CC ON CLS.InterimTransDriver = CC.ClientEmergencyContactId
         WHERE CLS.ClientLeaveId = @clientleaveid;
    END;
        ELSE
    BEGIN
        SELECT CL.Id, 
               CL.ClientId, 
               LeaveType, 
               CONVERT(datetime, SWITCHOFFSET(ScheduledDeparture, @timeoffset), 0) AS ScheduledDeparture, 
               DepartTransMode, 
               DepartTransDetails, 
               DepartTransDriver, 
               DepartTransVehicle, 
               DepartTravelTime, 
               CONVERT(datetime, SWITCHOFFSET(ScheduledReturn, @timeoffset), 0) AS ScheduledReturn, 
               ReturnTransMode, 
               ReturnTransDetails, 
               ReturnTransDriver, 
               ReturnTransVehicle, 
               ReturnTravelTime, 
               CL.RecordDeleted, 
               CL.RequestStatus, 
               CL.ClientLeaveId, 
               DenialReason, 
               CL.Comments, 
               GC2.CodeName AS DepartTransModeDetailsDescription, 
               GC.FriendlyName AS LeaveTypeDescription, 
               GC3.FriendlyName AS ReturnTransModeDetailsDescription, 
               CC.Name AS DepartTransDriverName, 
               CC2.Name AS ReturnTransDriverName, 
               dbo.fn_GetVehicleDescription(CL.DepartTransVehicle) AS DepartTransportVehicleDescription, 
               dbo.fn_GetVehicleDescription(CL.ReturnTransVehicle) AS ReturnTransportVehicleDescription, 
               GC4.CodeName AS RequestStatusDescription
          FROM KioskClientLeaves AS CL
          LEFT JOIN GlobalCodes AS GC ON GC.GlobalCodeId = CL.LeaveType
          LEFT JOIN GlobalCodes AS GC2 ON GC2.GlobalCodeId = CL.DepartTransMode
          LEFT JOIN GlobalCodes AS GC3 ON GC3.GlobalCodeId = CL.ReturnTransMode
          LEFT JOIN GlobalCodes AS GC4 ON GC4.GlobalCodeId = CL.RequestStatus
          LEFT JOIN ClientEmergencyContacts AS CC ON CC.ClientEmergencyContactId = CL.DepartTransDriver
          LEFT JOIN ClientEmergencyContacts AS CC2 ON CC2.ClientEmergencyContactId = CL.ReturnTransDriver
         WHERE Id = @clientleaveid;

        SELECT CLS.Id,
               CASE
                   WHEN ISNULL(GC2.GlobalCodeId, 0) > 0
                   THEN GC2.CodeName
                   ELSE GC.CodeName
               END AS ScheduleType,
               CASE
                   WHEN ISNULL(GC2.GlobalCodeId, 0) > 0
                   THEN GC2.GlobalCodeId
                   ELSE GC.GlobalCodeId
               END AS ScheduleTypeId, 
               DBO.fn_GetScheduleDestinations(CLS.Id, @agendasource) AS Destination, 
               CLS.ScheduleDestinationKey AS DestinationId,
               CASE
                   WHEN @minutes = 0
                   THEN CONVERT(datetime, SWITCHOFFSET(CLS.StartDate, @timeoffset), 0)
                   ELSE DATEADD(minute, @minutes, CONVERT(datetime, SWITCHOFFSET(CLS.StartDate, @timeoffset), 0))
               END AS StartDate,
               CASE
                   WHEN @minutes = 0
                   THEN CONVERT(datetime, SWITCHOFFSET(CLS.EndDate, @timeoffset), 0)
                   ELSE DATEADD(minute, @minutes, CONVERT(datetime, SWITCHOFFSET(CLS.EndDate, @timeoffset), 0))
               END AS EndDate, 
               GC1.CodeName AS TransMode, 
               dbo.fn_GetVehicleDescription(InterimTransVehicle) AS Vehicle, 
               CC.Name AS TransDriver, 
               CLS.InterimTravelTime AS TravelTime, 
               CLS.InterimTransDetails AS TransDetails, 
               CLS.InterimTransMode, 
               CLS.InterimTransDriver, 
               CLS.InterimTransVehicle, 
               CLS.ReturnsToCenter, 
               CLS.Comments
          FROM KioskClientLeaveSchedules AS CLS
          INNER JOIN KioskClientLeaves AS CL ON CL.Id = CLS.ClientLeaveId
                                                AND CLS.RecordDeleted = 'N'
                                                AND CL.RecordDeleted = 'N'
          INNER JOIN GlobalCodes AS GC ON CLS.ScheduleType = GC.GlobalCodeId
          LEFT JOIN GlobalCodes AS GC2 ON CLS.DestinationType = GC2.GlobalCodeId
          LEFT JOIN GlobalCodes AS GC1 ON CLS.InterimTransMode = GC1.GlobalCodeId
          LEFT JOIN ClientEmergencyContacts AS CC ON CLS.InterimTransDriver = CC.ClientEmergencyContactId
         WHERE CL.Id = @clientleaveid
               AND ISNULL(CL.ClientLeaveId, '') = ''
        ORDER BY StartDate;
    END;
END;