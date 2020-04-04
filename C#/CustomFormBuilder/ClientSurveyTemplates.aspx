<%@ Page Title="" Language="C#" MasterPageFile="~/AdminLayout.master" AutoEventWireup="true" CodeBehind="ClientSurveyTemplates.aspx.cs" Inherits="Admin_ClientSurveyTemplates" %>

<%@ MasterType VirtualPath="~/AdminLayout.master" %>


<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContentPlaceHolder" runat="server">
    <script type="text/javascript" src="../App_Themes/JS/ClientSurveyTemplates.js?v=<% =ConfigurationManager.AppSettings["JSVersion"].ToString() %>">    </script>

    <asp:GridView ID="GridViewSurveyTemplates" EnableViewState="false" runat="server" AutoGenerateColumns="False"
        CssClass="table permission_table" ShowHeaderWhenEmpty="True" EmptyDataText="No survey found">
        <Columns>
            <asp:TemplateField HeaderText="Actions" ItemStyle-HorizontalAlign="Left" ItemStyle-CssClass="twoAction">
                <ItemTemplate>
                    <img src="../App_Themes/Images/<%# DataBinder.Eval(Container.DataItem,"DeleteImage")%>"
                        style="cursor: pointer" title="<%# DataBinder.Eval(Container.DataItem,"DeleteImageTitle")%>"
                        onclick="DeleteTemplate(this,<%# DataBinder.Eval(Container.DataItem,"SurveyTemplateId") %>,<%# GridViewSurveyTemplates.Rows.Count%>,'<%#GridViewSurveyTemplates.ClientID%>')" />&nbsp;&nbsp;

                    <a href="Javascript:EditTemplate(<%# DataBinder.Eval(Container.DataItem,"SurveyTemplateId") %>)">
                        <img src="../App_Themes/Images/edit.png" style="cursor: pointer" title="Edit" /></a>
                </ItemTemplate>
            </asp:TemplateField>

            <asp:TemplateField HeaderText="Survey Template Name" ItemStyle-Wrap="false" HeaderStyle-Wrap="false"
                ItemStyle-HorizontalAlign="Left">
                <ItemTemplate>
                    <a href="Javascript:EditSurveyTemplate(<%# DataBinder.Eval(Container.DataItem,"SurveyTemplateId") %>,<%# GridViewSurveyTemplates.Rows.Count%>,'<%#GridViewSurveyTemplates.ClientID%>')">
                        <%# DataBinder.Eval(Container.DataItem, "SurveyTemplateName")%>
                    </a>
                </ItemTemplate>
            </asp:TemplateField>



        </Columns>
    </asp:GridView>



    <div class="modal fade" id="DivSurveyTemplate">
        <div class="modal-dialog ">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Survey Template</h4>
                </div>
                <div class="modal-body">
                    <table class="table filter-table smart-form">

                        <tr>
                            <td style="width: 15%">
                                <label class="label">Template Name:</label>
                            </td>
                            <td style="width: 30%">
                                <label class="input">
                                    <input type="text" class="req_feild" id="TextBoxSurveyTemplateName" />
                                    <input type="text" class="hidden" id="TextCompanyId" value="<%=Convert.ToInt32(((SitePrinciple)HttpContext.Current.Session["UserContext"]).DataRowUser["DefaultCompanyId"]) %>" />
                                    <input type="text" class="hidden" id="TextSurveyTemplateId" value="-1" />
                                </label>
                            </td>
                        </tr>
                    </table>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button id="ButtonSurveyTemplate" type="button" class="btn btn-primary" onclick="CreateSurveyTemplate('Insert');return false;">Create Template</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptPlaceHolder" runat="server">
</asp:Content>
