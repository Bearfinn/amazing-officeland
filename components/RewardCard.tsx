import { FunctionComponent } from "react";
import { RewardCalculation } from "../types";
import RewardCardInfo from "./RewardCardInfo";
interface RewardCardProps {
  rewardCalculations: RewardCalculation[];
}

const RewardCard: FunctionComponent<RewardCardProps> = ({
  rewardCalculations,
}) => {
  const bestReward = rewardCalculations[0];
  return (
    <div className="relative group">
      <div>
        {bestReward && <RewardCardInfo rewardCalculation={bestReward} />}
      </div>
      {/* Tooltip */}
      <div className="absolute bg-white shadow-md hidden group-hover:block top-4 left-4 z-10 flex flex-col gap-4 p-4">
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
