import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:brightness-90 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:brightness-90 focus:ring-secondary',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300',
    danger: 'bg-error text-white hover:brightness-90 focus:ring-error',
    success: 'bg-success text-white hover:brightness-90 focus:ring-success'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon name={icon} className={`w-${iconSize/4} h-${iconSize/4} ${children ? 'mr-2' : ''}`} />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon name={icon} className={`w-${iconSize/4} h-${iconSize/4} ${children ? 'ml-2' : ''}`} />
      )}
    </motion.button>
  );
};

export default Button;