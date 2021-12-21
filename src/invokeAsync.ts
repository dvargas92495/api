import AWS from "aws-sdk";
import axios from "axios";

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
            InvocationType: "Event",
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
      }) => axios.post(`${process.env.API_URL}/${path}`, data).then(() => true);

export default invokeAsync;
