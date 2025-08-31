"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { format } from "date-fns";
import { db } from "@/lib/firebase/config";
import type { Visitor } from "@/types/visitor";
import { useToast } from "@/hooks/use-toast";
import { checkoutVisitor } from "@/app/actions";
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
import { Clock, LogOut, Search, Users, Loader2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export function VisitorList() {
  const { toast } = useToast();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "visitors"), orderBy("checkInTime", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const visitorsData: Visitor[] = [];
        querySnapshot.forEach((doc) => {
          visitorsData.push({ id: doc.id, ...doc.data() } as Visitor);
        });
        setVisitors(visitorsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching visitors:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load visitor data.",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const handleCheckout = async (id: string) => {
    setIsCheckingOut(id);
    const result = await checkoutVisitor(id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Visitor checked out successfully.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
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
    () => filteredVisitors.filter((v) => v.checkOutTime === null),
    [filteredVisitors]
  );
  const historicalVisitors = useMemo(
    () => filteredVisitors.filter((v) => v.checkOutTime !== null),
    [filteredVisitors]
  );
  
  const renderVisitorRows = (visitorList: Visitor[], isHistory = false) => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          </TableCell>
        </TableRow>
      );
    }

    if (visitorList.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center">
            No visitors found.
          </TableCell>
        </TableRow>
      );
    }
    
    return visitorList.map((visitor) => (
      <TableRow key={visitor.id}>
        <TableCell className="font-medium">{visitor.name}</TableCell>
        <TableCell>{visitor.idNumber}</TableCell>
        <TableCell>{visitor.phoneNumber}</TableCell>
        <TableCell>
          {visitor.checkInTime ? format(visitor.checkInTime.toDate(), 'PPpp') : 'N/A'}
        </TableCell>
        <TableCell>
          {isHistory && visitor.checkOutTime ? (
            <Badge variant="secondary">{format(visitor.checkOutTime.toDate(), 'PPpp')}</Badge>
          ) : (
            <Badge>Checked In</Badge>
          )}
        </TableCell>
        <TableCell className="text-right">
          {!isHistory && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isCheckingOut === visitor.id}>
                  {isCheckingOut === visitor.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <LogOut className="h-4 w-4 text-destructive" />}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will check out <span className="font-bold">{visitor.name}</span>. This action cannot be undone.
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
        </TableCell>
      </TableRow>
    ));
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
              Current Visitors ({currentVisitors.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="mr-2 h-4 w-4" />
              Historical Logs ({historicalVisitors.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <ScrollArea className="h-[400px] rounded-md border">
              <Table>
                <TableHeader className="sticky top-0 bg-card">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>ID Number</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Checked In</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderVisitorRows(currentVisitors)}</TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="history">
            <ScrollArea className="h-[400px] rounded-md border">
              <Table>
                <TableHeader className="sticky top-0 bg-card">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>ID Number</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Checked In</TableHead>
                    <TableHead>Checked Out</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderVisitorRows(historicalVisitors, true)}</TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
