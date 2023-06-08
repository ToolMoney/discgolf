import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Get Lost!</h1>
      <p>Oh wait, looks like you already did...</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}