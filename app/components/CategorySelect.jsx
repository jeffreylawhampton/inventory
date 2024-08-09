"use client";
import Select from "react-select";
import { checkLuminance } from "../lib/helpers";

const CategorySelect = ({ onChange, userCategories, defaultValue }) => {
  const options = userCategories
    ?.map((category) => {
      return {
        label: category.name,
        value: category.id,
        key: category.id,
        color: category.color,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const colorStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#f7f7f7",
      borderRadius: 12,
      minHeight: 54,
      border: "none",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.color
          : isFocused
          ? data.color.concat("44")
          : undefined,
        color: isDisabled ? "#ccc" : isSelected ? "white" : "black",
        cursor: isDisabled ? "not-allowed" : "default",

        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : data.color
            : undefined,
        },
      };
    },
    multiValue: (styles, { data }) => {
      return {
        ...styles,
        backgroundColor: data.color,
        borderRadius: "40px",
        padding: "4px 12px",
        color: checkLuminance(data?.color) || "black",
        fontWeight: 500,
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: checkLuminance(data.color),
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      ":hover": {
        backgroundColor: data.color,
        color: checkLuminance(data?.color) || "black",
      },
    }),
  };

  return (
    <Select
      options={options}
      name="categories"
      isMulti
      closeMenuOnSelect={false}
      placeholder="Select categories"
      aria-label="Categories"
      onChange={onChange}
      styles={colorStyles}
      defaultValue={defaultValue}
    />
  );
};

export default CategorySelect;
