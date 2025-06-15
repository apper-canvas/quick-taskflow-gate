import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'default', 
  color,
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    error: 'bg-error text-white',
    outline: 'bg-transparent border text-gray-600 border-gray-300'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const badgeClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const style = color ? { backgroundColor: color, color: 'white' } : {};

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={badgeClasses}
      style={style}
      {...props}
    >
      {children}
    </motion.span>
  );
};

export default Badge;