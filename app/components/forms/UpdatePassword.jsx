"use client";
import { useState, startTransition } from "react";
import { TextInput } from "@mantine/core";
import FooterButtons from "../FooterButtons";
import { updateAuth0User } from "@/app/actions";
import { Eye, EyeOff } from "lucide-react";
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
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
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
            {showConfirmedPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </div>
        }
      />
      <FooterButtons onClick={handleClose} />
    </form>
  );
};
export default UpdatePassword;
