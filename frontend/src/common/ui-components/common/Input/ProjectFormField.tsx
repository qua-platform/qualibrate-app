import React, { useState } from "react";
import InputField from "./InputField";
import styles from "../../../../modules/Project/CreateNewProjectForm/CreateNewProjectForm.module.scss";
import { classNames } from "../../../../utils/classnames";

interface Props {
  hasOpenFileDialogButton?: boolean;
  id: string;
  label: string;
  placeholder: string;
  value?: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
}

const ProjectFormField: React.FC<Props> = ({
  hasOpenFileDialogButton = false,
  id,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
}) => {
  const [folderPath, setFolderPath] = useState<string | null>(null);

  const handleButtonClick = async () => {
    if (window.electronAPI) {
      try {
        const result = await window.electronAPI.openFolderDialog();
        if (result && !result.canceled) {
          const absolutePath = result.filePaths[0];
          setFolderPath(absolutePath);
          onChange(absolutePath);
        }
      } catch (error) {
        console.error("Error opening folder dialog:", error);
      }
    } else {
      alert("Electron API not available");
    }
  };

  const handleInputChange = (value: string) => {
    onChange(value);
    if (value && value !== folderPath) {
      setFolderPath(null);
    }
  };

  return (
    <>
      <label htmlFor={id} className={error ? styles.error : undefined}>
        {label}
      </label>
      <div>
        <div className={classNames(hasOpenFileDialogButton && styles.openFileDialogWrapper)}>
          <InputField id={id} type={type} placeholder={placeholder} value={value} onChange={handleInputChange} error={error} />
          {hasOpenFileDialogButton && (
            <div className="p-4">
              <button type="button" onClick={handleButtonClick} className={styles.openFileDialogButton}>
                Choose folder
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectFormField;
