import React, { useState } from "react";
import { SortIcon } from "../Icons";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./SortButton.module.scss";
import { classNames } from "../../utils/classnames";

type Props = {
  options?: string[];
  onSelect: (type: string) => void;
};

const defaultOptions = ["Date (Newest first)", "Name (A-Z)", "Result (Success First)"];

const SortButton: React.FC<Props> = ({ options = defaultOptions, onSelect }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(options[0]);

  const onClickHandler = () => {
    setShowOptions(!showOptions);
  };

  const selectOptionHandler = (option: string) => {
    setSelectedOption(option);
    setShowOptions(false);
    onSelect(option);
  };
  return (
    <div className={styles.filterButton} id="dateFilterBtn" onClick={onClickHandler}>
      <SortIcon width={16} height={16} />
      <div className={classNames(styles.sortDropdown, showOptions && styles.active)} id="dateFilterDropdown">
        {options.map((option) => (
          <div
            key={option}
            onClick={() => selectOptionHandler(option)}
            className={classNames(styles.sortOption, selectedOption === option && styles.selected)}
            data-filter={option}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};
export default SortButton;
