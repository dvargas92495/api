import type { AxiosError } from "axios";

const formatError = (e: Error | AxiosError): string => {
  if ((e as AxiosError).isAxiosError) {
    const err = e as AxiosError;
    return typeof err.response?.data === "string"
      ? err.response?.data
      : typeof err.response?.data?.message === "string"
      ? err.response?.data?.message
      : typeof err.response?.data === "object"
      ? JSON.stringify(err.response?.data)
      : err.message;
  }
  return e.message;
};

export default formatError;
