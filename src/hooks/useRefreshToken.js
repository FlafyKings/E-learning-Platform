import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);
      console.log("--------ROLES-------", response.data.roles);
      return {
        ...prev,
        roles: response.data.roles,
        accessToken: response.data.accessToken,
        login: response.data.login,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
