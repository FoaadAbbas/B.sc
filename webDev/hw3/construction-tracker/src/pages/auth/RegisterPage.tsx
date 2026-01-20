import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export function RegisterPage() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [touched, setTouched] = useState(false);

  const nameError = touched && name.trim().length < 2 ? "Enter your name." : "";
  const emailError = touched && !email.includes("@") ? "Enter a valid email." : "";
  const passError =
    touched && password.length < 6 ? "Password must be at least 6 characters." : "";

  const canSubmit =
    name.trim().length >= 2 && email.includes("@") && password.length >= 6;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;

    // TODO: replace with real register later
    nav("/");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Full name"
        placeholder="Michael Billan"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={nameError}
        autoComplete="name"
      />

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
        placeholder="Minimum 6 characters"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={passError}
        autoComplete="new-password"
      />

      <Button type="submit" disabled={!canSubmit}>
        Create account
      </Button>

      <div className="text-xs text-zinc-400">
        Already have an account?{" "}
        <Link to="/login" className="hover:text-zinc-200">
          Log in
        </Link>
      </div>
    </form>
  );
}
