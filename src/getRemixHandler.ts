import { createRequestHandler } from "remix-lambda-at-edge";
// import sendEmail from "aws-sdk-plus/dist/sendEmail";

const getRemixHandler = ({
  originPaths = [],
}: { originPaths?: RegExp[] } = {}) =>
  createRequestHandler({
    // this looks really bad but is actually okay. Current project standards guarantee this file and build file's location
    // and we need a hardcoded file path for esbuild to be able to do it's bundling
    getBuild: () => require("../../../server/build"),
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
