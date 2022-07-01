import IOrder from "@test/models/.dist/interfaces/IOrder";

export const OrderActionTypes = {
  // Order Id
  SET_ORDER_ID: "SET_ORDER_ID",
  // Cache Orders
  CACHE_ORDERS: "CACHE_ORDERS",
  // Order Refunded
  ORDER_REFUNDED: "ORDER_REFUNDED",
};

/********************************************************************************
 *  Venue Action Creators
 *******************************************************************************/
export type OrderActionCreatorTypes =
  // Order Id
  | SetOrderIdAction
  // Cache Orders
  | CacheOrdersAction
  // Set Order Refunded
  | setOrderRefundedAction;

/********************************************************************************
 *  Set Order ID
 *******************************************************************************/

export interface SetOrderIdAction {
  type: typeof OrderActionTypes.SET_ORDER_ID;
  payload: {
    orderId: string;
  };
}

export function setOrderId(orderId: string): SetOrderIdAction {
  return {
    type: OrderActionTypes.SET_ORDER_ID,
    payload: {
      orderId,
    },
  };
}

/********************************************************************************
 *  Cache Orders
 *******************************************************************************/

export interface CacheOrdersAction {
  type: typeof OrderActionTypes.CACHE_ORDERS;
  payload: {
    orders: IOrder[];
  };
}

export function cacheOrders(orders: IOrder[]): CacheOrdersAction {
  return {
    type: OrderActionTypes.CACHE_ORDERS,
    payload: {
      orders,
    },
  };
}

/********************************************************************************
 *  Cache Orders
 *******************************************************************************/

export interface setOrderRefundedAction {
  type: typeof OrderActionTypes.ORDER_REFUNDED;
  payload: {
    refunded: boolean;
  };
}

export function setOrderRefunded(refunded: boolean): setOrderRefundedAction {
  return {
    type: OrderActionTypes.ORDER_REFUNDED,
    payload: {
      refunded,
    },
  };
}
