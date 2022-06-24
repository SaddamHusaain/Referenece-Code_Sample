import { useSelector, useDispatch } from "react-redux";
import { BackstageState } from "../redux/store";
import { useQuery } from '@apollo/react-hooks';
import * as CustomerActions from "../redux/actions/customer.actions";
import { ApolloError } from "apollo-client";
import GET_CUSTOMER_PROFILE from '@test/models/.dist/graphql/queries/customerProfile.query';

type UseCustomer = {
  customer: any | undefined;
  customerId: string;
  loading: boolean;
  error: ApolloError | undefined
};

type UseCustomerHook = (customerId?: string) => UseCustomer;

const useCustomerHook: UseCustomerHook = (customerId) => {
  /* State */
  const {
    customerId: stateCustomerId,
    customersCache,
  } = useSelector(
    (state: BackstageState) => state.customer
  );

  customerId = (stateCustomerId || customerId) as string;

  const customer = customersCache[customerId];

  /* Actions */
  const dispatch = useDispatch();
  const cacheCustomer = (customer: any) => {
    dispatch(CustomerActions.cacheCustomers([customer]));
  }

  /* Hooks */
  const { loading, error } = useQuery(GET_CUSTOMER_PROFILE, {
    variables: {
      query: {
        userIds: [customerId],
      },
    },
    onCompleted: (data) => {
      if (data.userProfiles && !customer) {
        cacheCustomer(data.userProfiles[0]);
      }
    }
  });

  return {
    customer: customer,
    customerId: customerId,
    loading: customer ? false : loading,
    error: error,
  };
};

export default useCustomerHook;
