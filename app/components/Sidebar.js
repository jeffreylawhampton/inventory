"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHouse,
  faList,
  faTags,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={`z-40 shadow-lg transition-max-w duration-[400ms] px-3 pt-10 w-full text-nowrap flex flex-col gap-8 ${
        isOpen ? "max-w-[200px]" : "max-w-[60px]"
      } h-screen fixed top-0 left-0 bg-slate-800 overflow-hidden text-white`}
    >
      <Link href="/" className="flex items-center w-fit">
        <FontAwesomeIcon icon={faHouse} className="w-8 h-6 mr-5" />
        Home
      </Link>

      <Link href="/locations" className="flex items-center w-fit">
        <FontAwesomeIcon icon={faLocationDot} className="w-8 h-6 mr-5" />
        Locations
      </Link>
      <Link href="/categories" className="flex items-center w-fit">
        <FontAwesomeIcon icon={faTags} className="w-8 h-6 mr-5" />
        Categories
      </Link>
      <Link href="/items" className="flex items-center w-fit">
        <FontAwesomeIcon icon={faList} className="w-8 h-6 mr-5" />
        Items
      </Link>
      <Link href="/user" className="flex items-center w-fit">
        <FontAwesomeIcon icon={faUser} className="w-8 h-6 mr-5" />
        Account
      </Link>
    </div>
  );
};

export default Sidebar;
