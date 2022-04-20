import { Lambda } from "@aws-sdk/client-lambda";
import nodePath from "path";

const invokeDirect =
  process.env.NODE_ENV === "production"
    ? <T extends Record<string, unknown>>({
        path,
        data,
      }: {
        path: string;
        data: T;
      }) =>
        new Lambda({ region: process.env.AWS_REGION })
          .invoke({
            FunctionName: `${(process.env.ORIGIN || "")
              ?.replace(/\./g, "-")
              .replace(/^https?:\/\//, "")}_${path}`,
            InvocationType: "RequestResponse",
            Payload: Buffer.from(JSON.stringify(data)),
          })
          .then(() => true)
    : <T extends Record<string, unknown>>({
        path,
        data,
      }: {
        path: string;
        data: T;
      }) =>
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require(nodePath.resolve("build", `${path}.js`)).handler(data);

export default invokeDirect;
