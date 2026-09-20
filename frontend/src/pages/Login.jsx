import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      setLoading(true);

      await loginUser(username, password);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (loginError) {
      setError(
        loginError?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-cyan-400">
            SentinelX
          </div>

          <p className="text-slate-400 mt-2">
            Cybersecurity Threat Intelligence Platform
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">

          <h1 className="text-2xl font-semibold text-white text-center">
            Secure Login
          </h1>

          <p className="text-slate-400 text-sm text-center mt-2 mb-6">
            Sign in to access the SentinelX security console.
          </p>

          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Enter username"
                autoComplete="username"
                disabled={loading}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-600 outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter password"
                autoComplete="current-password"
                disabled={loading}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-600 outline-none transition focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Authenticating..."
                : "Sign In"}
            </button>

          </form>

          <div className="mt-6 border-t border-slate-800 pt-5">
            <p className="text-center text-xs text-slate-500">
              🔒 Authentication protected by JWT-based access control.
            </p>
          </div>

        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          SentinelX Security Operations Platform
        </p>

      </div>
    </div>
  );
}

export default Login;