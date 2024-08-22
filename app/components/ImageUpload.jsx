"use client";
import { CldUploadButton } from "next-cloudinary";

const ImageUpload = ({ handleImageUpload, classNames }) => {
  return (
    <CldUploadButton
      options={{
        multiple: true,
        apiKey: process.env.apiKey,
        cloudName: "dgswa3kpt",
        uploadPreset: "inventory",
      }}
      className={classNames}
      onSuccess={(e) => handleImageUpload(e)}
    >
      Upload
    </CldUploadButton>
  );
};

export default ImageUpload;
