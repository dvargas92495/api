# Vargas Arts API Utility Methods

This package is a library of helper methods exposing common functionality used by the backends of Vargas Arts applications. Methods will live in this library before migrating to a proper library for wider use. It also includes vital backend libraries the Vargas Arts applications use, such as:
- `@clerk/clerk-sdk-node`
- `aws-sdk-plus`

If you are interested in using any of these methods and know of a better home, please open up an issue on this repo.

## clerkAuthenticateLambda

Authenticates a user with [Clerk](https://clerk.dev) authentication within the context of an AWS Lambda.
    