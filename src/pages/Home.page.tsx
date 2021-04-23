import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

interface Env {
  clientId: string;
  redirectUrl: string;
  authApiUrl: string;
  attributes: string;
}

// randomly generated state
const state = "123";
const purpose = "test myinfo api";

const HomePage = () => {
  const [env, setEnv] = useState<Env>();
  const [singpassAuthUrl, setSingpassAuthUrl] = useState("");

  const authParamsSupplier = async () => {
    return { state: "randomState", nonce: "randomNonce" };
  };

  const onError = (errorId: string, message: string) => {
    console.log(`errorId: ${errorId}: ${message}`);
  };

  const handleOnLoad = useCallback(() => {
    const response = (window as any).NDI.initAuthSession(
      "ndi-qr",
      {
        clientId: "STG2-MYINFO-SELF-TEST",
        redirectUri: "http://localhost:3003/callback",
        scope: "openid",
        responseType: "code",
      },
      authParamsSupplier,
      onError
    );
    console.log(response);
  }, []);

  const getSingpassQR = useCallback(() => {
    const script = document.createElement("script");
    script.src = "https://stg-id.singpass.gov.sg/static/ndi_embedded_auth.js";
    script.onload = () => handleOnLoad();
    script.async = true;
    document.body.appendChild(script);
  }, [handleOnLoad]);

  const getEnv = async () => {
    const { data } = await axios.get(
      "http://localhost:3002/auth/getEnv/myinfo"
    );
    setEnv(data);
    console.log(data);
  };

  const getSingpassAuthUrl = async () => {
    const {
      data: { authorisationUrl },
    } = await axios.get("http://localhost:3002/auth/singpass");
    setSingpassAuthUrl(authorisationUrl);
  };

  const callServerAPIs = async () => {
    const authCode = new URLSearchParams(window.location.search).get("code");
    const data = await axios.post("http://localhost:3002/auth/getPersonData", {
      code: authCode,
    });
    console.log("person data", data);
  };

  const handleOnClick = () => {
    if (env) {
      const { authApiUrl, clientId, attributes, redirectUrl } = env;
      const authoriseUrl = `${authApiUrl}?client_id=${clientId}&attributes=${attributes}&purpose=${purpose}&state=${encodeURIComponent(
        state
      )}&redirect_uri=${redirectUrl}`;
      window.location.href = authoriseUrl;
    }
  };

  const handleLoginSingpassOnClick = async () => {
    fetch("http://localhost:3002/auth/singpass", {
      method: "GET",
    })
      .then((response) => {
        // HTTP 301 response
        if (response.redirected) {
          window.location.href = response.url;
        }
        console.log(response);
      })
      .catch(function (err) {
        console.info(err);
      });
    // window.location.href = singpassAuthUrl;
  };

  const handleMockMyInfoOnClick = async () => {
    const response = await axios.get("http://localhost:3002/auth/myinfo");
    const { clientId, redirectUrl, authApiUrl, attributes } = response.data;
    const authoriseUrl = `${authApiUrl}?client_id=${clientId}&attributes=${attributes}&purpose=${purpose}&state=${encodeURIComponent(
      state
    )}&redirect_uri=${redirectUrl}`;
    window.location.href = authoriseUrl;
    console.log(response.data);
  };

  useEffect(() => {
    if (
      window.location.href.includes("callback?") &&
      window.location.href.includes("code")
    ) {
      callServerAPIs();
    } else {
      getSingpassQR();
      getEnv();
      // getSingpassAuthUrl();
    }
  }, [getSingpassQR]);

  return (
    <div className="App">
      <div className="container">
        <h1>MyInfo Demo</h1>
        <p>
          To start the SingPass login and consent process, click on the
          "Retrieve MyInfo" button below.
        </p>
        <button onClick={handleOnClick}>RETRIEVE MYINFO</button>
        <hr />
        {/* <div id="ndi-qr"></div> */}
        <button onClick={handleLoginSingpassOnClick}>
          Login with Mock Singpass
        </button>
        <button onClick={handleMockMyInfoOnClick}>Mock MyInfo</button>
      </div>
    </div>
  );
};

export default HomePage;
