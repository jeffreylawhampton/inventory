import { notifications } from "@mantine/notifications";
import { X, Check } from "lucide-react";

const Notification = ({
  type,
  headline,
  message,
  autoClose = 1500,
  withCloseButton = true,
  radius = "xl",
  position = "top-right",
}) => {
  let title = headline;
  let icon;
  let color;

  switch (type) {
    case "Success": {
      title = "Success";
      icon = <Check />;
      color = "success.3";
    }
    case "Error": {
      (title = "Something went wrong"), (icon = <X />), (color = "danger.3");
    }
  }
  return notifications.show({
    position,
    withCloseButton,
    autoClose,
    title,
    message,
    color,
    icon,
    // className: "my-notification-class",
    loading: false,
  });
};

export default Notification;
