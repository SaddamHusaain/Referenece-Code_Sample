SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
----- =============================================                        
-- Author  : Saddam Husain                        
-- Create Date : 06 Jan-2020                      
-- Comment  : This procedure accepts json format as string and create Agenda with Schedules.                        
-- =============================================                          

CREATE PROCEDURE [dbo].[sp_InsertModifyAgenda] @json nvarchar(max), @modifiedby varchar(50)= ''
AS
BEGIN
    DECLARE @newid int = -1;

    DECLARE @leave TABLE(Id int, ClientId int, LeaveType int, ScheduledDeparture datetime, DepartTransMode int, DepartTransDetails varchar(100), DepartTransDriver int, DepartTransVehicle int, DepartTravelTime int, ScheduledReturn datetime, ReturnTransMode int, ReturnTransDetails varchar(100), ReturnTransDriver int, ReturnTransVehicle int, ReturnTravelTime int, RecordDeleted char(1), ClientLeaveId int, Comments varchar(max), RequestStatus int);

    INSERT INTO @leave(Id,
                       ClientId,
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
                       RecordDeleted,
                       ClientLeaveId,
                       Comments,
                       RequestStatus)
    SELECT *
      FROM OPENJSON(@json) WITH (id int, clientId int, leave_type int, scheduledDeparture datetime, departTransMode int, departTransDetails VARCHAR(100), departTransDriver int, departTransVehicle int, departTravelTime int, scheduledReturn datetime, returnTransMode int, returnTransDetails VARCHAR(100), returnTransDriver int, returnTransVehicle int, returnTravelTime int, recordDeleted CHAR(1), clientLeaveId int, comments VARCHAR(max), requestStatus int );

    UPDATE @leave
      SET
          RecordDeleted = ISNULL(RecordDeleted, 'N'),
          RequestStatus =
                          (
          SELECT GlobalCodeId
            FROM GlobalCodes AS GC
            INNER JOIN GlobalCodeCategories AS GCC ON GC.CategoryId = GCC.CategoryId
           WHERE CategoryName LIKE 'KioskLeaveRequestStatus'
                 AND CodeName = 'Requested'
                          ),
          DepartTransDetails = CASE
                                   WHEN DepartTransDetails <= 0
                                   THEN NULL
                                   ELSE DepartTransDetails
                               END,
          DepartTransVehicle = CASE
                                   WHEN DepartTransVehicle <= 0
                                   THEN NULL
                                   ELSE DepartTransVehicle
                               END,
          ReturnTransDriver = CASE
                                  WHEN ReturnTransDriver <= 0
                                  THEN NULL
                                  ELSE ReturnTransDriver
                              END,
          ReturnTransVehicle = CASE
                                   WHEN ReturnTransVehicle <= 0
                                   THEN NULL
                                   ELSE ReturnTransVehicle
                               END,
          DepartTransDriver = CASE
                                  WHEN ISNULL(DepartTransDriver, '') = ''
                                  THEN NULL
                                  ELSE DepartTransDriver
                              END,
          ReturnTransDetails = CASE
                                   WHEN ISNULL(ReturnTransDetails, '') = ''
                                   THEN NULL
                                   ELSE ReturnTransDetails
                               END;

    DECLARE @key int = -1;

    SELECT @key = Id
      FROM @leave
     WHERE Id > 0;

    IF(@key > 0)
    BEGIN
        UPDATE @leave
          SET
              ClientLeaveId = @key;

        UPDATE KioskClientLeaves
          SET
              LeaveType = temp.LeaveType,
              ScheduledDeparture = temp.ScheduledDeparture,
              DepartTransMode = temp.DepartTransMode,
              DepartTransDetails = temp.DepartTransDetails,
              DepartTransDriver = temp.DepartTransDriver,
              DepartTransVehicle = temp.DepartTransVehicle,
              DepartTravelTime = temp.DepartTravelTime,
              ScheduledReturn = temp.ScheduledReturn,
              ReturnTransMode = temp.ReturnTransMode,
              ReturnTransDetails = temp.ReturnTransDetails,
              ReturnTransDriver = temp.ReturnTransDriver,
              ReturnTransVehicle = temp.ReturnTransVehicle,
              ReturnTravelTime = temp.ReturnTravelTime,
              RecordDeleted = temp.RecordDeleted,
              Comments = temp.Comments,
              RequestStatus = temp.RequestStatus
          FROM @leave temp
         WHERE KioskClientLeaves.Id = temp.Id;

        IF(ISNULL(@modifiedby, '') <> '')
        BEGIN
            INSERT INTO StaffActivityLog(TableName,
                                         PrimaryKey,
                                         ACTION,
                                         ModifiedBy)
            VALUES('ClientLeaves', @key, 'M', @modifiedby);
        END;
    END;
        ELSE
    BEGIN

        INSERT INTO KioskClientLeaves(ClientId,
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
                                      RecordDeleted,
                                      ClientLeaveId,
                                      Comments,
                                      RequestStatus)
        SELECT ClientId,
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
               RecordDeleted,
               ClientLeaveId,
               Comments,
               RequestStatus
          FROM @leave;

        SET @newid = SCOPE_IDENTITY();

        IF(ISNULL(@modifiedby, '') <> '')
        BEGIN
            INSERT INTO StaffActivityLog(TableName,
                                         PrimaryKey,
                                         ACTION,
                                         ModifiedBy)
            VALUES('ClientLeaves', SCOPE_IDENTITY(), 'N', @modifiedby);
        END;
    END;

    IF(ISNULL(@newid, -1) < 0)
    BEGIN
        SET @newid = @key;
    END;

    DECLARE @schedule TABLE(Id int, ClientLeaveId int, ScheduleType int, ScheduleDestinationKey int, StartDate datetime, EndDate datetime, ReturnsToCenter char(1), InterimTransMode int, InterimTransDetails varchar(100), InterimTransDriver int, InterimTransVehicle int, InterimTravelTime int, RecordDeleted char(1), DestinationType int, Comments varchar(max));

    INSERT INTO @schedule(Id,
                          ClientLeaveId,
                          ScheduleType,
                          ScheduleDestinationKey,
                          StartDate,
                          EndDate,
                          ReturnsToCenter,
                          InterimTransMode,
                          InterimTransDetails,
                          InterimTransDriver,
                          InterimTransVehicle,
                          InterimTravelTime,
                          RecordDeleted,
                          DestinationType,
                          Comments)
    SELECT Id,
           @newid AS ClientLeaveId,
           ScheduleType,
           ScheduleDestinationKey,
           StartDate,
           EndDate,
           ReturnsToCenter,
           InterimTransMode,
           CASE
               WHEN ISNULL(InterimTransDetails, '') = ''
               THEN NULL
               ELSE InterimTransDetails
           END AS InterimTransDetails,
           InterimTransDriver,
           InterimTransVehicle,
           InterimTravelTime,
           RecordDeleted,
           CASE
               WHEN ISNULL(DestinationType, '') = ''
               THEN NULL
               ELSE DestinationType
           END AS DestinationType,
           CASE
               WHEN ISNULL(Comments, '') = ''
               THEN NULL
               ELSE Comments
                  END AS Comments
      FROM OPENJSON(@json, '$.clientLeaveSchedules') WITH (Id int '$.id', ClientLeaveId int '$.cientLeaveId', ScheduleType int '$.scheduleType', ScheduleDestinationKey int '$.scheduleDestinationKey', StartDate datetime '$.startDate', EndDate datetime '$.endDate', ReturnsToCenter CHAR(1) '$.returnsToCenter', InterimTransMode int '$.interimTransMode', InterimTransDetails VARCHAR(100) '$.interimTransDetails', InterimTransDriver int '$.interimTransDriver', InterimTransVehicle int '$.interimTransVehicle', InterimTravelTime int '$.interimTravelTime', RecordDeleted CHAR(1) '$.recordDeleted', DestinationType int '$.destinationType', Comments VARCHAR(max) '$.comments');

    UPDATE @schedule
      SET
          InterimTransDriver = CASE
                                   WHEN InterimTransDriver <= 0
                                   THEN NULL
                                   ELSE InterimTransDriver
                               END,
          InterimTransVehicle = CASE
                                    WHEN InterimTransVehicle <= 0
                                    THEN NULL
                                    ELSE InterimTransVehicle
                                END,
          InterimTransMode = CASE
                                 WHEN InterimTransMode <= 0
                                 THEN NULL
                                 ELSE InterimTransMode
                             END,
          Id = CASE
                   WHEN Id <= 0
                   THEN NULL
                   ELSE Id
               END;

    UPDATE @schedule
      SET
          ClientLeaveId = A.Id,
          RecordDeleted = ISNULL(a.RecordDeleted, 'N')
      FROM KioskClientLeaves A
      INNER JOIN @schedule B ON B.ClientLeaveId = A.ClientLeaveId;

     UPDATE KioskClientLeaveSchedules
      SET 
          RecordDeleted = 'Y'
     WHERE KioskClientLeaveSchedules.ClientLeaveId = @key
           AND Id NOT IN
                        (
                         SELECT temp.Id
                           FROM @schedule AS temp
                          WHERE temp.ClientLeaveId = @key
                                AND ISNULL(temp.id, -1) > 0
                        );

    UPDATE KioskClientLeaveSchedules
      SET
          ScheduleType = temp.ScheduleType,
          ScheduleDestinationKey = temp.ScheduleDestinationKey,
          StartDate = temp.StartDate,
          EndDate = temp.EndDate,
          InterimTransDetails = temp.InterimTransDetails,
          ReturnsToCenter = temp.ReturnsToCenter,
          InterimTransMode = temp.InterimTransMode,
          InterimTransDriver = temp.InterimTransDriver,
          InterimTransVehicle = temp.InterimTransVehicle,
          InterimTravelTime = temp.InterimTravelTime,
          DestinationType = temp.DestinationType,
          RecordDeleted = temp.RecordDeleted,
          Comments = temp.Comments
      FROM @schedule temp
     WHERE KioskClientLeaveSchedules.Id = temp.Id
           AND KioskClientLeaveSchedules.Id = temp.Id;

    INSERT INTO KioskClientLeaveSchedules(ClientLeaveScheduleId,
                                          ClientLeaveId,
                                          ScheduleType,
                                          ScheduleDestinationKey,
                                          StartDate,
                                          EndDate,
                                          ReturnsToCenter,
                                          InterimTransMode,
                                          InterimTransDetails,
                                          InterimTransDriver,
                                          InterimTransVehicle,
                                          InterimTravelTime,
                                          RecordDeleted,
                                          DestinationType,
                                          Comments)
    SELECT Id,
           ClientLeaveId,
           ScheduleType,
           ScheduleDestinationKey,
           StartDate,
           EndDate,
           ReturnsToCenter,
           InterimTransMode,
           InterimTransDetails,
           InterimTransDriver,
           InterimTransVehicle,
           InterimTravelTime,
           RecordDeleted,
           DestinationType,
           Comments
      FROM @schedule
     WHERE Id NOT IN
                    (
                     SELECT id
                       FROM KioskClientLeaveSchedules
                    )
           OR ISNULL(Id, '') = '';

END;