"use client";
import { Card, CardBody } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Box } from "lucide-react";

const ContainerCard = ({ container }) => {
  const router = useRouter();

  return (
    <Card
      key={container.id}
      isPressable
      onPress={() =>
        router.push(`/containers/${container.id}?name=${container.name}`)
      }
      className="border-none bg-gray-200 hover:bg-gray-300 aspect-[2.5/1]"
      shadow="sm"
    >
      <CardBody className="flex flex-row gap-3 items-center justify-center h-full overflow-hidden">
        <div className="py-2 pl-2 flex flex-col gap-0 w-full items-start h-full">
          <h1 className="text-lg font-semibold pb-1 flex gap-2">
            <Box size={30} /> {container?.name}
          </h1>

          {container?.location?.name}
        </div>
      </CardBody>
    </Card>
  );
};

export default ContainerCard;
