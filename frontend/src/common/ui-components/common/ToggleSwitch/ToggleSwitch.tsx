import React from "react";
import styles from "./ToggleSwitch.module.scss";
import FileTypeSelector from "../FileTypeSelector/FileTypeSelector";

interface IToggleSwitchProps {
  title: string;
  activeTab: string;
  setActiveTab: (a: string) => void;
  fileType?: string;
  onFileTypeChange?: (fileType: string) => void;
  showFileTypeSelector?: boolean;
}

const ToggleSwitch = ({ 
  title, 
  activeTab, 
  setActiveTab, 
  fileType = "json",
  onFileTypeChange,
  showFileTypeSelector = true
}: IToggleSwitchProps) => {
  return (
    <div className={styles.firstRowWrapper}>
      <h1>{title}</h1>
      <div className={styles.controlsWrapper}>
        {showFileTypeSelector && onFileTypeChange && (
          <FileTypeSelector
            value={fileType}
            onChange={onFileTypeChange}
          />
        )}
        <div className={styles.switchWrapper}>
          <div className={`${styles.switchOption} ${activeTab === "live" ? styles.selected : ""}`} onClick={() => setActiveTab("live")}>
            Live
          </div>
          <div className={`${styles.switchOption} ${activeTab === "final" ? styles.selected : ""}`} onClick={() => setActiveTab("final")}>
            Final
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToggleSwitch;
