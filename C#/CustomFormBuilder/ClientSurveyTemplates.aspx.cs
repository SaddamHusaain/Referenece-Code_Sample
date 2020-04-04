using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;

public partial class Admin_ClientSurveyTemplates : AdminBasePage
{
    private PeakSystem.BusinessService.ClientSurveyTemplates _ClientSurveyTemplates = null;
    protected void Page_Load(object sender, EventArgs e)
    {
        Master.InnerTitle = "Survey Templates";
        Master.ButtonAddNew_OnClick = "ShowModal();return false;";




        BindClientSurveyTemplateGrid();
    }

    private void BindClientSurveyTemplateGrid()
    {
        try
        {
            _ClientSurveyTemplates = new PeakSystem.BusinessService.ClientSurveyTemplates();

            GridViewSurveyTemplates.DataSource = _ClientSurveyTemplates.GetSurveyTemplatesList(-1, Convert.ToInt32(((SitePrinciple)HttpContext.Current.Session["UserContext"]).DataRowUser["DefaultCompanyId"]), -1);
            GridViewSurveyTemplates.DataBind();
        }
        catch
        {

        }
        finally
        {
            _ClientSurveyTemplates = null;
        }
    }

}
