import { createRequestHandler } from "remix-lambda-at-edge";
import { appPath } from "fuegojs/dist/common";
// import sendEmail from "aws-sdk-plus/dist/sendEmail";

const getRemixHandler = ({
  originPaths = [],
}: { originPaths?: RegExp[] } = {}) =>
  createRequestHandler({
    getBuild: () => require(appPath("build")),
    originPaths: [
      "favicon.ico",
      /^\/build\/.*/,
      /^\/images\/.*/,
      /^\/svgs\/.*/,
      ...originPaths,
    ],
    onError: (e) => console.log("Send email to me", e),
    /*sendEmail({
      to: "support@constancy.fund",
      subject: "Remix Origin Error",
      body: e.message,
    }),*/
  });

export default getRemixHandler;
