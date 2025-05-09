import React from "react";
import { generateKey } from "./utils";
import JsonView from "@uiw/react-json-view";

export const CreateIdentity: React.FC = () => {
  const [data, setData] = React.useState<any>(null);
  const handleClick = async () => {
    const output = await generateKey();

    setData(output);
  };
  return (
    <div>
      <h1>Create Identity</h1>
      <button onClick={handleClick}>Generate Key</button>

      {data && (
        <div>
          <h2>Output:</h2>
          <JsonView value={data} />
        </div>
      )}
    </div>
  );
};
