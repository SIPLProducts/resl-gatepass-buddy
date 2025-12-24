import { ReactNode } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Column {
  key: string;
  header: string;
  width?: string;
  render?: (value: any, row: any, index: number) => ReactNode;
}

interface DataGridProps<T> {
  columns: Column[];
  data: T[];
  onRowDelete?: (index: number) => void;
  onAddRow?: () => void;
  editable?: boolean;
  minRows?: number;
  emptyMessage?: string;
}

export function DataGrid<T extends Record<string, any>>({
  columns,
  data,
  onRowDelete,
  onAddRow,
  editable = false,
  minRows = 1,
  emptyMessage = 'No items added',
}: DataGridProps<T>) {
  const canDelete = data.length > minRows;

  return (
    <div className="space-y-3">
      <div className="data-grid">
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-12 text-center">#</th>
              {columns.map((col) => (
                <th key={col.key} style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
              {editable && <th className="w-16 text-center">Action</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (editable ? 2 : 1)} className="text-center py-8 text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="group">
                  <td className="text-center font-medium text-muted-foreground">{index + 1}</td>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row, index) : row[col.key] || '-'}
                    </td>
                  ))}
                  {editable && (
                    <td className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onRowDelete?.(index)}
                        disabled={!canDelete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editable && onAddRow && (
        <Button variant="outline" size="sm" onClick={onAddRow} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Row
        </Button>
      )}
    </div>
  );
}
