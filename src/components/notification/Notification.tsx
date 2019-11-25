import { Snackbar, IconButton } from "@material-ui/core"
import React, { useState, useEffect } from "react";
import { Close } from "@material-ui/icons";

interface NotificationProps {
  readonly message?: string;
  readonly onClose: () => void;
}

const Notification = ({ message, onClose }: NotificationProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!!message);
  }, [ message ]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={<span id="message-id">{message}</span>}
      action={[
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          className={"close"}
          onClick={handleClose}>
          <Close />
        </IconButton>,
      ]}
    />
  );
};

export { Notification };