import React, { useState, useRef, useEffect } from "react";
import styles from "./FileTypeSelector.module.scss";

export interface FileTypeOption {
  value: string;
  label: string;
}

interface FileTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options?: FileTypeOption[];
  className?: string;
}

const DEFAULT_OPTIONS: FileTypeOption[] = [
  { value: "json", label: "JSON" },
  { value: "text", label: "Text" },
  { value: "xml", label: "XML" },
  { value: "yaml", label: "YAML" },
  { value: "csv", label: "CSV" },
];

export const FileTypeSelector: React.FC<FileTypeSelectorProps> = ({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`${styles.fileTypeSelector} ${className || ""}`} ref={dropdownRef}>
      <button
        className={styles.selectorButton}
        onClick={handleToggle}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles.viewLabel}>View</span>
        <span className={styles.fileTypeLabel}>{selectedOption.label}</span>
        <span className={`${styles.dropdownIcon} ${isOpen ? styles.open : ""}`}>
          ▼
        </span>
      </button>
      
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.dropdownOption} ${option.value === value ? styles.selected : ""}`}
              onClick={() => handleOptionSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileTypeSelector;
