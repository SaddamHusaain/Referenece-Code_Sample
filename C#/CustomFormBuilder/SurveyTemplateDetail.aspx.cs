using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
public partial class SurveyTemplateDetail : AdminBasePage
{
    private CommonAdministration _CommonAdministrationObject = null;
    public string fields = "";
    public string fieldsLayout = "";
    string FilterExpression = "";
    string controlName = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        _CommonAdministrationObject = new CommonAdministration();
        DropDownGlobalCode.DataSource = _CommonAdministrationObject.GetGlobalCodeCategories(-1);
        DropDownGlobalCode.DataTextField = "Category";
        DropDownGlobalCode.DataValueField = "Category";
        DropDownGlobalCode.DataBind();

        BindControls();
    }

    public void BindControls()
    {
        FilterExpression = "CodeName NOT IN ('HorizontalLine','StraightText','Headers')";
        _CommonAdministrationObject = new CommonAdministration();
        DataTable UserDefinedField = _CommonAdministrationObject.GetGlobalCodes(-1, -1, "UDFFIELDDATATYPE", false);
        DataRow[] rows = UserDefinedField.Select(FilterExpression);
        foreach (DataRow row in rows)
        {
            switch (row["CodeName"].ToString())
            {
                case "Varchar":
                    {
                        controlName = "Text Box";
                        break;
                    }
                case "Text":
                    {
                        controlName = "Text Area";
                        break;
                    }
                case "Integer":
                    {
                        controlName = "Integer";
                        break;
                    }
                case "Date":
                    {
                        controlName = "Date Time";
                        break;
                    }
                case "Money":
                    {
                        controlName = "Money / Decimal";
                        break;
                    }
                case "GlobalCode":
                    {
                        controlName = "Global Code";
                        break;
                    }
            }
            fields += "<tr><td><a href='javascript:void(0);' id=\"FormControl-" + row["CodeName"].ToString() + "\" code-value='" + row["GlobalCodeId"].ToString() + "' data-type='" + row["CodeName"].ToString() + "'>" + controlName + "</a></td></tr>";
        }
        BindLayoutControls(UserDefinedField);

    }
    public void BindLayoutControls(DataTable UserDefinedFieldsLayout)
    {
        FilterExpression = "CodeName NOT IN ('Varchar','Text','Integer','Date','Money','GlobalCode')";
        DataRow[] rows = UserDefinedFieldsLayout.Select(FilterExpression);
        foreach (DataRow row in rows)
        {
            switch (row["CodeName"].ToString())
            {
                case "HorizontalLine":
                    {
                        controlName = "Horizontal Line";
                        break;
                    }
                case "StraightText":
                    {
                        controlName = "Straight Text";
                        break;
                    }
                case "Headers":
                    {
                        controlName = "Headers";
                        break;
                    }
            }
            fieldsLayout += "<tr><td><a href='javascript:void(0);' id=\"FormControl-" + row["CodeName"].ToString() + "\" code-value='" + row["GlobalCodeId"].ToString() + "' data-type='" + row["CodeName"].ToString() + "'>" + controlName + "</a></td></tr>";
        }
    }
}
