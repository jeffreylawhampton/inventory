import { CldUploadButton } from "next-cloudinary";
import { Upload } from "lucide-react";

const CloudUploadButton = ({ handleUpload }) => {
  return (
    <CldUploadButton
      className="bg-black col-span-2 h-fit mt-8 py-3 rounded-xl font-semibold flex gap-1 justify-center items-center text-white"
      options={{
        multiple: true,
        uploadPreset: "inventory",
        sources: ["local", "url", "google_drive", "dropbox"],
      }}
      uploadPreset="inventory"
      onQueuesEndAction={handleUpload}
    >
      <Upload size={18} className="mr-1" />
      Upload images
    </CldUploadButton>
  );
};

export default CloudUploadButton;
