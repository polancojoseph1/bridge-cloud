export default function Button({
  children,
  className = '',
  variant = 'primary',
  disabled = false,
  ...props
}) {
  const baseStyles =
    'px-4 py-2 rounded-lg font-medium transition-colors min-h-[40px] flex items-center justify-center';

  const variants = {
    primary: 'bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-100 disabled:opacity-50',
    ghost: 'text-gray-300 hover:text-gray-100 disabled:opacity-50',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}