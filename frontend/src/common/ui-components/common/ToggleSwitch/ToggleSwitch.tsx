import styles from "./ToggleSwitch.module.scss";

interface IToggleSwitchProps {
  activeTab: string;
  setActiveTab: (a: string) => void;
  options: { label: string; value: string }[];
}

const ToggleSwitch = ({ activeTab, setActiveTab, options }: IToggleSwitchProps) => {
  return (
    <div className={styles.switchWrapper}>
      {options.map((option) => (
        <div
          key={option.value}
          className={`${styles.switchOption} ${activeTab === option.value ? styles.active : ""}`}
          onClick={() => setActiveTab(option.value)}
        >
          {activeTab === option.value && <span className={styles.switchIndicator}></span>}
          <span className={styles.optionLabel}>{option.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ToggleSwitch;
