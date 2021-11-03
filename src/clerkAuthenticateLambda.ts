import clerk, { users } from "@clerk/clerk-sdk-node";
import { APIGatewayProxyHandler } from "aws-lambda";

const headers = {
  "Access-Control-Allow-Origin": process.env.HOST || "*",
};

const authenticate =
  (
    fcn: APIGatewayProxyHandler,
    options: { allowAnonymous?: true } = {}
  ): APIGatewayProxyHandler =>
  (event, context, callback) => {
    const execute = (user: unknown) => {
      const response = fcn(
        {
          ...event,
          requestContext: { ...event.requestContext, authorizer: { user } },
        },
        context,
        callback
      );
      return (
        response || {
          statusCode: 204,
          body: "",
          headers,
        }
      );
    };
    return Promise.resolve()
      .then(() => {
        const sessionToken = (
          event.headers.Authorization ||
          event.headers.authorization ||
          ""
        ).replace(/^Bearer /, "");
        if (!sessionToken) {
          return {
            statusCode: 401,
            body: "No session token found",
            headers,
          };
        }
        return clerk
          .verifyToken(sessionToken)
          .then((session) =>
            session.sub ? users.getUser(session.sub) : undefined
          )
          .then((user) => {
            if (user) {
              if (!user.id)
                return {
                  statusCode: 401,
                  body: "Invalid User",
                  headers,
                };
              return execute(user);
            }
            return {
              statusCode: 401,
              body: "No user found",
              headers,
            };
          });
      })
      .then((r) => {
        if (options.allowAnonymous && r.statusCode === 401) {
          return execute(undefined);
        }
        return r;
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
