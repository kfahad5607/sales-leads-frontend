import { FaRegClock } from "react-icons/fa";
import { LuPlus, LuSearch } from "react-icons/lu";
import Checkbox from "./ui/Checkbox";
import IconBadge from "./ui/IconBadge";
import ProgressBar from "./ui/ProgressBar";

const DataTable = () => {
  return (
    <div className="border border-blue-900">
      {/* Head starts */}
      <div className="border border-amber-600 mb-4">
        <div className="flex justify-between items-center mb-6">
          <div className="text-3xl font-semibold leading-10 font-fraunces">
            Leads
          </div>
          <div className="flex gap-x-3">
            <button className="inline-flex items-center px-3 py-2 bg-white rounded-lg border border-gray-400">
              <LuPlus className="mr-1 text-xl" />
              <span className="font-medium">Add Lead</span>
            </button>
            <button className="inline-flex items-center px-3 py-2 bg-[#6A1BE0] text-white rounded-lg border border-[#6A1BE0]">
              <LuPlus className="mr-1 text-xl" />
              <span className="font-medium">Export All</span>
            </button>
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
          Showing 1-10 of 85 leads
        </div>
        <div className="bg-white rounded-lg border border-[#DBDADD]">
          <table className="w-full">
            <thead className="font-normal border-b border-[#DBDADD]">
              <tr className="px-4 py-1">
                <th className="w-12 py-1.5">
                  <Checkbox id="select-all" />
                </th>
                <th className="font-normal text-left text-xs text-[#646069] py-1.5">
                  Name
                </th>
                <th className="font-normal text-left text-xs text-[#646069] py-1.5">
                  Company
                </th>
                <th className="font-normal text-left text-xs text-[#646069] py-1.5">
                  Stage
                </th>
                <th className="font-normal text-left text-xs text-[#646069] py-1.5">
                  Engaged
                </th>
                <th className="font-normal text-left text-xs text-[#646069] py-1.5">
                  Last Contacted
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="border-b border-[#DBDADD]">
                  <td className="px-4 py-3">
                    <Checkbox id={`select-item-${i}`} />
                  </td>
                  <td className="pr-4 py-3">
                    <div className="flex items-center gap-x-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border border-[#ECE8FF] bg-[#F5F2FF] text-xs text-[#6A1BE0] font-medium">
                        EB
                      </div>
                      <div>
                        <div className="text-sm font-medium">Emma Blake</div>
                        <div className="text-xs text-[#646069]">
                          emma.blake@flux.com
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="pr-4 py-3">
                    <span className="text-sm font-medium">
                      Flux Technologies Ltd.
                    </span>
                  </td>
                  <td className="pr-4 py-3">
                    <ProgressBar totalBars={4} filledBars={2} />
                  </td>
                  <td className="pr-4 py-3">
                    <IconBadge
                      label="Not Engaged"
                      Icon={FaRegClock}
                      variant="gray"
                    />
                  </td>
                  <td className="pr-4 py-3">
                    <span className="text-sm font-medium">23 Jan, 2025</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* body ends */}
      {/* foot */}
    </div>
  );
};

export default DataTable;
