import React from "react";
import { FullPageSpinner } from "../../components/Spinner";

/**
 * NOTE: This is a conceptual component. You will need to implement the logic
 * for fetching data, as well as the add, edit, and delete forms/modals
 * based on your application's specific needs and UI library.
 */

interface Column<T> {
  key: keyof T;
  header: string;
}

// Using a generic type `T` to make the component more reusable and type-safe.
// We also constrain `T` to be an object with an `id` property.
interface MasterDataPageProps<T extends { id: any }> {
  title: string;
  columns: Column<T>[];
  fetchData: () => Promise<T[]>;
}

export const MasterDataPage = <T extends { id: any }>({
  title,
  columns,
  fetchData,
}: MasterDataPageProps<T>) => {
  // The following states and handlers are placeholders.
  // You should implement them using your app's state management and data fetching libraries.
  const [data, setData] = React.useState<T[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Using a useCallback for the data fetching function to ensure it has a stable identity
  const loadData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchData();
      setData(result);
    } catch (err) {
      setError("Failed to fetch data.");
      console.error(err); // Keep detailed error in console
    } finally {
      setIsLoading(false);
    }
  }, [fetchData]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdd = () => {
    // TODO: Implement logic to show an "Add" modal/form.
    alert(`Adding new ${title.slice(0, -1)}...`);
  };

  const handleEdit = (item: T) => {
    // TODO: Implement logic to show an "Edit" modal/form for the item.
    alert(`Editing ${JSON.stringify(item)}...`);
  };

  const handleDelete = (item: T) => {
    // TODO: Implement logic to confirm and delete the item.
    if (window.confirm("Are you sure you want to delete this item?")) {
      alert(`Deleting ${JSON.stringify(item)}...`);
    }
  };

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (error) {
    return <div style={{ color: 'red', padding: '2rem' }}>{error}</div>
  }

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>{title}</h1>
        <button onClick={handleAdd}>Add New</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key as string} style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>{col.header}</th>
            ))}
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.key as string} style={{ border: "1px solid #ddd", padding: "8px" }}>{String(row[col.key])}</td>
              ))}
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <button onClick={() => handleEdit(row)} style={{ marginRight: "5px" }}>Edit</button>
                <button onClick={() => handleDelete(row)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};