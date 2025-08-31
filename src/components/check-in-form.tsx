"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addVisitor } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Building,
  ClipboardList,
  Fingerprint,
  LogIn,
  Phone,
  User,
  UserCheck,
} from "lucide-react";

const visitorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  idNumber: z.string().min(2, "ID number is required."),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits."),
  purposeOfVisit: z.string().min(2, "Purpose of visit is required."),
  personForVisit: z.string().min(2, "Person to visit is required."),
  organisation: z.string().min(2, "Organisation is required."),
});

type VisitorFormData = z.infer<typeof visitorSchema>;

const initialState = {
  error: null,
  success: false,
};

export function CheckInForm() {
  const [state, formAction] = useFormState(addVisitor, initialState);
  const { toast } = useToast();

  const form = useForm<VisitorFormData>({
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      name: "",
      idNumber: "",
      phoneNumber: "",
      purposeOfVisit: "",
      personForVisit: "",
      organisation: "",
    },
  });

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Success",
        description: "Visitor checked in successfully.",
      });
      form.reset();
    } else if (state.error && typeof state.error === 'string') {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    }
  }, [state, toast, form]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <LogIn className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Visitor Check-in</CardTitle>
        </div>
        <CardDescription>
          Fill in the details below to check in a new visitor.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="e.g. John Doe" {...field} className="pl-10" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Number</FormLabel>
                    <div className="relative">
                      <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="e.g. 12345678" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="e.g. 555-123-4567" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="organisation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organisation / Company</FormLabel>
                   <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="e.g. Acme Inc." {...field} className="pl-10" />
                      </FormControl>
                    </div>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="personForVisit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Person to Visit</FormLabel>
                   <div className="relative">
                      <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="e.g. Jane Smith" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purposeOfVisit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose of Visit</FormLabel>
                   <div className="relative">
                      <ClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="e.g. Delivery, Meeting" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              <LogIn className="mr-2 h-4 w-4" />
              Check In Visitor
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
