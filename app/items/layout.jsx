"use client";
import Search from "../components/Search";
import { usePathname } from "next/navigation";

const Layout = ({ children }) => {
  const pathname = usePathname();
  const showSearch = pathname.split("/").length < 3;
  return (
    <>
      {showSearch ? <Search /> : null}
      {children}
    </>
  );
};

export default Layout;
