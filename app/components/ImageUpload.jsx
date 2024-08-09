"use client";
import { CldUploadButton } from "next-cloudinary";

const ImageUpload = ({ handleImageUpload }) => {
  return (
    <CldUploadButton
      options={{
        multiple: true,
        apiKey: process.env.apiKey,
        cloudName: process.env.cloudName,
        uploadPreset: process.env.preset,
      }}
      onSuccess={(e) => handleImageUpload(e)}
    >
      Upload
    </CldUploadButton>
  );
};

export default ImageUpload;
