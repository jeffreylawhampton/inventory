"use client";
import { useState } from "react";
import SearchFilter from "../components/SearchFilter";
import ViewToggle from "../components/ViewToggle";
import Items from "./Items";
import Containers from "./Containers";
import Categories from "./Categories";

const HomePage = () => {
  const tabs = ["Items", "Containers", "Categories"];
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState("");

  let placeholder = "an item";
  if (activeTab === 1) placeholder = "a container";
  if (activeTab === 2) placeholder = "a category";
  return (
    <div>
      <h1 className="font-bold text-3xl pb-5">Favorites</h1>
      <ViewToggle data={tabs} active={activeTab} setActive={setActiveTab} />
      <SearchFilter
        filter={filter}
        onChange={(e) => setFilter(e.target.value)}
        label={`Search for ${placeholder}`}
      />
      <div className="mt-2">
        {activeTab === 0 ? <Items filter={filter} /> : null}
        {activeTab === 1 ? <Containers filter={filter} /> : null}
        {activeTab === 2 ? <Categories filter={filter} /> : null}
      </div>
    </div>
  );
};

export default HomePage;
