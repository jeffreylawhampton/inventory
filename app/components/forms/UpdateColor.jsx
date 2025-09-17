import { useState, useContext } from "react";
import useSWR from "swr";
import { mutate } from "swr";
import { Button, ColorPicker, Loader } from "@mantine/core";
import { notify } from "@/app/lib/handlers";
import { updateColor } from "../../lib/db";
import { fetcher } from "@/app/lib/helpers";
import { DeviceContext } from "@/app/providers";

function UpdateColor({
  data,
  item,
  mutateKey,
  type,
  additionalMutate = "",
  close,
}) {
  const { isMobile } = useContext(DeviceContext);
  const { data: colorData, isLoading } = useSWR("/api/colors", fetcher);
  const [hex, setHex] = useState(
    item?.color?.hex || data?.color?.hex || "#ffffff"
  );

  const swatches = colorData?.colors?.map((c) => c.hex);

  const handleCancel = () => {
    setHex(data?.color?.hex);
    close();
  };

  const handleSetColor = async () => {
    close();

    let updated;

    if (data && item) {
      updated = structuredClone(data);
      if (type === "item" && updated?.items) {
        const itemToUpdate = updated.items.find((i) => i.id === item.id);
        itemToUpdate.color.hex = hex;
      } else if (type === "container" && updated?.containers) {
        const itemToUpdate = updated.containers.find(
          (con) => con.id === item.id
        );
        itemToUpdate.color.hex = hex;
      } else if (type === "category" && updated?.categories) {
        const itemToUpdate = updated.categories.find(
          (cat) => cat.id === item.id
        );
        itemToUpdate.color.hex = hex;
      } else {
        const itemToUpdate = updated.find((i) => i.id === item.id);
        itemToUpdate.color.hex = hex;
      }
    } else {
      if (data?.color?.hex === hex) return;
      updated = structuredClone(data);
      updated.color.hex = hex;
    }

    const id = data && item ? item.id : data.id;

    try {
      await mutate(mutateKey, updateColor({ id, hex, type }), {
        optimisticData: updated,
        rollbackOnError: true,
        populateCache: false,
        revalidate: false,
      });

      await mutate(mutateKey);

      if (additionalMutate) {
        await mutate(additionalMutate);
      }

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
        value={hex}
        defaultValue={data?.color?.hex}
        swatches={swatches}
        onChange={setHex}
        fullWidth
        swatchesPerRow={isMobile ? 10 : 12}
        classNames={{
          wrapper: "!cursor-picker",
          swatches: "max-h-[240px] overflow-y-auto",
          saturation: "!min-h-[180px]",
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
