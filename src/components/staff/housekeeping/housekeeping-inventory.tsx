import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Package, AlertTriangle, Plus, ArrowUp, ArrowDown } from 'lucide-react';

// Types for inventory management
interface InventoryItem {
  id: string;
  name: string;
  category: 'toiletries' | 'cleaning' | 'linens' | 'amenities';
  currentStock: number;
  reorderPoint: number;
  unit: string;
  lastRestocked: Date;
  location: string;
}

interface StockAdjustment {
  id: string;
  itemId: string;
  type: 'restock' | 'use' | 'waste' | 'adjustment';
  quantity: number;
  timestamp: Date;
  notes?: string;
}

const HousekeepingInventory = () => {
  // Mock data - replace with real data from backend
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Bath Towels',
      category: 'linens',
      currentStock: 150,
      reorderPoint: 50,
      unit: 'pieces',
      lastRestocked: new Date('2024-03-15'),
      location: 'Main Storage'
    },
    {
      id: '2',
      name: 'Toilet Paper',
      category: 'toiletries',
      currentStock: 200,
      reorderPoint: 100,
      unit: 'rolls',
      lastRestocked: new Date('2024-03-10'),
      location: 'Supply Room'
    },
    {
      id: '3',
      name: 'All-Purpose Cleaner',
      category: 'cleaning',
      currentStock: 15,
      reorderPoint: 10,
      unit: 'bottles',
      lastRestocked: new Date('2024-03-01'),
      location: 'Cleaning Station'
    }
  ]);

  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false);
  const [adjustmentForm, setAdjustmentForm] = useState({
    type: 'restock',
    quantity: 0,
    notes: ''
  });

  const handleStockAdjustment = (itemId: string, type: 'increase' | 'decrease') => {
    setSelectedItem(inventory.find(item => item.id === itemId) || null);
    setIsAdjustmentDialogOpen(true);
    setAdjustmentForm({
      type: type === 'increase' ? 'restock' : 'use',
      quantity: 0,
      notes: ''
    });
  };

  const submitAdjustment = () => {
    if (!selectedItem || adjustmentForm.quantity <= 0) return;

    // Update inventory
    const updatedInventory = inventory.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          currentStock: adjustmentForm.type === 'restock' 
            ? item.currentStock + adjustmentForm.quantity
            : item.currentStock - adjustmentForm.quantity,
          lastRestocked: adjustmentForm.type === 'restock' ? new Date() : item.lastRestocked
        };
      }
      return item;
    });

    // Record adjustment
    const newAdjustment: StockAdjustment = {
      id: Date.now().toString(),
      itemId: selectedItem.id,
      type: adjustmentForm.type as StockAdjustment['type'],
      quantity: adjustmentForm.quantity,
      timestamp: new Date(),
      notes: adjustmentForm.notes
    };

    setInventory(updatedInventory);
    setAdjustments([newAdjustment, ...adjustments]);
    setIsAdjustmentDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Item
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Items
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.filter(item => item.currentStock <= item.reorderPoint).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Categories
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
          <CardDescription>
            Manage your housekeeping supplies and stock levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="capitalize">{item.category}</TableCell>
                  <TableCell>{item.currentStock} {item.unit}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <Badge variant={
                      item.currentStock <= item.reorderPoint ? "destructive" : 
                      item.currentStock <= item.reorderPoint * 1.5 ? "default" : 
                      "secondary"
                    }>
                      {item.currentStock <= item.reorderPoint ? "Low Stock" :
                       item.currentStock <= item.reorderPoint * 1.5 ? "Medium" :
                       "Good"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStockAdjustment(item.id, 'increase')}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStockAdjustment(item.id, 'decrease')}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAdjustmentDialogOpen} onOpenChange={setIsAdjustmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock Level</DialogTitle>
            <DialogDescription>
              {selectedItem?.name} - Current Stock: {selectedItem?.currentStock} {selectedItem?.unit}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Select
                value={adjustmentForm.type}
                onValueChange={(value) => setAdjustmentForm({
                  ...adjustmentForm,
                  type: value as StockAdjustment['type']
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select adjustment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restock">Restock</SelectItem>
                  <SelectItem value="use">Use</SelectItem>
                  <SelectItem value="waste">Waste</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Input
                type="number"
                placeholder="Quantity"
                value={adjustmentForm.quantity}
                onChange={(e) => setAdjustmentForm({
                  ...adjustmentForm,
                  quantity: parseInt(e.target.value)
                })}
              />
            </div>
            <div className="grid gap-2">
              <Input
                placeholder="Notes (optional)"
                value={adjustmentForm.notes}
                onChange={(e) => setAdjustmentForm({
                  ...adjustmentForm,
                  notes: e.target.value
                })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjustmentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitAdjustment}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HousekeepingInventory;