import React, { useState, useContext, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import styled from 'styled-components';
import colors from '../styles/colors';
import Icon from './Icon';
import { IconEnum as Icons } from './Icons';
import BaseModal, { ModalList } from './modals/BaseModal';
import { GET_CONTACTS, SEND_WELCOME_TEXT, GET_CURRENT_ORGANIZATION } from '../graphql/queries';
import Loader from './Loader';
import CustomerTable from './CustomerTable';
import { AppContext } from '../context/AppContext';
import { Flex } from './Flex';
import Header from './Header';
import moment from 'moment';
import * as Price from '../util/Price';
import { CSVLink } from "react-csv";

const LoaderContainer = styled.div`
  position: absolute;
  top: calc(50vh - 60px);
  left: calc(50vw - 60px);
`;

const HeaderText = styled.div`
  font-weight: bold;
  font-size: 2.4rem;
  color: ${colors.grey1};
`;

const Page = styled.div` 
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: ${colors.background};
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 35px 25px 50px 0px;
  padding:0 50px;
`;

const PageContainer = styled.div`
  margin-left: 80px;
  height: 100%;
  width: 100%;
  display: flex;
  position: fixed;
  box-sizing: border-box;
`;

const Toolbar = styled.div`
  display: flex;
  margin-left: 40px;
`;

const ToolBarItem = styled.div`
  margin-right: 40px;
  color: ${colors.grey3};
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
`;

const ClearSearch = styled.div`
  color: ${colors.grey1};
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 15px;
`;

// const TableTypeItems = styled.div`
//   display: flex;
//   margin-bottom: 25px;
// `;

// const TableTypeItem = styled.div`
//   margin-right: 35px;
//   color: ${colors.grey3};
//   font-size: 1.4rem;
//   font-weight: 600;
//   cursor: pointer;
// `;



export default function Customer() {
  const { app, setApp } = useContext(AppContext);
  const [contactModalIsVisible, setContactModalIsVisible] = useState(false);
  const [searchModalIsVisible, setSearchModalIsVisible] = useState(false);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [isMore, setIsMore] = useState(true);
  const [welcomeText, setWelcomeText] = useState('');
  const [allContactsData, setAllContactsData] = useState([]);
  const [filteredContactsData, setFilteredContactsData] = useState([]);
  const [ordering, setOrdering] = useState({ fieldName: "phoneNumber", order: "asc" });
  const { data: organizationData } = useQuery(GET_CURRENT_ORGANIZATION);
  const csvRef = useRef();

  const pagination = {
    limit: 50,
    offset: 1
  };

  const { data, loading, fetchMore, refetch } = useQuery(GET_CONTACTS, {
    fetchPolicy: 'network-only',
    variables: {
      query: {
        phoneNumber: app?.searchQuery?.phoneNumber || null,
      },
      //pagination,
      ordering: { fieldName: "phoneNumber", order: 1 }
    },
    onCompleted(data) {
      initialStatePaging(data);
      setApp({ ...app, refetchContacts: refetch });
    }
  });

  const [sendWelcomeText] = useMutation(SEND_WELCOME_TEXT, {
    onError(error) {
      console.error(error);
    },
    async onCompleted(data) {
      let response;
      if (app?.refetchContacts) {
        await setApp({ ...app, searchQuery: null, paginationOffset: 1 });
        response = await app.refetchContacts();
        initialStatePaging(response?.data);
      }
      setApp({ ...app, welcomeQueue: null, sendAllWelcomes: false });
    },
  });


  function initialStatePaging(data) {
    setAllContactsData(data?.getContacts);
    setFilteredContactsData(paginate(data?.getContacts, pagination.limit, pagination.offset));
    setIsMore(true);
  }

  // Download csv file 
  const downloadExportData = () => {
    if (allContactsData?.length > 0) {
      csvRef.current.link.click();
    }
  }


  useEffect(() => {
    if (exportData.length >  0 && csvRef && csvRef.current && csvRef.current.link) {
      setTimeout(() => {
        csvRef.current.link.click();
        setExportData([]);
      });
    }
  }, [exportData]);;

  // TODO: clean up
  useEffect(() => {
    setWelcomeText(`Send Welcomes (${app?.sendAllWelcomes ? 'uploaded today' : (app?.welcomeQueue?.length || 0)})`);
  }, [welcomeText, app]);
  useEffect(() => {
    setApp({ ...app, paginationOffset: 1 });
  }, []);

  if (loading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  }

  console.log(app?.welcomeQueue);

  const getToolBarButtons = () => {
    return [
      {
        icon: Icons.SearchRegular,
        onClick: () => setSearchModalIsVisible(true),
        text: 'Search',
      },
      {
        icon: Icons.PlusRegular,
        onClick: () => setContactModalIsVisible(true),
        text: 'Add Contacts',
      },
      {
        icon: Icons.PaperPlaneRegular,
        onClick: () => sendWelcomeText({
          variables: {
            phoneNumbers: app?.sendAllWelcomes ? [] : app.welcomeQueue,
          },
        }),
        text: welcomeText,
      },

    ];
  };

  // Perform sorting client side
  function dynamicsort(property, order) {
    var sort_order = 1;
    if (order === "desc") {
      sort_order = -1;
    }
    return function (a, b) {
      // a should come before b in the sorted order
      if (a[property] < b[property]) {
        return -1 * sort_order;
        // a should come after b in the sorted order
      } else if (a[property] > b[property]) {
        return 1 * sort_order;
        // a and b are the same
      } else {
        return 0 * sort_order;
      }
    }
  }

  const handleSort = (columnName) => {
    let contacts = data?.getContacts;
    let newOrderDirection = ordering.order === "asc" ? "desc" : "asc";
    let filter = contacts.sort(dynamicsort(columnName, newOrderDirection));
    setFilteredContactsData(paginate(filter, pagination.limit, pagination.offset));
    setOrdering({ fieldName: columnName, order: newOrderDirection });
    setIsMore(true);
    setApp({ ...app, searchQuery: null, paginationOffset: 1 });
  };

  // Perform paging client side
  function paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  const { getCurrentOrganization: currentOrganisation } = organizationData;

  // Csv file header
  const headers = [
    { label: "PHONE", key: "phoneNumber" },
    { label: "CREATED AT", key: "createdAt" },
    { label: "LAST IMPORT", key: "lastImported" },
    { label: "CURRENT AVAILABLE BALANCE", key: "currentAvailableBalance" },
    { label: "TOTAL CREDIT GRANTED", key: "totalCreditGranted" },
    { label: "TOTAL CREDIT REDEEMED", key: "totalCreditRedeemed" },
    { label: "TOTAL DISCOUNTS GRANTED", key: "totalCouponsGranted" },
    { label: "TOTAL DISCOUNTS REDEEMED", key: "totalCouponsRedeemed" },
    { label: "TOTAL REF DISCOUNTS ACCEPTED", key: "totalCouponsAcceptedRef" },
    { label: "TOTAL REF DISCOUNTS REDEEMED", key: "totalCouponsRedRef" },
    { label: "TOTAL REF CONVERSION RATE", key: "totalConversionRateRef" },
    { label: "ORIGINAL SOURCE", key: "originalSource" },
    { label: "OPT-IN METHOD", key: "optInMethod" },
    { label: "LAST OPT-IN", key: "lastOptIn" },
    { label: "OPT-OUT", key: "optOut" }
  ];

  // Load moredata client side.
  const loadMoreData = () => {
    setApp({ ...app, paginationOffset: app.paginationOffset + 1 });
    let newData = paginate(allContactsData, pagination.limit, app?.paginationOffset + 1);
    setIsLoadingMoreData(true);
    if (newData.length > 0) {
      let appendData = [...filteredContactsData, ...newData]
      setFilteredContactsData(appendData);
    }
    else {
      setIsMore(false);
    }
    setIsLoadingMoreData(true);
  }

  return (
    <>
      <BaseModal
        open={contactModalIsVisible}
        modalType={ModalList.ImportContactsModal}
        onClose={setContactModalIsVisible}
      />
      <BaseModal
        open={searchModalIsVisible}
        modalType={ModalList.SearchModal}
        onClose={setSearchModalIsVisible}
      />
      <PageContainer>
        <CSVLink
          data={allContactsData.map((row) => {
            return ({
              phoneNumber: row.phoneNumber,
              createdAt: moment(row.createdAt * 1000).format('L'),
              lastImported: moment(row.lastImported * 1000).format('L'),
              discount: `$${Price.output(row.currentAvailableBalance, true)}`,
              totalCreditGranted: `$${Price.output(row.totalCreditGranted, true)}`,
              totalCreditRedeemed: `$${Price.output(row.totalCreditRedeemed, true)}`,
              totalCouponsGranted: row.totalCouponsGranted,
              totalCouponsRedeemed: row.totalCouponsRedeemed,
              totalCouponsAcceptedRef: row.totalCouponsAcceptedRef,
              totalCouponsRedRef: row.totalCouponsRedRef,
              totalConversionRateRef: `${row.totalConversionRateRef}%`,
              originalSource: row.originalSource,
              optInMethod: row.optInMethod,
              lastOptIn: row.lastOptIn,
              optOut: row.optOut
            })
          })}
          headers={headers}
          filename="Contacts.csv"
          ref={csvRef}
          target="_self" />
        <Page>
          <Header currentOrganisation={currentOrganisation}></Header>
          <PageContent>
            <Flex align="center" margin="0px 0px 20px 0px">
              <HeaderText>
                Contacts
              </HeaderText>
              <Toolbar>
                {getToolBarButtons().map((b, i) => {
                  if (b.text === 'Send Welcomes (0)') {
                    return null;
                  }
                  return (
                    <ToolBarItem key={i} onClick={b.onClick}>
                      <Icon
                        icon={b.icon}
                        size={14}
                        margin="0px 10px 0px 0px"
                      />
                      {b.text}
                    </ToolBarItem>
                  );
                })}
                <ToolBarItem onClick={() => downloadExportData()}>
                  <Icon
                    icon={Icons.FileExcel}
                    size={14}
                    margin="0px 10px 0px 0px"
                  />
                  Download
                </ToolBarItem>
              </Toolbar>

            </Flex>
            {app?.searchQuery?.phoneNumber && (
              <ClearSearch onClick={() => setApp({ ...app, searchQuery: null, paginationOffset: 1 })}>
                <Icon
                  icon={Icons.TimesCircleSolid}
                  size={14}
                  margin="0px 10px 0px 0px"
                  color={colors.grey1}
                />
                {`Clear Current Search Query: "${app?.searchQuery?.phoneNumber}"`}
              </ClearSearch>
            )}
            {/* <TableTypeItems>
              {getTableTypeButtons().map((b, i) => {
                return (
                  <TableTypeItem key={i} onClick={b.onClick}>
                    {b.text}
                  </TableTypeItem>
                );
              })}
            </TableTypeItems> */}
            {filteredContactsData ? (
              <CustomerTable
                contacts={filteredContactsData}
                fetchMore={fetchMore}
                pagination={pagination}
                isMore={isMore}
                ordering={ordering}
                handleSort={handleSort}
                loadMoreData={loadMoreData}
                isLoadingMoreData={isLoadingMoreData}
              // updateQuery={(prev, { fetchMoreResult }) => {
              //   if (fetchMoreResult.getContacts.length <= 0) {
              //     setIsMore(false);
              //   }
              //   return {
              //     ...prev,
              //     getContacts: [...prev.getContacts, ...fetchMoreResult.getContacts],
              //   };
              // }}
              />
            ) : <div />}
          </PageContent>
        </Page>
        {/* <CustomerInfoSideNav /> */}
      </PageContainer>
    </>
  );
}

// const { orders } = fetchMoreResult;

// return {
//   ...prev,
//   orders: [...prev.orders, ...orders],
// };
