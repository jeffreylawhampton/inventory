import { useState } from "react";
import useSWR from "swr";
import { mutate } from "swr";
import { Button, ColorPicker, Loader } from "@mantine/core";
import { notify } from "@/app/lib/handlers";
import { updateColor } from "../../lib/db";
import { fetcher } from "@/app/lib/fetcher";

function UpdateColor({
  data,
  mutateKey,
  type,
  additionalMutate = "",
  close,
  revalidate = true,
}) {
  const { data: colorData, isLoading } = useSWR("/api/colors", fetcher);
  const [hex, setHex] = useState(data?.color?.hex || "#ffffff");

  const swatches = colorData?.colors?.map((c) => c.hex);

  const handleCancel = () => {
    setHex(data?.color?.hex);
    close();
  };

  const handleSetColor = async () => {
    close();
    if (data?.color?.hex == hex) return;
    const updated = structuredClone(data);
    updated.color.hex = hex;

    try {
      await mutate(
        mutateKey,
        updateColor({
          id: data.id,
          hex,
          type,
        }),
        {
          optimisticData: updated,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );

      revalidate
        ? mutate(additionalMutate, undefined, { revalidate: true })
        : mutate(additionalMutate);
      notify({ message: "Color updated" });
    } catch (e) {
      notify({ isError: true });
      throw new Error(e);
    }
  };

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <ColorPicker
        color={hex}
        defaultValue={data?.color?.hex}
        swatches={swatches}
        onChange={setHex}
        fullWidth
        swatchesPerRow={8}
        classNames={{
          wrapper: "!cursor-picker",
          swatches: "max-h-[240px] overflow-y-auto",
          picker: "!h-[200px]",
        }}
      />
      <div className="flex gap-2 justify-end mt-2">
        <Button variant="subtle" color="danger" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={handleSetColor}
          variant="subtle"
          disabled={data?.color?.hex === hex}
        >
          Set color
        </Button>
      </div>
    </>
  );
}

export default UpdateColor;
