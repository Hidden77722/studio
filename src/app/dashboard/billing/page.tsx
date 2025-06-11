"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, PlusCircle, Edit } from "lucide-react";

// Mock data
const currentPlan = {
  name: "Annual Pro",
  price: "$199.99/year",
  renewsOn: "January 15, 2025",
  status: "Active",
};

const paymentMethods = [
  { id: "pm1", type: "Visa", last4: "4242", expiry: "12/25", isDefault: true },
  { id: "pm2", type: "Mastercard", last4: "5555", expiry: "08/26", isDefault: false },
];

const billingHistory = [
  { id: "bh1", date: "January 15, 2024", description: "Annual Pro Subscription", amount: "$199.99", status: "Paid" },
  { id: "bh2", date: "December 10, 2023", description: "Monthly Pro (Prorated)", amount: "$19.99", status: "Paid" },
];

export default function BillingPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-headline font-semibold">Billing & Subscription</h1>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription Plan</CardTitle>
          <CardDescription>Manage your current MemeTrade Pro plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold text-primary">{currentPlan.name}</h3>
            <p className="text-muted-foreground">{currentPlan.price}</p>
            <p className="text-sm text-muted-foreground">Renews on: {currentPlan.renewsOn}</p>
            <Badge className={`mt-2 ${currentPlan.status === "Active" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
              {currentPlan.status}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Change Plan</Button>
            <Button variant="destructive">Cancel Subscription</Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Payment Methods */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Your saved payment options.</CardDescription>
          </div>
          <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4"/> Add Payment Method</Button>
        </CardHeader>
        <CardContent>
          {paymentMethods.length > 0 ? (
            <ul className="space-y-3">
              {paymentMethods.map(method => (
                <li key={method.id} className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">{method.type} ending in {method.last4}</p>
                      <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
                    </div>
                    {method.isDefault && <Badge variant="secondary">Default</Badge>}
                  </div>
                  <div className="flex gap-2">
                    {!method.isDefault && <Button variant="ghost" size="sm">Set as Default</Button>}
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No payment methods saved.</p>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Review your past invoices and payments.</CardDescription>
        </CardHeader>
        <CardContent>
          {billingHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistory.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "Paid" ? "success" : "secondary"} 
                             className={item.status === "Paid" ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No billing history available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
