type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "w-full rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";

  const styles =
    variant === "primary"
      ? "bg-zinc-100 text-zinc-900 hover:bg-white"
      : "border border-zinc-800 text-zinc-100 hover:bg-zinc-900";

  return <button className={[base, styles, className].join(" ")} {...props} />;
}
