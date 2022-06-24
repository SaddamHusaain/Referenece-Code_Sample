import React, { Component } from "react";
import {Table ,Button,Grid,Dropdown,Modal,Icon} from "semantic-ui-react";
import moment from "moment";
import {connect, bindActionCreators, actions, Link}   from "../../../shared/functional/global-import";
import Moment from "react-moment";
import {CalenderSkelton, CalenderModal} from "../../../shared/components";

class TodayCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ShopingHours: [],
      Event:[],
      recentOrdersdata:[],
      responseData:[],
      skeletonLoading: true, 
      }
  }
//this fuction is used when the location id change rerender the page //
  componentWillReceiveProps(newProps) {
    if (this.props.global?.locationSelected.BusinessLocationId !== newProps.global?.locationSelected.BusinessLocationId) {
      this.todayGetDate(newProps.global?.locationSelected.BusinessLocationId);
      this.setState({  skeletonLoading: true })
    }
  }
//this function we used for geting the response of the api and set state with the time array which we print on grid.//
componentDidMount=()=>{
  this.todayGetDate(this.props.global?.locationSelected.BusinessLocationId);
}
todayGetDate = (locationId) => { 
    this.props.actions.apiCall({
      urls: ["GETCALENDARVIEW"], method: "GET", data: { "businessId": this.props.global.bussinessDetail.businessId, "userId": "1", "locationId": locationId, "input": "today" }, onSuccess: (response) => {
        this.setState({ responseData: response },
          this.setState({  skeletonLoading: false })
    
          );
      }});
    var Date = []
    for (var i = 8; i <= 20; i++) {
      if (i > 12) {
        Date.push(i - 12 + ":00 PM");
      }
      else {
        Date.push(i + ":00 AM");
      }
    }
    return this.setState({ ShopingHours: Date });
  }
//this handleClick function is to set the sate with the clicked event and we can show the data in droptable.//
  handleClick=(time)=>{
  this.setState({Event:time});  
  }
//this function is used for close modal by changing the state into false//
  hideModal = () => {
    this.setState({ recentOrders: false });
  };
  // this function is used to open calendear//
  CalenderModal = () => {
    this.setState({recentOrders: !this.state.recentOrders});
  };
  render() {
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
                  <Table.Cell><Moment format="MMM DD,YYYY hh:mm A">
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
            {this.state.ShopingHours.map((dates) => (
              <Table.HeaderCell>{dates} </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
      <Table.Body>
      <Table.Row style={{ height: "100px" }}>
      {this.state.ShopingHours.map((item, index ) => {
        let count=0;
        return (
           <Table.Cell>
            {this.state.responseData.map((time) => {
          let startTime = moment(time.start).format('h:mm A');
            if (item === startTime) { 
               const recentOrdersdata = this.state.recentOrdersdata;
              count++
                if (count<=2){
                  recentOrdersdata.push(time)
              return ( 
                  <Dropdown direction='left' trigger={<Button className="todayButton" onClick={()=>this.handleClick(time)} content={`${time.businessCategoryType }#${time.orderId}` }
                   style={{backgroundColor: time.color}}/>} 
                  options={options}  className="monthView"/> 
                ) }
                if (count>2) {
                  recentOrdersdata.push(time)
                 return(
                   <div>
                   <Button className="todayModal" onClick={() => this.CalenderModal()}>{count}</Button>
                   </div>)}
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
    }}
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

export default connect(mapStateToProps, mapDispatchToProps)(TodayCalendar);
