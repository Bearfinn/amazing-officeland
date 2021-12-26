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

export const RARITY_INFO = {
  intern: {
    man_hours: 1,
    success_rate: 50,
  },
  junior: {
    man_hours: 1.5,
    success_rate: 60,
  },
  senior: {
    man_hours: 2,
    success_rate: 70,
  },
  leader: {
    man_hours: 2.5,
    success_rate: 85,
  },
  manager: {
    man_hours: 3,
    success_rate: 98,
  },
  boss: {
    man_hours: 5,
    success_rate: 100,
  },
};

export interface TaskList {
  task_id: number;
  task_name: string;
  task_time: number;
  task_diff: number;
  ranks: string[];
}

export const getTaskList = async (): Promise<TaskList[]> => {
  return getOfficeLandData("tasklist");
};

export interface Coffee {
  item_id: number;
  item_name: string;
  item_data: string;
  success_rate: [number, number];
  reduce_time: [number, number];
  item_amount: string;
  item_type: number;
  item_status: number;
  item_task: string[];
}

export const getCoffees = async () => {
  return getOfficeLandData("items")
}