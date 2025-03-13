import React from "react";
import SidebarMenu from "../../modules/SidebarMenu/SidebarMenu";
import { classNames } from "../../utils/classnames";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./styles/Layout.module.scss";
import ToastComponent from "../../modules/toastModule/ToastComponent";
import QUAlibrateLogoIcon from "../Icons/QUAlibrateLogoIcon";
import { useGlobalThemeContext } from "../../modules/themeModule/GlobalThemeContext";
import TitleBarMenu from "../../modules/TopbarMenu/TitleBarMenu";
import { NodesContextProvider } from "../../modules/Nodes/context/NodesContext";

const EmptyPlaceholder = (
  <div className={styles.emptyPlaceholder}>
    <QUAlibrateLogoIcon height={200} width={400} />
  </div>
);

interface Props {
  className?: string;
  children?: React.JSX.Element;
}

const MainLayout = ({ className, children }: Props) => {
  const { pinSideMenu } = useGlobalThemeContext();
  return (
    <div className={styles.wrapper}>
      <SidebarMenu />
      <div className={classNames(styles.content, pinSideMenu && styles.addLeftMargin, className)}>
        <NodesContextProvider>
          <TitleBarMenu />
          {children ?? EmptyPlaceholder}
        </NodesContextProvider>
      </div>
      <ToastComponent />
    </div>
  );
};

export default MainLayout;
