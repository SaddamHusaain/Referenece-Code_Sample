using Newtonsoft.Json;
using Test.Entities.Common;
using Test.Entities.Request;
using Test.Entities.Response;
using Test.Repository.IRepository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
namespace Test.Repository.Repository
{
    public class LinkRepository : ILinkRepository
    {
        #region Private 
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
        DownloadDocumentResponse downloadDocumentResponse = null;
        AzureFileStorage azure = new AzureFileStorage();
        LinkProgramConfigResponse LinkProgramConfigResponse = null;
        LinkServiceConfigResponse LinkServiceConfigResponse = null;
        ClientProgramServiceResponse clientProgramServiceResponse = null;
        ClientServiceEquipmentResponse clientServiceEquipmentResponse = null;
        ClientServicePeriodResponse clientServicePeriodResponse = null;
        ClientServicePlacementResponse clientServicePlacementResponse = null;
        ClientServiceViolationResponse clientServiceViolationResponse = null;
        ClientProgramServiceLeftTabResponse clientProgramServiceLeftTabResponse = null;
        ClientDataPdfResponse clientDataPdfResponse = null;
        LinkReferralCountByProgramResponse LinkReferralCountByProgramResponse = null;
        LinkReferralListResponse LinkReferralListResponse = null;
        #endregion

        #region Users
        public async Task<BaseResponse> CreateUpdateUser(LinkUserRequest LinkUserRequest, string connectionstring)
        {
            baseResponse = new BaseResponse();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_InsertModifyLinkUser", con))
                {
                    string encryptedHubSecret = string.Empty;
                    if (LinkUserRequest.UserId < 1)
                    {
                        EncodeComparePassword _EncodeComparePassword = new EncodeComparePassword();
                        encryptedHubSecret = _EncodeComparePassword.GetMd5Hash(LinkUserRequest.Password);
                    }
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@UserId", LinkUserRequest.UserId);
                    cmd.Parameters.AddWithValue("@UserName", LinkUserRequest.UserName);
                    cmd.Parameters.AddWithValue("@PasswordHash", encryptedHubSecret);
                    cmd.Parameters.AddWithValue("@FirstName", LinkUserRequest.FirstName);
                    cmd.Parameters.AddWithValue("@LastName", LinkUserRequest.LastName);
                    cmd.Parameters.AddWithValue("@CourtAgency", LinkUserRequest.CourtAgency);
                    cmd.Parameters.AddWithValue("@Email", LinkUserRequest.Email);
                    cmd.Parameters.AddWithValue("@Address", LinkUserRequest.Address);
                    cmd.Parameters.AddWithValue("@Phone", LinkUserRequest.Phone);
                    cmd.Parameters.AddWithValue("@Roles", LinkUserRequest.Roles);
                    cmd.Parameters.AddWithValue("@Active", LinkUserRequest.Active);
                    cmd.Parameters.AddWithValue("@ActionPerformedBy", LinkUserRequest.ActionPerformedBy);

                    con.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));

