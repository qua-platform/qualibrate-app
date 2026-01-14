import React, { useState } from "react";
import { DateFilterIcon } from "../Icons"; // eslint-disable-next-line css-modules/no-unused-class
import styles from "./DateFilter.module.scss";
import { classNames } from "../../utils/classnames";

type Props = {
  options?: string[];
  onSelect: (type: string) => void;
};
const defaultOptions = ["Today", "Last 7 days", "Last 30 days"];

const DateFilter: React.FC<Props> = ({ options = defaultOptions, onSelect }) => {
  const [showOptions, setShowOptions] = useState(false);

  const onClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    setShowOptions(!showOptions);
    e.stopPropagation();
  };

  const selectOptionHandler = (e: React.MouseEvent<HTMLDivElement>, option: string) => {
    // setSelectedOption(option);
    setShowOptions(false);
    e.stopPropagation();
    onSelect(option);
  };

  const handleOnInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.filterButton} id="dateFilterBtn" onClick={(event) => onClickHandler(event)}>
      <DateFilterIcon width={16} height={16} />
      <div className={classNames(styles.dateFilterDropdown, showOptions && styles.active)} id="dateFilterDropdown">
        {options.map((option) => (
          <div key={option} onClick={(e) => selectOptionHandler(e, option)} className={styles.dateFilterOption} data-filter={option}>
            {option}
          </div>
        ))}

        <div className={styles.dateRangeInputs}>
          <div className={styles.dateInputGroup}>
            <label>From</label>
            <input onClick={handleOnInputClick} type="date" id="dateFrom" />
          </div>

          <div className={styles.dateInputGroup}>
            <label>To</label>
            <input onClick={handleOnInputClick} type="date" id="dateTo" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DateFilter;
