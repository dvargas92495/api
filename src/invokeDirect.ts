import AWS from "aws-sdk";
import nodePath from "path";

const lambda = new AWS.Lambda();

const invokeAsync =
  process.env.NODE_ENV === "production"
    ? <T extends Record<string, string>>({
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
    : <T extends Record<string, string>>({
        path,
        data,
      }: {
        path: string;
        data: T;
      }) => require(nodePath.resolve('functions', path)).handler(data);

export default invokeAsync;
