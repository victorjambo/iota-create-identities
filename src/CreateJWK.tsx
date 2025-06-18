import React from "react";
import { createJWK } from "./utils";
import JsonView from "@uiw/react-json-view";

const CreateJWK: React.FC = () => {
  const [data, setData] = React.useState<any>(null);

  const handleClick = async (): Promise<void> => {
    const jwk = await createJWK();
    setData({
      verMethodKeyPair: {
        privateKey: jwk.privateKeyVerificationMethodRaw,
        publicKey: jwk.publicKeyVerificationMethodRaw,
      },
      jwk: {
        publicKey: jwk.publicKeyJwk,
        privateKey: jwk.privateKeyJwk,
      },
    });
  };

  return (
    <div className="mx-auto container mt-10 w-full">
      <div className="mx-4 xl:mx-96 space-y-8">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={handleClick}
        >
          Create JWK
        </button>

        {data && (
          <>
            <div>
              <h2 className="text-slate-500 pb-1">JWK:</h2>
              <JsonView
                shortenTextAfterLength={200}
                displayDataTypes={false}
                value={data}
              />
            </div>
            <hr />
            <a
              href="https://iotaledger.github.io/ebsi-stardust-components/public/encode_identity.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              IOTA CLI tool to encode identity
            </a>
            <p className="text-slate-500 pt-2 italic text-xs">
              Use the above tool to encode the JWK. Copy Paste the jwk.publicKey into the the tool
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateJWK;
