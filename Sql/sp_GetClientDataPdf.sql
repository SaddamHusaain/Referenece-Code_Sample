-- =============================================        
-- Author  :  Saddam                                     
-- Created Date : 15-11-19         
-- Description : This store procedure is used to get client services data for pdf.        
-- =============================================        
-- sp_GetClientDataPdf '1,2,3',2    

CREATE PROCEDURE [dbo].[sp_GetClientDataPdf] @clientprogramserviceids varchar(255), @clientprogramenrollmentid int
AS
BEGIN

    ----Service Data    
    SET @clientprogramserviceids = NULLIF(@clientprogramserviceids, '');

    SELECT CPS.ClientProgramServiceId, 
           CPS.ClientProgramEnrollmentId, 
           CPS.ServiceId, 
           S.Service, 
           (U1.Firstname + ' ' + U1.Lastname
                                            ) AS ServiceManager, 
           CPS.ServiceManagerId AS ServiceManagerId, 
           G.CodeName AS ServiceStatus, 
           CPS.ServiceStatus AS ServiceStatusId, 
           CPS.ReferralSourceId, 
           RS.ReferralSource, 
           CPS.ServiceFee, 
           CONVERT(varchar(10), CPS.StartDate, 101) AS StartDate, 
           CONVERT(varchar(10), CPS.EndDate, 101) AS EndDate, 
           CPS.Active, 
           S.EDisplay_ReferralSource, 
           S.EDisplay_ServiceStatus, 
           CONVERT(varchar(10), CPS.ScheduledEndDate, 101) AS ScheduledEndDate, 
           CONVERT(varchar(10), CPS.ReferralDate, 101) AS ReferralDate, 
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
     WHERE(CPS.ClientProgramServiceId IN
                                        (
                                         SELECT CAST(items AS int) AS items
                                           FROM dbo.fn_Split(@clientprogramserviceids, ',')
                                        )
           OR @clientprogramserviceids IS NULL)
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

    --Servce Equipments    

    SELECT C.ClientProgramServiceId, 
           C.ClientServiceEquipmentId, 
           C.EquipmentType AS EquipmentTypeId, 
           GC1.CodeName AS EquipmentType, 
           C.EquipmentStatus AS EquipmentStatusId, 
           GC2.CodeName AS EquipmentStatus, 
           C.SerialNumber, 
           CONVERT(varchar(10), C.TheftReportFiled, 101) AS TheftReportFiled, 
           CONVERT(varchar(10), C.EquipmentRecovered, 101) AS EquipmentRecovered, 
           C.Comments, 
           C.Active
      FROM ClientServiceEquipment AS C
      INNER JOIN
                (
           SELECT CAST(items AS int) AS items
             FROM dbo.fn_Split(@clientprogramserviceids, ',')
                ) AS serviceids ON ClientProgramServiceId = items
      INNER JOIN ClientProgramServices AS CPS ON CPS.ClientProgramServiceId = C.ClientProgramServiceId
      LEFT JOIN CourtLinkServiceConfig AS CLS ON CLS.ServiceId = CPS.ServiceId
                                                 AND ISNULL(CLS.TabDisplay_Equipment, 'Y') = 'Y'
      LEFT JOIN GlobalCodes AS GC1 ON C.EquipmentType = GC1.GlobalCodeId
      LEFT JOIN GlobalCodes AS GC2 ON C.EquipmentStatus = GC2.GlobalCodeId
     WHERE C.RecordDeleted = 'N'
    ORDER BY GC1.CodeName, 
             C.CreatedDate DESC;

    -- ServicePeriods    

    SELECT CPS.ClientProgramServiceId, 
           CPS.ClientServicePeriodId, 
           CONVERT(varchar(10), CPS.StartDate, 101) AS StartDate, 
           CONVERT(varchar(10), CPS.EndDate, 101) AS EndDate, 
           CPS.ServiceStatus AS ServiceStatusId, 
           G.CodeName AS ServiceStatus, 
           CPS.ServiceBilling AS ServiceBillingId, 
           G1.CodeName AS ServiceBilling, 
           CPS.Comments, 
           CPS.Active
      FROM ClientServicePeriods AS CPS
      INNER JOIN
                (
           SELECT CAST(items AS int) AS items
             FROM dbo.fn_Split(@clientprogramserviceids, ',')
                ) AS serviceids ON ClientProgramServiceId = items
      INNER JOIN ClientProgramServices AS CS ON CS.ClientProgramServiceId = CPS.ClientProgramServiceId
      LEFT JOIN CourtLinkServiceConfig AS CLS ON CLS.ServiceId = CS.ServiceId
                                                 AND ISNULL(CLS.TabDisplay_ServicePeriods, 'Y') = 'Y'
      LEFT JOIN GlobalCodes AS G ON CPS.ServiceStatus = G.GlobalCodeId
      LEFT JOIN GlobalCodes AS G1 ON CPS.ServiceBilling = G1.GlobalCodeId
     WHERE CPS.RecordDeleted = 'N'
    ORDER BY CPS.Startdate DESC, 
             CPS.CreatedDate DESC;

    --Service Placements    

    SELECT CSP.ClientProgramServiceId, 
           CSP.ClientServicePlacementId, 
           P.PlacementSiteId, 
           P.PlacementSite, 
           CONVERT(varchar(10), CSP.StartDate, 101) AS StartDate, 
           CONVERT(varchar(10), CSP.EndDate, 101) AS StartDate, 
           CSP.HoursAssigned, 
           ISNULL(SUM(HoursWorked), 0.0) AS HoursCompleted, 
           CSP.Comments, 
           CSP.Active
      FROM ClientServicePlacements AS CSP
      INNER JOIN
                (
           SELECT CAST(items AS int) AS items
             FROM dbo.fn_Split(@clientprogramserviceids, ',')
                ) AS serviceids ON ClientProgramServiceId = items
      INNER JOIN ClientProgramServices AS CS ON CS.ClientProgramServiceId = CSP.ClientProgramServiceId
      LEFT JOIN CourtLinkServiceConfig AS CLS ON CLS.ServiceId = CS.ServiceId
                                                 AND ISNULL(CLS.TabDisplay_Placements, 'Y') = 'Y'
      LEFT JOIN ClientServicePlacementHours AS CSPH ON CSP.ClientServicePlacementId = CSPH.ClientServicePlacementHourId
      LEFT JOIN PlacementSites AS P ON CSP.PlacementSiteId = P.PlacementSiteId
     WHERE CSP.RecordDeleted = 'N'
     GROUP BY CSP.ClientProgramServiceId, 
              CSP.ClientServicePlacementId, 
              P.PlacementSiteId, 
              P.PlacementSite, 
              CSP.StartDate, 
              CSP.EndDate, 
              CSP.HoursAssigned, 
              CSP.Comments, 
              CSP.Active;

    --ClientServiceViolations    

    SELECT C.ClientProgramServiceId, 
           C.ClientServiceViolationId, 
           C.ViolationType AS ViolationTypeId, 
           GC1.CodeName AS ViolationType, 
           C.NotificationMethod AS NotificationMethodId, 
           GC2.CodeName AS NotificationMethod, 
           CONVERT(varchar(10), C.ViolationDate, 101) AS ViolationDate, 
           C.Comments, 
           C.Resolution, 
           C.Active
      FROM ClientServiceViolations AS C
      INNER JOIN
                (
           SELECT CAST(items AS int) AS items
             FROM dbo.fn_Split(@clientprogramserviceids, ',')
                ) AS serviceids ON ClientProgramServiceId = items
      INNER JOIN ClientProgramServices AS CS ON CS.ClientProgramServiceId = C.ClientProgramServiceId
      LEFT JOIN CourtLinkServiceConfig AS CLS ON CLS.ServiceId = CS.ServiceId
                                                 AND ISNULL(CLS.TabDisplay_Violations, 'Y') = 'Y'
      LEFT JOIN GlobalCodes AS GC1 ON C.ViolationType = GC1.GlobalCodeId
      LEFT JOIN GlobalCodes AS GC2 ON C.NotificationMethod = GC2.GlobalCodeId
     WHERE C.RecordDeleted = 'N'
    ORDER BY C.ViolationDate DESC, 
             C.CreatedDate DESC;
END;