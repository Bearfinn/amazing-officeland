import type { NextPage } from "next";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import RewardCard from "../components/RewardCard";
import { CoffeeExtended, RewardCalculation, TaskList } from "../types";
import { getLowestPriceOfRarity } from "../utils/atomic";
import { formatNumber } from "../utils/format";
import { getCoffees, getTaskList, RARITY_INFO } from "../utils/officeland";
import { getOcoinPrice } from "../utils/wax";
import { AppContext } from "./_app";

const Home: NextPage = () => {
  const [taskList, setTaskList] = useState<TaskList[]>([]);
  const [coffees, setCoffees] = useState<CoffeeExtended[]>([]);
  const [lowestPriceMapping, setLowestPriceMapping] = useState<
    Record<string, number>
  >({});
  const [ocoinPrice, setOcoinPrice] = useState(0);
  const { tax } = useContext(AppContext);

  useEffect(() => {
    getTaskList().then((taskList) => setTaskList(taskList));
    getCoffees().then((coffees) =>
      setCoffees(
        [
          {
            success_rate: [0, 0],
            reduce_time: [0, 0],
            item_name: "(No coffee)",
            item_amount: "0.0000 OCOIN",
          },
          ...coffees,
        ].map((coffee) => ({
          ...coffee,
          average_success_rate:
            (coffee.success_rate[0] + coffee.success_rate[1]) / 2,
          average_reduce_time:
            (coffee.reduce_time[0] + coffee.reduce_time[1]) / 2,
        }))
      )
    );

    getOcoinPrice().then((lastPrice) => setOcoinPrice(lastPrice));

    Object.keys(RARITY_INFO).forEach((rarity) => {
      getLowestPriceOfRarity(rarity).then((marketItem) => {
        // Get price with two precision digits
        const price =
          Number(
            marketItem.price.amount.slice(0, marketItem.price.amount.length - 6)
          ) / 100;
        setLowestPriceMapping((prevState) => {
          return {
            ...prevState,
            [rarity]: price,
          };
        });
      });
    });
  }, []);

  const getReward = useCallback(
    (man_hours: number, difficulty: number, task_hours: number) => {
      return (task_hours * (man_hours - difficulty)) * (1 - ( tax / 100 ));
    },
    [tax]
  );

  const getRewardPerHour = (total_reward: number, work_hours: number) => {
    return total_reward / work_hours;
  };

  const getAverageRewardPerHour = (
    average_reward: number,
    work_hours: number
  ) => {
    return average_reward / work_hours;
  };

  const calculateReward = useCallback(
    (
      task: Record<string, any>,
      rarity: string,
      rank: Record<string, any>,
      coffee: CoffeeExtended
    ) => {
      const getPaybackPeriod = (ocoinPerHour: number, investPrice: number) => {
        const investPriceInOcoin = investPrice / ocoinPrice;
        return investPriceInOcoin / (ocoinPerHour * 24);
      };

      const getAverageReward = (
        man_hours: number,
        difficulty: number,
        success_rate_percent: number,
        task_hours: number,
        item_cost?: number
      ) => {
        const reward = getReward(man_hours, difficulty, task_hours);
        if (success_rate_percent >= 100) success_rate_percent = 100;
        return (
          (success_rate_percent / 100) * reward +
          (1 - success_rate_percent / 100) * 0.2 * reward -
          (item_cost || 0)
        );
      };

      const coffeeCost = Number(coffee.item_amount.split(" ")[0]);

      const workTime =
        ((100 - rank.reduce_time - coffee.average_reduce_time) / 100) *
        task.task_time;

      const averageReward = getAverageReward(
        rank.man_hours,
        task.task_diff,
        rank.success_rate + coffee.average_success_rate,
        task.task_time,
        coffeeCost
      );

      const averageRewardPerHour = getAverageRewardPerHour(
        averageReward,
        workTime
      );

      const paybackPeriod = getPaybackPeriod(
        averageRewardPerHour,
        lowestPriceMapping[rarity]
      );
      return {
        averageRewardPerHour,
        averageReward,
        workTime,
        paybackPeriod,
      };
    },
    [getReward, lowestPriceMapping, ocoinPrice]
  );

  const rewardCalculations = useMemo(() => {
    const result: RewardCalculation[] = [];
    taskList.forEach((task) => {
      Object.entries(RARITY_INFO).forEach(([rarity, rank]) => {
        coffees.forEach((coffee) => {
          const rewardInfo = calculateReward(task, rarity, rank, coffee);
          result.push({
            task,
            rarity,
            rank,
            coffee,
            rewardInfo,
          });
        });
      });
    });
    result.sort(
      (a, b) =>
        b.rewardInfo.averageRewardPerHour - a.rewardInfo.averageRewardPerHour
    );
    return result;
  }, [calculateReward, coffees, taskList]);

  return (
    <div className="container mx-auto">
      <div className="text-center my-8">
        <div className="text-2xl">Boss Space</div>
        <div className="text-center">
          by{" "}
          <a
            className="text-blue-500 hover:text-blue-300 hover:underline"
            target="_blank"
            rel="noreferrer"
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          >
            bananaminion
          </a>
        </div>
        <div className="mt-2">
          Tax: {tax}%
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-6">
        {Object.entries(RARITY_INFO).map(([rarity_name, rank]) => {
          return (
            <div key={`header-${rarity_name}`}>
              <div className={`uppercase ${rank.color}`}>{rarity_name}</div>
              <div className="text-sm mt-2">Lowest price</div>
              <div>{formatNumber(lowestPriceMapping[rarity_name])} WAX</div>
            </div>
          );
        })}
      </div>

      {/* Tasks */}
      {taskList.map((task) => {
        return (
          <div className="grid grid-cols-6 my-4" key={`task-${task.task_id}`}>
            <div className="col-span-6 my-4 font-bold">{task.task_name}</div>
            {Object.entries(RARITY_INFO).map(([rarity, rank]) => {
              const sortedRewards = rewardCalculations.filter(
                (rewardCalculation) =>
                  rewardCalculation.rarity === rarity &&
                  rewardCalculation.task.task_id === task.task_id
              );
              return (
                <div className="w-96" key={`${task.task_id}-rarity-${rarity}`}>
                  {task.ranks.includes(rarity) && (
                    <>
                      <RewardCard rewardCalculations={sortedRewards} />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Home;
