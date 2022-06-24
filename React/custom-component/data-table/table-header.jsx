import React, { Component } from 'react';
import { Table, Icon, Checkbox, Dropdown, Button } from "semantic-ui-react";

class TableHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { sortingArrow, columns, onHandleSorting, sortColumn, hideColumns } = this.props;
        return (
                <Table.Header>
                    <Table.Row>
                        {columns.map((singleData, index) => {
                            return (
                                <>
                                    {hideColumns.length > 0 && hideColumns[0][singleData.fieldName] === false ? "" : (
                                        <Table.HeaderCell onClick={() => { singleData.isSorting && onHandleSorting(singleData.fieldName) }}>
                                            {`${singleData.headerName} `}
                                            {singleData.isSorting &&
                                                <Icon id={index} name={singleData.fieldName === sortColumn ? sortingArrow : "sort"} className="orange-color" />
                                            }
                                            {(columns.length - 1) === index &&
                                                <Dropdown item simple icon="filter" className="orange-color">
                                                    <Dropdown.Menu  className="left">
                                                        {columns.map((singleData, index) => {
                                                            return (
                                                                <Dropdown.Item disabled={!singleData.isHideAble ? true : false} > <Checkbox label={singleData.headerName} className="custome-checkbox" onClick={this.props.onChange} defaultChecked={true} value={singleData.fieldName} data={singleData.fieldName} />  </Dropdown.Item>)
                                                        }
                                                        )}
                                                        <Dropdown.Item><Button className="orange-button" size="mini" onClick={this.props.onHandleHiddenColumn}>Done</Button></Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            }
                                        </Table.HeaderCell>
                                    )}
                                </>
                            )
                        }
                        )}
                    </Table.Row>
                </Table.Header>
        );
    }
};



export default TableHeader;