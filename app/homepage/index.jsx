"use client";
import { useState } from "react";
import ViewToggle from "../components/ViewToggle";
import Items from "./Items";
import MasonryContainer from "../components/MasonryContainer";
import Containers from "./Containers";
import Categories from "./Categories";

const HomePage = () => {
  const tabs = ["Items", "Containers", "Categories"];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-3 mt-4">Favorites</h1>
      <ViewToggle data={tabs} active={activeTab} setActive={setActiveTab} />

      {activeTab === 0 ? <Items /> : null}
      {activeTab === 1 ? <Containers /> : null}
      {activeTab === 2 ? <Categories /> : null}
    </div>
  );
};

export default HomePage;
