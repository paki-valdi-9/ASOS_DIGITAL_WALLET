import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TreeNode } from "primereact/treenode";
import EmptyState from "@atlaskit/empty-state";
import EmptyStateTransactionImage from "../../../assets/icons/Sandy_Tech-28_Single-11.jpg";
import styles from "./CardTransactionHistory.module.scss";
import { displayToast } from "app";

export const CardTransactionHistory: React.FC = () => {
  const params = useParams();
  const [data, setData] = useState<TreeNode[]>([]);
  const userId: string = params.userId ?? "";

  useEffect(() => {
    fetch(`http://localhost:3000/transactions/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data) {
          setData(data);
        }
      })
      .catch((error) => {
        displayToast("error", "Fetch Error", "Failed to get transactions.");
        console.error("Error:", error);
      });
  }, []);

  return (
    <>
      <div className={styles["table-container"]}>
        {data.length > 0 ? (
          <DataTable value={data}>
            <Column
              className={styles["date-column"]}
              field="date"
              header="Date"
            ></Column>
            <Column
              className={styles["description-column"]}
              field="type"
              header="Description"
            ></Column>
            <Column
              className={styles["amount-column"]}
              field="amount"
              header="Amount"
            ></Column>
          </DataTable>
        ) : (
          <EmptyState
            header="There are not any logged transactions."
            description="Plese create a transaction to see transaction table."
            imageUrl={EmptyStateTransactionImage}
          />
        )}
      </div>
    </>
  );
};
