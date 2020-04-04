<%@ Page Title="" Language="C#" MasterPageFile="~/AdminLayout.master" AutoEventWireup="true" CodeBehind="SurveyTemplateDetail.aspx.cs" Inherits="SurveyTemplateDetail" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContentPlaceHolder" runat="server">
    <script type="text/javascript" src="../App_Themes/JS/ClientSurveyTemplates.js?v=<% =ConfigurationManager.AppSettings["JSVersion"].ToString() %>">    </script>
    <input type="text" id="ClientSurveyId" name="ClientSurveyId" style="display: none;" value="<%= Request.QueryString["ClientSurveyId"]%>" class="primary" />
    <div class="draganddrop-container">
        <div id="ControlsTab" class="panel-default">
               <div class="panel-heading">
                    <h4>Layout Controls</h4>
                </div>
                <div class="panel-body">
                    <table id="FormLayoutControlTable" style="overflow: auto">

                        <%= fieldsLayout %>
                    </table>
                </div>

            <div class="panel-heading">
                <h4>Form Controls</h4>
            </div>
            <div class="panel-body">
                <table id="FormControlTable" style="overflow: auto">

                    <%= fields %>
                </table>
            </div>
        </div>

        <div id="form-design-area" class="drag-drop-area" data-content="Drag layout controls from the left side-bar into this space to begin building your form">
        </div>


        <div id="properties-container" class="Hidden panel-default">
            <div class="panel-heading">
                <h4>Control Properties</h4>
            </div>
            <div class="panel-body">
                <table class="smart-form">
                    <tr>
                        <td>
                            <label class="label text-center"><strong>Control Type:</strong> <span id="LabelControlType"></span></label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label class="label">Text:</label>
                            <label class="input">
                                <input type="text" id="controlTitle" class="propertiesControl"  maxlength="100" />
                            </label>
                            <textarea id="controlTitleLayouts" class="Hidden" rows="5" cols="150" style="width: 225px!important;padding: 3%; "></textarea>
                        </td>
                    </tr>

                    <tr id="GlobalCodeRow" class="hidden">
                        <td>
                            <label class="label">
                                Global Category:</label>
                            <label class="select">
                                <asp:DropDownList ID="DropDownGlobalCode" name="DropDownGlobalCode" CssClass="propertiesControl" runat="server"></asp:DropDownList><i></i></label>

                        </td>
                    </tr>
                    <tr>

                        <td class="layoutElements">
                            <label class="checkbox">
                                <input type="checkbox" name="Required" id="CheckBoxRequired" class="propertiesControl"><i></i> Required
                            </label>
                        </td>

                    </tr>
                    <tr id="ShowTimeRow" class="hidden">

                        <td>
                            <label class="checkbox">
                                <input type="checkbox" name="CheckBoxShowTime" id="CheckBoxShowTime" class="propertiesControl"><i></i> Show time
                            </label>
                        </td>
                    </tr>
                      <tr id="HeaderRow" class="hidden">
                        <td>
                            <label class="label">
                                Header Type:</label>
                            <label class="select">
                                <asp:DropDownList ID="DropDownHeaderType" name="DropDownHeaderType" CssClass="propertiesControl" runat="server">
                                    <asp:ListItem Value="h1">h1</asp:ListItem>
                                    <asp:ListItem Value="h2">h2</asp:ListItem>
                                    <asp:ListItem Value="h3">h3</asp:ListItem>
                                    <asp:ListItem Value="h4">h4</asp:ListItem>
                                    <asp:ListItem Value="h5">h5</asp:ListItem>
                                    <asp:ListItem Value="h6">h6</asp:ListItem>
                                </asp:DropDownList><i></i></label>
                        </td>
                    </tr>
                </table>
                <div class="buttonrow pull-right">
                    <input type="button" onclick="CloseProperties()" class="btn btn-default btn-xs button" value="Close">
                    <input type="button" onclick="SaveProperties()" class="btn btn-primary btn-xs button" value="Update">
                </div>
            </div>
        </div>

    </div>
    <div id="buttonrow" class="buttonrow">
        <button onclick="SaveClientSuveysTemplate();return false;" class="btn btn-primary btn-xs button" style="float: right">Save Template</button>
        <button onclick="ClearAllControls()" type="button" class="btn btn-default btn-xs button" style="float: right">Cancel</button>

    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptPlaceHolder" runat="server">
    <script type="text/javascript">
        $(document).ready(function () {
            ShowTemplateDetails(GetURLParameter("SurveyTemplateId"));
        });

    </script>

    <script id='form-field-Text-template' type='text/x-jquery-tmpl'>
        <div class="TextareaContainer  controlContainer ${hideControl}" id="TextareaContainer${count}">
            <p><span class="glyphicon glyphicon-pencil iconscursor" onclick="editProperties('LabelText${count}')"></span></p>
            <button type="button" class="close closeSetting iconscursor" onclick="deleteControl(ColumnText${count})" aria-hidden="true">&times</button>
            <label id="LabelText${count}" class="cdata labelsetting" name="ColumnName">${columnName}</label>
            <textarea rows="5" style="width: 100%;" class="clientControl form-control ${reqclass}" id="ColumnText${count}" datatypecode="${datatype}" name="Text" isrequired="${required}" tempid='${tempid}' readonly></textarea>
        </div>
    </script>
    <script id='form-field-Varchar-template' type='text/x-jquery-tmpl'>
        <div class="TextboxContainer controlContainer ${hideControl}" id="TextboxContainer${count}">
            <p><span class="glyphicon glyphicon-pencil iconscursor" onclick="editProperties('LabelVarchar${count}')"></span></p>
            <button type="button" class="close closeSetting iconscursor" onclick="deleteControl(ColumnVarchar${count})" aria-hidden="true">&times;</button>
            <label id="LabelVarchar${count}"  class="cdata labelsetting" name="ColumnName">${columnName}</label>
            <input type='text' placeholder='' class='clientControl form-control ${reqclass}' id="ColumnVarchar${count}" datatypecode="${datatype}" name='Varchar' isrequired="${required}" tempid='${tempid}' readonly />
        </div>
    </script>
    <script id='form-field-Money-template' type='text/x-jquery-tmpl'>
        <div class="MoneyContainer controlContainer ${hideControl}" id="MoneyContainer${count}">
            <p><span class="glyphicon glyphicon-pencil iconscursor" onclick="editProperties('LabelMoney${count}')"></span></p>
            <button type="button" class="close closeSetting iconscursor" onclick="deleteControl(ColumnMoney${count})" aria-hidden="true">&times;</button>
            <label id="LabelMoney${count}" class="cdata labelsetting" name="ColumnName">${columnName}</label>
            <input type='number' class='clientControl form-control ${reqclass}' id="ColumnMoney${count}" name='Money' datatypecode="${datatype}" isrequired="${required}" tempid='${tempid}' readonly />
        </div>
    </script>
    <script id='form-field-Datetime-template' type='text/x-jquery-tmpl'>
        <div class="DatetimeContainer controlContainer ${hideControl}" id="DatetimeContainer${count}">           
            <p><span class="glyphicon glyphicon-pencil iconscursor" onclick="editProperties('LabelDateTime${count}')"></span></p>
            <button type="button" class="close closeSetting iconscursor" onclick="deleteControl(ColumnDateTime${count})" aria-hidden="true">&times;</button>
            <label id="LabelDateTime${count}" class="cdata labelsetting" name="ColumnName">${columnName}</label>
            <label style="width: 100%">
                <i class="icon-append fa fa-calendar"></i>
                <input type="text" name='DateTime' style="width: 40%; height: 32px;" id="ColumnDateTime${count}" datatypecode="${datatype}" class=" date clientControl hasDatepicker ${reqclass}" showtime="${showtime}" isrequired="${required}" tempid='${tempid}' readonly />

                <i class="icon-append fa fa-clock-o ${hiddenclass}"></i>
                <input type="text" class='time ui-timepicker-input ${reqclass} ${hiddenclass}' style="width: 40%; height: 32px;" id="ColumnDateTimetime${count}" name='DateTimetime' autocomplete="off" readonly />
            </label>
        </div>
    </script>

    <script id='form-field-GlobalCode-template' type='text/x-jquery-tmpl'>
        <div class="GlobalCodeContainer controlContainer ${hideControl}" id="GlobalCodeContainer${count}">
            <%--<p><span class="glyphicon glyphicon-sort" style="right: 24px; top: 1px"></span></p>--%>
            <p><span class="glyphicon glyphicon-pencil iconscursor" onclick="editProperties('LabelGlobalCode${count}')"></span></p>
            <button type="button" class="close closeSetting iconscursor" onclick="deleteControl(ColumnGlobalCode${count})" aria-hidden="true">&times;</button>
            <label id="LabelGlobalCode${count}" class="cdata labelsetting" name="ColumnName">${columnName}</label>
            <select class='clientControl form-control ${reqclass}' id="ColumnGlobalCode${count}" name='GlobalCode' datatypecode="${datatype}" globalcategory="${globalCodeName}" isrequired="${required}" tempid='${tempid}' readonly></select>
        </div>
    </script>
    <script id='form-field-Integer-template' type='text/x-jquery-tmpl'>
        <div class="IntegerContainer controlContainer ${hideControl}" id="IntegerContainer${count}">
            <p><span class="glyphicon glyphicon-pencil iconscursor" onclick="editProperties('LabelInteger${count}')"></span></p>
            <button type="button" class="close closeSetting iconscursor" onclick="deleteControl(ColumnInteger${count})" aria-hidden="true">&times;</button>
            <label id="LabelInteger${count}" class="cdata labelsetting" name="ColumnName">${columnName}</label>
            <input type='number' class='clientControl form-control ${reqclass} ' id="ColumnInteger${count}" name='Integer' datatypecode="${datatype}" isrequired="${required}" tempid='${tempid}' readonly />
        </div>
    </script>
       <script id='form-field-LineBreak-template' type='text/x-jquery-tmpl'>
        <div class="LineBreakContainer  controlContainer ${hideControl}" id="LineBreakContainer{count}">
            <button type="button" class="close closeSetting iconscursor" onclick="deleteControl(ColumnLineBreak${count})" aria-hidden="true">&times</button>
            <hr id="ColumnLineBreak${count}"  class='clientControl Form-control ${reqclass} dividerLine'  name="HorizontalLine" datatypecode="${datatype}" tempid='${tempid}' readonly />
        </div>
    </script>
     <script id='form-field-StraightText-template' type='text/x-jquery-tmpl'>
        <div class="StraightTextContainer controlContainer ${hideControl}" id="StraightTextContainer${count}">
            <p><span class="glyphicon glyphicon-pencil iconscursor" onclick="editProperties('LabelStraightText${count}')"></span></p>
            <button type="button" class="close closeSetting iconscursor" onclick="deleteControl(ColumnStraightText${count})" aria-hidden="true">&times;</button>
            <label id="LabelStraightText${count}" class="cdata labelsetting" name="ColumnName">${columnName}</label>
        <label class='clientControl form-control ${reqclass} Hidden' id="ColumnStraightText${count}" name='StraightText' datatypecode="${datatype}" isrequired="${required}" tempid='${tempid}' readonly></label>
        </div>
    </script>
      <script id='form-field-Headers-template' type='text/x-jquery-tmpl'>
        <div class="HeadersContainer controlContainer ${hideControl}" id="HeadersContainer${count}">
            <p><span class="glyphicon glyphicon-pencil iconscursor" onclick="editProperties('LabelHeaders${count}')"></span></p>
            <button type="button" class="close closeSetting iconscursor" onclick="deleteControl(ColumnHeaders${count})" aria-hidden="true">&times;</button>
            <label id="LabelHeaders${count}" class="cdata labelsetting" name="ColumnName">${columnName}</label>
            <label class='clientControl form-control ${reqclass} Hidden' id="ColumnHeaders${count}" name='Headers' datatypecode="${datatype}" globalcategory="${globalCodeName}" isrequired="${required}" tempid='${tempid}' readonly></label>
        </div>
    </script>
</asp:Content>
