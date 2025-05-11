import React, { useEffect } from "react";
import { generateKey } from "./utils";
import JsonView from "@uiw/react-json-view";

const getBrowserName = () => {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf("Chrome") > -1) return "Chrome";
  if (userAgent.indexOf("Safari") > -1) return "Safari";
  if (userAgent.indexOf("Firefox") > -1) return "Firefox";
  if (userAgent.indexOf("Edge") > -1) return "Edge";
  if (userAgent.indexOf("IE") > -1) return "Internet Explorer";
  return "Unknown";
};

export const CreateIdentity: React.FC = () => {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [browser, setBrowser] = React.useState("");

  const handleClick = async (): Promise<void> => {
    setLoading(true);
    await generateKey()
      .then((output) => {
        setData(output);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message ?? "Unknown error");
        setLoading(false);
      });
  };

  useEffect(() => {
    const browserName = getBrowserName();
    setBrowser(browserName);
  }, []);

  return (
    <div className="mx-4 xl:mx-96 space-y-8">
      {browser && !["Firefox", "Safari"].includes(browser) ? (
        <div
          className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-5"
          role="alert"
        >
          <p className="font-bold">Unsupported Browser</p>
          <p>
            Try switching Browser to <b>Firefox</b> or <b>Safari</b> for this to
            work.
          </p>
        </div>
      ) : null}

      <h1 className="text-2xl mb-10">Create Identity</h1>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        disabled={loading}
        onClick={handleClick}
      >
        {loading ? "Loading..." : "Generate Keys"}
      </button>

      {error && <div>Error: {error}</div>}

      {data && (
        <>
          <div>
            <h2 className="text-slate-500 pb-1">Payload to create Identity:</h2>
            <JsonView
              displayDataTypes={false}
              value={data.CreateIdentityPayload}
            />
          </div>

          <hr />

          <div>
            <h2 className="text-slate-500 pb-1">Txn Response:</h2>
            <JsonView displayDataTypes={false} value={data} />
          </div>
        </>
      )}
    </div>
  );
};
