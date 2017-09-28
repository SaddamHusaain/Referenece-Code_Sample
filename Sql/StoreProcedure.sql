USE [PeakSys]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetSecurityDashboard]    Script Date: 25/09/2017 13:37:03 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- sp_GetSecurityDashboard 201, 1
-- Select * from ClientLeaves
-- Select * from ClientLeaveSchedules
-- Update ClientLeaves Set RecordDeleted = 'Y' where ClientLeaveId = 9
-- Update ClientLeaves Set ActualDeparture = null where ClientLeaveId = 13
-- sp_GetSecurityDashboard 8781
-- =============================================
-- Author:		Saddam Husain
-- Create date: 23rd-March-16
-- Description:	This procedure will be used to fetch the details of Security Dashboard
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetSecurityDashboard] @clientid AS int ,
											@userid AS int
AS
BEGIN

	-- Pull Leave Section
	SELECT L.ClientLeaveId ,
		   CASE
			   WHEN ActualReturn IS NOT NULL
			   THEN 'Gray'
			   ELSE 'Black'
		   END AS Color ,

/*case 
	When cast(convert(varchar(10),L.ScheduledDeparture,101) as datetime) = cast(convert(varchar(10),getdate(),101) as datetime)
	then G.CodeName + ':' + substring(dbo.fn_FormatDateWithUserPreference(@UserId,L.ScheduledDeparture),11,len(dbo.fn_FormatDateWithUserPreference(@UserId,L.ScheduledDeparture)))  + ' - ' +
		substring(dbo.fn_FormatDateWithUserPreference(@UserId,L.ScheduledReturn),11,len(dbo.fn_FormatDateWithUserPreference(@UserId,L.ScheduledReturn))) 
	else G.CodeName + ':' + substring(dbo.fn_FormatDateWithUserPreference(@UserId,L.ScheduledDeparture),0,6) + 
		substring(dbo.fn_FormatDateWithUserPreference(@UserId,L.ScheduledDeparture),11,len(dbo.fn_FormatDateWithUserPreference(@UserId,L.ScheduledDeparture)))  + ' - ' +
		substring(dbo.fn_FormatDateWithUserPreference(@UserId,L.ScheduledReturn),0,6) + 
		substring(dbo.fn_FormatDateWithUserPreference(@UserId,L.ScheduledReturn),11,len(dbo.fn_FormatDateWithUserPreference(@UserId,L.ScheduledReturn))) 
	End as LeaveText*/

		   G.CodeName + ':' + SUBSTRING( dbo.fn_FormatDateWithUserPreference( @userid ,L.ScheduledDeparture ) ,0 ,6 ) + SUBSTRING( dbo.fn_FormatDateWithUserPreference( @userid ,L.ScheduledDeparture ) ,11 ,LEN( dbo.fn_FormatDateWithUserPreference( @userid ,L.ScheduledDeparture ))) + ' - ' + SUBSTRING( dbo.fn_FormatDateWithUserPreference( @userid ,L.ScheduledReturn ) ,0 ,6 ) + SUBSTRING( dbo.fn_FormatDateWithUserPreference( @userid ,L.ScheduledReturn ) ,11 ,LEN( dbo.fn_FormatDateWithUserPreference( @userid ,L.ScheduledReturn )))AS LeaveText ,
		   ActualDeparture ,
		   ActualReturn

/*, L.ActualDeparture, L.ActualReturn, G1.CodeName as DepartTransMode, G2.CodeName as ReturnTransMode, 
	(Select G3.CodeName as InterimTransMode from ClientLeaveSchedules CL 
	left join GlobalCodes G3 on CL.InterimTransMode = G3.GlobalCodeId  where CL.ClientLeaveId = L.ClientLeaveId
	and G2.CodeName='Car') as InterimTransMode */

	  FROM ClientLeaves AS L INNER JOIN GlobalCodes AS G ON L.LeaveType = G.GlobalCodeId

