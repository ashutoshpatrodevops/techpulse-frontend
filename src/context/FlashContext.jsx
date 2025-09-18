import React, { createContext, useContext, useState, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const FlashContext = createContext();

export const FlashProvider = ({ children }) => {
  const [flash, setFlash] = useState({ message: "", severity: "info" });
  const [open, setOpen] = useState(false);

  const showFlash = useCallback((message, severity = "info") => {
    setFlash({ message, severity });
    setOpen(true);
  }, []);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <FlashContext.Provider value={{ showFlash }}>
      {children}

      {/* Snackbar UI */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity={flash.severity} sx={{ width: "100%" }}>
          {flash.message}
        </Alert>
      </Snackbar>
    </FlashContext.Provider>
  );
};

export const useFlash = () => useContext(FlashContext);
