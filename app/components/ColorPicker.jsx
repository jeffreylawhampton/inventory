import { useContext, useEffect } from "react";
import useSWR from "swr";
import {
  Collapse,
  ColorSwatch,
  ColorPicker as Picker,
  TextInput,
} from "@mantine/core";
import { Loading } from ".";
import { fetcher } from "../lib/helpers";
import { sample } from "lodash";
import { DeviceContext } from "../providers";
import { ChevronDown } from "lucide-react";
import { handleSetColor } from "../lib/handlers";
import { inputStyles } from "../lib/styles";

export default function ColorPicker({
  hex,
  showPicker,
  setShowPicker,
  validHex,
  object,
  setObject,
}) {
  const { data, isLoading } = useSWR("/api/colors", fetcher);
  const swatches = data?.colors?.map((c) => c.hex);
  const { isMobile } = useContext(DeviceContext);

  const setHex = (hex) => {
    setObject({ ...object, color: { hex } });
  };

  useEffect(() => {
    if (!hex && swatches?.length) {
      const picked = sample(swatches);
      if (picked) setHex(picked);
    }
  }, [hex, swatches]);

  if (isLoading) return <Loading />;

  return (
    <>
      <TextInput
        name="color"
        label="Color"
        type="text"
        radius={inputStyles.radius}
        size={inputStyles.size}
        variant={inputStyles.variant}
        classNames={{
          label: inputStyles.labelClasses,
          input: validHex ? "" : inputStyles.errorClasses,
        }}
        value={object?.color?.hex}
        onChange={(e) => handleSetColor(e, object, setObject)}
        onFocus={() => setShowPicker(true)}
        error={!validHex}
        leftSection={
          <ColorSwatch
            color={object?.color?.hex}
            onClick={() => setShowPicker(!showPicker)}
          />
        }
        rightSection={
          <ChevronDown
            className={`transition ${showPicker ? "" : "rotate-180"}`}
            onClick={() => setShowPicker(!showPicker)}
            aria-label={showPicker ? "Hide color picker" : "Show color picker"}
          />
        }
      />
      <Collapse in={showPicker} onChange={setShowPicker}>
        <Picker
          value={hex}
          swatches={swatches}
          onChange={setHex}
          fullWidth
          swatchesPerRow={isMobile ? 8 : 10}
          classNames={{
            wrapper: "!cursor-picker",
            swatches: "max-h-[170px] overflow-y-auto",
            picker: "!h-[200px]",
          }}
        />
      </Collapse>
    </>
  );
}
