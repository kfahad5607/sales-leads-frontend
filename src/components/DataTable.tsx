import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FaRegClock } from "react-icons/fa";
import { LuEllipsisVertical, LuPlus, LuSearch } from "react-icons/lu";

import { useLeads } from "../hooks/useLeads";
import Button from "./ui/Button";
import Checkbox from "./ui/Checkbox";
import IconBadge from "./ui/IconBadge";
import ProgressBar from "./ui/ProgressBar";

const getInitials = (fullName: string): string => {
  const names = fullName.split(" ");

  const firstInitial = names[0].charAt(0);
  const lastInitial =
    names.length > 1 ? names[names.length - 1].charAt(0) : firstInitial;

  return (firstInitial + lastInitial).toUpperCase();
};

const formatDateToLocal = (inputDate: string): string => {
  const date = new Date(inputDate);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return date.toLocaleDateString("en-GB", options); // 'en-GB' for "day month year"
};

const DataTable = () => {
  const query = useLeads(
    {
      page: 1,
      pageSize: 20,
    },
    []
  );
  console.log("Data ", query.data?.current_page);

  if (query.isLoading) return <h3 className="text-5xl my-3">Loading...</h3>;
  if (query.error)
    return <h3 className="text-5xl my-3">ERROR: {query.error.message}</h3>;

  if (!query.data) return null;

  return (
    <div className="">
      {/* Head starts */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-6">
          <div className="text-3xl font-semibold leading-10 font-fraunces">
            Leads
          </div>
          <div className="flex gap-x-3">
            <Button icon={<LuPlus />} variant="outlined-primary">
              Add Lead
            </Button>
            <Button icon={<LuPlus />}>Export All</Button>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-x-2 border border-[#DBDADD] px-3 py-2 bg-white rounded-lg">
            <LuSearch className="fill-gray-100 text-gray-600 text-xl" />
            <input
              type="search"
              placeholder="Search by lead's name, email or company name"
              className="w-full placeholder:text-sm outline-none"
            />
          </div>
        </div>
      </div>
      {/* Head ends */}
      {/* body starts */}
      <div>
        <div className="font-medium text-xs text-[#646069] mb-2">
          Showing 1-10 of {query.data.total_records} leads
        </div>
        <div className="bg-white rounded-lg border border-[#DBDADD]">
          <table className="w-full">
            <thead className="font-normal border-b border-[#DBDADD]">
              <tr className="px-4 py-1">
                <th className="w-14 py-1.5 pr-2.5">
                  <Checkbox id="select-all" />
                </th>
                <th className="w-auto font-normal text-left text-xs text-[#646069] py-1.5 pr-2.5">
                  Name
                </th>
                <th className="w-auto font-normal text-left text-xs text-[#646069] py-1.5 pr-2.5">
                  Company
                </th>
                <th className="w-20 font-normal text-left text-xs text-[#646069] py-1.5 pr-2.5">
                  Stage
                </th>
                <th className="w-40 font-normal text-left text-xs text-[#646069] py-1.5 pr-2.5">
                  Engaged
                </th>
                <th className="w-40 font-normal text-left text-xs text-[#646069] py-1.5 pr-2.5">
                  Last Contacted
                </th>
                <th className="w-9 text-left py-1.5"></th>
              </tr>
            </thead>
            <tbody>
              {query.data.data.map((lead) => (
                <tr key={lead.id} className="border-b border-[#DBDADD]">
                  <td className="px-4 py-3">
                    <Checkbox id={`select-item-${lead.id}`} />
                  </td>
                  <td className="pr-2.5 py-3">
                    <div className="flex items-center gap-x-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border border-[#ECE8FF] bg-[#F5F2FF] text-xs text-[#6A1BE0] font-medium">
                        {getInitials(lead.name)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{lead.name}</div>
                        <div className="text-xs text-[#646069]">
                          {lead.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="pr-2.5 py-3">
                    <span className="text-sm font-medium">
                      {lead.company_name}
                    </span>
                  </td>
                  <td className="w-20 pr-2.5 py-3">
                    <ProgressBar totalBars={4} filledBars={2} />
                  </td>
                  <td className="w-40 pr-2.5 py-3">
                    {getEngagedBadge(lead.engaged)}
                  </td>
                  <td className="w-40 pr-2.5 py-3">
                    <span className="text-sm font-medium">
                      {lead.last_contacted_at
                        ? formatDateToLocal(lead.last_contacted_at)
                        : "-"}
                    </span>
                  </td>
                  <td className="w-9 py-3">
                    <div className="flex items-center justify-center size-6 p-1 rounded-full cursor-pointer transition-colors ease-in-out duration-300 hover:bg-gray-200">
                      <LuEllipsisVertical className="text-[#646069] text" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center border border-amber-300 py-2 px-2">
            <div className="relative text-left hidden">
              <div className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
                Click Me
              </div>
              <div className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                <div className="py-1">
                  <div>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      Account settings
                    </a>
                  </div>
                  <div>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      Account settings
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <nav className="flex gap-x-2">
              <button
                type="button"
                className="w-9 h-8 flex justify-center items-center rounded-lg bg-[#F7F7F8] text-[#96949C] cursor-pointer transition-colors ease-out duration-200 hover:bg-gray-200"
              >
                <BsChevronLeft />
              </button>
              <div className="flex gap-x-0.5 text-sm">
                {[1, 2, 3, 4].map((k) => (
                  <div
                    key={k}
                    className="flex justify-center items-center size-8 rounded-lg bg-[#6A1BE0] text-white cursor-pointer transition-colors ease-out duration-200 hover:bg-gray-100 hover:text-[#28272A]"
                  >
                    {k}
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="w-9 h-8 flex justify-center items-center rounded-lg bg-[#F7F7F8] text-[#646069] cursor-pointer transition-colors ease-out duration-200 hover:bg-gray-200"
              >
                <BsChevronRight />
              </button>
            </nav>
            <div></div>
          </div>
        </div>
      </div>
      {/* body ends */}
      {/* foot */}
    </div>
  );
};

const getEngagedBadge = (isEngaged: boolean) => {
  if (isEngaged)
    return <IconBadge label="Engaged" icon={<FaRegClock />} variant="green" />;
  return <IconBadge label="Not Engaged" icon={<FaRegClock />} variant="gray" />;
};

export default DataTable;
