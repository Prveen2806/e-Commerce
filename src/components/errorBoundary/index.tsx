import { Result } from "antd";
import { useEffect } from "react";
import { useNavigate, useRouteError } from "react-router-dom";

export type ErrorBoundaryResponse = { message: string; stack: string };
export default function ErrorBoundary() {
  const error = useRouteError() as ErrorBoundaryResponse;
  const navigate = useNavigate();
  const skip =
    error.message.includes("dynamically imported module") ||
    error.message.includes("preload");

  useEffect(() => {
    if (skip) {
      window.location.reload();
    }
  }, [error]);

  if (skip) {
    return  <div>Loading...</div>;
  }

  return (
    <Result
      status={"error"}
      title={
        location.hostname.startsWith("localhost") ||
        location.hostname.startsWith("127.0.0.1") ||
        location.hostname.startsWith("dev")
          ? error.message
          : "Try reloading the page. (OR) Contact support for more information."
      }
      extra={
        <button
          className="btn btn-primary px-5 rounded-pill text-white"
          onClick={() => navigate(0)}
        >
          Refresh
        </button>
      }
    >
      {location.hostname.includes("localhost") ? (
        <pre className="text-start ms-auto ">{error.stack}</pre>
      ) : null}
    </Result>
  );
}
