/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import {Table, Button ,Dropdown,Grid,Modal,Icon } from "semantic-ui-react";
import { connect, bindActionCreators, actions,Link } from "../../../shared/functional/global-import";
import moment from "moment";
import Moment from "react-moment";
import {CalenderSkelton , CalenderModal} from "../../../shared/components";
class TommorrowCalendar  extends React.Component {
constructor(props) {
super(props);
this.state = {
      Event:[],
      date: [],
      responseData:[],
      skeletonLoading:"true",
      show: false,
    };
  }
  //this fuction is used when the location id change rerender the page //
  componentWillReceiveProps(newProps) {
    if (this.props.global?.locationSelected.BusinessLocationId !== newProps.global?.locationSelected.BusinessLocationId) {
      this.tommorrowGetdate(newProps.global?.locationSelected.BusinessLocationId);
      this.setState({  skeletonLoading: true })
    }
  }
  componentDidMount=()=>{
    this.tommorrowGetdate(this.props.global?.locationSelected.BusinessLocationId);
  }
 //this function we used for geting the response of the api and set state with the time array which we print on grid.//
  tommorrowGetdate= (locationId) => {
 
    this.props.actions.apiCall({
      urls: ["GETCALENDARVIEW"], method: "GET", data: { "businessId": this.props.global.bussinessDetail.businessId, "userId": "1", "locationId": locationId, "input": "today" }, onSuccess: (response) => {
        this.setState({ responseData: response });
        this.setState({  skeletonLoading: false })
      }
    });
    var Date = []
    for (var i = 8; i <= 20; i++) {
      if (i > 12) {
        Date.push(i - 12 + ":00 PM");
      }
      else {
        Date.push(i + ":00 AM");
      }
    }
    return this.setState({ date: Date });
  }
  //this function is used for open modal by changeing  the state into true//
  showModal = () => {
    
    this.setState({ show: true });
  };
//this function is used for close modal by changing the state into false//
  hideModal = () => {
    this.setState({ show: false });
  };

//this handleClick function is to set the sate with the clicked event and we can show the data in droptable.//
handleClick=(time)=>{
   this.setState({Event:time});  
    }
    //this function is used for close modal by changing the state into false//
  hideModal = () => {
    this.setState({ recentOrders: false });
  };
  CalenderModal = () => {
    this.setState({recentOrders: !this.state.recentOrders});
  };
 render() {
   const {api}=this.props;
    const event =this.state.Event
    const options = [
      {
        key: 'user',
        text: (
          <Grid columns="equal">
            <Grid.Column width={10}>
              <Link className="orange-color">#{event.orderId}</Link>
            </Grid.Column>
            <Grid.Column width={6}>
              <p>{event.customerName}</p>
            </Grid.Column>
            <Grid.Column width={10}>
              <Button className="orange-btn" as={Link} to={`${process.env.REACT_APP_PUBLIC_URL}/order-summary`}  >{event.businessCategoryType}</Button>
            </Grid.Column>
            <Grid.Column width={6} verticalAlign="middle">
              <Button className="paid-btn" as={Link} to={`${process.env.REACT_APP_PUBLIC_URL}/order-summary`} > Paid</Button>
            </Grid.Column>
            <Grid.Column width={16}>
              <p className="maroon-color">Total Time: {event.totalTime}</p>
              <Table basic="very">
                <Table.Body>
                  <Table.Row>
                  <Table.Cell ><Moment format="MMM DD,YYYY hh:mm A">
                  {event.start} 
                </Moment></Table.Cell>
                    <Table.Cell textAlign="center">
                      <i aria-hidden="true" class="long arrow alternate right icon maroon-color" ></i>
                    </Table.Cell>
                    <Table.Cell textAlign="right"><Moment format="MMM DD,YYYY hh:mm A">
                    {event.end} 
                  </Moment></Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
              <p className="maroon-color">Items:{event.itemCount}</p>
              {event.item &&( event.item.length > 0 &&
              <Table basic="very">
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>{event.item[0].itemName} ({event.item[0].quantity})</Table.Cell> <Table.Cell textAlign="right">${event.item[0].itemPrice}</Table.Cell>
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
                    <Table.Cell textAlign="right"><span className="orange-color">${event.totalAmount}</span></Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>)}
            </Grid.Column>
          </Grid>
          ),
      },
    ]
  
    return  (
      <React.Fragment>
      {this.state.skeletonLoading ?  <CalenderSkelton/> : 
      <Table celled className="horz-table">
      <Table.Header>
          <Table.Row>
            {this.state.date.map((dates) => (
              <Table.HeaderCell>{dates} </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
        <Table.Row style={{ height: "100px" }}>
        {this.state.date.map((item, index ) => {
          let count=0;
          return (
             <Table.Cell>
              {this.state.responseData.map((time) => {
            let startTime = moment(time.start).format('h:mm A');
              if (item === startTime) { 
                count++
                if (count<=2){
                return (
                    <Dropdown  direction='left'  trigger={<Button className="tomorrowButton" content={`${time.businessCategoryType }#${time.orderId}`}
                     style={{backgroundColor: time.color}}  />} 
                    options={options} onClick={()=>this.handleClick(time)} className="monthView"/>
                  )}
                  if (count>2) {
                    return(<Button className="tommorrowModal"  onClick={() => this.CalenderModal()}>{count}</Button>)}
              }
              else{
                return(null)
              }
              })}
              </Table.Cell> 
          )}
        )}
  </Table.Row>
  </Table.Body>
      </Table>
            }
            <CalenderModal openModal={this.state.recentOrders} hideModal={this.hideModal}  />
            </React.Fragment>
    );
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(TommorrowCalendar);
