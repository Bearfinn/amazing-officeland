import Image from "next/image";
import { FunctionComponent, useContext } from "react";
import { AppContext } from "../pages/_app";
import { RewardCalculation } from "../types";
import { formatNumber, getCoffeeImageUrl } from "../utils/format";

interface RewardCardInfoProps {
  rewardCalculation: RewardCalculation;
}

const RewardCardInfo: FunctionComponent<RewardCardInfoProps> = ({
  rewardCalculation,
}) => {
  const { coffee, sleep, rewardInfo } = rewardCalculation;
  const {
    averageReward,
    averageRewardPerHour,
    averageSuccessRate,
    averageWorkTime,
    workTime,
    paybackPeriod,
  } = rewardInfo;
  const { ocoinPrice } = useContext(AppContext);

  return (
    <div className="flex text-sm" key={`coffee-${coffee.item_id}`}>
      <div className="relative p-2">
        <div className="flex items-center text-bold">
          <div className="">
            {/* {coffee.item_name !== "(No coffee)" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getCoffeeImageUrl(coffee.item_name.toLowerCase())}
                width="24"
                height="24"
                alt="Coffee"
              ></img>
            )} */}
          </div>
          <div className="">{coffee.item_name}</div>
        </div>

        <div>Sleep after working {sleep} times</div>

        <div className="">
          <div>
            <div className="text-xl text-yellow-300 mt-4">
              {formatNumber(averageRewardPerHour * 24)}
              <span className="text-sm ml-1">OCOIN/D</span>
            </div>
            <div className="text-[12px] text-gray-300">
              {formatNumber(averageReward)} OCOIN in {formatNumber(workTime)}h
            </div>
            <div className="text-[12px] text-gray-300">
              {formatNumber(averageReward * ocoinPrice)} WAX/D
            </div>
            <div className="mt-4">
              <span className="text-gray-400 text-xs">PB </span>
              <span>{formatNumber(paybackPeriod)} Days</span>
            </div>
            <div className="mt-1">
              <span className="text-gray-400 text-xs mr-1">
                AVG Success Rate
              </span>
              <span>{formatNumber(averageSuccessRate)}%</span>
            </div>
            <div className="mt-1">
              <span className="text-gray-400 text-xs mr-1">AVG Work Time</span>
              <span>{formatNumber(averageWorkTime)} hr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardCardInfo;
