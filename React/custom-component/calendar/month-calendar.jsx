import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Moment from "react-moment";
import { Grid, Table, Dropdown, Button } from "semantic-ui-react";
import { connect, bindActionCreators, actions ,Link}   from "../../../shared/functional/global-import";
import {FullCalendarSkeleton} from "../../../shared/components";
import moment from "moment";
class MonthCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      responseData: [],
      currentEvents: [],
      open: false,
      clickedEvent: [],
      skeletonLoading: true, 
    };
  };
  //this fuction is used when the location id change rerender the page //
  componentWillReceiveProps(newProps) {
    if (this.props.global?.locationSelected.BusinessLocationId !== newProps.global?.locationSelected.BusinessLocationId) {
      this.getMonthView(newProps.global?.locationSelected.BusinessLocationId);
      this.setState({  skeletonLoading: true })
    }
  }
//this function we used for geting the response of the api and set state with the time array which we print on grid.//
componentDidMount=()=>{
  this.getMonthView(this.props.global?.locationSelected.BusinessLocationId);
}
  //this is the method used to get the data from the Api//
  getMonthView = (locationId) => {
    this.props.actions.apiCall({
      urls: ["GETCALENDARVIEW"], method: "GET", data:  { "businessId": this.props.global.bussinessDetail.businessId, "userId": "1", "locationId": locationId, "input": "month" }, onSuccess: (response) => {
        this.setState({ responseData: response },
          this.setState({  skeletonLoading: false }));
      }
    });
  }
//this function is run when we click on the event and we can update the state and get the value of the event//
  handleEventClick = (clickInfo) => {
 
    this.setState({ open: !this.state.open });
    this.setState({ clickedEvent: clickInfo }); 
  }
  render() {
    const {skeletonLoading} = this.state;
    const { responseData } = this.state;
    return (
    
      <React.Fragment>
      {skeletonLoading ?  <FullCalendarSkeleton/> :  
      <div className="demo-app">
        {(responseData.length > 0) && <div className="demo-app-main">
          <FullCalendar
            plugins={[dayGridPlugin]}
            headerToolbar={{
              left: "",
              center: "",
              right: "",
            }}
            initialView="dayGridMonth"
            firstDay='1'
            windowResizeDelay="200"
            aspectRatio="1.20"
            expandRows={true}
            slotMinTime="09:00:00"
            slotMaxTime="33:00:00"
            isDragging={true}
            timeZone={true}
            isMirror={false}
            slotDuration="01:00"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={this.state.weekendsVisible}
            initialEvents={responseData}
            select={this.handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={(e) => this.handleEventClick(e)}
            eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
          />
        </div>
          }       
      </div>}
      </React.Fragment>
    );
  }
  // this method is used to handel the event and set the event is state// 
  handleEvents = (events) => {
    
   
    this.setState({ currentEvents: events, });
  };
}
// this method is for the droptable when we click on the event it will render the html//
function renderEventContent(clickInfo) {
  
  let startTime=clickInfo.event._instance.range.start
  let startFormat = moment(startTime, "HH:mm:A").format("LT");
  
  let endTime=clickInfo.event._instance.range.end 
  let endFormat = moment(endTime, "HH:mm:A").format("LT");
  
  return (
    <div className="Event" >
    <Dropdown className="monthView" direction='left' text={`${clickInfo.event._def.extendedProps.businessCategoryType}#${clickInfo.event._def.extendedProps.orderId}        ${startFormat}-${endFormat} `} style={{backgroundColor:clickInfo.backgroundColor}} >
    <Dropdown.Menu>
      <Grid columns="equal">
        <Grid.Column width={8}>
          <Link className="orange-color">#{clickInfo.event._def.extendedProps.orderId}</Link>
        </Grid.Column>
        <Grid.Column width={8}>
        <p className="orange-color">#{clickInfo.event._def.extendedProps.customerName}</p>
        </Grid.Column>
        <Grid.Column width={8}>
          <Button className="orange-btn" as={Link} to={`${process.env.REACT_APP_PUBLIC_URL}/order-summary`}  > {clickInfo.event._def.extendedProps.businessCategoryType}</Button>
        </Grid.Column>
        <Grid.Column width={8}>
          <Button className="paid-btn" as={Link} to={`${process.env.REACT_APP_PUBLIC_URL}/order-summary`} > Paid</Button>
        </Grid.Column>
        <Grid.Column width={16}>
          <p className="maroon-color">Total Time:{clickInfo.event._def.extendedProps.totalTime}</p>
          <Table basic="very">
            <Table.Body>
              <Table.Row>
                <Table.Cell><Moment   format="MMM DD,YYYY hh:mm A">
              {clickInfo.event._instance.range.start} 
            </Moment></Table.Cell>
                <Table.Cell textAlign="center">
                  <i aria-hidden="true" class="long arrow alternate right icon maroon-color" ></i>
                </Table.Cell>
                <Table.Cell textAlign="right">
                <Moment format="MMM DD,YYYY hh:mm A">
                {clickInfo.event._instance.range.end} 
              </Moment>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <p className="maroon-color">Items: {clickInfo.event._def.extendedProps.itemCount}
          </p>
          <Table basic="very">
            <Table.Body>
              <Table.Row>
                <Table.Cell>{clickInfo.event._def.extendedProps.item[0].itemName}({clickInfo.event._def.extendedProps.item[0].quantity})</Table.Cell> <Table.Cell textAlign="right">${clickInfo.event._def.extendedProps.item[0].itemPrice}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Helmet (2)</Table.Cell><Table.Cell textAlign="right">$30</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Bike Basket (2)</Table.Cell><Table.Cell textAlign="right">$30</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <span className="orange-color">Bundle Price: </span>{" "}
                  Bike, Hel...X2
                </Table.Cell>
                <Table.Cell textAlign="right">$100</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Total Including Tax</Table.Cell>
                <Table.Cell textAlign="right"><span className="orange-color">$ {clickInfo.event._def.extendedProps.totalAmount}</span></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Grid.Column>
      </Grid>
    </Dropdown.Menu>
  </Dropdown>
    </div>
  );
}
const mapStateToProps = state => {
  return {
    api: state.api,
    global: state.global
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      apiCall: bindActionCreators(actions.apiCall, dispatch),
      storeGlobalCodes: bindActionCreators(actions.storeGlobalCodes, dispatch)
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MonthCalendar);
