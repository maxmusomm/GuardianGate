
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
import { Loader2, Users, BarChart2, User, Phone, ClipboardList, Clock, Building, ChevronDown, Search } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

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
  const [openAccordion, setOpenAccordion] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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

    const filteredSummary = Object.values(summary).filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.organisation.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return filteredSummary.sort((a,b) => b.visitCount - a.visitCount);
  }, [visitors, searchTerm]);

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <BarChart2 className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Visitor Analytics</CardTitle>
            </div>
             <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                placeholder="Search by name, ID, or org..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
        <CardDescription>
          Summary of all visitor entries over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {visitorSummary.length > 0 ? (
          <Accordion type="multiple" value={openAccordion} onValueChange={setOpenAccordion} className="w-full">
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
                    <AccordionItem value={summary.idNumber} key={summary.idNumber} asChild>
                      <>
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
                              <TableCell>
                                 <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200", openAccordion.includes(summary.idNumber) && "rotate-180" )} />
                              </TableCell>
                           </TableRow>
                        </AccordionTrigger>
                        <AccordionContent asChild>
                           <tr className="bg-muted/50">
                                <td colSpan={5} className="p-0">
                                    <div className="p-4">
                                        <h4 className="font-semibold mb-2 text-primary">Visit History for {summary.name}</h4>
                                        <ScrollArea className="h-[200px] rounded-md border bg-card">
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
                      </>
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
