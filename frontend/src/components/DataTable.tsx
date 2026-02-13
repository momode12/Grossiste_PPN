import type { ReactNode } from "react";

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: (item: T) => ReactNode;
  emptyMessage?: string;
  loading?: boolean;
}

const DataTable = <T extends { id: number | string }>({
  columns,
  data,
  actions,
  emptyMessage = "Aucune donnée disponible",
  loading = false,
}: DataTableProps<T>) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-6 text-center text-slate-500">
        Chargement...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 w-full">
      {/* ================= DESKTOP / TABLET ================= */}
      <div className="hidden md:block">
        <table className="w-full table-auto divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase"
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="py-12 text-center text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map(item => (
                <tr
                  key={String(item.id)}
                  className="hover:bg-indigo-50/40 transition"
                >
                  {columns.map(col => (
                    <td
                      key={String(col.key)}
                      className="px-4 py-3 text-sm text-slate-700 break-words whitespace-normal align-top"
                    >
                      {col.render
                        ? col.render(item)
                        : String(item[col.key] ?? "")}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-4 py-3 text-center align-top">
                      <div className="flex justify-center gap-2">
                        {actions(item)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden space-y-4 p-4">
        {data.length === 0 ? (
          <p className="text-center text-slate-500">{emptyMessage}</p>
        ) : (
          data.map(item => (
            <div
              key={String(item.id)}
              className="border rounded-xl p-4 bg-slate-50 shadow-sm"
            >
              <div className="space-y-2">
                {columns.map(col => (
                  <div
                    key={String(col.key)}
                    className="flex justify-between gap-3"
                  >
                    <span className="text-xs font-semibold text-slate-500">
                      {col.label}
                    </span>
                    <span className="text-sm text-slate-700 text-right break-words whitespace-normal">
                      {col.render
                        ? col.render(item)
                        : String(item[col.key] ?? "")}
                    </span>
                  </div>
                ))}
              </div>

              {actions && (
                <div className="mt-3 flex justify-end gap-2">
                  {actions(item)}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ================= FOOTER ================= */}
      {data.length > 0 && (
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
          <div className="flex justify-between items-center text-sm text-slate-600">
            <span>
              <strong className="text-indigo-600">{data.length}</strong>{" "}
              {data.length > 1 ? "éléments" : "élément"}
            </span>
            <span className="text-xs">
              Dernière mise à jour :{" "}
              {new Date().toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
