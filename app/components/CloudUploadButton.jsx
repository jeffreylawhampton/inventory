import { CldUploadButton } from "next-cloudinary";
import { IconUpload } from "@tabler/icons-react";

const CloudUploadButton = ({ handleUpload }) => {
  return (
    <CldUploadButton
      className="bg-black col-span-2 h-fit mt-8 py-3 rounded-xl font-semibold flex gap-1 justify-center items-center text-white"
      options={{
        multiple: true,
        uploadPreset: "inventory",
        sources: ["local", "url", "google_drive", "dropbox"],
      }}
      onQueuesEndAction={handleUpload}
    >
      <IconUpload size={16} />
      Upload images
    </CldUploadButton>
  );
};

export default CloudUploadButton;
