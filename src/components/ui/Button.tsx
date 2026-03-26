import React from 'react';

// 1. Define the custom props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

// 2. Use React.FC (Functional Component) with your Props
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  
  const baseStyles = "font-header text-sm  lg:text-lg text-center my-3 px-6 py-2.5 rounded-full font-bold transition-all active:scale-95 cursor-pointer";
  
  const variantStyles = variant === 'primary' 
    ? 'bg-secondary text-primary hover:bg-secondary/90 shadow-md' 
    : 'bg-primary text-secondary border border-secondary/20 hover:bg-secondary/5';

  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};