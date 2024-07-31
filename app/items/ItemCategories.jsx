"use client";
import { useState } from "react";
import {
  CheckboxGroup,
  Chip,
  Spinner,
  CircularProgress,
} from "@nextui-org/react";
import { v4 } from "uuid";
import { useUser } from "../hooks/useUser";
import { CheckboxToggle } from "../components/CheckboxToggle";
import _ from "lodash";
import { useQuery } from "@tanstack/react-query";

const fetchItemCategories = async (id) => {
  try {
    const res = await fetch(`/api/itemcategories/${id}`);
    const data = await res.json();
    return data;
  } catch (e) {
    throw new Error(e);
  }
};

const ItemCategories = ({ item }) => {
  const [initial, setInitial] = useState([]);
  const initialCategories = _.sortBy(
    item?.categories?.map((category) => category.id)
  );

  const [selected, setSelected] = useState(
    item?.categories?.map((category) => category.id)
  );

  const [showEditCategories, setShowEditCategories] = useState(false);
  const { user } = useUser();

  const { isLoading, isError, data, isFetching } = useQuery({
    queryKey: ["itemcategories"],
    queryFn: () => fetchItemCategories(item.id),
  });

  if (isFetching)
    return (
      <div>
        <CircularProgress />
      </div>
    );
  if (isError) return <div>failed to load</div>;
  if (isLoading) return <Spinner />;

  const handleEditClick = () => {
    setInitial([..._.sortBy(selected)]);
    setShowEditCategories(true);
  };

  const categoryChips = data?.categories?.map((category) => {
    return (
      <Chip
        style={{ backgroundColor: category.color, color: "white" }}
        key={category.name}
      >
        {category.name}
      </Chip>
    );
  });

  const toggles = user?.categories?.map((category) => {
    return (
      <CheckboxToggle key={v4()} value={category.id}>
        {category.name}
      </CheckboxToggle>
    );
  });

  const checkboxes = (
    <CheckboxGroup
      orientation="horizontal"
      defaultValue={selected}
      onValueChange={setSelected}
    >
      {toggles}
    </CheckboxGroup>
  );

  return (
    <div className="min-h-[50px] flex gap-1">
      {showEditCategories ? checkboxes : categoryChips}
    </div>
  );
};

export default ItemCategories;
