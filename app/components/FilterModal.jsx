import { useContext, useState } from "react";
import {
  ColorSwatch,
  Menu,
  Pill,
  PillGroup,
  ScrollArea,
  Tabs,
} from "@mantine/core";
import { Sort } from ".";
import { CircleCheck, Heart, SlidersHorizontal } from "lucide-react";
import { DeviceContext, FilterContext } from "../providers";
import { LucideIcon, RevealSection, SearchFilter } from ".";
import {
  checkSelected,
  getFilterCounts,
  handleToggleDelete,
  handleToggleSelect,
} from "../lib/helpers";

const FilterModal = ({
  data,
  handleClear,
  showLocationFilters = true,
  showItemSort,
}) => {
  const [activeTab, setActiveTab] = useState("filter");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [showAllColors, setShowAllColors] = useState(false);
  const [showAllIcons, setShowAllIcons] = useState(false);

  const {
    setFilter,
    showFavorites,
    setShowFavorites,
    locationFilters,
    setLocationFilters,
    categoryFilters,
    setCategoryFilters,
    colorFilters,
    setColorFilters,
    iconFilters,
    setIconFilters,
  } = useContext(FilterContext);

  const { isMobile } = useContext(DeviceContext);

  const MAX_SPOILER_HEIGHT = 67;

  const locationOptions = getFilterCounts(data, "location");
  const categoryOptions = getFilterCounts(data, "categories");
  const colorOptions = [...new Set(data?.map((c) => c?.color?.hex))]?.filter(
    (c) => c
  );

  const iconOptions = [...new Set(data?.map((c) => c?.icon))]?.filter((c) => c);

  if (locationOptions?.length) {
    locationOptions.push({ id: null, name: "No location" });
  }

  const labelClasses = "flex items-center justify-start !gap-[1px] !text-xs";
  const selectedClasses =
    "!bg-white border dropshadow !pl-0.5 border-bluegray-100";
  const unselectedClasses = "!bg-white border opacity-50 border-bluegray-400";

  const pillGroupClasses = "!gap-y-1.5 !gap-x-1 pb-1";

  return (
    <Menu
      classNames={{ dropdown: "!font-medium !px-0 !pt-4" }}
      shadow="0px 0px 9px #00000033"
      closeOnItemClick={false}
      position="bottom-end"
      width={340}
      radius="md"
      onClose={() => {
        setShowAllCategories(false);
        setShowAllLocations(false);
      }}
    >
      <Menu.Target>
        <button className="bg-bluegray-200 hover:bg-bluegray-300 active:bg-bluegray-400 p-1 rounded !w-10 !h-10 [&>svg]:mx-auto">
          <SlidersHorizontal size={22} />
        </button>
      </Menu.Target>
      <Menu.Dropdown>
        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          classNames={{ panel: "!pb-3 !pt-5" }}
        >
          <Tabs.List className="mx-4">
            <Tabs.Tab value="filter" className="data-[active]:!border-black">
              Filter
            </Tabs.Tab>
            <Tabs.Tab value="sort" className="data-[active]:!border-black">
              Sort
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="filter">
            <ScrollArea.Autosize
              mah={390}
              scrollbars="y"
              type={isMobile ? "never" : "hover"}
              offsetScrollbars="y"
              classNames={{ viewport: "!pr-0" }}
            >
              <div className="px-4">
                <SearchFilter
                  label="Filter by name"
                  onChange={(e) => setFilter(e.target.value)}
                  size="md"
                  roundedFull
                  autoFocus
                />
                <h2 className="font-medium pt-3 pb-2 text-sm">Favorites</h2>
                <Pill
                  size="lg"
                  classNames={{
                    label: `${labelClasses} [&>svg]:!mr-1`,
                    root: `!bg-white border ${
                      showFavorites ? selectedClasses : unselectedClasses
                    }`,
                  }}
                  onClick={() => setShowFavorites(!showFavorites)}
                >
                  {showFavorites ? (
                    <CircleCheck fill="black" stroke="white" size={26} />
                  ) : (
                    <Heart
                      size={12}
                      fill={"var(--mantine-color-danger-5)"}
                      stroke={"var(--mantine-color-danger-5)"}
                    />
                  )}
                  Favorites
                </Pill>

                {locationOptions?.length && showLocationFilters ? (
                  <RevealSection
                    title="Locations"
                    maxHeight={MAX_SPOILER_HEIGHT}
                    deps={[locationOptions, locationFilters]}
                    PillComponent={Pill}
                    pillProps={{}}
                    expanded={showAllLocations}
                    onToggle={setShowAllLocations}
                  >
                    <PillGroup className={pillGroupClasses}>
                      {locationOptions?.map((location) => {
                        const selected = checkSelected(
                          location,
                          locationFilters
                        );
                        return (
                          <Pill
                            key={location.name}
                            size="lg"
                            classNames={{
                              label: labelClasses,
                              root: selected
                                ? selectedClasses
                                : unselectedClasses,
                            }}
                            onClick={() =>
                              handleToggleDelete(
                                location,
                                "id",
                                locationFilters,
                                setLocationFilters
                              )
                            }
                          >
                            {selected ? (
                              <CircleCheck
                                fill="black"
                                stroke="white"
                                size={26}
                              />
                            ) : (
                              <LucideIcon
                                iconName="MapPin"
                                type="location"
                                size={12}
                                classes="!mr-1"
                              />
                            )}

                            {location.name}
                          </Pill>
                        );
                      })}
                    </PillGroup>
                  </RevealSection>
                ) : null}

                {categoryOptions?.length ? (
                  <RevealSection
                    title="Categories"
                    maxHeight={MAX_SPOILER_HEIGHT}
                    deps={[categoryOptions, categoryFilters]}
                    PillComponent={Pill}
                    pillProps={{}}
                    expanded={showAllCategories}
                    onToggle={setShowAllCategories}
                  >
                    <PillGroup className={pillGroupClasses}>
                      {categoryOptions.map((category) => {
                        const selected = checkSelected(
                          category,
                          categoryFilters
                        );
                        return (
                          <Pill
                            key={category.name}
                            size="lg"
                            classNames={{
                              label: labelClasses,
                              root: selected
                                ? selectedClasses
                                : unselectedClasses,
                            }}
                            onClick={() =>
                              handleToggleDelete(
                                category,
                                "name",
                                categoryFilters,
                                setCategoryFilters
                              )
                            }
                          >
                            {selected ? (
                              <CircleCheck
                                fill="black"
                                stroke="white"
                                size={26}
                              />
                            ) : (
                              <LucideIcon
                                iconName={category.icon}
                                type="category"
                                fill={category.color?.hex}
                                size={12}
                                classes="!mr-1"
                              />
                            )}
                            {category.name}
                          </Pill>
                        );
                      })}
                    </PillGroup>
                  </RevealSection>
                ) : null}

                {colorOptions?.length ? (
                  <RevealSection
                    title="Colors"
                    maxHeight={MAX_SPOILER_HEIGHT}
                    deps={[colorOptions, colorFilters]}
                    PillComponent={Pill}
                    pillProps={{}}
                    expanded={showAllColors}
                    onToggle={setShowAllColors}
                  >
                    <PillGroup className={pillGroupClasses}>
                      {colorOptions.map((color) => {
                        const selected = colorFilters?.find((c) => c === color);
                        return (
                          <Pill
                            key={color}
                            size="lg"
                            classNames={{
                              label: labelClasses,
                              root: selected
                                ? selectedClasses
                                : `${unselectedClasses} !opacity-80 !px-2.5`,
                            }}
                            onClick={() =>
                              handleToggleSelect(
                                color,
                                colorFilters,
                                setColorFilters
                              )
                            }
                          >
                            {selected ? (
                              <CircleCheck
                                fill="black"
                                stroke="white"
                                size={26}
                              />
                            ) : null}
                            <ColorSwatch color={color} size={20} />
                          </Pill>
                        );
                      })}
                    </PillGroup>
                  </RevealSection>
                ) : null}

                {iconOptions?.length ? (
                  <RevealSection
                    title="Icons"
                    maxHeight={MAX_SPOILER_HEIGHT}
                    deps={[iconOptions, iconFilters]}
                    PillComponent={Pill}
                    pillProps={{}}
                    expanded={showAllIcons}
                    onToggle={setShowAllIcons}
                  >
                    <PillGroup className="!gap-y-1.5 !gap-x-1.5 pb-1">
                      {iconOptions.map((icon) => {
                        const selected = iconFilters?.find((i) => i === icon);
                        return (
                          <Pill
                            key={icon}
                            size="lg"
                            classNames={{
                              label: `${labelClasses} !gap-1.5`,
                              root: selected
                                ? `${selectedClasses} !pr-1.5 !bg-black`
                                : unselectedClasses,
                            }}
                            onClick={() =>
                              handleToggleSelect(
                                icon,
                                iconFilters,
                                setIconFilters
                              )
                            }
                          >
                            {selected ? (
                              <CircleCheck
                                fill="black"
                                stroke="white"
                                size={26}
                              />
                            ) : null}
                            <LucideIcon
                              iconName={icon}
                              type="item"
                              stroke="black"
                              size={18}
                            />
                          </Pill>
                        );
                      })}
                    </PillGroup>
                  </RevealSection>
                ) : null}

                <div className="h-2" />
              </div>
            </ScrollArea.Autosize>
            <div className="w-full !ml-auto !pr-4 !mb-2 pt-3 text-right">
              <button
                onClick={handleClear}
                className="rounded-full border border-black px-4 py-1 text-xs hover:bg-black/80 active:bg-black/90 hover:text-white active:text-white"
              >
                Clear all
              </button>
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="sort">
            <Sort showItemSort={showItemSort} />
          </Tabs.Panel>
        </Tabs>
      </Menu.Dropdown>
    </Menu>
  );
};

export default FilterModal;
