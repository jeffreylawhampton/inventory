"use client";
import { useState, startTransition } from "react";
import { Checkbox, TextInput, CheckboxProps } from "@mantine/core";
import FooterButtons from "../FooterButtons";
import { updateAuth0User } from "@/app/actions";

import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { inputStyles } from "@/app/lib/styles";

const UpdatePassword = ({ close, user, setJustUpdated }) => {
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    setPassword("");
    setConfirmedPassword("");
    setFormError(false);
    close();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmedPassword || password != confirmedPassword) {
      setFormError(true);
      return setErrorMessage("Passwords don't match");
    }

    startTransition(async () => {
      try {
        const result = await updateAuth0User({
          auth0Id: user.sub,
          password,
        });
        setPassword("");
        setConfirmedPassword("");
        setJustUpdated(true);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {errorMessage ? (
        <p className="font-medium mb-2 text-danger-600">{errorMessage}</p>
      ) : null}
      <TextInput
        type={showPassword ? "text" : "password"}
        placeholder="New password"
        size={inputStyles.size}
        radius={inputStyles.radius}
        name="password"
        value={password}
        error={formError}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
        onFocus={() => setFormError(false)}
        aria-label="Password"
        className={`pb-3 w-full`}
        classNames={{
          label: inputStyles.labelClasses,
          input: formError ? "!bg-danger-100/40" : "textinput",
        }}
        leftSection={
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <IconEye size={20} /> : <IconEyeOff size={20} />}
          </div>
        }
      />
      <TextInput
        type={showConfirmedPassword ? "text" : "password"}
        placeholder="Confirm password"
        size={inputStyles.size}
        radius={inputStyles.radius}
        name="confirmpassword"
        value={confirmedPassword}
        error={formError}
        onChange={(e) => setConfirmedPassword(e.target.value)}
        autoFocus
        onFocus={() => setFormError(false)}
        aria-label="Confirm password"
        className={`pb-3 w-full`}
        classNames={{
          label: inputStyles.labelClasses,
          input: formError ? "!bg-danger-100/40" : "textinput",
        }}
        leftSection={
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowConfirmedPassword(!showConfirmedPassword)}
            aria-label={
              showConfirmedPassword ? "Hide password" : "Show password"
            }
          >
            {showConfirmedPassword ? (
              <IconEye size={20} />
            ) : (
              <IconEyeOff size={20} />
            )}
          </div>
        }
      />

      {/* <TextInput
        type={checked ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New password"
        error={formError}
        // variant="filled"
        autoFocus
        className={{ input: formError ? "!bg-danger-100" : "" }}
      />
      <TextInput
        type={checked ? "text" : "password"}
        value={confirmedPassword}
        onChange={(e) => setConfirmedPassword(e.target.value)}
        placeholder="Confirm password"
        variant={inputStyles.variant}
        error={formError}
        classNames={{
          label: inputStyles.labelClasses,
          input: `text-input ${formError ? "!bg-danger-100" : ""}`,
        }}
        onFocus={() => setFormError(false)}
      /> */}

      {/* <div
        onClick={() => setChecked(!checked)}
        className="flex gap-1 items-center cursor-pointer"
        role="button"
      >
        {checked ? <IconEyeOff size={18} /> : <IconEye size={18} />}
        {checked ? "Hide" : "Show"} password
      </div> */}

      <FooterButtons onClick={handleClose} />
    </form>
  );
};
export default UpdatePassword;
