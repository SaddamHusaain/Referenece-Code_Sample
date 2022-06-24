import React, { Component } from "react";
import { Grid, Table, Button } from "semantic-ui-react";
import TableHeader from "../data-table/table-header";
import TableRow from "../data-table/table-row";

class DataTable extends Component {
  get initialState() {
    return {
      tableHeader: {},
    };
  }

  constructor(props) {
    super(props);

    this.state = { ...this.initialState, columnFilter: [] };
  }

  onHandleChange = (e, { name, value, type, checked, data }) => {
    this.setState(() => ({
      tableHeader: { ...this.state.tableHeader, [data]: checked },
    }));
  };

  onHandleHiddenColumn = () => {
    var a = [this.state.tableHeader];
    this.setState({ columnFilter: a });
  };

  render() {
    const { columns, onHandleSorting, sortColumn, sortingArrow, data, hasMore, fetchMoreData, emptyGrid, id, gridDataLoading } = this.props;
    return (
      <Grid>
        <Grid.Column width={16}>
          <div className="common-table">
            <Table className="table-scrolling singleLine"  id={id}>
              <TableHeader
                columns={columns}
                onHandleSorting={onHandleSorting}
                sortingArrow={sortingArrow}
                sortColumn={sortColumn}
                onChange={this.onHandleChange}
                hideColumns={this.state.columnFilter}
                onHandleHiddenColumn={this.onHandleHiddenColumn}
                id={id}
              />
              <TableRow
                data={data}
                columns={columns}
                hasMore={hasMore}
                fetchMoreData={fetchMoreData}
                emptyGrid={emptyGrid}
                hideColumns={this.state.columnFilter}
                id={id}
                gridDataLoading={gridDataLoading}
                
              />
            </Table>
          </div>
        </Grid.Column>
      </Grid>
    );
  }
}

export default DataTable;
