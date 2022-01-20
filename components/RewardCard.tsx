import { FunctionComponent } from "react";
import { RewardCalculation } from "../types";
import { RARITY_INFO } from "../utils/officeland";
import RewardCardInfo from "./RewardCardInfo";
interface RewardCardProps {
  rarity: string;
  rewardCalculations: RewardCalculation[];
}

const RewardCard: FunctionComponent<RewardCardProps> = ({
  rarity,
  rewardCalculations,
}) => {
  const bestReward = rewardCalculations[0];
  return (
    <div className="relative group shadow-lg mt-8 rounded-lg bg-gray-800">
      <div
        className={`uppercase px-4 py-2 rounded-t-lg font-bold ${RARITY_INFO[rarity].bg_color}`}
      >
        {rarity}
      </div>
      <div className="p-2">
        {bestReward && <RewardCardInfo rewardCalculation={bestReward} />}
      </div>
      {/* Tooltip */}
      <div className="absolute bg-gray-900 shadow-md hidden group-hover:block top-full left-4 z-10 flex flex-col gap-4 p-4">
        {rewardCalculations.map((rewardCalculation, index) => {
          return (
            rewardCalculation && (
              <RewardCardInfo
                key={index}
                rewardCalculation={rewardCalculation}
              />
            )
          );
        })}
      </div>
    </div>
  );
};

export default RewardCard;
