-- =============================================            
-- Author:  Saddam            
-- Created date:- 30-10-2019      
-- Description: This procedure will be used to Get Courtlink ClientData.   
-- Modified Date :-13-12-2019
-- modified changes:-Added date only format for date fields
-- =============================================       
-- sp_GetCourtLinkClientDetails 2,2    
  
CRETE PROCEDURE [dbo].[sp_GetCourtLinkClientDetails] @clientprogramenrollmentid AS int, @companyid AS int, @programid AS int  
AS  
BEGIN  
  
    SELECT CPE.ClientProgramEnrollmentId,  
           CPE.ClientId,  
           (CASE  
                WHEN ISNULL(G_B.CodeName, '') = 'Assessment'  
                THEN '* '  
                ELSE ''  
            END  
               )+C.LastName+', '+C.FirstName+ISNULL(' '+C.MiddleName, '') AS [ClientName],  
           P.Program,  
           U.Lastname+', '+U.Firstname AS [CaseManger],  
           U.EmailId AS CM_Email,  
          CONVERT(VARCHAR(10),  CPE.StartDate , 101) as StartDate,  
         CONVERT(VARCHAR(10),   CPE.ScheduledEndDate , 101) as ScheduledEndDate  ,  
           CASE  
               WHEN CPE.ActualEndDate IS NOT NULL  
               THEN 'Termed - '+ISNULL(G_T.CodeName, '')  
               ELSE CASE ISNULL(ast.ProgramStatus, 'Active')  
                        WHEN 'Active'  
                        THEN 'Compliant'  
                        WHEN 'Open'  
                        THEN 'Compliant'  
                        WHEN 'Action'  
                        THEN 'Non-compliant'  
                        WHEN 'Terminate'  
                        THEN 'Terminate'  
                        WHEN 'Jail'  
                        THEN 'Jail'  
                        ELSE ast.ProgramStatus  
                    END  
               END AS [ProgramStatus],  
           R.ReferralSource,  
          CONVERT(VARCHAR(10), CPE.IntakeDate, 101) as IntakeDate,  
           CONVERT(VARCHAR(10),CPE.ActualEndDate, 101) as ActualEndDate ,  
           G.CodeName AS ManagingLocation,  
           STRING_AGG(CD.DocketNumber, ',') AS Dockets,  
           CompanyId,  
           P.ProgramId,  
           ISNULL(CLP.TabDisplay_Violations, 'Y') AS TabDisplay_Violations,  
           ISNULL(CLP.TabDisplay_Procedures, 'Y') AS TabDisplay_Procedures,  
           ISNULL(CLP.TabDisplay_Financials, 'Y') AS TabDisplay_Financials,  
           ISNULL(CLP.TabDisplay_TreatmentGroups, 'Y') AS TabDisplay_TreatmentGroups,  
           P.EnableServices  
      FROM ClientProgramEnrollments AS CPE  
      INNER JOIN Clients AS C ON CPE.ClientId = C.ClientId  
      INNER JOIN Programs AS P ON CPE.ProgramId = P.ProgramId  
      INNER JOIN USers AS U ON CPE.CaseManagerId = U.UserId  
      INNER JOIN ReferralSources AS R ON CPE.ReferralSourceId = R.ReferralSourceId  
      LEFT JOIN GlobalCodes AS G ON G.GlobalCodeId = CPE.ManagingLocation  
      LEFT JOIN GlobalCodes AS G_T ON CPE.TerminationReason = G_T.GlobalCodeId  
      LEFT JOIN GlobalCodes AS G_B ON CPE.Billing = G_B.GlobalCodeId  
      LEFT JOIN ClientProgramEnrollmentDockets AS CPED ON CPE.ClientProgramEnrollmentId = CPED.ClientProgramEnrollmentId  
      LEFT JOIN ClientDockets AS CD ON CPED.ClientDocketId = CD.ClientDocketId  
      LEFT JOIN CourtLinkProgramConfig AS CLP ON P.ProgramId = CLP.ProgramId  
                                                 AND CLP.RecordDeleted = 'N'  
                                                 AND CLP.Active = 'Y'  
      LEFT JOIN  
               (  
           SELECT ClientProgramEnrollmentId,  
                  G_CPS.CodeName AS ProgramStatus,  
                  StartDate,  
                  RANK() OVER(PARTITION BY ClientProgramEnrollmentId ORDER BY StartDate,  
                                                                              ClientProgramStatusId DESC) AS [rownum]  
             FROM ClientProgramStatus AS CPS  
             INNER JOIN GlobalCodes AS G_CPS ON CPS.ProgramStatus = G_CPS.GlobalCodeId  
            WHERE EndDate IS NULL  
                  AND UPPER(ProgramStatus) <> 'HOLD'  
                  AND UPPER(ProgramStatus) NOT LIKE 'EXTERNAL%'  
               ) AS AST ON CPE.ClientProgramEnrollmentId = AST.ClientProgramEnrollmentId  
                           AND ast.rownum = 1  
     WHERE CompanyId = @companyid  
           AND ISNULL(ActualEndDate, GETDATE()) >= DATEADD(year, -1, GETDATE())  
           AND (CPE.ClientProgramEnrollmentId = @clientprogramenrollmentid  
                OR @clientprogramenrollmentid < 1)  
           AND CPE.RecordDeleted = 'N'  
           AND CPE.Active = 'Y'  
           AND (P.ProgramId = @programid  
                OR @programid < 1)  
     GROUP BY CPE.ClientProgramEnrollmentId,  
              CPE.ClientId,  
              G_B.CodeName,  
              P.Program,  
              C.LastName,  
              C.FirstName,  
              C.MiddleName,  
              U.Lastname,  
              U.Firstname,  
              U.EmailId,  
              CPE.StartDate,  
              CPE.ScheduledEndDate,  
              CPE.ActualEndDate,  
              G_T.CodeName,  
              R.ReferralSource,  
              CPE.IntakeDate,  
              CPE.ActualEndDate,  
              G.CodeName,  
              ast.ProgramStatus,  
              CompanyId,  
              P.ProgramId,  
              CLP.TabDisplay_Violations,  
              CLP.TabDisplay_Procedures,  
              CLP.TabDisplay_Financials,  
              CLP.TabDisplay_TreatmentGroups,  
              P.EnableServices;  
END;