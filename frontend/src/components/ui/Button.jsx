export default function Button({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const baseClasses = "font-inter font-semibold text-lg md:text-xl px-6 py-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg text-center";

  const variants = {
    primary: "bg-blue-400 border-2 border-blue-400 text-neutral-100 hover:bg-blue-500",
    secondary: "border-2 border-blue-400 text-black hover:bg-blue-50",
    submit: "w-full bg-blue-400 text-neutral-100 font-poppins font-bold text-lg rounded-lg py-4 hover:bg-blue-500"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
