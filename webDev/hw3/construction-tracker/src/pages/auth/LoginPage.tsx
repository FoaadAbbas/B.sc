import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../app/auth/AuthProvider";

export function LoginPage() {
  const nav = useNavigate();

  const { login } = useAuth();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);

  const emailError =
    touched && !email.includes("@") ? "Enter a valid email." : "";
  const passError =
    touched && password.length < 6
      ? "Password must be at least 6 characters."
      : "";

  const canSubmit = email.includes("@") && password.length >= 6;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;

    login(email);
    nav(from, { replace: true });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Email"
        placeholder="name@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={emailError}
        autoComplete="email"
      />
      <Input
        label="Password"
        placeholder="••••••••"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={passError}
        autoComplete="current-password"
      />

      <Button type="submit" disabled={!canSubmit}>
        Log in
      </Button>

      <div className="text-xs text-zinc-400 flex justify-between">
        <button
          type="button"
          className="hover:text-zinc-200"
          onClick={() => alert("Later: forgot password flow")}
        >
          Forgot password?
        </button>

        <Link to="/register" className="hover:text-zinc-200">
          Create account
        </Link>
      </div>
    </form>
  );
}
