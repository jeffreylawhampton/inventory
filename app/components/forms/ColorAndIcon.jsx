import { useState, useContext } from "react";
import { Collapse, ColorPicker } from "@mantine/core";
import { IconPicker, LucideIcon } from "..";
import { DeviceContext } from "@/app/providers";

export default function ColorAndIcon({ object, setObject, swatches, type }) {
  const { isMobile } = useContext(DeviceContext);
  const [openPanel, setOpenPanel] = useState(null);
  const toggle = (panel) => setOpenPanel((p) => (p === panel ? null : panel));

  let icon = object?.icon;
  if (!icon) {
    if (type === "container") icon = "Box";
    if (type === "category") icon = "Tag";
    if (type === "item") icon = "Layers";
  }

  return (
    <div className="mt-2">
      <p className="font-semibold pb-2">Color and icon</p>
      <div className="flex gap-2 items-center pb-4">
        <div
          role="button"
          tabIndex={0}
          style={{ background: object.color?.hex }}
          className="w-12 h-12 rounded-md"
          onClick={() => toggle("color")}
        />
        <span
          role="button"
          tabIndex={0}
          onClick={() => toggle("icon")}
          className="flex items-center justify-center w-12 h-12 bg-bluegray-200/80 rounded"
        >
          <LucideIcon iconName={icon} type={type} size={28} />
        </span>
      </div>
      <Collapse in={openPanel === "color"}>
        <ColorPicker
          fullWidth
          swatches={swatches}
          swatchesPerRow={isMobile ? 10 : 12}
          value={object?.color?.hex}
          onChange={(e) => setObject({ ...object, color: { hex: e } })}
          classNames={{
            wrapper: "!cursor-picker",
            swatches: "max-h-[240px] overflow-y-auto",
          }}
        />
      </Collapse>

      <Collapse in={openPanel === "icon"}>
        <IconPicker
          data={object}
          onSelect={(icon) => {
            setObject({ ...object, icon });
          }}
        />
      </Collapse>
    </div>
  );
}
