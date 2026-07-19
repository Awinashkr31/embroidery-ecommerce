import React, { useState } from 'react';

const FloatingInput = ({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  required = false, 
  name,
  className = "",
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || (value && value.toString().length > 0);

  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full px-4 pt-5 pb-2 bg-[#F8F5F2] border border-stone-100 rounded-[12px] focus:border-rose-900 focus:ring-4 focus:ring-rose-900/10 outline-none text-[14px] transition-all peer`}
        {...props}
      />
      <label
        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
          isActive 
            ? 'top-1.5 text-[10px] font-bold text-stone-500 uppercase tracking-wider' 
            : 'top-3.5 text-[14px] font-medium text-stone-400'
        }`}
      >
        {label} {required && '*'}
      </label>
    </div>
  );
};

export default FloatingInput;
