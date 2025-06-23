import { useContext, useState } from "react";
import { Avatar, Menu } from "@mantine/core";
import { useUserInfo } from "@/app/hooks/useUserInfo";
import { useRefreshedUser } from "@/app/hooks/useRefreshedUser";
import { DeviceContext } from "../../providers";
import UpdateEmail from "../forms/UpdateEmail";
import UpdatePassword from "../forms/UpdatePassword";
import UpdateAvatar from "../forms/UpdateAvatar";
import { Lock, LogOut, Mail } from "lucide-react";

const AvatarMenu = ({ size = 44 }) => {
  const { userInfo } = useUserInfo();
  const [justUpdated, setJustUpdated] = useState(false);

  const { user } = useRefreshedUser(justUpdated);
  const { setCurrentModal, open, close } = useContext(DeviceContext);

  const handleUpdateEmail = () => {
    setCurrentModal({
      component: (
        <UpdateEmail
          close={close}
          user={user}
          userInfo={userInfo}
          setJustUpdated={setJustUpdated}
        />
      ),
      size: "md",
      title: "Update email",
    });
    open();
  };

  const handleUpdatePassword = () => {
    setCurrentModal({
      component: (
        <UpdatePassword
          close={close}
          user={user}
          userInfo={userInfo}
          setJustUpdated={setJustUpdated}
        />
      ),
      size: "md",
      title: "Update password",
    });
    open();
  };

  return (
    <>
      <Menu
        width={240}
        arrowSize={16}
        withArrow
        classNames={{
          dropdown: "!bg-white !shadow",
          item: "hover:bg-primary-300 !text-[14px]",
          itemSection: "!w-5 !p-0",
        }}
      >
        <Menu.Target>
          <Avatar
            src={userInfo?.image ?? user?.picture}
            radius="100%"
            color="blue.6"
            size={size}
            alt="Avatar"
            className="hover:brightness-90"
          />
        </Menu.Target>
        <Menu.Dropdown>
          <UpdateAvatar
            userInfo={userInfo}
            justUpdated={justUpdated}
            setJustUpdated={setJustUpdated}
          />

          <Menu.Divider />
          <Menu.Item
            leftSection={<Mail size={16} />}
            onClick={handleUpdateEmail}
          >
            Update email
          </Menu.Item>
          <Menu.Item
            leftSection={<Lock className="relative top-[-2px]" size={19} />}
            onClick={handleUpdatePassword}
          >
            Update password
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            leftSection={<LogOut className="relative left-[1px]" size={18} />}
            component="a"
            href="/api/auth/logout"
          >
            Log out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default AvatarMenu;
