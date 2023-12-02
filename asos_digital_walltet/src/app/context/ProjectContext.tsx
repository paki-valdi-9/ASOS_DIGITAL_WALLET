import React, { useState, useMemo } from "react";

import { IUserCard, Props } from "./ProjectContext.interface";
import { Provider } from "react-redux";

export const ProjectsContext = React.createContext({});

export const ProjectsContextWrapper = ({ children }: Props): JSX.Element => {
  const [userFirstCard, setUserFirstCard] = useState<IUserCard | undefined>(
    undefined
  );
  const [userSecondCard, setUserSecondCard] = useState<IUserCard | undefined>(
    undefined
  );

  const actions = useMemo(
    () => ({
      setUserFirstCard: (card: any) => {
        setUserFirstCard(card);
      },
      clearUserFirstCard: () => setUserFirstCard(undefined),
      setUserSecondCard: (card: any) => {
        setUserSecondCard(card);
      },
      clearUserSecondCard: () => setUserSecondCard(undefined),
    }),
    []
  );

  return (
    <ProjectsContext.Provider
      value={{
        actions,
        userFirstCard,
        userSecondCard,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export default ProjectsContextWrapper;
