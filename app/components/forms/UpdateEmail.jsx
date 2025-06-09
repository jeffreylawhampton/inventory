"use client";
import { useState, startTransition } from "react";
import { TextInput } from "@mantine/core";
import FooterButtons from "../FooterButtons";
import { updateAuth0User } from "@/app/actions";
import { useRefreshedUser } from "@/app/hooks/useRefreshedUser";
import { IconMail } from "@tabler/icons-react";
import { inputStyles } from "@/app/lib/styles";

const UpdateEmail = ({ close, user, userInfo, setJustUpdated }) => {
  const [email, setEmail] = useState(user?.email ?? userInfo?.email ?? "");
  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateRequired = () => {
    if (!email.trim()) {
      setFormError(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setErrorMessage("You forgot something.");

    startTransition(async () => {
      try {
        const result = await updateAuth0User({
          auth0Id: user.sub,
          email,
          name: user?.name === user?.email ? email : user?.name,
        });

        setJustUpdated(true);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Something went wrong"
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage ? (
        <p className="font-medium mb-2 text-danger-600">{errorMessage}</p>
      ) : null}
      <TextInput
        placeholder="New email"
        size={inputStyles.size}
        radius={inputStyles.radius}
        name="email"
        value={email}
        error={formError}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
        onFocus={() => setFormError(false)}
        onBlur={() => validateRequired()}
        aria-label="Search"
        className={`pb-3 w-full`}
        classNames={{
          label: inputStyles.labelClasses,
          input: formError ? "!bg-danger-100/40" : "textinput",
        }}
      />
      <FooterButtons onClick={close} />
    </form>
  );
};
export default UpdateEmail;
