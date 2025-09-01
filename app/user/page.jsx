"use client";
import { useEffect, useState, useContext } from "react";
import { useUserInfo } from "../hooks/useUserInfo";
import { useRefreshedUser } from "../hooks/useRefreshedUser";
import { ModalContext } from "../providers";
import {
  Header,
  UpdateAvatar,
  UpdateEmail,
  UpdatePassword,
} from "@/app/components";
import { Button, ButtonGroup } from "@mantine/core";

export default function Page() {
  const [justUpdated, setJustUpdated] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { user, isLoading, refreshing } = useRefreshedUser(justUpdated);
  const { userInfo } = useUserInfo();
  const { setCurrentModal, open, close } = useContext(ModalContext);

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
      size: "lg",
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
      size: "lg",
      title: "Update password",
    });
    open();
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || isLoading || refreshing) return null;

  return (
    <>
      <Header />
      <h1 className="font-bold text-4xl mt-8 mb-6">Account</h1>
      <UpdateAvatar
        size={160}
        justUpdated={justUpdated}
        setJustUpdated={setJustUpdated}
        userInfo={userInfo}
        showEmail={false}
      />

      <h2 className="font-semibold text-xl mt-3">Email</h2>
      <div className="flex gap-x-2 flex-wrap">
        {user?.email ?? userInfo?.email}{" "}
        <span className="font-light invisible xs:visible">|</span>
        <a
          href="/api/auth/logout"
          className="text-primary-600 hover:text-primary-700 active:text-primary-800 font-medium"
        >
          Log out
        </a>
      </div>
      <ButtonGroup className="gap-x-2 gap-y-3 mt-5 max-sm:flex-wrap">
        <Button color="black" fullWidth onClick={handleUpdateEmail}>
          Update email
        </Button>
        <Button color="black" fullWidth onClick={handleUpdatePassword}>
          Update password
        </Button>
      </ButtonGroup>
    </>
  );
}
