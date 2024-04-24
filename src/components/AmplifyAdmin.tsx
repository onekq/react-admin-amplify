import React from "react";
import { Admin, AdminProps } from "react-admin";
import { buildAuthProvider, buildDataProvider } from "../providers";
import { Operations } from "../providers/DataProvider";

export interface AmplifyAdminOptions {
  authGroups?: string[];
  storageBucket?: string;
  storageRegion?: string;
  enableAdminQueries?: boolean;
}

type Props = {
  operations: Operations;
  options?: AmplifyAdminOptions;
} & Omit<AdminProps, "authProvider" | "dataProvider">;

export const AmplifyAdmin: React.FC<Props> = ({
  children,
  operations,
  options,
  ...propsRest
}) => {
  const {
    authGroups,
    storageBucket,
    storageRegion,
    enableAdminQueries,
  } = options || {};

  return (
    <Admin
      {...propsRest}
      authProvider={buildAuthProvider({ authGroups })}
      dataProvider={buildDataProvider(operations, {
        storageBucket,
        storageRegion,
        enableAdminQueries,
      })}
    >
      {children}
    </Admin>
  );
};
