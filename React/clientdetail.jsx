import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import FinancialTab from '../clientdata/financials_tab';
import ProceduresTab from '../clientdata/procedures_tab';
import TreatmentGroupTab from '../clientdata/treatmentgroups_tab';
import ViolationsTab from '../clientdata/violations_tab';
import { apiService } from "../../services/api.service";
import Alert from 'react-bootstrap/Alert';
import VerticalServicesTab from "../../containers/clientdata/services_section";
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DialogContentText from '@material-ui/core/DialogContentText';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

import { COMPANY_ID } from '../../config/api.config';
import { Link } from "react-router-dom";

import FormatDateTime from "../../shared/components/functional/DateTimeFormatter";
import * as actions from '../../store/actions';
import { bindActionCreators } from 'redux';

import TransferList from "../../containers/clientdata/transfer_list";


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

class ClientData extends Component {
    constructor(props) {
        super(props);
        let { match } = this.props;
        this.state = {
            clientdata: [],
            value: 0,
            showActiveServices: false,
            clientprogramenrollmentid: match.params.clientprogramenrollmentid,
            classes: makeStyles(theme => ({
                root: {
                    flexGrow: 1,
                    backgroundColor: theme.palette.background.paper,
                },
            })),
            modalOpen: false,
            printOptionsForm: {
                Violations: false,
                Procedures: false,
                Financials: false,
                TreatmentGroups: false
            },
            servicesdata: [],
            selectedservices: [],
            message: "",
            TabDisplay_Violations: [],
            TabDisplay_Procedures: [],
            TabDisplay_Financials: [],
            TabDisplay_TreatmentGroups: [],
            selectdTransferListService: [],
            printserviecdetails: {},
            loading: false
        }
    }

    componentDidMount() {
        this.setState({ loading: true });
        this.ClientDetailDataRequest();
    }

    ClientDetailDataRequest = () => {
        let clientreqdetail = { ClientProgramEnrollmentId: this.state.clientprogramenrollmentid, ProgramId: -1, CompanyId: COMPANY_ID };
        apiService.post('GETCOURTLINKDETAILS', clientreqdetail).then(response => {
            if (response.Success && response.CourtLinkClientDetails != null) {
                let details = response.CourtLinkClientDetails;
                this.setState({
                    clientdata: details[0],
                    loading: false
                });
            }
            else {
                this.setState({ loading: false, message: response.Message });
            }
        }, error => {
            this.setState({ loading: false, message: error });;
        });
    }

    handleChange = (event, newValue) => {
        this.setState({ value: newValue })
    };
    handleClickOpen = () => {
        this.setState({
            modalOpen: true, message: "", printOptionsForm: {
                Violations: false,
                Procedures: false,
                Financials: false,
                TreatmentGroups: false
            }
        });
    };
    handleClose = () => {
        this.setState({
            modalOpen: false,
            showActiveServices: false,
            selectdTransferListService: []
        });

    };
    handleModalChange = (e) => {

        const { printOptionsForm } = this.state;
        printOptionsForm[e.target.name] = e.target.checked;
        this.setState({ printOptionsForm });
    }
    showServiceTabs = (e) => {
        const isServicesActive = e.target.checked;
        this.setState({ showActiveServices: isServicesActive });

    }
    handleChildData = (e) => {
        const servicesdata = e;
        this.setState({
            servicesdata: servicesdata
        });
    }

    handleViolationsChild = (e) => {
        const Violations = e;
        this.setState({
            TabDisplay_Violations: Violations
        });
    }

    handleProceduresChild = (e) => {

        const Procedures = e;
        this.setState({
            TabDisplay_Procedures: Procedures
        });
    }

    handleFinancialsChild = (e) => {
        const Financials = e;
        this.setState({
            TabDisplay_Financials: Financials
        });
    }

    handleTreatmentGroupsChild = (e) => {
        const TreatmentGroups = e;
        this.setState({
            TabDisplay_TreatmentGroups: TreatmentGroups
        });
    }

