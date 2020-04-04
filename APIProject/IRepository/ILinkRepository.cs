using Test.Entities.Request;
using Test.Entities.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Test.Repository.IRepository
{
    public interface ILinkRepository
    {
        #region Users
        Task<BaseResponse> CreateUpdateUser(LinkUserRequest LinkUserRequest, string connectionstring);
        Task<LinkUserResponse> GetUsers(LinkUserDetailRequest LinkUserDetailRequest, string connectionstring);
        Task<BaseResponse> ModifyPassword(LinkModifyPassword LinkModifyPassword, string connectionstring);
        Task<LinkLoginResponse> UserLogin(LinkUserLoginRequest LinkUserLoginRequest, string connectionstring);
        Task<BaseResponse> SetResetPasswordToken(LinkUserNameRequest LinkUserNameRequest, string connectionstring);
        Task<BaseResponse> ResetForgetPassword(ResetForgetPasswordRequest resetPasswordRequest, string connectionstring);
        #endregion

        #region Roles
        Task<LinkRoleResponse> GetRoles(LinkRoleIdRequest LinkRoleIdRequest, string connectionstring);

        #endregion

        #region Documents
        Task<BaseResponse> CreateUpdateDocument(LinkDocumentRequest LinkDocumentRequest, string connectionstring, HttpPostedFile file);
        Task<LinkDocumentResponse> GetDocuments(LinkDocumentIdRequest LinkDocumentIdRequest, string connectionstring);
        Task<DownloadDocumentResponse> Download(LinkDocumentIdRequest LinkDocumentIdRequest, string connectionstring);
        #endregion

        #region ClientData
        Task<LinkClientDetailResponse> GetLinkClientDetails(LinkClientDetailRequest LinkClientDetailRequest, string connectionstring);

        Task<LinkClientProgramViolationResponse> GetLinkClientProgramViolations(LinkClientProgramViolationRequest LinkClientProgramViolationRequest, string connectionstring);

        Task<LinkClientSecurityProcedureResponse> GetLinkClientSecurityProcedures(LinkClientSecurityProcedureRequest LinkClientSecurityProcedureRequest, string connectionstring);

        Task<LinkClientCommunityFinancialDetailResponse> GetLinkClientCommunityFinancialDetails(LinkClientCommunityFinancialDetailRequest LinkClientCommunityFinancialDetailRequest, string connectionstring);

        Task<LinkClientSessionNoteResponse> GetLinkClientSessionNotes(LinkClientSessionNoteRequest LinkClientSessionNoteRequest, string connectionstring);

        Task<ClientDataPdfResponse> GetClientDataPdf(ClientDataPdfRequest clientDataPdfRequest, string connectionstring);
        #endregion

        #region Configuration
        Task<LinkProgramConfigResponse> GetLinkProgramConfig(LinkProgramConfigDetailRequest LinkProgramConfigDetailRequest, string connectionstring);
        Task<LinkServiceConfigResponse> GetLinkServiceConfig(LinkServiceConfigDetailRequest LinkServiceConfigDetailRequest, string connectionstring);

        Task<BaseResponse> CreateUpdateLinkProgramConfig(LinkProgramConfigRequest LinkProgramConfigRequest, string connectionstring);
        Task<BaseResponse> CreateUpdateLinkServiceConfig(LinkServiceConfigRequest LinkServiceConfigRequest, string connectionstring);
        #endregion

        #region Service
        Task<ClientProgramServiceResponse> GetClientProgramServices(ClientProgramServiceRequest clientProgramServiceRequest, string connectionstring);
        Task<ClientServiceEquipmentResponse> GetClientServiceEquipments(ClientProgramServiceIdRequest clientProgramServiceIdRequest, string connectionstring);
        Task<ClientServicePeriodResponse> GetClientServicePeriods(ClientProgramServiceIdRequest clientProgramServiceIdRequest, string connectionstring);
        Task<ClientServicePlacementResponse> GetClientServicePlacements(ClientProgramServiceIdRequest clientProgramServiceIdRequest, string connectionstring);
        Task<ClientServiceViolationResponse> GetClientServiceViolations(ClientProgramServiceIdRequest clientProgramServiceIdRequest, string connectionstring);
        Task<ClientProgramServiceLeftTabResponse> GetClientProgramServiceLeftTabs(ClientProgramServiceRequest clientProgramServiceRequest, string connectionstring);
        #endregion

        #region Referral
        Task<LinkReferralCountByProgramResponse> GetLinkReferralCountByPrograms(LinkReferralCountByProgramRequest LinkReferralCountByProgramRequest, string connectionstring);
        Task<LinkReferralListResponse> GetLinkReferralList(LinkReferralListRequest LinkReferralListRequest, string connectionstring);
        #endregion
    }
}
