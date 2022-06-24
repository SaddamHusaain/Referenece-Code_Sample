import { useDispatch } from "react-redux";
import { useQuery } from '@apollo/react-hooks';
import * as CustomerActions from "../redux/actions/customer.actions";
import { ApolloError } from "apollo-client";
import LIST_CUSTOMERS from '@test/models/.dist/graphql/queries/customerProfile.query';
import { QueryHookOptions } from '@apollo/react-hooks';

type UseListCustomers = {
  customers: any[] | undefined;
  loading: boolean;
  fetchMore: Function | undefined;
  error: ApolloError | undefined;
};

type UseListCustomersHook = (params?: QueryHookOptions) => UseListCustomers;

const useListCustomersHook: UseListCustomersHook = (params) => {
  /* Actions */
  const dispatch = useDispatch();
  const cacheCustomers = (customers: any[]) =>
    dispatch(CustomerActions.cacheCustomers(customers));

  if (params && !params?.onCompleted) {
    params.onCompleted = (data) => {
      if (data?.userProfiles) {
        cacheCustomers(data.userProfiles);
      }
    }
  }

  /** Query */
  const { data, loading, error, fetchMore } = useQuery(LIST_CUSTOMERS, params);

  return {
    customers: data?.userProfiles,
    loading: loading,
    fetchMore: fetchMore,
    error: error,
  };
};

export default useListCustomersHook;
