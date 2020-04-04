-- =============================================              
-- Author:  Saddam Husain              
-- Create date: 14-11-19             
-- Description : This sp is used to get Client program service list.   
-- Modified Date :- 13-12-2019
-- Description :- date only format applied on datetime fields     
-- =============================================              
--sp_GetClientProgramServices 1,91  
  
CREATE PROCEDURE [dbo].[sp_GetClientProgramServices] @clientprogramserviceid AS int, @clientprogramenrollmentid AS int  
AS  
BEGIN  
    SELECT CPS.ClientProgramServiceId,  
           CPS.ClientProgramEnrollmentId,  
           CPS.ServiceId,  
           S.Service,  
           (U1.Firstname+' '+U1.Lastname) AS ServiceManager,  
           CPS.ServiceManagerId AS ServiceManagerId,  
           G.CodeName AS ServiceStatus,  
           CPS.ServiceStatus AS ServiceStatusId,  
           CPS.ReferralSourceId,  
           RS.ReferralSource,  
           CPS.ServiceFee,  
            CONVERT(VARCHAR(10),  CPS.StartDate , 101) as StartDate,  
            CONVERT(VARCHAR(10),  CPS.EndDate , 101) as EndDate,  
           CPS.Active,  
           S.EDisplay_ReferralSource,  
           S.EDisplay_ServiceStatus,  
            CONVERT(VARCHAR(10),   CPS.ScheduledEndDate , 101) as ScheduledEndDate,  
            CONVERT(VARCHAR(10),   CPS.ReferralDate , 101) as ReferralDate,  
           STRING_AGG(CD.DocketNumber, ',') AS Dockets,  
           ISNULL(CSP.TabDisplay_Violations, 'Y') AS TabDisplay_Violations,  
           ISNULL(CSP.TabDisplay_Equipment, 'Y') AS TabDisplay_Equipment,  
           ISNULL(CSP.TabDisplay_ServicePeriods, 'Y') AS TabDisplay_ServicePeriods,  
           ISNULL(CSP.TabDisplay_Placements, 'Y') AS TabDisplay_Placements  
      FROM ClientProgramServices AS CPS  
      INNER JOIN ClientProgramEnrollments AS CPE ON CPS.ClientProgramEnrollmentId = CPE.ClientProgramEnrollmentId  
      INNER JOIN Services AS S ON CPS.ServiceId = S.ServiceId  
      LEFT JOIN ReferralSources AS RS ON CPS.ReferralSourceId = RS.ReferralSourceId  
      LEFT JOIN Users AS U1 ON CPS.ServiceManagerId = U1.UserId  
      LEFT JOIN ClientProgramServiceDockets AS CPSD ON CPS.ClientProgramServiceId = CPSD.ClientProgramServiceId  
      LEFT JOIN GlobalCodes AS G ON CPS.ServiceStatus = G.GlobalCodeId  
      LEFT JOIN ClientDockets AS CD ON CPSD.ClientDocketId = CD.ClientDocketId  
      LEFT JOIN CourtLinkServiceConfig AS CSP ON S.ServiceId = CSP.ServiceId  
                                                 AND CSP.RecordDeleted = 'N'  
                                                 AND CSP.Active = 'Y'  
     WHERE(CPS.ClientProgramServiceId = @clientprogramserviceid  
           OR @clientprogramserviceid = -1)  
          AND CPS.RecordDeleted = 'N'  
          AND S.RecordDeleted = 'N'  
          AND CPS.Active = 'Y'  
          AND S.Active = 'Y'  
          AND CPS.ClientProgramEnrollmentId = @clientprogramenrollmentid  
     GROUP BY CPS.ClientProgramServiceId,  
              CPS.ClientProgramEnrollmentId,  
              CPS.ServiceId,  
              S.Service,  
              U1.Firstname,  
              U1.Lastname,  
              CPS.ServiceManagerId,  
              G.CodeName,  
              CPS.ServiceStatus,  
              CPS.ReferralSourceId,  
              RS.ReferralSource,  
              CPS.ServiceFee,  
              CPS.StartDate,  
              CPS.EndDate,  
              CPS.Active,  
              S.EDisplay_ReferralSource,  
              S.EDisplay_ServiceStatus,  
              CPS.ScheduledEndDate,  
              CPS.ReferralDate,  
              CSP.TabDisplay_Violations,  
              CSP.TabDisplay_Equipment,  
              CSP.TabDisplay_ServicePeriods,  
              CSP.TabDisplay_Placements;  
END;