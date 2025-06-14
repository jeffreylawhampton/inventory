"use client";
import { useEffect, useState } from "react";
import { useRefreshedUser } from "@/app/hooks/useRefreshedUser";
import { CldUploadWidget } from "next-cloudinary";
import { updateAuth0User } from "@/app/actions";
import { IconPencil } from "@tabler/icons-react";
import { Avatar } from "@mantine/core";

const UpdateAvatar = ({
  justUpdated,
  setJustUpdated,
  userInfo,
  size = 100,
  showEmail = true,
}) => {
  const [hasMounted, setHasMounted] = useState(false);
  const { isLoading, refreshing, user } = useRefreshedUser(justUpdated);
  const handleSubmit = async (result) => {
    try {
      user?.sub &&
        (await updateAuth0User({ auth0Id: user.sub, picture: result }));
      setJustUpdated(true);
    } catch (e) {
      throw new Error(e);
    }
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || isLoading || refreshing) return null;

  return (
    <CldUploadWidget
      uploadPreset="avatar"
      multiple={false}
      options={{
        cropping: true,
        croppingAspectRatio: 1,
        singleUploadAutoClose: false,
        sources: ["local", "url", "dropbox", "google_drive", "facebook"],
      }}
      uploadParams={{
        folder: `users/${userInfo.id}`,
      }}
      onSuccess={(result) => {
        handleSubmit(result?.info?.secure_url);
      }}
    >
      {({ open }) => {
        function handleOnClick() {
          open();
        }
        return (
          <div className="h-fit px-4 pb-2">
            <div className="w-fit relative mx-auto py-2">
              <Avatar
                alt="Avatar"
                src={userInfo?.image ?? user?.picture}
                radius="100%"
                size={110}
                onClick={handleOnClick}
              />
              <button
                onClick={handleOnClick}
                className="absolute bottom-3 right-2 rounded-full w-[20%] h-[20%] bg-black flex items-center justify-center"
              >
                <IconPencil size={size / 8} color="white" />
              </button>
            </div>
            {showEmail ? (
              <p className="font-medium text-[14px] overflow-hidden">
                {`${user?.email ?? userInfo?.email}`?.substring(0, 28)}
              </p>
            ) : null}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default UpdateAvatar;
