import React from "react";
import { useSelector } from "react-redux";
import {
  MessageHeader,
  MessageContent,
  Message,
  Icon,
} from "semantic-ui-react";

const Notification = () => {
  const notification = useSelector((state) => state.notification);
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
  };
  if (notification === "") {
    return <div></div>;
  }
  return (
    <Message icon>
      <Icon name="info" />
      <MessageContent>{notification}</MessageContent>
    </Message>
  );
};

export default Notification;
