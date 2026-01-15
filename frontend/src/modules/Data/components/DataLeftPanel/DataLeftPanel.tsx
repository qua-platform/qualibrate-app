import React, { useEffect, useState } from "react";
import styles from "./DataLeftPanel.module.scss";
import { AppliedFilterLabel, DateFilter, SearchField, SortButton } from "../../../../components";
import { SnapshotsTimeline } from "../SnapshotsTimeline/SnapshotsTimeline";
import PaginationWrapper from "../Pagination/PaginationWrapper";

const DataLeftPanel: React.FC = () => {
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | undefined>(undefined);
  const [searchText, setSearchText] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  useEffect(() => {
    // TODO call API for snapshot search
  }, [searchText, setSearchText]);

  const handleOnDateFilterSelect = (dateFilterType?: string) => {
    setSelectedDateFilter(dateFilterType);
    // TODO fetchSnapshots with sortType
  };

  const handleOnDateFilterRemove = (filterName?: string) => {
    setSelectedDateFilter(undefined);
    if (filterName === "From") {
      setFromDate("");
    } else if (filterName === "To") {
      setToDate("");
    }
  };

  const handleOnSortSelect = (sortType: string) => {
    // TODO fetchSnapshots with sortType
  };

  return (
    <div className={styles.dataWrapper}>
      <div className={styles.data}>
        <div className={styles.headerPanel}>
          <h2>Execution History</h2>
          <div className={styles.searchFilterContainer}>
            <SearchField placeholder="Search executions..." value={searchText} onChange={setSearchText} debounceMs={500} />
            <DateFilter from={fromDate} to={toDate} setFrom={setFromDate} setTo={setToDate} onSelect={handleOnDateFilterSelect} />
            <SortButton key={"sortFilter"} onSelect={handleOnSortSelect} />
          </div>
          <div className={styles.searchFilterContainer}>
            {selectedDateFilter && <AppliedFilterLabel value={selectedDateFilter} onRemove={handleOnDateFilterRemove} label={"Date"} />}
            {fromDate && <AppliedFilterLabel value={fromDate} onRemove={() => handleOnDateFilterRemove("From")} label={"From"} />}
            {toDate && <AppliedFilterLabel value={toDate} onRemove={() => handleOnDateFilterRemove("To")} label={"To"} />}
          </div>
        </div>
        <div className={styles.snapshotsWrapper}>
          <SnapshotsTimeline />
        </div>
        <PaginationWrapper />
      </div>
    </div>
  );
};
export default DataLeftPanel;
