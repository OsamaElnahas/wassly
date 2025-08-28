import React from "react";
import { useOutletContext } from "react-router-dom";

export default function OrdersHistory() {
  const { searchTerm, setSearchTerm } = useOutletContext();

  return <div>OrdersHistory</div>;
}
