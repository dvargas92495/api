import clerk, { users } from "@clerk/clerk-sdk-node";
import { APIGatewayProxyHandler } from "aws-lambda";

const headers = {
  "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
};

const authenticate =
  (fcn: APIGatewayProxyHandler): APIGatewayProxyHandler =>
  (event, context, callback) => {
    const sessionToken = (
      event.headers.Authorization ||
      event.headers.authorization ||
      ""
    ).replace(/^Bearer /, "");
    if (!sessionToken) {
      return Promise.resolve({
        statusCode: 401,
        body: "No session token found",
        headers,
      });
    }
    return clerk
      .verifyToken(sessionToken)
      .then((session) => (session.sub ? users.getUser(session.sub) : undefined))
      .then((user) => {
        if (user) {
          if (!user.id)
            return Promise.resolve({
              statusCode: 401,
              body: "Invalid User",
              headers,
            });
          const response = fcn(
            {
              ...event,
              requestContext: { ...event.requestContext, authorizer: { user } },
            },
            context,
            callback
          );
          return (
            response ||
            Promise.resolve({
              statusCode: 204,
              body: "",
              headers,
            })
          );
        }
        return Promise.resolve({
          statusCode: 401,
          body: "No user found",
          headers,
        });
      })
      .catch((e) => {
        return {
          statusCode: 500,
          body: e.message,
          headers,
        };
      });
  };

export default authenticate;
