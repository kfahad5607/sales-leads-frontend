import DataTable from "@/components/DataTable";
import LeadForm from "@/components/LeadForm";
import { Column } from "@/components/Table";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import IconBadge from "@/components/ui/IconBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import { Button as ButtonShadcn } from "@/components/ui/shadcn/button";
import { toast } from "@/hooks/use-toast";
import { useBulkDeleteLeads } from "@/hooks/useBulkDeleteLeads";
import { useDatatableSearchParams } from "@/hooks/useDatatableSearchParams";
import useDeleteLead from "@/hooks/useDeleteLead";
import useLeads from "@/hooks/useLeads";
import { formatDateToLocal, getInitials } from "@/lib/utils";
import { LEAD_STAGE_MAP, LEAD_STAGE_NAMES } from "@/schemas/leads";
import { Lead, LeadCreateWithOptId } from "@/types/leads";
import { useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";

type DeleteItemInfo = Pick<Lead, "id" | "email">;

const getEngagedBadge = (isEngaged: boolean) => {
  if (isEngaged)
    return <IconBadge label="Engaged" icon={<FaRegClock />} variant="green" />;
  return <IconBadge label="Not Engaged" icon={<FaRegClock />} variant="gray" />;
};

const columns: Column<Lead>[] = [
  {
    title: "Name",
    dataKey: "name",
    render: (_, record) => {
      return (
        <div className="flex items-center gap-x-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full border border-[#ECE8FF] bg-[#F5F2FF] text-xs text-[#6A1BE0] font-medium">
            {getInitials(record.name)}
          </div>
          <div>
            <div className="text-sm font-medium">{record.name}</div>
            <div className="text-xs text-[#646069]">{record.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    title: "Company",
    dataKey: "company_name",
    render: (val) => {
      return <span className="text-sm font-medium">{val}</span>;
    },
  },
  {
    title: "Stage",
    dataKey: "stage",
    render: (val) => {
      const _val = val as Lead["stage"];
      return (
        <ProgressBar
          totalBars={LEAD_STAGE_NAMES.length - 1}
          filledBars={LEAD_STAGE_MAP[_val]}
        />
      );
    },
  },
  {
    title: "Engaged",
    dataKey: "is_engaged",
    render: (val) => {
      const _val = val as Lead["is_engaged"];
      return <span>{getEngagedBadge(_val)}</span>;
    },
  },
  {
    title: "Last Contacted",
    dataKey: "last_contacted_at",
    render: (val) => {
      const _val = val as Lead["last_contacted_at"];
      return (
        <span className="text-sm font-medium">
          {_val ? formatDateToLocal(_val) : "-"}
        </span>
      );
    },
  },
];

const getEmptyLeadData = (): LeadCreateWithOptId => {
  return {
    email: "",
    name: "",
    company_name: "",
    is_engaged: false,
    stage: LEAD_STAGE_NAMES[1],
    last_contacted_at: null,
  };
};

const AllLeads = () => {
  const [leadData, setLeadData] =
    useState<LeadCreateWithOptId>(getEmptyLeadData);
  const [showForm, setShowForm] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [deleteItemInfo, setDeleteItemInfo] = useState<DeleteItemInfo | null>(
    null
  );
  const [selectedRowIds, setSelectedRowIds] = useState<Set<Lead["id"]>>(
    new Set()
  );
  const { query, page, pageSize, updatePagination, updateSearch } =
    useDatatableSearchParams();

  const { data, isLoading, error } = useLeads(
    {
      page,
      pageSize,
    },
    {
      query,
    },
    []
  );
  const { mutate } = useDeleteLead(
    {
      page,
      pageSize,
    },
    {
      query,
    },
    []
  );
  const { mutate: mutateBulkDelete } = useBulkDeleteLeads();

  if (isLoading) return <h3 className="text-5xl my-3">Loading...</h3>;
  if (error) return <h3 className="text-5xl my-3">ERROR: {error.message}</h3>;

  if (!data) return null;

  const pagination = data
    ? {
        total_records: data.total_records,
        current_page: data.current_page,
        page_size: data.page_size,
      }
    : undefined;

  const onFormSuccess = () => {
    if (!isEdit) {
      setLeadData(getEmptyLeadData);
    }
    setShowForm(false);
  };

  const onAdd = () => {
    console.log("onAdd");

    setLeadData(getEmptyLeadData);
    setShowForm(true);
  };

  const onEdit = (lead: Lead) => {
    console.log("Ediitit ", lead.id);
    setLeadData(lead);
    setShowForm(true);
  };

  const onBulkDelete = () => {
    setShowBulkDeleteDialog(true);
  };

  const onDelete = (lead: Lead) => {
    setDeleteItemInfo({
      id: lead.id,
      email: lead.email,
    });
  };

  const onDeleteConfirm = async () => {
    if (deleteItemInfo?.id) {
      mutate(deleteItemInfo.id, {
        onError: (error: any) => {
          let errorMsg = "Could not delete the lead, please try again!";
          if (error.response?.data && error.response.data.error) {
            errorMsg = error.response.data.error;
          } else if (error.message) {
            errorMsg = error.message;
          }

          toast({
            variant: "destructive",
            description: errorMsg,
            duration: 2500,
          });
        },
        onSuccess: () => {
          toast({
            duration: 2500,
            description: (
              <div>
                Lead with{" "}
                <span className="font-bold">{deleteItemInfo.email}</span> was
                successfully deleted.
              </div>
            ),
          });
        },
      });
      setDeleteItemInfo(null);
    } else if (selectedRowIds.size > 0) {
      mutateBulkDelete(Array.from(selectedRowIds), {
        onError: (error: any) => {
          let errorMsg = "Could not delete the lead(s), please try again!";
          if (error.response?.data && error.response.data.error) {
            errorMsg = error.response.data.error;
          } else if (error.message) {
            errorMsg = error.message;
          }

          toast({
            variant: "destructive",
            description: errorMsg,
            duration: 2500,
          });
        },
        onSuccess: () => {
          setSelectedRowIds(new Set());
          toast({
            duration: 2500,
            description: <div>Leads were deleted successfully.</div>,
          });
        },
      });

      setShowBulkDeleteDialog(false);
    }
  };

  const onDeleteCancel = () => {
    setDeleteItemInfo(null);
    setShowBulkDeleteDialog(false);
  };

  const onRowSelect = (lead: Lead, selection: boolean) => {
    const newSelectedRowIds = new Set(selectedRowIds);
    if (selection) {
      newSelectedRowIds.add(lead.id);
    } else {
      newSelectedRowIds.delete(lead.id);
    }
    setSelectedRowIds(newSelectedRowIds);
  };

  const onAllRowSelect = (selection: boolean) => {
    if (selection) {
      setSelectedRowIds(new Set());
    } else {
      const allRowIds = data.data.map((row) => row.id);
      setSelectedRowIds(new Set(allRowIds));
    }
  };

  const isEdit = "id" in leadData;
  return (
    <div className="bg-stone-100 min-h-screen py-10 px-12 mx-auto font-inter">
      <div className="flex justify-between items-center mb-6">
        <div className="text-3xl font-semibold leading-10 font-fraunces">
          Leads
        </div>
        <div className="flex gap-x-3">
          <Button onClick={onAdd} icon={<LuPlus />} variant="outlined-primary">
            Add Lead
          </Button>
          <Button icon={<LuPlus />}>Export All</Button>
        </div>
      </div>
      <DataTable
        data={data.data}
        columns={columns}
        searchQuery={query}
        isLoading={isLoading}
        idKey="id"
        selectedRowIds={selectedRowIds}
        onAllRowSelect={onAllRowSelect}
        onRowSelect={onRowSelect}
        onEdit={onEdit}
        onDelete={onDelete}
        onBulkDelete={onBulkDelete}
        onSearch={updateSearch}
        onPagination={updatePagination}
        {...{ pagination }}
      />
      {/* Lead Form Dialog Starts */}
      <Dialog
        title={isEdit ? "Edit Lead" : "Add a Lead"}
        description="Manage lead details to streamline your sales efforts"
        open={showForm}
        onClose={() => setShowForm(false)}
      >
        <LeadForm data={leadData} isEdit={isEdit} onSuccess={onFormSuccess} />
      </Dialog>
      {/* Delete Lead Confirm Dialog Ends */}
      {/* Lead Form Dialog Starts */}
      <Dialog
        title="Confirm Deletion"
        open={Boolean(deleteItemInfo)}
        onClose={onDeleteCancel}
      >
        <div>
          <p>
            Are you sure you want to delete this lead with{" "}
            <span className="font-bold whitespace-nowrap">
              {deleteItemInfo?.email}
            </span>
            ?
          </p>
          <div className="flex justify-end mt-5">
            <div className="flex gap-x-3">
              <ButtonShadcn
                onClick={onDeleteCancel}
                variant="default"
                type="button"
              >
                Cancel
              </ButtonShadcn>
              <ButtonShadcn
                onClick={onDeleteConfirm}
                variant="destructive"
                type="button"
              >
                Delete
              </ButtonShadcn>
            </div>
          </div>
        </div>
      </Dialog>
      {/*  Delete Lead Confirm Dialog Ends */}
      {/* Lead Form Dialog Starts */}
      <Dialog
        title="Confirm Deletion"
        open={showBulkDeleteDialog}
        onClose={onDeleteCancel}
      >
        <div>
          <p>Are you sure you want to delete all the selected leads?</p>
          <div className="flex justify-end mt-5">
            <div className="flex gap-x-3">
              <ButtonShadcn
                onClick={onDeleteCancel}
                variant="default"
                type="button"
              >
                Cancel
              </ButtonShadcn>
              <ButtonShadcn
                onClick={onDeleteConfirm}
                variant="destructive"
                type="button"
              >
                Delete
              </ButtonShadcn>
            </div>
          </div>
        </div>
      </Dialog>
      {/*  Delete Lead Confirm Dialog Ends */}
    </div>
  );
};

export default AllLeads;
