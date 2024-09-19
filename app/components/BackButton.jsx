"use client";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@mantine/core";
import { IconArrowBigLeft } from "@tabler/icons-react";
import { revalidate } from "../lib/db";

const BackButton = () => {
  const paths = usePathname().split("/");
  const router = useRouter();
  const handleBack = () => {
    const prev =
      window.history.state.__PRIVATE_NEXTJS_INTERNALS_TREE[1].children[0];
    router.replace(`/${prev}`);
  };
  return (
    paths?.length > 2 && (
      <Button
        autoContrast
        radius="xl"
        color="gray.1"
        className="mt-4 mb-6"
        onClick={handleBack}
      >
        <IconArrowBigLeft size={20} className="mr-1" />
        All {paths[1]}
      </Button>
    )
  );
};

export default BackButton;
