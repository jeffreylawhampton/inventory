"use client";
import { useRouter } from "next/navigation";
import { Button } from "@mantine/core";
import { ArrowLeft } from "lucide-react";
const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      autoContrast
      radius="xl"
      color="gray.1"
      className="mt-4 mb-6"
      onClick={() => router.back()}
    >
      <ArrowLeft
        size={16}
        strokeWidth={4}
        className="mr-1"
        color="var(--mantine-color-primary-6)"
      />
      Back
    </Button>
  );
};

export default BackButton;
