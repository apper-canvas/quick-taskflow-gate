import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const SearchBar = ({ 
  onSearch, 
  placeholder = 'Search tasks...', 
  className = '',
  debounceMs = 300,
  ...props 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      onSearch?.(value);
    }, debounceMs);

    setDebounceTimer(timer);
  };

  const handleClear = () => {
    setSearchTerm('');
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    onSearch?.('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        icon="Search"
        className="pr-10"
        {...props}
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          icon="X"
          onClick={handleClear}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto"
        />
      )}
    </motion.div>
  );
};

export default SearchBar;