import { TaskList } from "../types";
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
    man_hours: number;
    reduce_time: number;
    success_rate: number;
  }
> = {
  intern: {
    color: "text-gray-400",
    man_hours: 1,
    reduce_time: 0,
    success_rate: 50,
  },
  junior: {
    color: "text-green-400",
    man_hours: 1.5,
    reduce_time: 5,
    success_rate: 60,
  },
  senior: {
    color: "text-yellow-400",
    man_hours: 2,
    reduce_time: 10,
    success_rate: 70,
  },
  leader: {
    color: "text-purple-400",
    man_hours: 2.5,
    reduce_time: 15,
    success_rate: 85,
  },
  manager: {
    color: "text-red-400",
    man_hours: 3,
    reduce_time: 20,
    success_rate: 98,
  },
  boss: {
    color: "text-gray-800",
    man_hours: 5,
    reduce_time: 25,
    success_rate: 100,
  },
};



export const getTaskList = async (): Promise<TaskList[]> => {
  return getOfficeLandData("tasklist");
};

export const getCoffees = async () => {
  return getOfficeLandData("items");
};
