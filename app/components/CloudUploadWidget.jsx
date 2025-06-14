import { mutate } from "swr";
import { CldUploadWidget } from "next-cloudinary";
import { createImages } from "../lib/db";

const CloudUploadWidget = ({ children, item, mutateKey }) => {
  const handleSubmit = async (images) => {
    await mutate(
      mutateKey,
      createImages({
        images,
        item,
      }),
      {
        optimisticData: {
          ...item,
          images: [...item?.images?.concat(images)],
        },
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      }
    );
  };

  return (
    <CldUploadWidget
      uploadPreset="inventory"
      multiple={true}
      options={{
        sources: ["local", "url", "dropbox", "google_drive", "facebook"],
      }}
      onQueuesEndAction={(result) => {
        const files = result?.info?.files?.map((f) => f.uploadInfo);
        handleSubmit(files);
      }}
    >
      {children}
    </CldUploadWidget>
  );
};

export default CloudUploadWidget;
