import AWS from "aws-sdk";
import nodePath from "path";

const lambda = new AWS.Lambda();

const invokeDirect =
  process.env.NODE_ENV === "production"
    ? <T extends Record<string, unknown>>({
        path,
        data,
      }: {
        path: string;
        data: T;
      }) =>
        lambda
          .invoke({
            FunctionName: `${(process.env.HOST || "")
              ?.replace(/\./g, "-")
              .replace(/^https?:\/\//, "")}_${path}`,
            InvocationType: "RequestResponse",
            Payload: JSON.stringify(data),
          })
          .promise()
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
