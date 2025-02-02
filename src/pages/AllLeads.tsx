// React
import { useState } from "react";

// Icons
import { FaRegClock, FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import { LuPlus } from "react-icons/lu";

// Components
import DataTable, { Column } from "@/components/DataTable";
import LeadForm from "@/components/LeadForm";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import IconBadge from "@/components/ui/IconBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import { Button as ButtonShadcn } from "@/components/ui/shadcn/button";

// Hooks
import { toast } from "@/hooks/use-toast";
import { useBulkDeleteLeads } from "@/hooks/useBulkDeleteLeads";
import { useDatatableSearchParams } from "@/hooks/useDatatableSearchParams";
import useDeleteLead from "@/hooks/useDeleteLead";
import useLeads from "@/hooks/useLeads";

// Utilities
import { formatDateToLocal, generateArray, getInitials } from "@/lib/utils";
import { LEAD_STAGE_MAP, LEAD_STAGE_NAMES } from "@/schemas/leads";

// Services
import { exportLeads } from "@/services/leadService";

// Types
import { Lead, LeadCreateWithOptId } from "@/types/leads";
import { RequiredPaginationParams } from "@/types/api";

type DeleteItemInfo = Pick<Lead, "id" | "email">;

const getEngagedBadge = (isEngaged: boolean) => {
  if (isEngaged)
    return (
      <IconBadge label="Engaged" icon={<FaRegCheckCircle />} variant="green" />
    );
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
    renderLoader: () => {
      return (
        <div className="flex items-center gap-x-2 animate-pulse">
          <div className="bg-gray-200 size-8 rounded-full"></div>
          <div>
            <div className="h-2.5 w-24 bg-gray-200 rounded-full mb-1.5"></div>
            <div className="h-2 w-32 bg-gray-200 rounded-full "></div>
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
    renderLoader: () => {
      return (
        <div className="animate-pulse">
          <div className="h-2.5 w-28 bg-gray-200 rounded-full"></div>
        </div>
      );
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
    renderLoader: () => {
      return (
        <div className="animate-pulse">
          <div className="flex items-stretch gap-x-0.5 h-4">
            {generateArray(LEAD_STAGE_NAMES.length - 1).map((i) => (
              <div
                key={i}
                className="w-1 h-full bg-gray-200 rounded-t-lg"
              ></div>
            ))}
          </div>
        </div>
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
    renderLoader: () => {
      return (
        <div className="animate-pulse">
          <div className="h-4 w-28 bg-gray-200 rounded-full"></div>
        </div>
      );
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
    renderLoader: () => {
      return (
        <div className="animate-pulse">
          <div className="h-2.5 w-28 bg-gray-200 rounded-full"></div>
        </div>
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
  const {
    query,
    page,
    pageSize,
    sortBy,
    updatePagination,
    updateSearch,
    updateSort,
  } = useDatatableSearchParams();

  const paginationParams = { page, pageSize };
  const filterParams = { query };
  const sortKeys = sortBy ? sortBy.split(",").map((s) => s.trim()) : [];

  const { data, isPlaceholderData, isLoading, error } = useLeads(
    paginationParams,
    filterParams,
    sortBy
  );
  const { mutate } = useDeleteLead(paginationParams, filterParams, sortBy);
  const { mutate: mutateBulkDelete } = useBulkDeleteLeads();

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
            description: (
              <div>
                {selectedRowIds.size} Lead(s) were deleted successfully.
              </div>
            ),
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
      const allRowIds = data?.data.map((row) => row.id);
      setSelectedRowIds(new Set(allRowIds));
    }
  };

  const onSort = (colKey: keyof Lead, isMultiMode: boolean) => {
    console.log("isMultiMode ", isMultiMode);

    const ascColKey = colKey.toString();
    const descColKey = "-" + ascColKey;

    let currentSortKeyIdx = sortKeys.findIndex((sortKey) =>
      [ascColKey, descColKey].includes(sortKey)
    );

    if (currentSortKeyIdx === -1) {
      sortKeys.push(ascColKey);
      currentSortKeyIdx = sortKeys.length - 1;
    } else {
      sortKeys[currentSortKeyIdx] =
        sortKeys[currentSortKeyIdx][0] === "-" ? ascColKey : descColKey;
    }
    if (isMultiMode) {
      updateSort(sortKeys.join(","));
    } else {
      updateSort(sortKeys[currentSortKeyIdx]);
    }
  };

  const onPagination = (pagination: RequiredPaginationParams) => {
    updatePagination(pagination);
    setSelectedRowIds(new Set());
  };

  const isEdit = "id" in leadData;

  return (
    <div className="bg-stone-100 min-h-screen py-10 px-12 mx-auto font-inter">
      <LeadsHeader onAdd={onAdd} />
      <DataTable
        idKey="id"
        data={data?.data}
        columns={columns}
        searchQuery={query}
        error={error}
        isLoading={isLoading || isPlaceholderData}
        selectedRowIds={selectedRowIds}
        sortKeys={sortKeys}
        onSort={onSort}
        onAllRowSelect={onAllRowSelect}
        onRowSelect={onRowSelect}
        onEdit={onEdit}
        onDelete={onDelete}
        onBulkDelete={onBulkDelete}
        onSearch={updateSearch}
        onPagination={onPagination}
        {...{ pagination }}
      />
      {/* Lead Form Dialog */}
      <Dialog
        title={isEdit ? "Edit Lead" : "Add a Lead"}
        description="Manage lead details to streamline your sales efforts"
        open={showForm}
        onClose={() => setShowForm(false)}
      >
        <LeadForm data={leadData} isEdit={isEdit} onSuccess={onFormSuccess} />
      </Dialog>
      {/* Confirm Single Delete Dialog */}
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
      {/* Confirm Bulk Delete Dialog */}
      <Dialog
        title="Confirm Deletion"
        open={showBulkDeleteDialog}
        onClose={onDeleteCancel}
      >
        <div>
          <p>
            Are you sure you want to delete all {selectedRowIds.size} selected
            leads?
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
    </div>
  );
};

interface LeadsHeaderProps {
  onAdd: () => void;
}

const LeadsHeader = ({ onAdd }: LeadsHeaderProps) => {
  const [isExportLoading, setIsExportLoading] = useState(false);
  const { query, sortBy } = useDatatableSearchParams();
  const filterParams = { query };

  const onExport = async () => {
    setIsExportLoading(true);
    await exportLeads(filterParams, sortBy);
    setIsExportLoading(false);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="text-3xl font-semibold leading-10 font-fraunces">
        Leads
      </div>
      <div className="flex gap-x-3">
        <Button onClick={onAdd} icon={<LuPlus />} variant="outlined-primary">
          Add Lead
        </Button>
        <Button
          onClick={onExport}
          icon={<MdOutlineDownloadForOffline />}
          disabled={isExportLoading}
        >
          Export All
        </Button>
      </div>
    </div>
  );
};

export default AllLeads;
