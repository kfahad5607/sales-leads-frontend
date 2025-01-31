import { FaRegClock } from "react-icons/fa";
import { LuEllipsisVertical, LuPlus, LuSearch } from "react-icons/lu";

import Checkbox from "./ui/Checkbox";
import IconBadge from "./ui/IconBadge";
import ProgressBar from "./ui/ProgressBar";
import Button from "./ui/Button";

const DataTable = () => {
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
          Showing 1-10 of 85 leads
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
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="border-b border-[#DBDADD]">
                  <td className="px-4 py-3">
                    <Checkbox id={`select-item-${i}`} />
                  </td>
                  <td className="pr-2.5 py-3">
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
                  <td className="pr-2.5 py-3">
                    <span className="text-sm font-medium">
                      Flux Technologies Ltd.
                    </span>
                  </td>
                  <td className="w-20 pr-2.5 py-3">
                    <ProgressBar totalBars={4} filledBars={2} />
                  </td>
                  <td className="w-40 pr-2.5 py-3">
                    <IconBadge
                      label="Not Engaged"
                      icon={<FaRegClock />}
                      variant="gray"
                    />
                  </td>
                  <td className="w-40 pr-2.5 py-3">
                    <span className="text-sm font-medium">23 Jan, 2025</span>
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
          <div></div>
        </div>
      </div>
      {/* body ends */}
      {/* foot */}
    </div>
  );
};

export default DataTable;
