import React, { Component } from "react";
import { Grid, Breadcrumb } from "semantic-ui-react";
import { connect, bindActionCreators, actions, Link, env } from "../../shared/functional/global-import";
import { withRouter } from "react-router-dom";


class InventoryBreadcrumb extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleBreadCrumClick = (breadcrumb, index) => {
        
        let inventoryDetail = this.props.global.inventoryDetail;

        if (breadcrumb.type === "ByType") {
            inventoryDetail.categoryId = 0;
            inventoryDetail.productId = 0;
            inventoryDetail.businessCategoryId = 0;
            inventoryDetail.inventoryBreadcrumb = [];
            this.props.history.push(`${process.env.REACT_APP_PUBLIC_URL}/inventory`);
            this.props.actions.storeInventoryDetail(inventoryDetail);
        }
        else {
            if (breadcrumb.type === "BusinessCategoryType") {
                inventoryDetail.categoryId = 0;
                inventoryDetail.productId = 0;
            }
            else if (breadcrumb.type === "SubCategory" || breadcrumb.type === "Category") {
                inventoryDetail.categoryId = breadcrumb.id;
                inventoryDetail.productId = 0;
            }
            inventoryDetail.inventoryBreadcrumb.length = index + 1;
            this.props.actions.storeInventoryDetail(inventoryDetail);

            if (window.location.pathname.indexOf("inventory-item-list") > 0) {
                this.props.history.push(`${env.PUBLIC_URL}/inventory/category-view`);
            }
            else {
                this.props.getProductCategoryDetail();
            }
        }

    }

    render() {
        const { global } = this.props;
        
        return (
            <Grid.Column width={"16"}>
                <Breadcrumb className="custom-breadcrumb">
                    <Breadcrumb.Section link as={Link} onClick={() => this.handleBreadCrumClick({ type: "ByType" })}>By Type</Breadcrumb.Section>
                    {
                        global?.inventoryDetail.inventoryBreadcrumb.map((breadcrumb, index) => {
                            return <><Breadcrumb.Divider as={Link} icon="right angle" key={index} /><Breadcrumb.Section key={index} onClick={() => this.handleBreadCrumClick(breadcrumb, index)}>{breadcrumb.breadcrumbName}</Breadcrumb.Section></>
                        })
                    }
                </Breadcrumb>
            </Grid.Column>
        );
    }
}


const mapStateToProps = state => {
    return {
        global: state.global
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            storeInventoryDetail: bindActionCreators(actions.storeInventoryDetail, dispatch),
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InventoryBreadcrumb));
