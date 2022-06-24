import { useDispatch } from "react-redux";
import { useQuery } from '@apollo/react-hooks';
import * as OrderActions from "../redux/actions/order.actions";
import IOrder from '@test/models/.dist/interfaces/IOrder';
import { ApolloError } from "apollo-client";
import LIST_ORDERS from '@test/models/.dist/graphql/queries/orders.query';
import { QueryHookOptions } from '@apollo/react-hooks';

type UseListOrders = {
  orders: IOrder[] | undefined;
  loading: boolean;
  error: ApolloError | undefined;
  fetchMore: Function | undefined;
};

type UseListOrdersHook = (params?: QueryHookOptions) => UseListOrders;


const useListOrdersHook: UseListOrdersHook = (params) => {
  /* Actions */
  const dispatch = useDispatch();
  const cacheOrders = (orders: IOrder[]) =>
    dispatch(OrderActions.cacheOrders(orders));

  if (params && !params?.onCompleted) {
    params.onCompleted = (data) => {
      if (data?.orders) {
        cacheOrders(data.orders);
      }
    }
  }

  /** Query */
  const { data, loading, error, fetchMore } = useQuery(LIST_ORDERS, params);

  return {
    orders: data?.orders,
    loading,
    error,
    fetchMore,
  };
};

export default useListOrdersHook;
