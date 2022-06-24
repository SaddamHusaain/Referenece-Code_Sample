import React, { Component } from "react";
import { Grid, Table, Dropdown,  Button } from "semantic-ui-react";
import moment from "moment";
import Moment from "react-moment";
import {Link}   from "../../../shared/functional/global-import";
import { connect, bindActionCreators, actions }   from "../../../shared/functional/global-import";
import {CalenderSkelton , CalenderModal} from "../../../shared/components";
class WeekCalender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      allEvent: [],
      Event:[],
      responseData:[],
      skeletonLoading: true,
    };
  }
 
  //this fuction is used when the location id change rerender the page //
  componentWillReceiveProps(newProps) {
    if (this.props.global?.locationSelected.BusinessLocationId !== newProps.global?.locationSelected.BusinessLocationId) {
      this.weekGetDate(newProps.global?.locationSelected.BusinessLocationId);
      this.setState({  skeletonLoading: true })
    }
  }
//this function we used for geting the response of the api and set state with the time array which we print on grid.//
componentDidMount=()=>{
  this.weekGetDate(this.props.global?.locationSelected.BusinessLocationId);
}
  //this is the method used to get the data from the Api//
  weekGetDate = (LocationId) => {
    console.log("responseData");
    this.props.actions.apiCall({
      urls: ["GETCALENDARVIEW"], method: "GET", data: { "businessId": this.props.global.bussinessDetail.businessId, "userId": "1", "locationId":LocationId, "input": "week" }, onSuccess: (response) => {
        this.setState({ responseData: response });
        this.setState({  skeletonLoading: false })
      }
    });
  }
 // this method is used for set the state with values of on click event//
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
            {this.state.responseData.map((time, index1) => {
          let startTime = moment(time.start).format('dddd');
            if (item === startTime) {
              count++
              if(count<=2){ 
                let a= time.start                
                 const startTime1 = moment(a).format('hh:mm A');
                let b= time.end
                const endTime1 = moment(b).format('hh:mm A');
              return (
                  <Dropdown direction='left' trigger={<Button className="todayButton" content={`${time.businessCategoryType }#${time.orderId}  \n ${startTime1}-${endTime1}` }
                   style={{backgroundColor: time.color}}  />} 
                  options={options}  onClick={()=>this.handleClick(time)} className="monthView"/> 
                ) }
                if(count>2){
                  return(<button className="weekModal" onClick={() => this.CalenderModal()} >{count}</button>)
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(WeekCalender);