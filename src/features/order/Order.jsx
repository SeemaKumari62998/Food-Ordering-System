 // Test ID: IIDSAT
 import OrderItem from '../order/OrderItem'
import { useFetcher, useLoaderData } from "react-router-dom";
import { getOrder } from "../../services/apiRestaurant";
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utils/helpers";
import { useEffect } from 'react';

function Order() {
  const order = useLoaderData();

  const fetcher = useFetcher();

  useEffect(function(){
    if(!fetcher.data && fetcher.state === 'idle' )
fetcher.load('./menu')
  },[fetcher])

  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;
  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="px-20 py-6 space-y-8">
      <div className=" flex justify-between flex-wrap items-center gap-2">
        <h2 className="font-semibold text-xl">Order #{id} status</h2>

        <div className="space-x-2">
          {priority && (<span className=" bg-red-500 text-sm uppercase font-semibold rounded-full text-red-50 tracking-wide px-3 py-1 ">
          Priority
          </span>)}

          <span className=" bg-green-500 text-sm uppercase font-semibold rounded-full text-green-50 tracking-wide px-3 py-1 ">
          {status} order</span>
        </div>
      </div>

      <div className=" flex  justify-between flex-wrap items-center gap-2 bg-stone-300 px-6 py-5">
        <p className="font-medium">
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p className="text-sm text-stone-500">(Estimated delivery: {formatDate(estimatedDelivery)})</p>
      </div>

      <ul className='divide-stone-300 divide-y border-b border-t'>
        {cart.map((item)=>(<OrderItem  item={item} key={item.pizzaId}/>)) }
      </ul>

      <div className="space-y-2 bg-stone-300 px-6 py-5">
        <p className=" text-sm font-medium text-stone-600">Price pizza: {formatCurrency(orderPrice)}</p>
        {priority && <p>Price priority: {formatCurrency(priorityPrice)}</p>}
        <p className=" font-bold ">To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}</p>
      </div>
    </div>
  );
}

export async function loader({ params }) {
  const order = await getOrder(params.orderID);
  return order;
}
export default Order;
