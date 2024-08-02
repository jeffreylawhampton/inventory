"use client";
import {
  Button,
  Card,
  CardHeader,
  Spinner,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
// import Image from "next/image";
import NewItem from "./NewItem";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllItems } from "./api/db";
import useSWR, { useSWRConfig } from "swr";
// import { fetcher } from "../lib/fetcher";
import { createItem } from "./api/db";
import { useUser } from "../hooks/useUser";
import toast from "react-hot-toast";
import Image from "next/image";
import FilestackPicker from "../components/FilestackPicker";
// const fetchAllItems = async () => {
//   try {
//     return getAllItems();
//   } catch (e) {
//     throw new Error(e);
//   }
// };

const fetcher = async () => {
  return await getAllItems();
};

const Page = () => {
  // const [items, setItems] = useState([]);
  const router = useRouter();
  const [showAddItem, setShowAddItem] = useState(false);
  const { data, error, isLoading } = useSWR("items", fetcher);
  const { mutate } = useSWRConfig();
  const { user } = useUser();
  const [count, setCount] = useState(200);
  const [newItem, setNewItem] = useState({});
  const [formError, setFormError] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  // const { isLoading, error, data, isFetching } = useQuery({
  //   queryKey: ["items"],
  //   queryFn: fetchAllItems,
  // });

  // if (isLoading || isFetching) return <Spinner />;
  // if (error) return "Something went wrong";

  if (isLoading) return "Loading";
  if (error) return "Error";
  let itemList = [];
  if (data.length) {
    itemList = data;
  }

  const validateRequired = ({ target: { value } }) => {
    setFormError(!value.trim());
  };

  const handleInputChange = (event) => {
    event.currentTarget.name === "name" && setFormError(false);
    setNewItem({
      ...newItem,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSelectionChange = (e) => {
    newItem.categories = e.target.value.split(",");
  };

  const newItemMutation = async (newItem) => {
    try {
      await mutate("items", createItem(newItem), {
        optimisticData: [...itemList, newItem],
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      });
      toast.success("Successfully added the new item.");
    } catch (e) {
      // If the API errors, the original data will be
      // rolled back by SWR automatically.
      throw e;
    }
  };
  return (
    <>
      {showAddItem ? (
        <>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await mutate("items", createItem(newItem), {
                  optimisticData: [...itemList, newItem],
                  rollbackOnError: true,
                  populateCache: false,
                  revalidate: true,
                });
                toast.success("Successfully added the new item.");
              } catch (e) {
                // If the API errors, the original data will be
                // rolled back by SWR automatically.
                throw e;
              }
              setShowAddItem(false);
            }}
          >
            <Input
              name="name"
              label="Name"
              placeholder="New item name"
              labelPlacement="outside"
              radius="sm"
              variant="flat"
              size="lg"
              autoFocus
              onBlur={(e) => validateRequired(e)}
              onFocus={() => setFormError(false)}
              value={newItem.name}
              onChange={handleInputChange}
              isInvalid={formError}
              validationBehavior="aria"
              className="pb-6"
              classNames={{ label: "font-semibold" }}
            />
            <Input
              label="Description"
              name="description"
              size="lg"
              value={newItem.description}
              onChange={handleInputChange}
            />

            <Input
              label="Quantity"
              name="quantity"
              size="lg"
              type="number"
              min={0}
              value={newItem.quantity}
              onChange={handleInputChange}
            />

            <Input
              label="Purchased at"
              name="purchasedAt"
              size="lg"
              value={newItem.purchasedAt}
              onChange={handleInputChange}
            />
            <Input
              label="Serial number"
              name="serialNumber"
              size="lg"
              value={newItem.serialNumber}
              onChange={handleInputChange}
            />

            <Input
              label="Value"
              name="value"
              size="lg"
              value={newItem.value}
              onChange={handleInputChange}
            />

            <Select
              label="Container"
              placeholder="Select"
              name="containerId"
              value={newItem.containerId}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  containerId: parseInt(e.target.value),
                })
              }
            >
              {user?.containers?.map((container) => (
                <SelectItem key={container.id}>{container.name}</SelectItem>
              ))}
            </Select>

            <Select
              label="Location"
              placeholder="Select"
              name="locationId"
              value={newItem.locationId}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  locationId: parseInt(e.target.value),
                })
              }
            >
              {user?.locations?.map((location) => (
                <SelectItem key={location.id}>{location.name}</SelectItem>
              ))}
            </Select>

            <Select
              label="Categories"
              name="categories"
              variant="bordered"
              placeholder="Select"
              selectionMode="multiple"
              onChange={handleSelectionChange}
            >
              {user?.categories?.map((category) => {
                return (
                  <SelectItem key={category.id}>{category.name}</SelectItem>
                );
              })}
            </Select>

            <Button onPress={() => setPickerVisible(true)}>
              Upload images
            </Button>
            <div className={`z-40 relative ${pickerVisible ? "" : "hidden"}`}>
              <FilestackPicker
                apikey="Aj6fZpiFQviOse160yT0Tz"
                openPicker={pickerVisible}
                onSuccess={(result) => {
                  if (result.filesUploaded.length > 0) {
                    setUploadedImages(result.filesUploaded);
                  }
                }}
              />
            </div>
            <div>
              <Button
                color="danger"
                variant="light"
                onPress={() => setShowAddItem(false)}
              >
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Submit
              </Button>
            </div>
          </form>
          {uploadedImages && (
            <div className="flex gap-3">
              {uploadedImages.map((image) => (
                <div key={image.url} className="relative">
                  <div
                    onClick={() => removeImage(image.url)}
                    className="transition z-20 rounded-full bg-black bg-opacity-75  text-white drop-shadow-2xl w-5 h-5 flex items-center justify-center absolute right-2 top-2 hover:scale-125"
                  >
                    <X strokeWidth={3} className="h-4 w-4" />
                  </div>
                  <Image
                    key={image.url}
                    src={image.url}
                    width={200}
                    height={200}
                    alt=""
                    onClick={() => removeImage(image.url)}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          Items
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-6">
            {itemList?.map((item) => {
              return (
                <Card
                  isPressable
                  onPress={() => router.push(`/items/${item.id}`)}
                  key={item.name}
                  className="py-3 bg-slate-400 overflow-hidden aspect-square"
                >
                  {/* {item.images?.length ? (
                    <Image
                      alt=""
                      src={item?.images[0]?.url}
                      fill
                      objectFit="cover"
                    />
                  ) : null} */}
                  <CardHeader className="flex-col items-start">
                    <h2>{item.name}</h2>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
          <Button
            onClick={async () => {
              setCount(count + 1);
              const newItem = {
                name: Date.now().toString(),
              };
              try {
                await mutate("items", createItem(newItem), {
                  optimisticData: [...itemList, newItem],
                  rollbackOnError: true,
                  populateCache: false,
                  revalidate: true,
                });
                toast.success("Successfully added the new item.");
              } catch (e) {
                // If the API errors, the original data will be
                // rolled back by SWR automatically.
                throw e;
              }
            }}
          >
            Mutate
          </Button>
          <Button onPress={() => setShowAddItem(true)}>Create new item</Button>
        </div>
      )}
    </>
  );
};

export default Page;