                    if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
                    {
                        string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                        baseResponse = JsonConvert.DeserializeObject<List<BaseResponse>>(dataSetString).FirstOrDefault();
                    }
                    else
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                    }
                }
            }
            return baseResponse;
        }
        public async Task<LinkUserResponse> GetUsers(LinkUserDetailRequest LinkUserDetailRequest, string connectionstring)
        {
            LinkUserResponse = new LinkUserResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetLinkUsers", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@UserId", LinkUserDetailRequest.UserId);
                    cmd.Parameters.AddWithValue("@UserName", (object)LinkUserDetailRequest.UserName ?? DBNull.Value);
                    con.Open();

                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                LinkUserResponse.LinkUsers = JsonConvert.DeserializeObject<List<LinkUser>>(dataSetString);
            }
            return LinkUserResponse;
        }

        public async Task<BaseResponse> ModifyPassword(LinkModifyPassword LinkModifyPassword, string connectionstring)
        {
            baseResponse = new BaseResponse();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_ModifyLinkUserPassword", con))
                {
                    EncodeComparePassword _EncodeComparePassword = new EncodeComparePassword();
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@UserId", LinkModifyPassword.UserId);
                    cmd.Parameters.AddWithValue("@OldPasswordHash", LinkModifyPassword.OldPassword != null ? _EncodeComparePassword.GetMd5Hash(LinkModifyPassword.OldPassword) : "");
                    cmd.Parameters.AddWithValue("@NewPasswordHash", _EncodeComparePassword.GetMd5Hash(LinkModifyPassword.NewPassword));
                    cmd.Parameters.AddWithValue("@Action", LinkModifyPassword.Action);
                    cmd.Parameters.AddWithValue("@ActionPerformedBy", LinkModifyPassword.ActionPerformedBy);

                    con.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));

                    if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
                    {
                        string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                        baseResponse = JsonConvert.DeserializeObject<List<BaseResponse>>(dataSetString).FirstOrDefault();
                    }
                    else
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                    }
                }
            }
            return baseResponse;
        }

        public async Task<LinkLoginResponse> UserLogin(LinkUserLoginRequest LinkUserLoginRequest, string connectionstring)
        {
            LinkLoginResponse = new LinkLoginResponse();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_ValidateLinkUserLogin", con))
                {
                    EncodeComparePassword _EncodeComparePassword = new EncodeComparePassword();
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@username", LinkUserLoginRequest.UserName);
                    cmd.Parameters.AddWithValue("@PasswordHash", _EncodeComparePassword.GetMd5Hash(LinkUserLoginRequest.Password));

                    con.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));

                    if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
                    {
                        string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                        LinkLoginResponse = JsonConvert.DeserializeObject<List<LinkLoginResponse>>(dataSetString).FirstOrDefault();
                        if (LinkLoginResponse.Success && !string.IsNullOrEmpty(LinkLoginResponse.Roles))
                        {
                            LinkLoginResponse.Token = EncodeDecodeToken.CreateEncryptedLinkAuthenticatePasswordTicket(LinkUserLoginRequest);
                        }
                        else
                        {
                            LinkLoginResponse.Success = false;
                            LinkLoginResponse.Message = CustomErrorMessages.USERNAME_PASSWORD_INVALID;
                        }
                    }
                    else
                    {
                        LinkLoginResponse.Success = false;
                        LinkLoginResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                    }
                }
            }
            return LinkLoginResponse;
        }

        public async Task<BaseResponse> SetResetPasswordToken(LinkUserNameRequest LinkUserNameRequest, string connectionstring)
        {
            baseResponse = new BaseResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_SetResetPasswordToken", con))
                {
                    System.Guid guid = Guid.NewGuid();
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@UserName", LinkUserNameRequest.UserName);
                    cmd.Parameters.AddWithValue("@Token", guid);
                    con.Open();
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    string Email = Convert.ToString(await cmd.ExecuteScalarAsync());

                    if (!string.IsNullOrEmpty(Email))
                    {
                        bool sendEmail = NotificationHelper.SendPasswordResetEmail(Email, guid.ToString());
                    }
                    baseResponse.Message = "Your password reset email has been sent.";
                }
            }
            return baseResponse;
        }

        public async Task<BaseResponse> ResetForgetPassword(ResetForgetPasswordRequest resetForgetPasswordRequest, string connectionstring)
        {
            baseResponse = new BaseResponse();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_ResetForgetPassword", con))
                {
                    EncodeComparePassword _EncodeComparePassword = new EncodeComparePassword();
                    string encryptedHubSecret = _EncodeComparePassword.GetMd5Hash(resetForgetPasswordRequest.Password);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Email", resetForgetPasswordRequest.Email);
                    cmd.Parameters.AddWithValue("@Token", resetForgetPasswordRequest.Token);
                    cmd.Parameters.AddWithValue("@passwordhash", encryptedHubSecret);

                    con.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));

                    if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
                    {
                        string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                        baseResponse = JsonConvert.DeserializeObject<List<BaseResponse>>(dataSetString).FirstOrDefault();
                    }
                    else
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                    }
                }
            }
            return baseResponse;
        }

        #endregion

        #region Roles
        public async Task<LinkRoleResponse> GetRoles(LinkRoleIdRequest LinkRoleIdRequest, string connectionstring)
        {
            LinkRoleResponse = new LinkRoleResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetLinkRoles", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@RoleId", LinkRoleIdRequest.RoleId);
                    con.Open();

                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                LinkRoleResponse.LinkRoles = JsonConvert.DeserializeObject<List<LinkRole>>(dataSetString);
            }
            return LinkRoleResponse;
        }
        #endregion

        #region Docuemnts 
        public async Task<BaseResponse> CreateUpdateDocument(LinkDocumentRequest LinkDocumentRequest, string connectionstring, HttpPostedFile file)
        {
            baseResponse = new BaseResponse();
            int DocumentId = 0;
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_InsertModifyLinkDocument", con))
                {
                   
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@DocumentId", LinkDocumentRequest.DocumentId);
                    cmd.Parameters.AddWithValue("@FileName", Path.GetFileName(LinkDocumentRequest.FileName));
                    cmd.Parameters.AddWithValue("@Description", LinkDocumentRequest.Description);
                    cmd.Parameters.AddWithValue("@RoleId", LinkDocumentRequest.RoleId);
                    cmd.Parameters.AddWithValue("@ActionPerformedBy", LinkDocumentRequest.ActionPerformedBy);

                    con.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));

                    if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[0].Rows)
                        {
                            DocumentId = Convert.ToInt32(row["DocumentId"]);

                        }
                        if (file != null)
                        {
                            azure.uploadDocument(file, LinkDocumentRequest.Description, DocumentId);

                        }
                        string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                        baseResponse = JsonConvert.DeserializeObject<List<BaseResponse>>(dataSetString).FirstOrDefault();
                    }
                    else
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                    }
                }
            }
            return baseResponse;
        }

        public async Task<LinkDocumentResponse> GetDocuments(LinkDocumentIdRequest LinkDocumentIdRequest, string connectionstring)
        {
            LinkDocumentResponse = new LinkDocumentResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetLinkDocuments", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@DocumentId", LinkDocumentIdRequest.DocumentId);
                    cmd.Parameters.AddWithValue("@UserId", LinkDocumentIdRequest.UserId);
                    con.Open();

                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                LinkDocumentResponse.LinkDocuments = JsonConvert.DeserializeObject<List<LinkDocument>>(dataSetString);
            }
            return LinkDocumentResponse;
        }

        public async Task<DownloadDocumentResponse> Download(LinkDocumentIdRequest LinkDocumentIdRequest, string connectionstring)
        {
            downloadDocumentResponse = new DownloadDocumentResponse();
            DataSet dataSet = new DataSet();
            string file = string.Empty;
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetLinkDocuments", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@DocumentId", LinkDocumentIdRequest.DocumentId);
                    cmd.Parameters.AddWithValue("@UserId", LinkDocumentIdRequest.UserId);
                    con.Open();

                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in dataSet.Tables[0].Rows)
                {
                    file = Convert.ToString(row["FileName"]);

                }
                downloadDocumentResponse.FileName = file;
                downloadDocumentResponse.path = azure.download(file, LinkDocumentIdRequest.DocumentId);
                //string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                //LinkDocumentResponse.LinkDocuments = JsonConvert.DeserializeObject<List<LinkDocument>>(dataSetString);
                //File(blobReference.OpenRead(), "application/octet-stream", doc.Filename)
            }
            return downloadDocumentResponse;
        }
        #endregion

        #region ClientData
        public async Task<LinkClientDetailResponse> GetLinkClientDetails(LinkClientDetailRequest LinkClientDetailRequest, string connectionstring)
        {
            LinkClientDetailResponse = new LinkClientDetailResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetLinkClientDetails", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ClientProgramEnrollmentId", LinkClientDetailRequest.ClientProgramEnrollmentId);
                    cmd.Parameters.AddWithValue("@CompanyId", LinkClientDetailRequest.CompanyId);
                    cmd.Parameters.AddWithValue("@ProgramId", LinkClientDetailRequest.ProgramId);
                    con.Open();
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                LinkClientDetailResponse.LinkClientDetails = JsonConvert.DeserializeObject<List<LinkClientDetail>>(dataSetString);
            }
            return LinkClientDetailResponse;
        }

        public async Task<LinkClientProgramViolationResponse> GetLinkClientProgramViolations(LinkClientProgramViolationRequest LinkClientProgramViolationRequest, string connectionstring)
        {
            LinkClientProgramViolationResponse = new LinkClientProgramViolationResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetLinkClientProgramViolations", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ClientProgramViolationId", LinkClientProgramViolationRequest.ClientProgramViolationId);
                    cmd.Parameters.AddWithValue("@ClientProgramEnrollmentId", LinkClientProgramViolationRequest.ClientProgramEnrollmentId);
                    con.Open();

                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                LinkClientProgramViolationResponse.LinkClientProgramViolations = JsonConvert.DeserializeObject<List<LinkClientProgramViolation>>(dataSetString);
            }
            return LinkClientProgramViolationResponse;
        }

        public async Task<LinkClientSecurityProcedureResponse> GetLinkClientSecurityProcedures(LinkClientSecurityProcedureRequest LinkClientSecurityProcedureRequest, string connectionstring)
        {
            LinkClientSecurityProcedureResponse = new LinkClientSecurityProcedureResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetLinkClientSecurityProcedures", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ClientSecurityProcedureId", LinkClientSecurityProcedureRequest.ClientSecurityProcedureId);
                    cmd.Parameters.AddWithValue("@ClientProgramEnrollmentId", LinkClientSecurityProcedureRequest.ClientProgramEnrollmentId);
                    con.Open();

                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                LinkClientSecurityProcedureResponse.LinkClientSecurityProcedures = JsonConvert.DeserializeObject<List<LinkClientSecurityProcedure>>(dataSetString);
            }
            return LinkClientSecurityProcedureResponse;
        }

        public async Task<LinkClientCommunityFinancialDetailResponse> GetLinkClientCommunityFinancialDetails(LinkClientCommunityFinancialDetailRequest LinkClientCommunityFinancialDetailRequest, string connectionstring)
        {
            LinkClientCommunityFinancialDetailResponse = new LinkClientCommunityFinancialDetailResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetLinkClientCommunityFinancialDetails", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ClientCommunityFinancialDetailId", LinkClientCommunityFinancialDetailRequest.ClientCommunityFinancialDetailId);
                    cmd.Parameters.AddWithValue("@ClientProgramEnrollmentId", LinkClientCommunityFinancialDetailRequest.ClientProgramEnrollmentId);
                    con.Open();

                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                LinkClientCommunityFinancialDetailResponse.LinkClientCommunityFinancialDetails = JsonConvert.DeserializeObject<List<LinkClientCommunityFinancialDetail>>(dataSetString);
            }
            return LinkClientCommunityFinancialDetailResponse;
        }

        public async Task<LinkClientSessionNoteResponse> GetLinkClientSessionNotes(LinkClientSessionNoteRequest LinkClientSessionNoteRequest, string connectionstring)
        {
            LinkClientSessionNoteResponse = new LinkClientSessionNoteResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetLinkClientSessionNotes", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ClientSessionNoteId", LinkClientSessionNoteRequest.ClientSessionNoteId);
                    cmd.Parameters.AddWithValue("@ClientProgramEnrollmentId", LinkClientSessionNoteRequest.ClientProgramEnrollmentId);
                    con.Open();

                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                LinkClientSessionNoteResponse.LinkClientSessionNotes = JsonConvert.DeserializeObject<List<LinkClientSessionNote>>(dataSetString);
            }
            return LinkClientSessionNoteResponse;
        }

        public async Task<ClientDataPdfResponse> GetClientDataPdf(ClientDataPdfRequest clientDataPdfRequest, string connectionstring)
        {
            clientDataPdfResponse = new ClientDataPdfResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetClientDataPdf", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@ClientProgramServiceIds", clientDataPdfRequest.ClientProgramServiceIds);
                    cmd.Parameters.AddWithValue("@ClientProgramEnrollmentId", clientDataPdfRequest.ClientProgramEnrollmentId);


                    con.Open();

                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0)
            {
                if (dataSet.Tables[0].Rows.Count > 0)
                {
                    string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                    clientDataPdfResponse.LinkProgramServices = JsonConvert.DeserializeObject<List<ClientProgramService>>(dataSetString);
                }
                if (dataSet.Tables[1].Rows.Count > 0)
                {
                    string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[1]);
                    clientDataPdfResponse.LinkServiceEquipments = JsonConvert.DeserializeObject<List<ClientServiceEquipment>>(dataSetString);
                }
                if (dataSet.Tables[2].Rows.Count > 0)
                {
                    string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[2]);
                    clientDataPdfResponse.LinkServicePeriods = JsonConvert.DeserializeObject<List<ClientServicePeriod>>(dataSetString);
                }
                if (dataSet.Tables[3].Rows.Count > 0)
                {
                    string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[3]);
                    clientDataPdfResponse.LinkServicePlacements = JsonConvert.DeserializeObject<List<ClientServicePlacement>>(dataSetString);
                }
                if (dataSet.Tables[4].Rows.Count > 0)
                {
                    string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[4]);
                    clientDataPdfResponse.LinkServiceViolations = JsonConvert.DeserializeObject<List<ClientServiceViolation>>(dataSetString);
                }
            }
            return clientDataPdfResponse;
        }
        #endregion


        #region configuration
        public async Task<LinkProgramConfigResponse> GetLinkProgramConfig(LinkProgramConfigDetailRequest LinkProgramConfigDetailRequest, string connectionstring)
        {
            LinkProgramConfigResponse = new LinkProgramConfigResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetLinkProgramConfig", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@LinkProgramConfigId", (object)LinkProgramConfigDetailRequest.LinkProgramConfigId ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@ProgramId", (object)LinkProgramConfigDetailRequest.ProgramId ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@CompanyId", LinkProgramConfigDetailRequest.CompanyId);
                    con.Open();
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                LinkProgramConfigResponse.LinkProgramConfigs = JsonConvert.DeserializeObject<List<LinkProgramConfig>>(dataSetString);
            }
            return LinkProgramConfigResponse;
        }

        public async Task<LinkServiceConfigResponse> GetLinkServiceConfig(LinkServiceConfigDetailRequest LinkServiceConfigDetailRequest, string connectionstring)
        {
            LinkServiceConfigResponse = new LinkServiceConfigResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetLinkServiceConfig", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@LinkServiceConfigId", (object)LinkServiceConfigDetailRequest.LinkServiceConfigId ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@ServiceId", (object)LinkServiceConfigDetailRequest.ServiceId ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@CompanyId", LinkServiceConfigDetailRequest.CompanyId);
                    con.Open();
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                LinkServiceConfigResponse.LinkServiceConfigs = JsonConvert.DeserializeObject<List<LinkServiceConfig>>(dataSetString);
            }
            return LinkServiceConfigResponse;
        }


        public async Task<BaseResponse> CreateUpdateLinkProgramConfig(LinkProgramConfigRequest LinkProgramConfigRequest, string connectionstring)
        {
            baseResponse = new BaseResponse();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_InsertModifyLinkProgramConfig", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ProgramId", LinkProgramConfigRequest.ProgramId);
                    cmd.Parameters.AddWithValue("@TabDisplay_Violations", (object)LinkProgramConfigRequest.TabDisplay_Violations ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@TabDisplay_Procedures", (object)LinkProgramConfigRequest.TabDisplay_Procedures ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@TabDisplay_Financials", (object)LinkProgramConfigRequest.TabDisplay_Financials ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@TabDisplay_TreatmentGroups", (object)LinkProgramConfigRequest.TabDisplay_TreatmentGroups ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@ActionPerformedBy", LinkProgramConfigRequest.ActionPerformedBy);

                    con.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));

                    if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
                    {
                        string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                        baseResponse = JsonConvert.DeserializeObject<List<BaseResponse>>(dataSetString).FirstOrDefault();
                    }
                    else
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                    }
                }
            }
            return baseResponse;
        }
        public async Task<BaseResponse> CreateUpdateLinkServiceConfig(LinkServiceConfigRequest LinkServiceConfigRequest, string connectionstring)
        {
            baseResponse = new BaseResponse();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_InsertModifyLinkServiceConfig", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ServiceId", LinkServiceConfigRequest.ServiceId);
                    cmd.Parameters.AddWithValue("@TabDisplay_Placements", (object)LinkServiceConfigRequest.TabDisplay_Placements ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@TabDisplay_ServicePeriods", (object)LinkServiceConfigRequest.TabDisplay_ServicePeriods ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@TabDisplay_Violations", (object)LinkServiceConfigRequest.TabDisplay_Violations ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@TabDisplay_Equipment", (object)LinkServiceConfigRequest.TabDisplay_Equipment ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@ActionPerformedBy", LinkServiceConfigRequest.ActionPerformedBy);

                    con.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));

                    if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
                    {
                        string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                        baseResponse = JsonConvert.DeserializeObject<List<BaseResponse>>(dataSetString).FirstOrDefault();
                    }
                    else
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                    }
                }
            }
            return baseResponse;
        }
        #endregion

        #region Service
        public async Task<ClientProgramServiceResponse> GetClientProgramServices(ClientProgramServiceRequest clientProgramServiceRequest, string connectionstring)
        {
            clientProgramServiceResponse = new ClientProgramServiceResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetClientProgramServices", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ClientProgramServiceId", clientProgramServiceRequest.ClientProgramServiceId);
                    cmd.Parameters.AddWithValue("@ClientProgramEnrollmentId", clientProgramServiceRequest.ClientProgramEnrollmentId);
                    con.Open();
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                clientProgramServiceResponse.ClientProgramServices = JsonConvert.DeserializeObject<List<ClientProgramService>>(dataSetString);
            }
            return clientProgramServiceResponse;
        }

        public async Task<ClientServiceEquipmentResponse> GetClientServiceEquipments(ClientProgramServiceIdRequest clientProgramServiceIdRequest, string connectionstring)
        {
            clientServiceEquipmentResponse = new ClientServiceEquipmentResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetClientServiceEquipments", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ClientProgramServiceId", clientProgramServiceIdRequest.ClientProgramServiceId);
                    con.Open();
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                clientServiceEquipmentResponse.ClientServiceEquipments = JsonConvert.DeserializeObject<List<ClientServiceEquipment>>(dataSetString);
            }
            return clientServiceEquipmentResponse;
        }

        public async Task<ClientServicePeriodResponse> GetClientServicePeriods(ClientProgramServiceIdRequest clientProgramServiceIdRequest, string connectionstring)
        {
            clientServicePeriodResponse = new ClientServicePeriodResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetClientServicePeriods", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ClientProgramServiceId", clientProgramServiceIdRequest.ClientProgramServiceId);
                    con.Open();

                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                clientServicePeriodResponse.ClientServicePeriods = JsonConvert.DeserializeObject<List<ClientServicePeriod>>(dataSetString);
            }
            return clientServicePeriodResponse;
        }

        public async Task<ClientServicePlacementResponse> GetClientServicePlacements(ClientProgramServiceIdRequest clientProgramServiceIdRequest, string connectionstring)
        {
            clientServicePlacementResponse = new ClientServicePlacementResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetClientServicePlacements", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ClientProgramServiceId", clientProgramServiceIdRequest.ClientProgramServiceId);
                    con.Open();

                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                clientServicePlacementResponse.ClientServicePlacements = JsonConvert.DeserializeObject<List<ClientServicePlacement>>(dataSetString);
            }
            return clientServicePlacementResponse;
        }

        public async Task<ClientServiceViolationResponse> GetClientServiceViolations(ClientProgramServiceIdRequest clientProgramServiceIdRequest, string connectionstring)
        {
            clientServiceViolationResponse = new ClientServiceViolationResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetClientServiceViolations", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ClientProgramServiceId", clientProgramServiceIdRequest.ClientProgramServiceId);
                    con.Open();

                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                clientServiceViolationResponse.ClientServiceViolations = JsonConvert.DeserializeObject<List<ClientServiceViolation>>(dataSetString);
            }
            return clientServiceViolationResponse;
        }

        public async Task<ClientProgramServiceLeftTabResponse> GetClientProgramServiceLeftTabs(ClientProgramServiceRequest clientProgramServiceRequest, string connectionstring)
        {
            clientProgramServiceLeftTabResponse = new ClientProgramServiceLeftTabResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetClientProgramServiceLeftTabs", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ClientProgramServiceId", clientProgramServiceRequest.ClientProgramServiceId);
                    cmd.Parameters.AddWithValue("@ClientProgramEnrollmentId", clientProgramServiceRequest.ClientProgramEnrollmentId);
                    con.Open();

                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                clientProgramServiceLeftTabResponse.ClientProgramServiceLeftTabs = JsonConvert.DeserializeObject<List<ClientProgramServiceLeftTab>>(dataSetString);
            }
            return clientProgramServiceLeftTabResponse;
        }
        #endregion

        #region Referral

        public async Task<LinkReferralCountByProgramResponse> GetLinkReferralCountByPrograms(LinkReferralCountByProgramRequest LinkReferralCountByProgramRequest, string connectionstring)
        {
            LinkReferralCountByProgramResponse = new LinkReferralCountByProgramResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetLinkReferralCountByPrograms", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@CompanyId", LinkReferralCountByProgramRequest.CompanyId);
                    cmd.Parameters.AddWithValue("@UserId", LinkReferralCountByProgramRequest.UserId);
                    con.Open();
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                LinkReferralCountByProgramResponse.LinkReferralCountByPrograms = JsonConvert.DeserializeObject<List<LinkReferralCountByProgram>>(dataSetString);
            }
            return LinkReferralCountByProgramResponse;
        }

        public async Task<LinkReferralListResponse> GetLinkReferralList(LinkReferralListRequest LinkReferralListRequest, string connectionstring)
        {
            LinkReferralListResponse = new LinkReferralListResponse();
            DataSet dataSet = new DataSet();
            using (SqlConnection con = new SqlConnection(CommonFunctions.GetConnectionString(connectionstring)))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetLinkReferralList", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ProgramId", LinkReferralListRequest.ProgramId);
                    cmd.Parameters.AddWithValue("@CompanyId", LinkReferralListRequest.CompanyId);
                    cmd.Parameters.AddWithValue("@UserId", LinkReferralListRequest.UserId);
                    con.Open();
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                    sqlDataAdapter.SelectCommand = cmd;
                    await Task.Run(() => sqlDataAdapter.Fill(dataSet));
                }
            }
            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                string dataSetString = CommonFunctions.ConvertDataTableToJson(dataSet.Tables[0]);
                LinkReferralListResponse.LinkReferralLists = JsonConvert.DeserializeObject<List<LinkReferralList>>(dataSetString);
            }
            return LinkReferralListResponse;
        }
        #endregion
    }
}
