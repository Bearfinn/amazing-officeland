import { FunctionComponent } from "react";
import { RewardCalculation } from "../types";
import { formatNumber } from "../utils/format";

interface RewardCardProps {
  rewardCalculation: RewardCalculation;
}

const RewardCard: FunctionComponent<RewardCardProps> = ({
  rewardCalculation,
}) => {
  const { coffee, rewardInfo } = rewardCalculation;
  const { averageReward, averageRewardPerHour, workTime, paybackPeriod } =
    rewardInfo;
  rewardCalculation;
  return (
    <div className="flex text-sm" key={`coffee-${coffee.item_id}`}>
      <div className="w-9">{coffee.item_name.slice(0, 3)}</div>
      <div>
        <div>{formatNumber(averageRewardPerHour)}/hr</div>
        <div className="text-[11px] text-gray-300">
          {formatNumber(averageReward)} OCOIN in {formatNumber(workTime)}h
          <div></div>
        </div>
        <div>
          <span className="uppercase text-gray-400 text-xs">PB </span>
          <span>{formatNumber(paybackPeriod)} Days</span>
        </div>
      </div>
      <div className="col-span-2"></div>
    </div>
  );
};

export default RewardCard;
