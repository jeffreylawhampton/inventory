"use client";
import { Fragment, useState } from "react";
import useSWR from "swr";
import { Modal, TextInput, Loader, ScrollArea, Space } from "@mantine/core";
import { Search } from "lucide-react";
import { inputStyles } from "@/app/lib/styles";
import ColorCard from "../SearchCard";
import { fetcher, hasResults } from "@/app/lib/helpers";
import { v4 } from "uuid";

export default function UniversalSearch({
  showSearch,
  setShowSearch,
  isMobile,
}) {
  const [searchString, setSearchString] = useState("");
  const [shouldFetch, setShouldFetch] = useState(searchString?.length);
  const { data, isLoading } = useSWR(
    shouldFetch && searchString?.length
      ? `/api/search?query=${searchString}`
      : null,
    fetcher
  );

  return (
    <Modal
      opened={showSearch}
      onClose={() => setShowSearch(false)}
      size="lg"
      withCloseButton={false}
      classNames={{
        body: "!p-0",
        content: "!overflow-hidden",
        inner: "!pt-3",
      }}
    >
      <TextInput
        size="lg"
        leftSection={<Search aria-label="Search" size={18} />}
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
        <ScrollArea
          classNames={{ root: "p-6 pb-0" }}
          scrollbars="y"
          type="auto"
          h={isMobile ? "45vh" : "80vh"}
        >
          {isLoading ? (
            <Loader aria-label="Loading" size="md" type="dots" />
          ) : hasResults(data) ? (
            <div>
              {Object.entries(data)?.map((r) => {
                return r[1]?.length ? (
                  <Fragment key={v4()}>
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
                            setShowSearch={setShowSearch}
                          />
                        );
                      })}
                    </div>
                  </Fragment>
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
          <Space h={isMobile ? 50 : 16} />
        </ScrollArea>
      ) : null}
    </Modal>
  );
}
