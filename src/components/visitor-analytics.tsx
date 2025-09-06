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
// Accordion removed: use local expand/collapse to avoid forwarding props to Fragment
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Loader2,
  Users,
  BarChart2,
  User,
  Clock,
  ClipboardList,
  Building,
  ChevronDown,
  Search,
} from "lucide-react";
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
    (async () => {
      try {
        const res = await fetch("/api/visitors");
        if (!res.ok) throw new Error("Failed to fetch visitors");
        const list: any[] = await res.json();
        const parsedVisitors: Visitor[] = list.map((v) => ({
          id: v.id,
          name: v.name,
          idNumber: v.idNumber,
          phoneNumber: v.phoneNumber,
          organisation: v.organisation ?? "",
          purposeOfVisit: v.purposeOfVisit,
          personForVisit: v.personForVisit,
          checkInTime: v.checkedInAt
            ? new Date(v.checkedInAt).toISOString()
            : new Date().toISOString(),
          checkOutTime: v.checkedOutAt
            ? new Date(v.checkedOutAt).toISOString()
            : null,
        }));
        setVisitors(parsedVisitors);
      } catch (error) {
        console.error("Error loading visitors from server:", error);
      } finally {
        setLoading(false);
      }
    })();
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

    return filteredSummary.sort((a, b) => b.visitCount - a.visitCount);
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
          <ScrollArea className="h-[600px] rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead>ID Number</TableHead>
                  <TableHead>Organisation / Institute of visit</TableHead>
                  <TableHead className="text-right">Total Visits</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitorSummary.map((summary) => (
                  <>
                    <TableRow key={`${summary.idNumber}-row`} className="p-0">
                      <TableCell colSpan={5} className="p-0">
                        <div
                          className="flex w-full items-center p-4 cursor-pointer"
                          onClick={() => {
                            if (openAccordion.includes(summary.idNumber)) {
                              setOpenAccordion(
                                openAccordion.filter(
                                  (v) => v !== summary.idNumber
                                )
                              );
                            } else {
                              setOpenAccordion([
                                ...openAccordion,
                                summary.idNumber,
                              ]);
                            }
                          }}
                        >
                          <span className="font-medium flex items-center gap-2 flex-1 text-left">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {summary.name}
                          </span>
                          <span className="flex-1 text-left">
                            {summary.idNumber}
                          </span>
                          <span className="flex-1 text-left flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            {summary.organisation}
                          </span>
                          <span className="flex-1 text-right">
                            <Badge>{summary.visitCount}</Badge>
                          </span>
                          <span className="w-[50px] flex justify-center">
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 shrink-0 transition-transform duration-200",
                                openAccordion.includes(summary.idNumber) &&
                                  "rotate-180"
                              )}
                            />
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                    {openAccordion.includes(summary.idNumber) && (
                      <TableRow key={`${summary.idNumber}-content`}>
                        <TableCell colSpan={5} className="p-0">
                          <div className="p-4 bg-muted/50">
                            <h4 className="font-semibold mb-2 text-primary">
                              Visit History for {summary.name}
                            </h4>
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
                                  {summary.visits
                                    .sort(
                                      (a, b) =>
                                        new Date(b.checkInTime).getTime() -
                                        new Date(a.checkInTime).getTime()
                                    )
                                    .map((visit) => (
                                      <TableRow key={visit.id}>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            {format(
                                              new Date(visit.checkInTime),
                                              "PPpp"
                                            )}
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          {visit.checkOutTime ? (
                                            <div className="flex items-center gap-2">
                                              <Clock className="h-4 w-4 text-muted-foreground" />
                                              {format(
                                                new Date(visit.checkOutTime),
                                                "PPpp"
                                              )}
                                            </div>
                                          ) : (
                                            <Badge variant="secondary">
                                              Still Checked In
                                            </Badge>
                                          )}
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
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-center">
            <Users className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              No visitor data available yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
