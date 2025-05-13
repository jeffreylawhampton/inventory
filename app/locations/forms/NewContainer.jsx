"use client";
import { useState, useEffect, useContext } from "react";
import { useUser } from "@/app/hooks/useUser";
import { FooterButtons } from "@/app/components";
import { ColorInput, TextInput } from "@mantine/core";
import toast from "react-hot-toast";
import { createContainer } from "@/app/containers/api/db";
import { mutate } from "swr";
import { sample } from "lodash";
import { inputStyles } from "@/app/lib/styles";
import { LocationContext } from "../layout";

const NewContainer = ({ data, close }) => {
  const { openContainers, setOpenContainers, openLocations, setOpenLocations } =
    useContext(LocationContext);
  const { user } = useUser();
  const colors = user?.colors?.map((color) => color.hex);
  const [newContainer, setNewContainer] = useState({
    name: "",
    color: { hex: "" },
    parentContainerId: data?.type === "container" ? data.id : null,
    locationId: data?.type === "container" ? data?.locationId : data.id,
  });

  const [formError, setFormError] = useState(false);

  useEffect(() => {
    setNewContainer({ ...newContainer, color: { hex: sample(colors) } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleInputChange = (event) => {
    event.currentTarget.name === "name" && setFormError(false);
    setNewContainer({
      ...newContainer,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newContainer.name) return setFormError(true);

    try {
      await mutate(
        `/locations/api/selected?type=${data?.type}&id=${data.id}`,
        createContainer({ ...newContainer, userId: user.id }),
        {
          optimisticData: {
            ...data,
            containers: [...data.containers, newContainer],
          },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      mutate("/locations/api", { revalidate: true });

      toast.success("Success");
    } catch (e) {
      toast.error("Something went wrong");
      throw e;
    }
    setNewContainer({});
    close();
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(!value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextInput
        name="name"
        label="Name"
        data-autofocus
        variant={inputStyles.variant}
        radius={inputStyles.radius}
        size={inputStyles.size}
        value={newContainer.name}
        onChange={handleInputChange}
        onBlur={(e) => validateRequired(e)}
        onFocus={() => setFormError(false)}
        error={formError}
        classNames={{
          label: inputStyles.labelClasses,
          input: formError ? "!bg-danger-200" : "",
        }}
      />

      <ColorInput
        value={newContainer.color?.hex}
        onChange={(e) =>
          setNewContainer({ ...newContainer, color: { hex: e } })
        }
        name="color"
        label="Color"
        variant={inputStyles.variant}
        radius={inputStyles.radius}
        size={inputStyles.size}
        swatches={colors}
        classNames={{
          label: inputStyles.labelClasses,
        }}
      />

      <FooterButtons onClick={close} />
    </form>
  );
};

export default NewContainer;
