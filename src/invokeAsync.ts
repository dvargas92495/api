import AWS from "aws-sdk";
import axios from "axios";

const invokeAsync =
  process.env.NODE_ENV === "production"
    ? <T extends Record<string, unknown>>({
        path,
        data,
      }: {
        path: string;
        data: T;
      }) =>
        new AWS.Lambda({ region: process.env.AWS_REGION })
          .invoke({
            FunctionName: `${(process.env.ORIGIN || "")
              ?.replace(/\./g, "-")
              .replace(/^https?:\/\//, "")}_${path}`,
            InvocationType: "Event",
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
      }) => axios.post(`${process.env.API_URL}/${path}`, data).then(() => true);

export default invokeAsync;
