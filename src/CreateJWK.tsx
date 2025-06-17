import React from "react";
import { createJWK } from "./utils";
import JsonView from "@uiw/react-json-view";

const CreateJWK: React.FC = () => {
  const [data, setData] = React.useState<any>(null);

  const handleClick = async (): Promise<void> => {
    const jwk = await createJWK();
    setData(jwk);
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
          <div>
            <h2 className="text-slate-500 pb-1">JWK:</h2>
            <JsonView shortenTextAfterLength={200} displayDataTypes={false} value={data} collapsed={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateJWK;
