import { useState, useRef, useEffect } from 'react';

export default function Dropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full bg-white rounded-2xl px-5 py-4 text-left flex items-center justify-between
          transition-all shadow-lg
          ${open ? 'ring-4 ring-tosca shadow-glow' : 'hover:shadow-glow-sm'}`}
      >
        <span className={`text-base ${value ? 'text-gray-800 font-medium' : 'text-gray-800'}`}>
          {value || label}
        </span>
        <svg
          className={`w-5 h-5 text-black transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Options */}
      {open && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
          {options.map((opt, idx) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full px-5 py-4 text-left text-black font-medium hover:bg-tosca/10 transition
                ${idx !== options.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}