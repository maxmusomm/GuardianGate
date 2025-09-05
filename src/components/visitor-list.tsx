"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { format } from "date-fns";
import type { Visitor } from "@/types/visitor";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Clock,
  LogOut,
  Search,
  Users,
  Loader2,
  User,
  Phone,
  Fingerprint,
  FileDown,
} from "lucide-react";

export function VisitorList() {
  const { toast } = useToast();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState<string | null>(null);

  const loadVisitors = useCallback(() => {
    (async () => {
      try {
        const res = await fetch("/api/visitors");
        if (!res.ok) throw new Error("Failed to load visitors");
        const list: any[] = await res.json();
        // Normalize server shape -> client Visitor shape
        const parsedVisitors: Visitor[] = list.map((v) => ({
          id: v.id,
          name: v.name,
          idNumber: v.idNumber,
          phoneNumber: v.phoneNumber,
          purposeOfVisit: v.purposeOfVisit,
          personForVisit: v.personForVisit,
          organisation: v.organisation ?? "",
          checkInTime: v.checkedInAt
            ? new Date(v.checkedInAt).toISOString()
            : new Date().toISOString(),
          checkOutTime: v.checkedOutAt
            ? new Date(v.checkedOutAt).toISOString()
            : null,
        }));
        parsedVisitors.sort(
          (a, b) =>
            new Date(b.checkInTime).getTime() -
            new Date(a.checkInTime).getTime()
        );
        setVisitors(parsedVisitors);
      } catch (error) {
        console.error("Error loading visitors from server:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load visitor data.",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  useEffect(() => {
    setLoading(true);
    loadVisitors();
    const handleStorageChange = () => loadVisitors();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("visitorsUpdated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("visitorsUpdated", handleStorageChange);
    };
  }, [loadVisitors]);

  const handleCheckout = async (id: string) => {
    setIsCheckingOut(id);
    try {
      const res = await fetch("/api/visitors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to checkout visitor");
      // refresh list
      window.dispatchEvent(new Event("visitorsUpdated"));
      toast({
        title: "Success",
        description: "Visitor checked out successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check out visitor.",
      });
    }
    setIsCheckingOut(null);
  };

  const filteredVisitors = useMemo(() => {
    return visitors.filter(
      (visitor) =>
        visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [visitors, searchTerm]);

  const currentVisitors = useMemo(
    () =>
      filteredVisitors.filter(
        (v) => v.checkOutTime === null || v.checkOutTime === undefined
      ),
    [filteredVisitors]
  );
  const historicalVisitors = useMemo(
    () =>
      filteredVisitors.filter(
        (v) => v.checkOutTime !== null && v.checkOutTime !== undefined
      ),
    [filteredVisitors]
  );

  const VisitorCard = ({
    visitor,
    isHistory = false,
  }: {
    visitor: Visitor;
    isHistory?: boolean;
  }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User />
              {visitor.name}
            </CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Fingerprint className="h-4 w-4" /> ID: {visitor.idNumber}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="h-4 w-4" /> {visitor.phoneNumber}
              </div>
            </CardDescription>
          </div>
          {!isHistory && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isCheckingOut === visitor.id}
                >
                  {isCheckingOut === visitor.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4 text-destructive" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will check out{" "}
                    <span className="font-bold">{visitor.name}</span>. This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleCheckout(visitor.id)}>
                    Check Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div>
            <strong>Checked In:</strong>{" "}
            {visitor.checkInTime
              ? format(new Date(visitor.checkInTime), "PPpp")
              : "N/A"}
          </div>
        </div>
        {isHistory && visitor.checkOutTime && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <strong>Checked Out:</strong>{" "}
              {format(new Date(visitor.checkOutTime), "PPpp")}
            </div>
          </div>
        )}
        {!isHistory && <Badge>Checked In</Badge>}
      </CardContent>
    </Card>
  );

  const renderVisitorList = (visitorList: Visitor[], isHistory = false) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (visitorList.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground">
          No visitors found.
        </div>
      );
    }

    return (
      <>
        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {visitorList.map((visitor) => (
            <VisitorCard
              key={visitor.id}
              visitor={visitor}
              isHistory={isHistory}
            />
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID Number</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Checked In</TableHead>
                <TableHead>{isHistory ? "Checked Out" : "Status"}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitorList.map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell className="font-medium">{visitor.name}</TableCell>
                  <TableCell>{visitor.idNumber}</TableCell>
                  <TableCell>{visitor.phoneNumber}</TableCell>
                  <TableCell>
                    {visitor.checkInTime
                      ? format(new Date(visitor.checkInTime), "PPpp")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {isHistory && visitor.checkOutTime ? (
                      <Badge variant="secondary">
                        {format(new Date(visitor.checkOutTime), "PPpp")}
                      </Badge>
                    ) : (
                      <Badge>Checked In</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!isHistory && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isCheckingOut === visitor.id}
                          >
                            {isCheckingOut === visitor.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <LogOut className="h-4 w-4 text-destructive" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will check out{" "}
                              <span className="font-bold">{visitor.name}</span>.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCheckout(visitor.id)}
                            >
                              Check Out
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Visitor Logs</CardTitle>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or phone..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <CardDescription>
          View current and past visitor records.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">
              <Users className="mr-2 h-4 w-4" />
              Current Visitors ({loading ? 0 : currentVisitors.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="mr-2 h-4 w-4" />
              Monthly Logs ({loading ? 0 : historicalVisitors.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="current" className="mt-4">
            {renderVisitorList(currentVisitors)}
          </TabsContent>
          <TabsContent value="history" className="mt-4">
            <div className="flex justify-end mb-4">
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Export as Sheet
              </Button>
            </div>
            {renderVisitorList(historicalVisitors, true)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
