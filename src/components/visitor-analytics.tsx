"use client";

import { useState, useEffect, useMemo } from "react";
import type { Visitor } from "@/types/visitor";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, Users, BarChart2, User, Phone, ClipboardList, Clock, Building } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface VisitorSummary {
  name: string;
  idNumber: string;
  phoneNumber: string;
  organisation: string;
  visitCount: number;
  visits: Visitor[];
}

export function VisitorAnalytics() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const storedVisitors = localStorage.getItem("visitors");
      if (storedVisitors) {
        const parsedVisitors: Visitor[] = JSON.parse(storedVisitors);
        setVisitors(parsedVisitors);
      }
    } catch (error) {
      console.error("Error loading visitors from localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const visitorSummary = useMemo(() => {
    const summary: Record<string, VisitorSummary> = {};
    visitors.forEach((visitor) => {
      const key = visitor.idNumber;
      if (!summary[key]) {
        summary[key] = {
          name: visitor.name,
          idNumber: visitor.idNumber,
          phoneNumber: visitor.phoneNumber,
          organisation: visitor.organisation,
          visitCount: 0,
          visits: [],
        };
      }
      summary[key].visitCount++;
      summary[key].visits.push(visitor);
    });
    return Object.values(summary).sort((a,b) => b.visitCount - a.visitCount);
  }, [visitors]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <BarChart2 className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Visitor Analytics</CardTitle>
        </div>
        <CardDescription>
          Summary of all visitor entries over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {visitorSummary.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            <ScrollArea className="h-[600px] rounded-md border">
              <Table>
                <TableHeader className="sticky top-0 bg-card">
                   <TableRow>
                    <TableHead className="w-[250px]">Name</TableHead>
                    <TableHead>ID Number</TableHead>
                    <TableHead>Organisation</TableHead>
                    <TableHead className="text-right">Total Visits</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                 <TableBody>
                  {visitorSummary.map((summary) => (
                    <AccordionItem value={summary.idNumber} key={summary.idNumber}>
                       <AccordionTrigger asChild>
                         <TableRow className="cursor-pointer">
                            <TableCell className="font-medium flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {summary.name}
                            </TableCell>
                            <TableCell>{summary.idNumber}</TableCell>
                             <TableCell>
                                <Building className="h-4 w-4 text-muted-foreground inline-block mr-2" />
                                {summary.organisation}
                            </TableCell>
                            <TableCell className="text-right">
                                <Badge>{summary.visitCount}</Badge>
                            </TableCell>
                            <TableCell></TableCell>
                         </TableRow>
                      </AccordionTrigger>
                      <AccordionContent asChild>
                        <tr>
                          <td colSpan={5} className="p-0">
                            <div className="p-4 bg-muted/50">
                              <h4 className="font-semibold mb-2 text-primary">Visit History for {summary.name}</h4>
                               <ScrollArea className="h-[200px] rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Check-in Time</TableHead>
                                            <TableHead>Check-out Time</TableHead>
                                            <TableHead>Purpose of Visit</TableHead>
                                            <TableHead>Person Visited</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                    {summary.visits.sort((a,b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()).map(visit => (
                                        <TableRow key={visit.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    {format(new Date(visit.checkInTime), 'PPpp')}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {visit.checkOutTime ? (
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        {format(new Date(visit.checkOutTime), 'PPpp')}
                                                    </div>
                                                ) : <Badge variant="secondary">Still Checked In</Badge>}
                                            </TableCell>
                                            <TableCell>
                                                 <div className="flex items-center gap-2">
                                                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                                    {visit.purposeOfVisit}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    {visit.personForVisit}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                               </ScrollArea>
                            </div>
                          </td>
                        </tr>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                 </TableBody>
              </Table>
            </ScrollArea>
          </Accordion>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-center">
            <Users className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No visitor data available yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
