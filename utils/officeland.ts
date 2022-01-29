import { AssignedTask, StaffInfo, TaskList, WorkingStaffInfo } from "../types";
import { getData, GetTableRowOptions } from "./wax";

const getOfficeLandData = async (
  table: string,
  options?: GetTableRowOptions
) => {
  return getData({
    game: "officegameio",
    table,
    options,
  });
};

export const RARITY_INFO: Record<
  string,
  {
    color: string;
    bg_color: string;
    man_hours: number;
    reduce_time: number;
    success_rate: number;
  }
> = {
  intern: {
    color: "text-gray-400",
    bg_color: "bg-gray-400 text-gray-800",
    man_hours: 1,
    reduce_time: 0,
    success_rate: 50,
  },
  junior: {
    color: "text-green-400",
    bg_color: "bg-green-400 text-gray-800",
    man_hours: 1.5,
    reduce_time: 5,
    success_rate: 60,
  },
  senior: {
    color: "text-yellow-400",
    bg_color: "bg-yellow-400 text-gray-800",
    man_hours: 2,
    reduce_time: 10,
    success_rate: 70,
  },
  leader: {
    color: "text-purple-400",
    bg_color: "bg-purple-400 text-gray-800",
    man_hours: 2.5,
    reduce_time: 15,
    success_rate: 85,
  },
  manager: {
    color: "text-red-400",
    bg_color: "bg-red-400 text-gray-800",
    man_hours: 3,
    reduce_time: 20,
    success_rate: 98,
  },
  boss: {
    color: "text-gray-300",
    bg_color: "bg-black text-white",
    man_hours: 5,
    reduce_time: 25,
    success_rate: 100,
  },
};

export const TASK_COUNT_BEFORE_SLEEP = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

export const getTaskList = async (): Promise<TaskList[]> => {
  return getOfficeLandData("tasklist");
};

export const getCoffees = async () => {
  return getOfficeLandData("items");
};

export const getWorkingStaff = async (
  address: string
): Promise<WorkingStaffInfo[]> => {
  return getOfficeLandData("publicspace", {
    query: address,
    index_position: 1,
    key_type: "i64",
  });
};

export const getOwnedStaffs = async (address: string): Promise<StaffInfo[]> => {
  const params = {
    collection_name: "officelandio",
    owner: address,
    order: "desc",
    sort: "updated",
    limit: 1000,
    "template_data.type": "staff",
  };
  const paramString = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const response = await fetch(
    `https://wax.api.atomicassets.io/atomicassets/v1/assets?${paramString}`
  );
  const data: { success: boolean; data: any[]; query_time: number } =
    await response.json();
  return data.data.map((staff) => staff);
};

export const getAssignedTasks = async (
  address: string
): Promise<AssignedTask[]> => {
  const response = await getOfficeLandData("taskassign", {
    query: address,
    index_position: 3,
    key_type: "i64",
  });
  return response;
};
