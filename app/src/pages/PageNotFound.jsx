import { Link } from "react-router-dom";

export function PageNotFound() {
  return (
    <div class="p-8 text-gray-500 text-center">
      <p>404 — Not Found</p>
      <Link to="/" class="block text-primary-light hover:underline mt-2">
        Go back home
      </Link>
    </div>
  );
}
