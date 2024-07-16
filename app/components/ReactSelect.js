import Select from "react-select";

const ReactSelect = ({ options, isMulti, defaultValue, handleChange }) => {
  return (
    <Select
      options={options}
      isMulti={isMulti}
      defaultValue={defaultValue}
      onChange={handleChange}
    />
  );
};

export default ReactSelect;
