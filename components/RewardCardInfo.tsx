import Image from "next/image";
import { FunctionComponent } from "react";
import { RewardCalculation } from "../types";
import { formatNumber, getCoffeeImageUrl } from "../utils/format";

interface RewardCardInfoProps {
  rewardCalculation: RewardCalculation;
}

const RewardCardInfo: FunctionComponent<RewardCardInfoProps> = ({
  rewardCalculation,
}) => {
  const { coffee, rewardInfo } = rewardCalculation;
  const { averageReward, averageRewardPerHour, workTime, paybackPeriod } =
    rewardInfo;
  rewardCalculation;
  return (
    <div className="flex text-sm" key={`coffee-${coffee.item_id}`}>
      <div className="relative p-2">
        <div className="flex items-center gap-1 text-bold">
          <div className="">
            {coffee.item_name !== "(No coffee)" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getCoffeeImageUrl(coffee.item_name.toLowerCase())}
                width="24"
                height="24"
                alt="Coffee"
              ></img>
            )}
          </div>
          <div className="mb-2">{coffee.item_name}</div>
        </div>

        <div className="">
          <div>
            <div className="text-lg text-yellow-300">
              {formatNumber(averageRewardPerHour * 24)}
              <span className="text-sm ml-1">OCOIN/D</span>
            </div>
            <div className="text-[11px] text-gray-300">
              {formatNumber(averageReward)} OCOIN in {formatNumber(workTime)}h
              <div></div>
            </div>
            <div className="mt-2">
              <span className="uppercase text-gray-400 text-xs">PB </span>
              <span>{formatNumber(paybackPeriod)} Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardCardInfo;