    handlePrintService = (e) => {
        const transferlistselectdevalues = e;
        this.setState({
            selectdTransferListService: transferlistselectdevalues
        });
    }

    handleModalSubmit = (e) => {
        e.preventDefault();
        var data = {
            ClientProgramEnrollmentId: this.state.clientprogramenrollmentid,
            ClientProgramServiceIds: (this.state.selectdTransferListService).toString()
        };
        if (data.ClientProgramServiceIds !== "") {
            apiService.post('GETCLIENTDATAPDF', data).then(response => {
                let details = {};
                if (response.Success) {
                    if (response.CourtLinkProgramServices != null) {
                        details = response;
                        this.setState({
                            printserviecdetails: details,
                            loading: false,
                            selectdTransferListService: []
                        });
                    }
                }
                else {
                    this.setState({ loading: false, message: response.Message });
                }
                this.printdata(this.state.printserviecdetails);

            },
                error => this.setState(prevState => {
                    this.setState({ loading: false, message: error });
                })
            );
        }
        else {
            data = [];
            this.setState({
                printserviecdetails: [],
                selectdTransferListService: []
            });
            this.printdata(data);
        }

    }

    printdata(servicesdata) {
        this.setState({ loading: false });
        var { printOptionsForm } = this.state;
        var optionChecked = false;

        Object.keys(printOptionsForm).map(function (key) {
            if (printOptionsForm[key]) {
                optionChecked = true;
                return 0;
            }
            return 0;
        });

        if (optionChecked === false && Object.keys(servicesdata).length < 1) {
            this.setState({ message: "Please select at least one tab or service to print." });
        }
        else {
            const { printOptionsForm } = this.state;

            if (this.state.clientdata) {
                var doc = new jsPDF("p", "mm", "a4");
                var clientdata = this.state.clientdata;
                doc.setFontSize("12");
                doc.setFontType("bold");

                // First Row
                doc.text(this.state.clientdata.ClientName, 10, 10);

                // Second Row
                doc.text('Program', 10, 20);
                doc.text('Referral Source', 75, 20);
                doc.text('Case Manager', 150, 20);

                // Fourth Row
                doc.text('Program Status', 10, 40);
                doc.text('Referral Date', 75, 40);
                doc.text('Intake Date(LoS)', 150, 40);

                // Sixth Row
                doc.text('Scheduled End', 10, 55);
                doc.text('Completion Date', 75, 55);
                doc.text('Dockets(s)', 150, 55);

                doc.setFontType("normal");
                doc.setFontSize("10");

                // Third Row
                doc.text(clientdata.Program, 10, 25, { pagesplit: true, 'maxWidth': 56, 'lineHeightFactor': 1.5 });
                doc.text(clientdata.ReferralSource, 75, 25, { pagesplit: true, 'maxWidth': 70, 'lineHeightFactor': 1.5 });
                var CaseManger = `${clientdata.CaseManger ? clientdata.CaseManger : ""} (${clientdata.CM_Email ? clientdata.CM_Email : ""})`;
                doc.text(CaseManger, 150, 25, { pagesplit: true, 'maxWidth': 57, 'lineHeightFactor': 1.5 });


                // Five Row
                doc.text(clientdata.ProgramStatus, 10, 45);
                doc.text(clientdata.StartDate, 75, 45);
                doc.text(clientdata.IntakeDate ? clientdata.IntakeDate : "", 150, 45);

                // Seventh Row
                doc.text(clientdata.ScheduledEndDate ? clientdata.ScheduledEndDate : "", 10, 60);
                doc.text(clientdata.ActualEndDate ? clientdata.ActualEndDate : "", 75, 60);
                var splitDockets = doc.splitTextToSize(clientdata.Dockets ? clientdata.Dockets : "", 70);
                doc.text(splitDockets, 150, 60, { pagesplit: true, 'maxWidth': 57, 'lineHeightFactor': 1.5 });

                doc.setFontSize("12");
                doc.setFontType("bold");
                doc.autoTable({
                    startY: 70
                });

                if (printOptionsForm.Violations && Object(this.state.TabDisplay_Violations).length > 0) {
                    //doc.text("Violations", 7, doc.autoTable.previous.finalY);
                    doc.autoTable({
                        theme: "striped",
                        body: this.state.TabDisplay_Violations,
                        columns: [
                            { header: 'Voilation Type', dataKey: 'ViolationType' },
                            { header: 'Violation Date', dataKey: 'ViolationDate' },
                            { header: 'Notification Method', dataKey: 'NotificationMethod' },
                            { header: 'Comments', dataKey: 'Comments' }
                        ],
                        //startY: doc.autoTable.previous.finalY + 25,
                        margin: { horizontal: 7 },

                        showHead: 'firstPage',
                        styles: { cellWidth: 'wrap' },
                        headStyles: { fillColor: [3, 71, 50] },
                        columnStyles: {
                            text: { cellWidth: 'auto' },
                            0: { cellWidth: 50 },
                            1: { cellWidth: 20 },
                            2: { cellWidth: 35 },
                            3: {
                                cellWidth: 80
                            }
                        },
                    });
                }
                if (printOptionsForm.Procedures && Object(this.state.TabDisplay_Procedures).length > 0) {
                    //doc.text("Procedures", 7, doc.autoTable.previous.finalY + 20);
                    doc.autoTable({
                        theme: "striped",
                        body: this.state.TabDisplay_Procedures,
                        columns:
                            [
                                { header: 'Procedure Type', dataKey: 'SecurityProcedureType' },
                                { header: 'Status', dataKey: 'ProcedureStatus' },
                                { header: 'Scheduled', dataKey: 'ScheduleDate' },
                                { header: 'Completed', dataKey: 'CompletedDate' },
                                { header: 'Comments', dataKey: 'Comments' }
                            ],
                        showHead: 'firstPage',
                        // startY: doc.autoTable.previous.finalY + 25,
                        margin: { horizontal: 7 },
                        styles: { cellWidth: 'wrap' },
                        headStyles: { fillColor: [3, 71, 50] },
                        columnStyles: {
                            text: { cellWidth: 'auto' },
                            0: { cellWidth: 40 },
                            1: { cellWidth: 50 },
                            2: { cellWidth: 20 },
                            3: { cellWidth: 20 },
                            4: {
                                cellWidth: 60
                            }

                        }
                    });
                }
                if (printOptionsForm.Financials && Object(this.state.TabDisplay_Financials).length > 0) {
                    //doc.text("Financials", 7, doc.autoTable.previous.finalY + 20);
                    doc.autoTable({
                        theme: "striped",
                        body: this.state.TabDisplay_Financials,
                        columns:
                            [
                                { header: 'Transaction Date', dataKey: 'TransactionDate' },
                                { header: 'Transaction Type', dataKey: 'TransactionType' },
                                { header: 'Amount', dataKey: 'TransactionAmount' },
                                { header: 'Comments', dataKey: 'Comments' }
                            ],
                        showHead: 'firstPage',
                        //startY: doc.autoTable.previous.finalY + 25,
                        margin: { horizontal: 7 },
                        styles: { cellWidth: 'wrap' },
                        headStyles: { fillColor: [3, 71, 50] },
                        columnStyles: {
                            text: { cellWidth: 'auto' },
                            3: {
                                cellWidth: 70
                            }
                        }
                    });
                }
                if (printOptionsForm.TreatmentGroups && Object(this.state.TabDisplay_TreatmentGroups).length > 0) {
                    //doc.text("Treatment Groups", 7, doc.autoTable.previous.finalY + 20);
                    doc.autoTable({
                        theme: "striped",
                        body: this.state.TabDisplay_TreatmentGroups,
                        columns:
                            [
                                { header: 'Treatment Group', dataKey: 'TreatmentGroup' },
                                { header: 'Session Details', dataKey: 'TreatmentGroupDetail' },
                                { header: 'Attendance', dataKey: 'Attendance' }
                            ],
                        showHead: 'firstPage',
                        //startY: doc.autoTable.previous.finalY + 25,
                        margin: { horizontal: 7 },
                        styles: { cellWidth: 'wrap' },
                        headStyles: { fillColor: [3, 71, 50] },
                        columnStyles: { text: { cellWidth: 'auto' } }
                    });
                }
            }
            if (Object.keys(servicesdata).length > 0) {
                servicesdata.CourtLinkProgramServices.map(function (item, key) {

                    var ServicePlacements = {};
                    var ServiceEquipments = {};
                    var ServiceViolations = {};
                    var ServicePeriods = {};

                    if (servicesdata.CourtLinkServicePlacements !== null) {
                        ServicePlacements = servicesdata.CourtLinkServicePlacements.filter((value) => value.ClientProgramServiceId === item.ClientProgramServiceId)
                    }
                    if (servicesdata.CourtLinkServiceEquipments !== null) {
                        ServiceEquipments = servicesdata.CourtLinkServiceEquipments.filter((value) => value.ClientProgramServiceId === item.ClientProgramServiceId)
                    }
                    if (servicesdata.CourtLinkServiceViolations !== null) {
                        ServiceViolations = servicesdata.CourtLinkServiceViolations.filter((value) => value.ClientProgramServiceId === item.ClientProgramServiceId)
                    }
                    if (servicesdata.CourtLinkServicePeriods !== null) {
                        ServicePeriods = servicesdata.CourtLinkServicePeriods.filter((value) => value.ClientProgramServiceId === item.ClientProgramServiceId)
                    }
                    doc.setFontSize("12");
                    doc.setFontType("bold");
                    //services heading
                    doc.addPage();
                    doc.text(10, 12, `${servicesdata.CourtLinkProgramServices[key].Service} - ${servicesdata.CourtLinkProgramServices[key].StartDate}`);

                    //services first row
                    doc.text(10, 20, 'Service');
                    doc.text(75, 20, 'Start Date');
                    doc.text(150, 20, 'End Date');


                    //services third row
                    doc.text(10, 40, 'Service Status', { pagesplit: true, 'maxWidth': 80, 'lineHeightFactor': 1.5 });
                    doc.text(75, 40, 'Service Manager', { pagesplit: true, 'maxWidth': 80, 'lineHeightFactor': 1.5 });
                    doc.text(150, 40, 'Referral Source', { pagesplit: true, 'maxWidth': 57, 'lineHeightFactor': 1.5 });


                    //services fifth row
                    doc.text(10, 60, 'Docket(s)');

                    doc.setFontType("normal");
                    doc.setFontSize("10");
                    //  Services Second row
                    doc.text(servicesdata.CourtLinkProgramServices[key].Service ? servicesdata.CourtLinkProgramServices[key].Service : "", 10, 25, { pagesplit: true, 'maxWidth': 60, 'lineHeightFactor': 1.5 });
                    doc.text(servicesdata.CourtLinkProgramServices[key].StartDate ? servicesdata.CourtLinkProgramServices[key].StartDate : "", 75, 25);
                    doc.text(servicesdata.CourtLinkProgramServices[key].EndDate ? servicesdata.CourtLinkProgramServices[key].EndDate : "", 150, 25);

                    //Services fourth row
                    doc.text(servicesdata.CourtLinkProgramServices[key].ServiceStatus ? servicesdata.CourtLinkProgramServices[key].ServiceStatus : "", 10, 45, { pagesplit: true, 'maxWidth': 60, 'lineHeightFactor': 1.5 });
                    doc.text(servicesdata.CourtLinkProgramServices[key].ServiceManager ? servicesdata.CourtLinkProgramServices[key].ServiceManager : "", 75, 45, { pagesplit: true, 'maxWidth': 60, 'lineHeightFactor': 1.5 });
                    doc.text(servicesdata.CourtLinkProgramServices[key].ReferralSource ? servicesdata.CourtLinkProgramServices[key].ReferralSource : "", 150, 45, { pagesplit: true, 'maxWidth': 57, 'lineHeightFactor': 1.5 });


                    //Services Sixth row
                    doc.text(servicesdata.CourtLinkProgramServices[key].Dockets ? servicesdata.CourtLinkProgramServices[key].Dockets : "", 10, 65, { pagesplit: true, 'maxWidth': 60, 'lineHeightFactor': 1.5 });

                    doc.autoTable({
                        startY: 70
                    });

                    if (Object.entries(ServiceEquipments).length > 0) {
                        doc.autoTable({
                            theme: "striped",
                            body: ServiceEquipments,
                            columns: [
                                { header: 'Equipment Type', dataKey: 'EquipmentType' },
                                { header: 'Equipment Status', dataKey: 'EquipmentStatus' },
                                { header: 'Serial Number', dataKey: 'SerialNumber' },
                                { header: 'Theft Report Filed', dataKey: 'TheftReportFiled' },
                                { header: 'Equipment Recovered', dataKey: 'EquipmentRecovered' },
                                { header: 'Comments', dataKey: 'Comments' },

                            ],
                            // startY: doc.autoTable.previous.finalY + 50,
                            margin: { horizontal: 7 },

                            showHead: 'firstPage',
                            styles: { cellWidth: 'auto' },
                            headStyles: { fillColor: [3, 71, 50] },
                            columnStyles: {
                                text: { cellWidth: 'auto' },
                                5: { cellWidth: 40 }

                            }
                        });
                    }
                    if (Object.entries(ServicePlacements).length > 0) {
                        doc.autoTable({
                            theme: "striped",
                            body: ServicePlacements,
                            columns: [
                                { header: 'Placement Site', dataKey: 'PlacementSite' },
                                { header: 'Start Date', dataKey: 'StartDate' },
                                { header: 'End Date', dataKey: 'EndDate' },
                                { header: 'Hours Assigned', dataKey: 'HoursAssigned' },
                                { header: 'Hours Completed ', dataKey: 'HoursCompleted' },
                                { header: 'Comments', dataKey: 'Comments' },

                            ],
                            //  startY: doc.autoTable.previous.finalY + 25,
                            margin: { horizontal: 7 },
                            showHead: 'firstPage',
                            styles: { cellWidth: 'auto' },
                            headStyles: { fillColor: [3, 71, 50] },
                            columnStyles: {
                                text: { cellWidth: 'auto' },
                                0: { cellWidth: 45 },
                                1: { cellWidth: 25 },
                                2: { cellWidth: 25 },
                                3: { cellWidth: 20 },
                                4: { cellWidth: 25 },
                                5: { cellWidth: 55 }

                            }
                        });
                    }
                    if (Object.entries(ServicePeriods).length > 0) {
                        doc.autoTable({
                            theme: "striped",
                            body: ServicePeriods,
                            columns: [
                                { header: 'Start Date', dataKey: 'StartDate' },
                                { header: 'End Date', dataKey: 'EndDate' },
                                { header: 'Service Status', dataKey: 'ServiceStatus' },
                                { header: 'Service Billing', dataKey: 'ServiceBilling' },
                                { header: 'Comments', dataKey: 'Comments' },

                            ],
                            //   startY: doc.autoTable.previous.finalY + 25,
                            margin: { horizontal: 7 },
                            showHead: 'firstPage',
                            styles: { cellWidth: 'auto' },
                            headStyles: { fillColor: [3, 71, 50] },
                            columnStyles: {
                                text: { cellWidth: 'auto' },
                                0: { cellWidth: 25 },
                                1: { cellWidth: 25 },
                                4: { cellWidth: 45 }
                            }
                        });
                    }
                    if (Object.entries(ServiceViolations).length > 0) {
                        doc.autoTable({
                            theme: "striped",
                            body: ServiceViolations,
                            columns: [
                                { header: 'Voilation Type', dataKey: 'ViolationType' },
                                { header: 'Notification Method', dataKey: 'NotificationMethod' },
                                { header: 'Violation Date', dataKey: 'ViolationDate' },
                                { header: 'Comments', dataKey: 'Comments' },
                                { header: 'Resolution', dataKey: 'Resolution' },

                            ],
                            // startY: doc.autoTable.previous.finalY + 25,
                            margin: { horizontal: 7 },
                            showHead: 'firstPage',
                            styles: { cellWidth: 'auto' },
                            headStyles: { fillColor: [3, 71, 50] },
                            columnStyles: {
                                text: { cellWidth: 'auto' },
                                0: { cellWidth: 40 },
                                1: { cellWidth: 25 },
                                2: { cellWidth: 25 },
                                3: { cellWidth: 50 },
                                4: { cellWidth: 50 }
                            }
                        });
                    }
                    return null;
                });
                
            }


            var pageSize = doc.internal.pageSize;
            var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
            var str = "This information has been disclosed to you from Records from Alternatives, Inc. whose confidentiality is protected by federal law. Federal regulation 42 C.F.R. Part 2 prohibits you making any further disclosure of it without the specific written consent of the person to whom it pertains, or as otherwise permitted by such regulations. A general authorization for the release of medical or other information is NOT sufficient for this purpose"
            var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
            doc.setFontSize(8);
            var lines = doc.splitTextToSize(str, (210 - 5 - 5));

            // PAGE NUMBERING
            // Add Page number at bottom-center
            // Get the number of pages
            const pageCount = doc.internal.getNumberOfPages();
            // For each page, print the page number and the total pages
            for (var i = 1; i <= pageCount; i++) {
                // Go to page i
                doc.setPage(i);

                doc.text(lines, pageWidth / 2, pageHeight - 10, 'center');
            }
            doc.save('ClientDetail.pdf')
            this.setState({
                modalOpen: false,
                showActiveServices: false
            });
        }
    }

