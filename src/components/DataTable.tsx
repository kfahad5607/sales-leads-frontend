import { LuPlus, LuSearch } from "react-icons/lu";

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
      </div>
      {/* body ends */}
      {/* foot */}
    </div>
  );
};

export default DataTable;
