export interface TaskList {
  task_id: number;
  task_name: string;
  task_time: number;
  task_diff: number;
  ranks: string[];
}

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

export interface RewardInfo {
  averageReward: number;
  averageRewardPerHour: number;
  averageSuccessRate: number;
  averageWorkTime: number;
  workTime: number;
  paybackPeriod: number;
}

export interface RewardCalculation {
  task: TaskList;
  rarity: string;
  rank: Record<string, any>;
  coffee: CoffeeExtended;
  rewardInfo: RewardInfo;
  sleep: number;
}

export type CoffeeExtended = Coffee & {
  average_reduce_time: number;
  average_success_rate: number;
};
