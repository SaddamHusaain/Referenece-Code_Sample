import React, { Component } from "react";
import { Table, Dimmer, Loader, Header } from "semantic-ui-react";
import InfiniteScroll from "react-infinite-scroll-component";

class TableRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { columns, data, emptyGrid, fetchMoreData, hasMore, id, gridDataLoading } = this.props;
        return (
            <InfiniteScroll
                dataLength={data.length}
                scrollableTarget={`${"scrollable" + id}`}
                next={fetchMoreData}
                hasMore={hasMore}
            // loader={data.length > 0 && <Dimmer active inverted> <Loader size='small'>Loading</Loader> </Dimmer>}
            >
                <Table.Body id={`${"scrollable" + id}`} style={{maxHeight: "400px"}}>
                    {gridDataLoading && <Dimmer active inverted> <Loader size='small'>Loading</Loader> </Dimmer>}
                    {data.length === 0 ? <Header as='h5' className="forCommonTable">{emptyGrid ?? "No record found"}</Header> : data.map((singleData, index) => {
                        return (
                            <Table.Row>
                                {columns.map((singleField, index) => {
                                    const fieldValue = singleField.fieldName;
                                    return (
                                        <>
                                            {this.props.hideColumns.length > 0 && this.props.hideColumns[0][fieldValue] === false ? "" : (
                                                <Table.Cell>
                                                    {singleField.Cell ? singleField.Cell(singleData) : singleData[fieldValue]}
                                                </Table.Cell>
                                            )}
                                        </>
                                    );
                                })}
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </InfiniteScroll>
        );
    }
}

export default TableRow;

