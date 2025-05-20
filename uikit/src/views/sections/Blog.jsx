import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RestaurantLayoutEditor() {
  const [tables, setTables] = useState([]);

  const addTable = () => {
    const newTable = {
      id: Date.now(),
      x: 50,
      y: 50,
      width: 60,
      height: 60,
    };
    setTables([...tables, newTable]);
  };

  const updateTablePosition = (id, x, y) => {
    setTables((prev) =>
      prev.map((table) => (table.id === id ? { ...table, x, y } : table))
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Restaurant Layout Editor</h2>
      <Button onClick={addTable}>Add Table</Button>
      <div className="relative w-full h-[600px] border mt-4 bg-gray-50">
        {tables.map((table) => (
          <div
            key={table.id}
            className="absolute bg-green-500 text-white flex items-center justify-center cursor-move"
            style={{
              top: table.y,
              left: table.x,
              width: table.width,
              height: table.height,
            }}
            draggable
            onDragEnd={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              updateTablePosition(table.id, rect.left - 20, rect.top - 120);
            }}
          >
            Table
          </div>
        ))}
      </div>
    </div>
  );
}