/*left join GlobalCodes G1 on L.DepartTransMode = G1.GlobalCodeId
	left join GlobalCodes G2 on L.ReturnTransMode = G2.GlobalCodeId*/

	  WHERE
	   (
		-- Leave scheduled today and not left yet. Exclude today's old leaves that were never signed out.
		( CAST(GETDATE() AS date) = CAST(L.ScheduledDeparture AS date) AND L.ActualDeparture IS NULL AND L.ScheduledDeparture >= DATEADD(MINUTE, -30, GETDATE()))
		 OR 
		-- Currently out on leave
		( CAST(L.ScheduledDeparture AS date) < GETDATE() AND L.ActualDeparture IS NOT NULL AND L.ActualReturn IS NULL )
		 OR 
		-- Returned from leave today
		( CAST(L.ActualReturn AS date) = CAST(GETDATE() AS date) )
	   )
	   AND L.RecordDeleted = 'N'
	   AND L.ClientID = @clientid
	  ORDER BY L.ScheduledDeparture;

	-- Pull Leave Schedule Section
	SELECT CLS.ClientLeaveScheduleId ,
		   L.ClientLeaveId ,
		   G.CodeName AS ScheduleType ,
		   --substring(dbo.fn_FormatDateWithUserPreference(@UserId,CLS.StartDate),11,len(dbo.fn_FormatDateWithUserPreference(@UserId,CLS.StartDate)))  + ' - ' +
		   substring( dbo.fn_FormatDateWithUserPreference( @userid ,CLS.StartDate ) ,0 ,6 ) + SUBSTRING( dbo.fn_FormatDateWithUserPreference( @userid ,CLS.StartDate ) ,11 ,LEN( dbo.fn_FormatDateWithUserPreference( @userid ,CLS.StartDate ))) + ' - ' + SUBSTRING( dbo.fn_FormatDateWithUserPreference( @userid ,CLS.EndDate ) ,0 ,6 ) + SUBSTRING( dbo.fn_FormatDateWithUserPreference( @userid ,CLS.EndDate ) ,11 ,LEN( dbo.fn_FormatDateWithUserPreference( @userid ,CLS.EndDate )))AS ScheduleText
	  FROM ClientLeaveSchedules AS CLS INNER JOIN GlobalCodes AS G ON CLS.ScheduleType = G.GlobalCodeID
									   INNER JOIN ClientLEaves AS L ON L.ClientLeaveId = CLS.ClientLEaveId
	  WHERE
	   (
		-- Leave scheduled today and not left yet. Exclude today's old leaves that were never signed out.
		( CAST(GETDATE() AS date) = CAST(L.ScheduledDeparture AS date) AND L.ActualDeparture IS NULL AND L.ScheduledDeparture >= DATEADD(MINUTE, -30, GETDATE()))
		 OR 
		-- Currently out on leave
		( CAST(L.ScheduledDeparture AS date) < GETDATE() AND L.ActualDeparture IS NOT NULL AND L.ActualReturn IS NULL )
		 OR 
		-- Returned from leave today
		( CAST(L.ActualReturn AS date) = CAST(GETDATE() AS date) )
	   )
	   AND CLS.RecordDeleted = 'N'
	   AND L.ClientId = @clientid
	  ORDER BY CLS.StartDate;
	-- Pull Treatment Section

	SELECT T.TreatmentGroupId ,
		   'Treatment:' + CASE
							  WHEN CAST(CONVERT(varchar( 10 ) ,TGC.SessionDateTime ,101)AS datetime) = CAST(CONVERT(varchar( 10 ) ,GETDATE() ,101)AS datetime)
							  THEN T.TReatmentGroup + ':' + SUBSTRING( dbo.fn_FormatDateWithUserPreference( @userid ,TGC.SessionDateTime ) ,11 ,LEN( dbo.fn_FormatDateWithUserPreference( @userid ,TGC.SessionDateTime ))) + ' - ' + ISNULL( SUBSTRING( dbo.fn_FormatDateWithUserPreference( @userid ,DATEADD(n ,TGC.SessionLength ,TGC.SessionDateTime)) ,11 ,LEN( dbo.fn_FormatDateWithUserPreference( @userid ,DATEADD(n ,TGC.SessionLength ,TGC.SessionDateTime)))) ,'' )
							  ELSE T.TReatmentGroup + ':' + SUBSTRING( dbo.fn_FormatDateWithUserPreference( @userid ,TGC.SessionDateTime ) ,0 ,6 ) + SUBSTRING( dbo.fn_FormatDateWithUserPreference( @userid ,TGC.SessionDateTime ) ,11 ,LEN( dbo.fn_FormatDateWithUserPreference( @userid ,TGC.SessionDateTime ))) + ' - ' + ISNULL( SUBSTRING( dbo.fn_FormatDateWithUserPreference( @userid ,DATEADD(n ,TGC.SessionLength ,TGC.SessionDateTime)) ,0 ,6 ) + SUBSTRING( dbo.fn_FormatDateWithUserPreference( @userid ,DATEADD(n ,TGC.SessionLength ,TGC.SessionDateTime)) ,11 ,LEN( dbo.fn_FormatDateWithUserPreference( @userid ,DATEADD(n ,TGC.SessionLength ,TGC.SessionDateTime)))) ,'' )
						  END AS TreatmentText ,
		   'Gray' AS Color ,
		   TGC.TreatmentGroupCalendarId
	  FROM TreatmentGroups AS T INNER JOIN ClientGroupRegistrations AS CGR ON T.TreatmentGroupId = CGR.TreatmentGroupId
								INNER JOIN ClientProgramEnrollments AS CPE ON CGR.ClientProgramEnrollmentId = CPE.ClientProgramEnrollmentId
								INNER JOIN TreatmentGroupCalendar AS TGC ON T.TreatmentGroupId = TGC.TreatmentGroupId
	  WHERE( CAST(CONVERT(varchar( 10 ) ,TGC.SessionDateTime ,101)AS datetime) = CAST(CONVERT(varchar( 10 ) ,GETDATE() ,101)AS datetime)
		  OR CAST(CONVERT(varchar( 10 ) ,GETDATE() ,101)AS datetime)BETWEEN CAST(CONVERT(varchar( 10 ) ,TGC.SessionDateTime ,101)AS datetime)
		 AND CAST(CONVERT(varchar( 10 ) ,ISNULL( DATEADD(n ,TGC.SessionLength ,TGC.SessionDateTime) ,GETDATE()) ,101)AS datetime))
	   AND CPE.ClientId = @clientid
	   AND ISNULL(CGR.EndDate, GETDATE()) >= GETDATE()
	   AND CGR.RecordDeleted = 'N'
	   AND NOT EXISTS( 
					   SELECT T.TreatmentGroupId
						 FROM TreatmentGroups AS T INNER JOIN ClientLeaveSchedules AS CLS ON T.TreatmentGroupId = CLS.ScheduleDestinationKey
												   INNER JOIN GlobalCodes AS G ON CLS.ScheduleType = G.GlobalCodeId
						 WHERE G.CodeName = 'Treatment'
						   AND CAST(CONVERT(varchar( 10 ) ,GETDATE() ,101)AS datetime)BETWEEN CAST(CONVERT(varchar( 10 ) ,CLS.StartDate ,101)AS datetime)
						   AND CAST(CONVERT(varchar( 10 ) ,CLS.EndDate ,101)AS datetime));

	--select * from ClientLeaveSchedules
	-- Pull Assessment Section

	--	Select C.ClientAssessmentId,'Assessment:' + 
	--	case 
	--	When cast(convert(varchar(10),C.ScheduledDate,101) as datetime) = cast(convert(varchar(10),getdate(),101) as datetime)
	--	then G.CodeName + ',' + substring(dbo.fn_FormatDateWithUserPreference(@UserId,C.ScheduledDate),11,len(dbo.fn_FormatDateWithUserPreference(@UserId,C.ScheduledDate)))  + ' - ' +
	--		substring(dbo.fn_FormatDateWithUserPreference(@UserId,L.ScheduledReturn),11,len(dbo.fn_FormatDateWithUserPreference(@UserId,L.ScheduledReturn))) 
	--	else G.CodeName + ',' + substring(dbo.fn_FormatDateWithUserPreference(@UserId,C.ScheduledDate),0,6) + 
	--		substring(dbo.fn_FormatDateWithUserPreference(@UserId,C.ScheduledDate),11,len(dbo.fn_FormatDateWithUserPreference(@UserId,C.ScheduledDate)))  + ' - ' +
	--		substring(dbo.fn_FormatDateWithUserPreference(@UserId,L.ScheduledReturn),0,6) + 
	--		substring(dbo.fn_Forma	tDateMMDDYYYYHHMMAMPM(L.ScheduledReturn),11,len(dbo.fn_FormatDateWithUserPreference(@UserId,L.ScheduledReturn))) 
	--	End
	--	from ClientAssessments C inner join GlobalCodes G on C.AssessmentType = G.GlobalCodeId
	--	where 
	--	(cast(convert(varchar(10),C.ScheduledDate,101) as datetime) = cast(convert(varchar(10),getdate(),101) as datetime)
	--	or cast(convert(varchar(10),getdate(),101) as datetime) between 
	--	cast(convert(varchar(10),C.ScheduledDate,101) as datetime) and cast(convert(varchar(10),L.ScheduledReturn,101) as datetime))

	-- Sign Out Hold Section
	-- select * from ClientSignOutHolds 
	SELECT CSOH.ClientHoldId ,
		   'Sign Out Hold in effect until ' + SUBSTRING( dbo.fn_FormatDateWithUserPreference( @userid ,CSOH.EndDate ) ,0 ,6 ) + ' at ' + SUBSTRING( dbo.fn_FormatDateWithUserPreference( @userid ,CSOH.EndDate ) ,12 ,5 )AS SignOutText
	  FROM ClientSignOutHolds AS CSOH
	  WHERE GETDATE()BETWEEN CSOH.StartDate
		AND CSOH.EndDate
		AND CSOH.Active = 'Y'
		AND CSOH.ClientId = @clientid
		AND CSOH.RecordDeleted = 'N';

	--	left join ClientLeaves CL on Cl.ClientId = CSOH.ClientId
	--	where getdate() between CSOH.StartDate and CSOH.EndDate and CSOH.Active='Y'
	--	and CSOH.ClientId = @ClientId and CSOH.StartDate not between CL.ScheduledDeparture and 
	--	isnull(Cl.ScheduledReturn,getdate())

	-- Security Flag Section
	SELECT CSF.ClientSecurityFlagId ,
		   CSF.SecurityFlagId ,
		   CSF.Comments ,
		   SF.SecurityFlag ,
		   SF.AllowDashboardDismiss
	  FROM ClientSecurityFlags AS CSF INNER JOIN SecurityFlags AS SF ON CSF.SecurityFlagId = SF.SecurityFlagId
	  WHERE SF.ShowOnDashboard = 'Y'
		AND ISNULL( CSF.StartDate ,'1/1/1900' ) < GETDATE()
		AND ISNULL( CSF.EndDate ,'12/31/2099' ) > GETDATE()
		AND CSF.ClientId = @clientid
		AND CSF.Active = 'Y'
		AND CSF.RecordDeleted = 'N'
		AND SF.Active = 'Y'
		AND SF.RecordDeleted = 'N';

	-- Get Client's Secured Medication Log Date
	SELECT TOP 1 
		'Secured Med last taken on ' + SUBSTRING( dbo.fn_FormatDateWithUserPreference( @userid ,cml.LogDate ) ,0 ,6 ) + ' at ' + SUBSTRING( dbo.fn_FormatDateWithUserPreference( @userid ,cml.LogDate ) ,12 ,5 ) AS "LogDate"
	  FROM ClientMedicationLog AS cml INNER JOIN ClientPrescriptions AS cp ON cml.ClientPrescriptionId = cp.ClientPrescriptionId
									  INNER JOIN Medications AS m ON cp.MedicationId = m.MedicationId
									  INNER JOIN GlobalCodes AS gc ON cml.LogType = gc.GlobalCodeId
	  WHERE cp.ClientId = @clientid
		AND m.SecuredMedication = 'Y'
		AND DATEADD(hour ,48 ,cml.LogDate) >= GETDATE()
		AND gc.CodeName = 'Dispense'
		AND cml.RecordDeleted = 'N'
	  ORDER BY cml.LogDate DESC;

END
GO


