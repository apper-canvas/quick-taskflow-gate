import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ 
  checked = false, 
  onChange, 
  label, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const checkboxClasses = `
    relative w-5 h-5 border-2 rounded cursor-pointer transition-all
    ${checked 
      ? 'bg-primary border-primary' 
      : 'bg-white border-gray-300 hover:border-primary'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <label className="inline-flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div className={checkboxClasses}>
          <AnimatePresence>
            {checked && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <ApperIcon name="Check" className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {label && (
        <span className={`ml-2 text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;