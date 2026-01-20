type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      {label && (
        <div className="mb-1 text-sm text-zinc-300">
          {label}
        </div>
      )}
      <input
        className={[
          "w-full rounded-xl bg-zinc-900 border px-3 py-2 text-sm outline-none",
          error ? "border-red-500" : "border-zinc-800 focus:border-zinc-600",
          className,
        ].join(" ")}
        {...props}
      />
      {error && <div className="mt-1 text-xs text-red-400">{error}</div>}
    </label>
  );
}
