import { useContext } from "react";
import AlertContext from "../context/AlertProvider";

const useAlert = () => {
  const { alert } = useContext(AlertContext);
  return useContext(AlertContext);
};

export default useAlert;
