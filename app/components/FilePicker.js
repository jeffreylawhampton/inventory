"use client";
import { PickerOverlay } from "filestack-react";

const FilePicker = () => {
  const pickerOptions = {
    maxFiles: 5,
    fromSources: [
      "local_file_system",
      "url",
      "facebook",
      "onedrive",
      "googlephotos",
      "googledrive",
      "gmail",
      "dropbox",
    ],
  };
  return (
    <PickerOverlay
      apikey={process.env.NEXT_PUBLIC_FILESTACK_API_KEY}
      onSuccess={(res) => console.log(res)}
      onUploadDone={(res) => console.log(res)}
      pickerOptions={pickerOptions}
    />
  );
};

export default FilePicker;
