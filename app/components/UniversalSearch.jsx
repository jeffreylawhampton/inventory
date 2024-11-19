"use client";
import { useState } from "react";
import useSWR from "swr";
import { Modal, TextInput, Loader, ScrollArea } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { inputStyles } from "../lib/styles";
import { fetcher } from "../lib/fetcher";
import ColorCard from "./SearchCard";
import { v4 } from "uuid";

export default function UniversalSearch({ showSearch, setShowSearch }) {
  const [searchString, setSearchString] = useState("");
  const [shouldFetch, setShouldFetch] = useState(searchString?.length);
  const { data, isLoading } = useSWR(
    shouldFetch && searchString?.length
      ? `/api/search?query=${searchString}`
      : null,
    fetcher
  );

  const onClick = () => setShowSearch(false);

  return (
    <Modal
      opened={showSearch}
      onClose={() => setShowSearch(false)}
      size="lg"
      withCloseButton={false}
      classNames={{
        body: "!p-0",
        content: "!overflow-hidden",
      }}
    >
      <TextInput
        size="lg"
        leftSection={<IconSearch aria-label="Search" stroke={2} size={20} />}
        classNames={{
          input: inputStyles.inputClasses,
        }}
        variant={inputStyles.variant}
        placeholder={"Search for anything"}
        aria-label="Search by name, description, or purchase location"
        onChange={(e) => {
          e.preventDefault();
          setSearchString(e.target.value);
        }}
        onFocus={() => setShouldFetch(true)}
        autoFocus
      />
      {data || isLoading ? (
        <ScrollArea.Autosize
          mah={"80vh"}
          classNames={{ root: "p-6 !pb-32 lg:!pb-8" }}
        >
          {isLoading ? (
            <Loader aria-label="Loading" size="md" type="dots" />
          ) : data?.results?.items?.length ||
            data?.results?.containers?.length ||
            data?.results?.categories?.length ||
            data?.results?.locations?.length ? (
            <div>
              {Object.entries(data?.results)?.map((r) => {
                return r[1]?.length ? (
                  <>
                    <div className="flex flex-col gap-2 pb-6">
                      <h2 className="font-semibold text-lg">
                        {r[0][0].toUpperCase().concat(r[0].substring(1))}
                      </h2>
                      {r[1]?.map((i) => {
                        return (
                          <ColorCard
                            key={v4()}
                            item={i}
                            type={r[0].toLowerCase()}
                            onClick={onClick}
                          />
                        );
                      })}
                    </div>
                  </>
                ) : null;
              })}
            </div>
          ) : (
            <h3
              className={`text-large font-medium ${
                !searchString?.length && "hidden"
              }`}
            >
              No results
            </h3>
          )}
        </ScrollArea.Autosize>
      ) : null}
    </Modal>
  );
}