    hadleCloseAlert = (e) => {
        this.setState({ message: "" });
    }

    render() {
        const { value, clientdata, clientprogramenrollmentid, modalOpen, printOptionsForm, showActiveServices, servicesdata, loading, message } = this.state;
        var count, counttabpanel = 0;


        var diff = 0;
        if (clientdata.IntakeDate) {
            diff = new Date() - new Date(clientdata.IntakeDate);
            diff = Math.floor(diff / (60 * 60 * 24 * 1000));
        }

        return (

            <section id="clientdata" className="innerPage">
                <div className="container-fluid"> <div className="row">
                    <div className="col-sm-12">
                        <div className="back_button"><Link to={{ pathname: '/clientdata/referrallist/' + clientdata.ProgramId }}><i className="fa fa-arrow-left" aria-hidden="true" />  Back to Client List</Link></div>
                        <div className="formsDiv">
                            <div className="clientServices card" >
                                <div className='card-header'>
                                    <h3>{clientdata.ClientName} <span className="pull-right" onClick={this.handleClickOpen}><i className="fa fa-print print-icon" aria-hidden="true"></i></span></h3>
                                </div>
                                <div className="row card-body">
                                    <div className="col-sm-4">
                                        <div className="form-group1">
                                            <label className=" control-label"><b>Program</b></label>
                                            <label className=" control-label">{clientdata.Program}</label>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="form-group1">
                                            <label className=" control-label"><b>Referral Source</b> </label>
                                            <label className=" control-label">{clientdata.ReferralSource}</label>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="form-group1">
                                            <label className=" control-label"><b>Case Manager</b></label>
                                            <label className=" control-label">{clientdata.CaseManger} (<a href={`mailto:${clientdata.CM_Email}`}>{clientdata.CM_Email}</a>)</label>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="form-group1">
                                            <label className=" control-label"><b>Program Status</b> </label>
                                            <label className=" control-label">{clientdata.ProgramStatus}</label>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="form-group1">
                                            <label className=" control-label"><b>Referral Date </b></label>
                                            <label className=" control-label" >
                                                <FormatDateTime
                                                    date={clientdata.StartDate}
                                                    format="MM/DD/YY"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="form-group1">
                                            <label className=" control-label"><b>Intake Date(LoS)</b> </label>
                                            <label className=" control-label">
                                                <FormatDateTime
                                                    date={clientdata.IntakeDate}
                                                    format="MM/DD/YY"
                                                />
                                                {clientdata.IntakeDate ? ` (${diff} Days)` : ""}
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="form-group1">
                                            <label className=" control-label"><b>Scheduled End</b></label>
                                            <label className=" control-label">
                                                <FormatDateTime
                                                    date={clientdata.ScheduledEndDate}
                                                    format="MM/DD/YY"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="form-group1">
                                            <label className=" control-label"><b>Completion Date</b> </label>
                                            <label className=" control-label">
                                                <FormatDateTime
                                                    date={clientdata.ActualEndDate}
                                                    format="MM/DD/YY"
                                                />
                                            </label>

                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="form-group1">
                                            <label className=" control-label"><b>Docket(s)</b></label>
                                            <label className=" control-label" >{clientdata.Dockets}</label>
                                        </div>
                                    </div>
                                </div>
                                {loading && <div className="loaderDiv"><div className="loader"><CircularProgress /></div></div>}
                            </div>
                            {clientdata.EnableServices === "Y" &&
                                <VerticalServicesTab onDataload={this.handleChildData} clientprogramenrollmentid={clientprogramenrollmentid}  >
                                </VerticalServicesTab>
                            }

                            {(clientdata.TabDisplay_Violations === 'Y' || clientdata.TabDisplay_Procedures === 'Y' || clientdata.TabDisplay_Financials === 'Y' || clientdata.TabDisplay_TreatmentGroups === 'Y') &&
                                <div className="clientServices">
                                    <AppBar position="static">
                                        <Tabs value={value} onChange={this.handleChange} >
                                            {clientdata.TabDisplay_Violations === 'Y' &&
                                                <Tab label="Violations" {...a11yProps(count++)} />
                                            }
                                            {clientdata.TabDisplay_Procedures === 'Y' &&
                                                <Tab label="Procedures" {...a11yProps(count++)} />
                                            }
                                            {clientdata.TabDisplay_Financials === 'Y' &&
                                                <Tab label="Financials" {...a11yProps(count++)} />
                                            }
                                            {clientdata.TabDisplay_TreatmentGroups === 'Y' &&
                                                <Tab label="Treatment Groups" {...a11yProps(count++)} />
                                            }
                                        </Tabs>
                                    </AppBar>
                                    {clientdata.TabDisplay_Violations === 'Y' &&
                                        <TabPanel value={value} index={counttabpanel++}>
                                            <ViolationsTab onViolationsDataLoad={this.handleViolationsChild} clientprogramenrollmentid={clientprogramenrollmentid} />
                                        </TabPanel>
                                    }
                                    {clientdata.TabDisplay_Procedures === 'Y' &&
                                        < TabPanel value={value} index={counttabpanel++}>
                                            <ProceduresTab onProceduresDataLoad={this.handleProceduresChild} clientprogramenrollmentid={clientprogramenrollmentid} />
                                        </TabPanel>
                                    }
                                    {clientdata.TabDisplay_Financials === 'Y' &&
                                        < TabPanel value={value} index={counttabpanel++}>
                                            <FinancialTab onFinancialsDataLoad={this.handleFinancialsChild} clientprogramenrollmentid={clientprogramenrollmentid} />
                                        </TabPanel>
                                    }
                                    {clientdata.TabDisplay_TreatmentGroups === 'Y' &&
                                        <TabPanel value={value} index={counttabpanel++}>
                                            <TreatmentGroupTab onTreatmentGroupsDataLoad={this.handleTreatmentGroupsChild} clientprogramenrollmentid={clientprogramenrollmentid} />
                                        </TabPanel>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
                </div >
                <Dialog aria-labelledby="customized-dialog-title" open={modalOpen} fullWidth={true}
                    setfullwidth="true" maxWidth="md" setmaxwidth="md"   >
                    <DialogTitle id="customized-dialog-title">
                        Print Options
                        <IconButton aria-label="close" className="closeIconModal" onClick={this.handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <DialogContentText component="div">
                            {
                                message &&
                                <Alert variant="danger" onClose={() => this.hadleCloseAlert(false)} dismissible>{message}</Alert>
                            }
                            <div className="Form">
                                <div className="row">
                                    <div className="col-md-6">
                                        <span className="checkActive"><b> Program Tabs: </b> </span>
                                    </div>
                                </div>
                                <div className="row">
                                    {clientdata.TabDisplay_Violations === 'Y' &&
                                        <div className="col-md-3">
                                            <label className="control-label checkbox">
                                                <input type="checkbox" name="Violations" onChange={this.handleModalChange} checked={printOptionsForm.Violations} />
                                                <span className="primary"></span>
                                            </label>
                                            <span className="checkActive">  Violations</span>
                                        </div>
                                    }
                                    {clientdata.TabDisplay_Procedures === 'Y' &&
                                        <div className="col-md-3">
                                            <label className="control-label checkbox">
                                                <input type="checkbox" name="Procedures" onChange={this.handleModalChange} checked={printOptionsForm.Procedures} />
                                                <span className="primary"></span>
                                            </label>
                                            <span className="checkActive"> Procedures</span>
                                        </div>
                                    }
                                    {clientdata.TabDisplay_Financials === 'Y' &&
                                        <div className="col-md-3">
                                            <label className="control-label checkbox">
                                                <input type="checkbox" name="Financials" onChange={this.handleModalChange} checked={printOptionsForm.Financials} />
                                                <span className="primary"></span>
                                            </label>
                                            <span className="checkActive"> Financials</span>
                                        </div>
                                    }
                                    {clientdata.TabDisplay_TreatmentGroups === 'Y' &&
                                        <div className="col-md-3">
                                            <label className="control-label checkbox">
                                                <input type="checkbox" name="TreatmentGroups" onChange={this.handleModalChange} checked={printOptionsForm.TreatmentGroups} />
                                                <span className="primary"></span>
                                            </label>
                                            <span className="checkActive"> Treatment Groups</span>
                                        </div>
                                    }
                                </div>
                                <br />
                                {Object.keys(servicesdata).length > 0 && clientdata.EnableServices === 'Y' &&
                                    <div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <span className="checkActive"><b> Services</b> </span>
                                                <label className="control-label checkbox">
                                                    <input type="checkbox" name="EnabledServices" onChange={this.showServiceTabs} />
                                                    <span className="primary"></span>
                                                </label>
                                            </div>
                                        </div>
                                        {showActiveServices === true &&
                                            <TransferList servicedata={servicesdata} ontransferlistselection={this.handlePrintService}>
                                            </TransferList>
                                        }
                                    </div>
                                }
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <button className="btn btn-primary" type="button" onClick={this.handleModalSubmit} disabled={loading}>Submit</button>
                    </DialogActions>
                </Dialog>
            </section >
        )
    }
}


const mapStateToProps = state => {
    return {
        alert: state.alert
    };
};
const mapDispatchToProps = dispatch => {
    return {
        actions: {
            showAlert: bindActionCreators(
                actions.showAlert,
                dispatch

            )
        }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(ClientData);


