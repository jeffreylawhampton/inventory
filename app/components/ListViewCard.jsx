import { useState } from "react";

const ListViewCard = ({ item }) => {
  return (
    <div className="flex items-center">
      <div className="w-1/6">{item.name}</div>
      <div className="w-1/6">{item.description}</div>
      <div className="w-1/6">{item.value}</div>
      <div className="w-1/6">{item.purchasedAt}</div>
    </div>
  );
};

export default ListViewCard;
