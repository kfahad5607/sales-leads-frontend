import { RequiredPaginationParams } from "@/services/leadService";
import { FaRegClock } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import DataTable from "../components/DataTable";
import { Column } from "../components/Table";
import IconBadge from "../components/ui/IconBadge";
import ProgressBar from "../components/ui/ProgressBar";
import { useLeads } from "../hooks/useLeads";
import { Lead } from "../types/leads";
import { formatDateToLocal, getInitials } from "@/lib/utils";

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
    dataKey: "company_name",
    render: (_) => {
      return <ProgressBar totalBars={4} filledBars={2} />;
    },
  },
  {
    title: "Engaged",
    dataKey: "engaged",
    render: (val) => {
      const _val = val as Lead["engaged"];
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

const AllLeads = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
  const pageSize = Math.max(parseInt(searchParams.get("pageSize") || "10"), 10);

  const { data, isLoading, error } = useLeads(
    {
      page,
      pageSize,
    },
    []
  );

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

  const handlePaginationClick = (pagination: RequiredPaginationParams) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("page", pagination.page.toString());
      newParams.set("pageSize", pagination.pageSize.toString());

      return newParams;
    });
  };

  const handleSearch = (query: string) => {
    setSearchParams(() => {
      const newParams = new URLSearchParams({});

      if (query) {
        newParams.set("query", query);
      } else {
        newParams.delete("query");
      }
      return newParams;
    });
  };

  return (
    <div className="bg-stone-100 min-h-screen py-10 px-12 mx-auto font-inter">
      <DataTable
        data={data.data}
        columns={columns}
        searchQuery={query}
        onSearch={handleSearch}
        isLoading={isLoading}
        onPagination={handlePaginationClick}
        {...{ pagination }}
      />
    </div>
  );
};

export default AllLeads;
