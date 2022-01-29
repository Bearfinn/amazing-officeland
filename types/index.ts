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
  reducedSuccessRate: number;
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

export interface WorkingStaffInfo {
  asset_ids: string[];
  max_slot: number;
  player: string;
}

export interface StaffInfo {
  asset_id: string;
  name: string;
  template: {
    template_id: string;
  };
  data: {
    img: string;
    name: string;
    type: string;
    rarity: string;
    backimg: string;
    description: string;
  };
}

export interface AssignedTask {
  asset_id: string;
  item_used: number;
  player: string;
  task_end: number;
  task_id: number;
  task_start: IdleDeadline;
  taskassign_id: number;
}