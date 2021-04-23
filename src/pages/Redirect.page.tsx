import React, { useEffect, useState } from "react";
import axios from "axios";

const RedirectPage = () => {
  const [authCode, setAuthCode] = useState("");

  const getSingpassToken = async (code: string) => {
    const response = await axios.post(
      "http://localhost:3002/auth/singpass/token",
      { code }
    );
    console.log(response);
  };

  const getMyInfoToken = async (code: string) => {
    const response = await axios.post(
      "http://localhost:3002/auth/myinfo/token",
      { code }
    );
    console.log(response);
  };

  useEffect(() => {
    const { search } = window.location;
    const searchParams = new URLSearchParams(search);
    const code = searchParams.get("code");
    const scope = searchParams.get("scope");
    console.log("code", code);
    if (code) {
      if (scope) {
        getMyInfoToken(code);
      } else {
        getSingpassToken(code);
      }
    }
  }, []);

  return <div>Redirect</div>;
};

export default RedirectPage;
