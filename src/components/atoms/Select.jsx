import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Select = forwardRef(({ 
  label, 
  error, 
  options = [], 
  placeholder = 'Select option',
  className = '',
  ...props 
}, ref) => {
  const selectClasses = `
    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary 
    transition-all appearance-none bg-white pr-10
    ${error ? 'border-error focus:ring-error' : 'border-gray-300 focus:border-primary'}
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;