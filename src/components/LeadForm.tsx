// React
import { useState } from "react";
import { useForm } from "react-hook-form";

// Icons
import { CalendarIcon } from "lucide-react";

// Components
import Select from "@/components/ui/Select";
import { Button as ButtonShadcn } from "@/components/ui/shadcn/button";
import { Calendar } from "@/components/ui/shadcn/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { Switch } from "@/components/ui/shadcn/switch";

// Hooks
import { toast } from "@/hooks/use-toast";
import { useDatatableSearchParams } from "@/hooks/useDatatableSearchParams";
import useSaveLead from "@/hooks/useSaveLead";

// Utilities
import { capitalize, cn, formatDateToLocal } from "@/lib/utils";

// Schemas
import { zodResolver } from "@hookform/resolvers/zod";
import { LEAD_STAGE_NAMES, LeadCreateWithOptIdSchema } from "@/schemas/leads";

// Types
import { LeadCreateWithOptId } from "@/types/leads";

interface Props {
  data: LeadCreateWithOptId;
  isEdit?: boolean;
  onSuccess: () => void;
}

const convertToDate = (date: string | null) => {
  if (typeof date === "string") return new Date(date);
  return undefined;
};

const leadStageOptions = LEAD_STAGE_NAMES.map((stage) => {
  return {
    value: stage,
    label: capitalize(stage),
  };
});

const LeadForm = ({ data, isEdit, onSuccess }: Props) => {
  const [formError, setFormError] = useState("");
  const { query, page, pageSize, sortBy } = useDatatableSearchParams();
  const paginationParams = { page, pageSize };
  const filterParams = { query };
  const { mutate } = useSaveLead(paginationParams, filterParams, sortBy);

  const form = useForm<LeadCreateWithOptId>({
    resolver: zodResolver(LeadCreateWithOptIdSchema),
    values: data,
  });

  function onSubmit(data: LeadCreateWithOptId) {
    setFormError("");
    mutate(data, {
      onError: (error: any) => {
        let errorMsg = "Could not create the lead, please try again!";
        if (error.response?.data && error.response.data.error) {
          errorMsg = error.response.data.error;
        } else if (error.message) {
          errorMsg = error.message;
        }
        setFormError(errorMsg);
      },
      onSuccess: () => {
        if (!isEdit) form.reset();

        onSuccess();
        toast({
          duration: 2500,
          description: (
            <div>
              Lead with{" "}
              <span className="font-bold">
                {data.name}({data.email})
              </span>{" "}
              was successfully {isEdit ? "updated" : "created"}.
            </div>
          ),
        });
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-4">
          <div className="grid grid-cols-2 space-x-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 space-x-6">
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Acme Corp."
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_contacted_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Contacted At</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <ButtonShadcn
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            formatDateToLocal(field.value)
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </ButtonShadcn>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={convertToDate(field.value)}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(date.toISOString());
                          } else {
                            field.onChange(null);
                          }
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 space-x-6">
            <FormField
              control={form.control}
              name="stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stage</FormLabel>
                  <FormControl>
                    <Select
                      selectedValue={field.value}
                      options={leadStageOptions}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_engaged"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-around">
                  <FormLabel>Engagement</FormLabel>
                  <FormControl>
                    <Switch
                      ref={field.ref}
                      name={field.name}
                      disabled={field.disabled}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          {formError && (
            <p className="text-[0.8rem] font-medium text-destructive mt-1 mb-3">
              {formError}
            </p>
          )}
        </div>
        <div className="flex justify-end">
          <ButtonShadcn type="submit">Submit</ButtonShadcn>
        </div>
      </form>
    </Form>
  );
};

export default LeadForm;
