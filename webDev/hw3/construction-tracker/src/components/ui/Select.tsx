type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export function Select({ label, className = "", children, ...props }: SelectProps) {
  return (
    <label className="block">
      {label && <div className="mb-1 text-sm text-zinc-300">{label}</div>}
      <select
        className={[
          "w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-zinc-600",
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
