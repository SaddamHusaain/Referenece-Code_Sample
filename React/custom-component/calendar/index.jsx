import React, { Component } from "react";
import { Grid, Tab } from "semantic-ui-react";
import WeekCalendar from "./week-calendar";
import TodayCalendar from "./today-calendar";
import TommorrowCalendar from "./tommorrow-calendar";
import MonthCalendar  from "./month-calendar"
import Moment from "react-moment";
import {CalenderSkelton} from "../../../shared/components";

class CalenderNew extends Component{
  constructor(props) {
    super(props);

    this.state = {
      date1: "",
      weekDay:"",
      lodding:"false"
    };
  }
  
  
  componentDidMount(props) {
    var date = new Date();
    date.setDate(date.getDate() + 1);
    this.setState({ date1: date });
    var week = new Date();
     week.setDate( week.getDate() + 7);
    this.setState({  weekDay: week });
  }


  render() {
    const panes = [
      {
        menuItem:"Day",
        render: () =>(
          <Tab.Pane key="Day" >
         
            <TodayCalendar />
            <div className="date-right">
              <p className="day" onClick={()=>this.getTodayDetails}> <Moment format="MMMM DD,YYYY">{new Date()}</Moment></p>
            </div>
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Tomorrow",
        render: () => (
          <Tab.Pane key="Tommorrow">
            <TommorrowCalendar />
            <div className="date-right">
              <p className="day" onClick={()=>this.getTommorrowDetails}><Moment format="MMMM DD,YYYY">{this.state.date1}</Moment></p>
            </div>
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Week",
        render: () =>(
          <Tab.Pane key="Week" >
            <WeekCalendar />
            <div className="date-right">
              <p className="day"><Moment format="MMMM DD">{new Date()}</Moment>-<Moment format="DD,YYYY">{this.state.weekDay}</Moment></p>
            </div>
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Month",
        render: () =>  (
          <Tab.Pane  key="Month">
          <MonthCalendar/>
            <div className="date-right">
              <p className="day"><Moment format="MMMM,YYYY">{new Date()}</Moment></p>
            </div> 
          </Tab.Pane>
        ),
      },
    ]
    return (
      <Grid>
        <Grid.Column width={16} >
          <div className="calendar-tabs cmn-shad">
            <Tab panes={panes}  menu={{ text: true }}/>
          </div>
        </Grid.Column>
      </Grid>
    );
  }
}
export default CalenderNew;
