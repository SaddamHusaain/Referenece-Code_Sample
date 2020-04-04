using AutoMapper;
using Newtonsoft.Json;
using Test.API.Filter;
using Test.Entities.Common;
using Test.Entities.Request;
using Test.Entities.Response;
using Test.Repository.Common;
using Test.Service.IService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Test.API.Controllers
{
    [RoutePrefix("LinkAPI")]
    public class LinkAPIController : ApiController
    {
        #region Private
        private System.Net.Http.HttpResponseMessage httpResponseMessage = null;
        private string connectionString = null;
        private ILinkService _ILinkService = null;
        BaseResponse baseResponse = null;
        LinkRoleResponse LinkRoleResponse = null;
        LinkUserResponse LinkUserResponse = null;
        LinkLoginResponse LinkLoginResponse = null;
        LinkDocumentResponse LinkDocumentResponse = null;
        LinkClientDetailResponse LinkClientDetailResponse = null;
        LinkClientProgramViolationResponse LinkClientProgramViolationResponse = null;
        LinkClientSecurityProcedureResponse LinkClientSecurityProcedureResponse = null;
        LinkClientCommunityFinancialDetailResponse LinkClientCommunityFinancialDetailResponse = null;
        LinkClientSessionNoteResponse LinkClientSessionNoteResponse = null;
        LinkProgramConfigResponse LinkProgramConfigResponse = null;
        LinkServiceConfigResponse LinkServiceConfigResponse = null;
        LinkChangePasswordResponse LinkChangePasswordResponse = null;
        ClientProgramServiceResponse clientProgramServiceResponse = null;
        ClientServiceEquipmentResponse clientServiceEquipmentResponse = null;
        ClientServicePeriodResponse clientServicePeriodResponse = null;
        ClientServicePlacementResponse clientServicePlacementResponse = null;
        ClientServiceViolationResponse clientServiceViolationResponse = null;
        ClientProgramServiceLeftTabResponse clientProgramServiceLeftTabResponse = null;
        DownloadDocumentResponse downloadDocumentResponse = null;
        ClientDataPdfResponse clientDataPdfResponse = null;
        LinkReferralCountByProgramResponse LinkReferralCountByProgramResponse = null;
        LinkReferralListResponse LinkReferralListResponse = null;
        #endregion
        public LinkAPIController(ILinkService ILinkService)
        {
            _ILinkService = ILinkService;
        }

        #region Users
        /// <summary>
        /// Create Update User
        /// </summary>
        /// <param name="LinkUserRequest">LinkUserRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CreateUpdateUser")]
        [ActionName("CreateUpdateUser")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> CreateUpdateUser(LinkUserRequest LinkUserRequest)
        {
            try
            {
                httpResponseMessage = new HttpResponseMessage();
                baseResponse = new BaseResponse();
                if (ModelState.IsValid && LinkUserRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkUserRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    baseResponse = await _ILinkService.CreateUpdateUser(LinkUserRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, baseResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkUserRequest.APILogId);
                baseResponse.Success = false;
                baseResponse.IsException = true;
                baseResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, baseResponse);
            }
            return httpResponseMessage;
        }


        /// <summary>
        /// Change Password
        /// </summary>
        /// <param name="LinkUserChangePasswordRequest">LinkUserChangePasswordRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("ChangePassword")]
        [ActionName("ChangePassword")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> ChangePassword(LinkUserChangePasswordRequest LinkUserChangePasswordRequest)
        {
            try
            {
                httpResponseMessage = new HttpResponseMessage();
                LinkChangePasswordResponse = new LinkChangePasswordResponse();
                if (ModelState.IsValid && LinkUserChangePasswordRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkUserChangePasswordRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }

                    LinkModifyPassword LinkModifyPassword = Mapper.Map<LinkModifyPassword>(LinkUserChangePasswordRequest);
                    LinkModifyPassword.Action = "ChangePassword";

                    BaseResponse baseResponse = await _ILinkService.ModifyPassword(LinkModifyPassword, connectionString);
                    LinkChangePasswordResponse = Mapper.Map<LinkChangePasswordResponse>(baseResponse);
                    if (baseResponse.Success)
                    {
                        var planEmailEncryptedPassord = LinkUserChangePasswordRequest.ActionPerformedBy + ':' + LinkUserChangePasswordRequest.NewPassword + ':' + LinkUserChangePasswordRequest.APILogId;
                        LinkChangePasswordResponse.Token = AesEncryptionDecryption.Encrypt(planEmailEncryptedPassord);
                    }
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkChangePasswordResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkUserChangePasswordRequest.APILogId);
                LinkChangePasswordResponse.Success = false;
                LinkChangePasswordResponse.IsException = true;
                LinkChangePasswordResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkChangePasswordResponse);
            }
            return httpResponseMessage;
        }

        /// <summary>
        /// Reset Password
        /// </summary>
        /// <remarks>
        ///1.Action - ResetPassword - When password reset by staff member.
        /// </remarks>
        /// <param name="LinkUserRestPasswordRequest">LinkUserRestPasswordRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("ResetPassword")]
        [ActionName("ResetPassword")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> ResetPassword(LinkUserRestPasswordRequest LinkUserRestPasswordRequest)
        {
            try
            {
                httpResponseMessage = new HttpResponseMessage();
                baseResponse = new BaseResponse();
                if (ModelState.IsValid && LinkUserRestPasswordRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkUserRestPasswordRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }

                    LinkModifyPassword LinkModifyPassword = Mapper.Map<LinkModifyPassword>(LinkUserRestPasswordRequest);
                    baseResponse = await _ILinkService.ModifyPassword(LinkModifyPassword, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, baseResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkUserRestPasswordRequest.APILogId);
                baseResponse.Success = false;
                baseResponse.IsException = true;
                baseResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, baseResponse);
            }
            return httpResponseMessage;
        }

        /// <summary>
        /// Get Link Users
        /// </summary>
        /// <param name="LinkUserIdRequest">LinkUserIdRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetUsers")]
        [ActionName("GetUsers")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetUsers(LinkUserIdRequest LinkUserIdRequest)
        {
            try
            {

                httpResponseMessage = new HttpResponseMessage();
                LinkUserResponse = new LinkUserResponse();
                if (ModelState.IsValid && LinkUserIdRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkUserIdRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    LinkUserDetailRequest LinkUserDetailRequest = Mapper.Map<LinkUserDetailRequest>(LinkUserIdRequest);
                    LinkUserResponse = await _ILinkService.GetUsers(LinkUserDetailRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkUserResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkUserIdRequest.APILogId);
                LinkUserResponse.Success = false;
                LinkUserResponse.IsException = true;
                LinkUserResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkUserResponse);
            }
            return httpResponseMessage;
        }

        /// <summary>
        /// User Login
        /// </summary>
        /// <param name="LinkUserLoginRequest">LinkUserLoginRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("UserLogin")]
        [ActionName("UserLogin")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> UserLogin(LinkUserLoginRequest LinkUserLoginRequest)
        {
            try
            {
                httpResponseMessage = new HttpResponseMessage();
                LinkLoginResponse = new LinkLoginResponse();
                if (ModelState.IsValid && LinkUserLoginRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkUserLoginRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    LinkLoginResponse = await _ILinkService.UserLogin(LinkUserLoginRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkLoginResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkUserLoginRequest.APILogId);
                LinkLoginResponse.Success = false;
                LinkLoginResponse.IsException = true;
                LinkLoginResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkLoginResponse);
            }
            return httpResponseMessage;
        }

        /// <summary>
        /// Send Reset Password Email
        /// </summary>
        /// <param name="LinkUserNameRequest">LinkUserNameRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("SendResetPasswordEmail")]
        [ActionName("SendResetPasswordEmail")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> SendResetPasswordEmail(LinkUserNameRequest LinkUserNameRequest)
        {
            try
            {
                httpResponseMessage = new HttpResponseMessage();
                baseResponse = new BaseResponse();
                if (ModelState.IsValid && LinkUserNameRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkUserNameRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    baseResponse = await _ILinkService.SetResetPasswordToken(LinkUserNameRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, baseResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkUserNameRequest.APILogId);
                baseResponse.Success = false;
                baseResponse.IsException = true;
                baseResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, baseResponse);
            }
            return httpResponseMessage;
        }



        /// <summary>
        /// Validate Reset Password Token
        /// </summary>
        /// <param name="resetForgetPasswordRequest">ResetForgetPasswordRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("ResetForgetPassword")]
        [ActionName("ResetForgetPassword")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> ResetForgetPassword(ResetForgetPasswordRequest resetForgetPasswordRequest)
        {
            try
            {
                httpResponseMessage = new HttpResponseMessage();
                baseResponse = new BaseResponse();
                if (ModelState.IsValid && resetForgetPasswordRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        resetForgetPasswordRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    baseResponse = await _ILinkService.ResetForgetPassword(resetForgetPasswordRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, baseResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, resetForgetPasswordRequest.APILogId);
                baseResponse.Success = false;
                baseResponse.IsException = true;
                baseResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, baseResponse);
            }
            return httpResponseMessage;
        }
        #endregion

        #region  Roles
        /// <summary>
        /// Get Link Roles
        /// </summary>
        /// <param name="LinkRoleIdRequest">LinkRoleIdRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetRoles")]
        [ActionName("GetRoles")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetRoles(LinkRoleIdRequest LinkRoleIdRequest)
        {
            try
            {

                httpResponseMessage = new HttpResponseMessage();
                LinkRoleResponse = new LinkRoleResponse();
                if (ModelState.IsValid && LinkRoleIdRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkRoleIdRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    LinkRoleResponse = await _ILinkService.GetRoles(LinkRoleIdRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkRoleResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkRoleIdRequest.APILogId);
                LinkRoleResponse.Success = false;
                LinkRoleResponse.IsException = true;
                LinkRoleResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkRoleResponse);
            }
            return httpResponseMessage;
        }
        #endregion

        #region Documents
        /// <summary>
        /// Create Update Documents
        /// </summary>
        /// <param name="LinkDocumentRequest">LinkDocumentRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CreateUpdateDocument")]
        [ActionName("CreateUpdateDocument")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> CreateUpdateDocument()
        {
            HttpRequestMessage request = this.Request;
            var context = HttpContext.Current.Request;
            HttpPostedFile file = null;
            LinkDocumentRequest LinkDocumentRequest = null;

            if (context.Form.Count > 0)
            {
                var dataKey = context.Form.AllKeys.FirstOrDefault();

                var jsonDataString = context.Form[dataKey];
                LinkDocumentRequest = JsonConvert.DeserializeObject<LinkDocumentRequest>(jsonDataString);
            }

            if (LinkDocumentRequest.NewFile == true)
            {
                if (!request.Content.IsMimeMultipartContent())
                {
                    throw new HttpResponseException(new HttpResponseMessage((HttpStatusCode.UnsupportedMediaType)));
                }

                if (context.Files.Count > 0)
                {
                    var filename = context.Files.AllKeys.FirstOrDefault();
                    file = context.Files[filename];
                }
                else
                {
                    return null;
                }
                LinkDocumentRequest.FileName = file.FileName;

            }


            try
            {
                httpResponseMessage = new HttpResponseMessage();
                baseResponse = new BaseResponse();
                if (ModelState.IsValid && LinkDocumentRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkDocumentRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    baseResponse = await _ILinkService.CreateUpdateDocument(LinkDocumentRequest, connectionString, file);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, baseResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkDocumentRequest.APILogId);
                baseResponse.Success = false;
                baseResponse.IsException = true;
                baseResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, baseResponse);
            }
            return httpResponseMessage;
        }


        /// <summary>
        /// Get Link Documents
        /// </summary>
        /// <param name="LinkDocumentIdRequest">LinkDocumentIdRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetDocuments")]
        [ActionName("GetDocuments")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetDocuments(LinkDocumentIdRequest LinkDocumentIdRequest)
        {
            try
            {

                httpResponseMessage = new HttpResponseMessage();
                LinkDocumentResponse = new LinkDocumentResponse();
                if (ModelState.IsValid && LinkDocumentIdRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkDocumentIdRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    LinkDocumentResponse = await _ILinkService.GetDocuments(LinkDocumentIdRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkDocumentResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkDocumentIdRequest.APILogId);
                LinkDocumentResponse.Success = false;
                LinkDocumentResponse.IsException = true;
                LinkDocumentResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkDocumentResponse);
            }
            return httpResponseMessage;
        }


        /// <summary>
        /// Get Link Documents
        /// </summary>
        /// <param name="LinkDocumentIdRequest">LinkDocumentIdRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Download")]
        [ActionName("Download")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> Download(LinkDocumentIdRequest LinkDocumentIdRequest)
        {
            try
            {
                downloadDocumentResponse = new DownloadDocumentResponse();
                if (ModelState.IsValid && LinkDocumentIdRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkDocumentIdRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    downloadDocumentResponse = await _ILinkService.Download(LinkDocumentIdRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, downloadDocumentResponse);
                    return httpResponseMessage;

                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkDocumentIdRequest.APILogId);
                LinkDocumentResponse.Success = false;
                LinkDocumentResponse.IsException = true;
                LinkDocumentResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkDocumentResponse);
            }
            return httpResponseMessage;
        }

        #endregion



        #region ClientData
        /// <summary>
        /// Get Link Client Details
        /// </summary>
        /// <param name="LinkClientDetailRequest">LinkClientDetailRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetLinkClientDetails")]
        [ActionName("GetLinkClientDetails")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetLinkClientDetails(LinkClientDetailRequest LinkClientDetailRequest)
        {
            try
            {

                httpResponseMessage = new HttpResponseMessage();
                LinkClientDetailResponse = new LinkClientDetailResponse();
                if (ModelState.IsValid && LinkClientDetailRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkClientDetailRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    LinkClientDetailResponse = await _ILinkService.GetLinkClientDetails(LinkClientDetailRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkClientDetailResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkClientDetailRequest.APILogId);
                LinkClientDetailResponse.Success = false;
                LinkClientDetailResponse.IsException = true;
                LinkClientDetailResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkClientDetailResponse);
            }
            return httpResponseMessage;
        }

        /// <summary>
        /// Get Link ClientProgramViolations
        /// </summary>
        /// <param name="LinkClientProgramViolationRequest">LinkClientProgramViolationRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetLinkClientProgramViolations")]
        [ActionName("GetLinkClientProgramViolations")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetLinkClientProgramViolations(LinkClientProgramViolationRequest LinkClientProgramViolationRequest)
        {
            try
            {

                httpResponseMessage = new HttpResponseMessage();
                LinkClientProgramViolationResponse = new LinkClientProgramViolationResponse();
                if (ModelState.IsValid && LinkClientProgramViolationRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkClientProgramViolationRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    LinkClientProgramViolationResponse = await _ILinkService.GetLinkClientProgramViolations(LinkClientProgramViolationRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkClientProgramViolationResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkClientProgramViolationRequest.APILogId);
                LinkClientProgramViolationResponse.Success = false;
                LinkClientProgramViolationResponse.IsException = true;
                LinkClientProgramViolationResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkClientProgramViolationResponse);
            }
            return httpResponseMessage;
        }

        /// <summary>
        /// Get Link ClientSecurityProcedures
        /// </summary>
        /// <param name="LinkClientSecurityProcedureRequest">LinkClientSecurityProcedureRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetLinkClientSecurityProcedures")]
        [ActionName("GetLinkClientSecurityProcedures")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetLinkClientSecurityProcedures(LinkClientSecurityProcedureRequest LinkClientSecurityProcedureRequest)
        {
            try
            {

                httpResponseMessage = new HttpResponseMessage();
                LinkClientSecurityProcedureResponse = new LinkClientSecurityProcedureResponse();
                if (ModelState.IsValid && LinkClientSecurityProcedureRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkClientSecurityProcedureRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    LinkClientSecurityProcedureResponse = await _ILinkService.GetLinkClientSecurityProcedures(LinkClientSecurityProcedureRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkClientSecurityProcedureResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkClientSecurityProcedureRequest.APILogId);
                LinkClientSecurityProcedureResponse.Success = false;
                LinkClientSecurityProcedureResponse.IsException = true;
                LinkClientSecurityProcedureResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkClientSecurityProcedureResponse);
            }
            return httpResponseMessage;
        }

        /// <summary>
        /// Get Link ClientCommunityFinancialDetails
        /// </summary>
        /// <param name="LinkClientCommunityFinancialDetailRequest">LinkClientCommunityFinancialDetailRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetLinkClientCommunityFinancialDetails")]
        [ActionName("GetLinkClientCommunityFinancialDetails")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetLinkClientCommunityFinancialDetails(LinkClientCommunityFinancialDetailRequest LinkClientCommunityFinancialDetailRequest)
        {
            try
            {

                httpResponseMessage = new HttpResponseMessage();
                LinkClientCommunityFinancialDetailResponse = new LinkClientCommunityFinancialDetailResponse();
                if (ModelState.IsValid && LinkClientCommunityFinancialDetailRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkClientCommunityFinancialDetailRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    LinkClientCommunityFinancialDetailResponse = await _ILinkService.GetLinkClientCommunityFinancialDetails(LinkClientCommunityFinancialDetailRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkClientCommunityFinancialDetailResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkClientCommunityFinancialDetailRequest.APILogId);
                LinkClientCommunityFinancialDetailResponse.Success = false;
                LinkClientCommunityFinancialDetailResponse.IsException = true;
                LinkClientCommunityFinancialDetailResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkClientCommunityFinancialDetailResponse);
            }
            return httpResponseMessage;
        }
        

        /// <summary>
        /// Get Link ClientSessionNotes
        /// </summary>
        /// <param name="LinkClientSessionNoteRequest">LinkClientSessionNoteRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetLinkClientSessionNotes")]
        [ActionName("GetLinkClientSessionNotes")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetLinkClientSessionNotes(LinkClientSessionNoteRequest LinkClientSessionNoteRequest)
        {
            try
            {

                httpResponseMessage = new HttpResponseMessage();
                LinkClientSessionNoteResponse = new LinkClientSessionNoteResponse();
                if (ModelState.IsValid && LinkClientSessionNoteRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkClientSessionNoteRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    LinkClientSessionNoteResponse = await _ILinkService.GetLinkClientSessionNotes(LinkClientSessionNoteRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkClientSessionNoteResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkClientSessionNoteRequest.APILogId);
                LinkClientSessionNoteResponse.Success = false;
                LinkClientSessionNoteResponse.IsException = true;
                LinkClientSessionNoteResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkClientSessionNoteResponse);
            }
            return httpResponseMessage;
        }

        /// <summary>
        /// GetClientDataPdf
        /// </summary>
        /// <param name="clientDataPdfRequest">clientDataPdfRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetClientDataPdf")]
        [ActionName("GetClientDataPdf")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetClientDataPdf(ClientDataPdfRequest clientDataPdfRequest)
        {
            try
            {

                httpResponseMessage = new HttpResponseMessage();
                clientDataPdfResponse = new ClientDataPdfResponse();
                if (ModelState.IsValid && clientDataPdfRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        clientDataPdfRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {







































































                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    clientDataPdfResponse = await _ILinkService.GetClientDataPdf(clientDataPdfRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, clientDataPdfResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, clientDataPdfRequest.APILogId);
                clientDataPdfResponse.Success = false;
                clientDataPdfResponse.IsException = true;
                clientDataPdfResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, clientDataPdfResponse);
            }
            return httpResponseMessage;
        }
        

        #endregion

        #region Configuration
        /// <summary>
        /// Get Link ProgramConfig
        /// </summary>
        /// <param name="LinkProgramConfigDetailRequest">LinkProgramConfigDetailRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetLinkProgramConfig")]
        [ActionName("GetLinkProgramConfig")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetLinkProgramConfig(LinkProgramConfigDetailRequest LinkProgramConfigDetailRequest)
        {
            try
            {

                httpResponseMessage = new HttpResponseMessage();
                LinkProgramConfigResponse = new LinkProgramConfigResponse();
                if (ModelState.IsValid && LinkProgramConfigDetailRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkProgramConfigDetailRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    LinkProgramConfigResponse = await _ILinkService.GetLinkProgramConfig(LinkProgramConfigDetailRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkProgramConfigResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkProgramConfigDetailRequest.APILogId);
                LinkProgramConfigResponse.Success = false;
                LinkProgramConfigResponse.IsException = true;
                LinkProgramConfigResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkProgramConfigResponse);
            }
            return httpResponseMessage;
        }

        /// <summary>
        /// Get Link ServiceConfig
        /// </summary>
        /// <param name="LinkServiceConfigDetailRequest">LinkServiceConfigDetailRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetLinkServiceConfig")]
        [ActionName("GetLinkServiceConfig")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetLinkServiceConfig(LinkServiceConfigDetailRequest LinkServiceConfigDetailRequest)
        {
            try
            {

                httpResponseMessage = new HttpResponseMessage();
                LinkServiceConfigResponse = new LinkServiceConfigResponse();
                if (ModelState.IsValid && LinkServiceConfigDetailRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkServiceConfigDetailRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    LinkServiceConfigResponse = await _ILinkService.GetLinkServiceConfig(LinkServiceConfigDetailRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkServiceConfigResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkServiceConfigDetailRequest.APILogId);
                LinkServiceConfigResponse.Success = false;
                LinkServiceConfigResponse.IsException = true;
                LinkServiceConfigResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkServiceConfigResponse);
            }
            return httpResponseMessage;
        }

        /// <summary>
        /// Create Update LinkProgramConfig
        /// </summary>
        /// <param name="LinkProgramConfigRequest">LinkProgramConfigRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CreateUpdateLinkProgramConfig")]
        [ActionName("CreateUpdateLinkProgramConfig")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> CreateUpdateLinkProgramConfig(LinkProgramConfigRequest LinkProgramConfigRequest)
        {
            try
            {
                httpResponseMessage = new HttpResponseMessage();
                baseResponse = new BaseResponse();
                if (ModelState.IsValid && LinkProgramConfigRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkProgramConfigRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    baseResponse = await _ILinkService.CreateUpdateLinkProgramConfig(LinkProgramConfigRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, baseResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkProgramConfigRequest.APILogId);
                baseResponse.Success = false;
                baseResponse.IsException = true;
                baseResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, baseResponse);
            }
            return httpResponseMessage;
        }


        /// <summary>
        /// Create Update LinkServiceConfig
        /// </summary>
        /// <param name="LinkServiceConfigRequest">LinkServiceConfigRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CreateUpdateLinkServiceConfig")]
        [ActionName("CreateUpdateLinkServiceConfig")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> CreateUpdateLinkServiceConfig(LinkServiceConfigRequest LinkServiceConfigRequest)
        {
            try
            {
                httpResponseMessage = new HttpResponseMessage();
                baseResponse = new BaseResponse();
                if (ModelState.IsValid && LinkServiceConfigRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkServiceConfigRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    baseResponse = await _ILinkService.CreateUpdateLinkServiceConfig(LinkServiceConfigRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, baseResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkServiceConfigRequest.APILogId);
                baseResponse.Success = false;
                baseResponse.IsException = true;
                baseResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, baseResponse);
            }
            return httpResponseMessage;
        }
        #endregion


        #region Service
        /// <summary>
        /// GetClientProgramServices
        /// </summary>
        /// <param name="clientProgramServiceRequest">ClientProgramServiceRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetClientProgramServices")]
        [ActionName("GetClientProgramServices")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetClientProgramServices(ClientProgramServiceRequest clientProgramServiceRequest)
        {
            try
            {
                httpResponseMessage = new HttpResponseMessage();
                clientProgramServiceResponse = new ClientProgramServiceResponse();
                if (ModelState.IsValid && clientProgramServiceRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        clientProgramServiceRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    clientProgramServiceResponse = await _ILinkService.GetClientProgramServices(clientProgramServiceRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, clientProgramServiceResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, clientProgramServiceRequest.APILogId);
                clientProgramServiceResponse.Success = false;
                clientProgramServiceResponse.IsException = true;
                clientProgramServiceResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, clientProgramServiceResponse);
            }
            return httpResponseMessage;
        }

        /// <summary>
        /// GetClientServiceEquipments
        /// </summary>
        /// <param name="clientProgramServiceIdRequest">ClientProgramServiceIdRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetClientServiceEquipments")]
        [ActionName("GetClientServiceEquipments")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetClientServiceEquipments(ClientProgramServiceIdRequest clientProgramServiceIdRequest)
        {
            try
            {
                httpResponseMessage = new HttpResponseMessage();
                clientServiceEquipmentResponse = new ClientServiceEquipmentResponse();
                if (ModelState.IsValid && clientProgramServiceIdRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        clientProgramServiceIdRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    clientServiceEquipmentResponse = await _ILinkService.GetClientServiceEquipments(clientProgramServiceIdRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, clientServiceEquipmentResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, clientProgramServiceIdRequest.APILogId);
                clientServiceEquipmentResponse.Success = false;
                clientServiceEquipmentResponse.IsException = true;
                clientServiceEquipmentResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, clientServiceEquipmentResponse);
            }
            return httpResponseMessage;
        }


        /// <summary>
        /// GetClientServicePeriods
        /// </summary>
        /// <param name="clientProgramServiceIdRequest">ClientProgramServiceIdRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetClientServicePeriods")]
        [ActionName("GetClientServicePeriods")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetClientServicePeriods(ClientProgramServiceIdRequest clientProgramServiceIdRequest)
        {
            try
            {
                httpResponseMessage = new HttpResponseMessage();
                clientServicePeriodResponse = new ClientServicePeriodResponse();
                if (ModelState.IsValid && clientProgramServiceIdRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        clientProgramServiceIdRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    clientServicePeriodResponse = await _ILinkService.GetClientServicePeriods(clientProgramServiceIdRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, clientServicePeriodResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, clientProgramServiceIdRequest.APILogId);
                clientServicePeriodResponse.Success = false;
                clientServicePeriodResponse.IsException = true;
                clientServicePeriodResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, clientServicePeriodResponse);
            }
            return httpResponseMessage;
        }

        /// <summary>
        /// GetClientServicePlacements
        /// </summary>
        /// <param name="clientProgramServiceIdRequest">ClientProgramServiceIdRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetClientServicePlacements")]
        [ActionName("GetClientServicePlacements")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetClientServicePlacements(ClientProgramServiceIdRequest clientProgramServiceIdRequest)
        {
            try
            {
                httpResponseMessage = new HttpResponseMessage();
                clientServicePlacementResponse = new ClientServicePlacementResponse();
                if (ModelState.IsValid && clientProgramServiceIdRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        clientProgramServiceIdRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    clientServicePlacementResponse = await _ILinkService.GetClientServicePlacements(clientProgramServiceIdRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, clientServicePlacementResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, clientProgramServiceIdRequest.APILogId);
                clientServicePlacementResponse.Success = false;
                clientServicePlacementResponse.IsException = true;
                clientServicePlacementResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, clientServicePlacementResponse);
            }
            return httpResponseMessage;
        }

        /// <summary>
        /// GetClientServiceViolations
        /// </summary>
        /// <param name="clientProgramServiceIdRequest">ClientProgramServiceIdRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetClientServiceViolations")]
        [ActionName("GetClientServiceViolations")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetClientServiceViolations(ClientProgramServiceIdRequest clientProgramServiceIdRequest)
        {
            try
            {
                httpResponseMessage = new HttpResponseMessage();
                clientServiceViolationResponse = new ClientServiceViolationResponse();
                if (ModelState.IsValid && clientProgramServiceIdRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        clientProgramServiceIdRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    clientServiceViolationResponse = await _ILinkService.GetClientServiceViolations(clientProgramServiceIdRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, clientServiceViolationResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, clientProgramServiceIdRequest.APILogId);
                clientServiceViolationResponse.Success = false;
                clientServiceViolationResponse.IsException = true;
                clientServiceViolationResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, clientServiceViolationResponse);
            }
            return httpResponseMessage;
        }
        /// <summary>
        /// GetClientProgramService LeftTabs
        /// </summary>
        /// <param name="clientProgramServiceRequest">ClientProgramServiceIdRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetClientProgramServiceLeftTabs")]
        [ActionName("GetClientProgramServiceLeftTabs")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetClientProgramServiceLeftTabs(ClientProgramServiceRequest clientProgramServiceRequest)
        {
            try
            {
                httpResponseMessage = new HttpResponseMessage();
                clientProgramServiceLeftTabResponse  = new ClientProgramServiceLeftTabResponse();
                if (ModelState.IsValid && clientProgramServiceRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        clientProgramServiceRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    clientProgramServiceLeftTabResponse = await _ILinkService.GetClientProgramServiceLeftTabs(clientProgramServiceRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, clientProgramServiceLeftTabResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, clientProgramServiceRequest.APILogId);
                clientProgramServiceLeftTabResponse.Success = false;
                clientProgramServiceLeftTabResponse.IsException = true;
                clientProgramServiceLeftTabResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, clientProgramServiceLeftTabResponse);
            }
            return httpResponseMessage;
        }

        #endregion

        #region Referral
        /// <summary>
        ///  Get Link ReferralCountByPrograms
        /// </summary>
        /// <param name="LinkReferralCountByProgramRequest">LinkReferralCountByProgramRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetLinkReferralCountByPrograms")]
        [ActionName("GetLinkReferralCountByPrograms")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetLinkReferralCountByPrograms(LinkReferralCountByProgramRequest LinkReferralCountByProgramRequest)
        {
            try
            {

                httpResponseMessage = new HttpResponseMessage();
                LinkReferralCountByProgramResponse = new LinkReferralCountByProgramResponse();
                if (ModelState.IsValid && LinkReferralCountByProgramRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkReferralCountByProgramRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    LinkReferralCountByProgramResponse = await _ILinkService.GetLinkReferralCountByPrograms(LinkReferralCountByProgramRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkReferralCountByProgramResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkReferralCountByProgramRequest.APILogId);
                LinkReferralCountByProgramResponse.Success = false;
                LinkReferralCountByProgramResponse.IsException = true;
                LinkReferralCountByProgramResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkReferralCountByProgramResponse);
            }
            return httpResponseMessage;
        }

        /// <summary>
        ///  Get Link ReferralList
        /// </summary>
        /// <param name="LinkReferralListRequest">LinkReferralListRequest Model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetLinkReferralList")]
        [ActionName("GetLinkReferralList")]
        [LinkAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetLinkReferralList(LinkReferralListRequest LinkReferralListRequest)
        {
            try
            {

                httpResponseMessage = new HttpResponseMessage();
                LinkReferralListResponse = new LinkReferralListResponse();
                if (ModelState.IsValid && LinkReferralListRequest != null)
                {
                    if (Request.Headers.Contains("APILogId"))
                    {
                        LinkReferralListRequest.APILogId = Convert.ToInt32(Request.Headers.GetValues("APILogId").First());
                    }

                    if (Request.Headers.Contains("Source"))
                    {
                        connectionString = Request.Headers.GetValues("Source").First();
                    }
                    LinkReferralListResponse = await _ILinkService.GetLinkReferralList(LinkReferralListRequest, connectionString);
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkReferralListResponse);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.InvalidRequest());
                }
            }
            catch (Exception ex)
            {
                APIErrorLog.APIErrorLogToDB(ex, connectionString, LinkReferralListRequest.APILogId);
                LinkReferralListResponse.Success = false;
                LinkReferralListResponse.IsException = true;
                LinkReferralListResponse.Message = ex.Message;
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, LinkReferralListResponse);
            }
            return httpResponseMessage;
        }
        #endregion
    }
}
