import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Scissors, Users, Package } from 'lucide-react';

export function MetricCards() {
  const metrics = [
    { title: 'Total Revenue', value: '$5,231', icon: DollarSign },
    { title: 'Orders in Progress', value: '12', icon: Scissors },
    { title: 'New Customers', value: '18', icon: Users },
    { title: 'Inventory Items', value: '143', icon: Package },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

