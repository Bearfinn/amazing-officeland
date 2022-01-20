import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import RewardCard from "../components/RewardCard";
import { CoffeeExtended, RewardCalculation, TaskList } from "../types";
import { getLowestPriceOfRarity } from "../utils/atomic";
import { formatNumber } from "../utils/format";
import {
  getCoffees,
  getTaskList,
  RARITY_INFO,
  TASK_COUNT_BEFORE_SLEEP,
} from "../utils/officeland";
import { AppContext } from "./_app";

const Home: NextPage = () => {
  const [taskList, setTaskList] = useState<TaskList[]>([]);
  const [coffees, setCoffees] = useState<CoffeeExtended[]>([]);
  const [lowestPriceMapping, setLowestPriceMapping] = useState<
    Record<string, number>
  >({});
  const { tax, ocoinPrice } = useContext(AppContext);

  const [includeFeeDuration, setIncludeFeeDuration] = useState(true);
  const [openedSlots, setOpenedSlots] = useState(5);
  const [includeNewSlotPrice, setIncludeNewSlotPrice] = useState(true);

  const bonusSuccessRate = useMemo(() => {
    if (openedSlots <= 5) return 0;
    return Math.floor((openedSlots - 10) / 2);
  }, [openedSlots]);

  const newSlotPrice = useMemo(() => {
    if (openedSlots <= 5) return 0;
    if (openedSlots >= 21) return 600;
    return (openedSlots - 5) * 50;
  }, [openedSlots]);

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
            (coffee.success_rate[0] + coffee.success_rate[1]) / 2 +
            bonusSuccessRate,
          average_reduce_time:
            (coffee.reduce_time[0] + coffee.reduce_time[1]) / 2,
        }))
      )
    );

    Object.keys(RARITY_INFO).forEach((rarity) => {
      getLowestPriceOfRarity(rarity).then((marketItem) => {
        // Get price with two precision digits
        const price = marketItem
          ? Number(
              marketItem.price.amount.slice(
                0,
                marketItem.price.amount.length - 6
              )
            ) / 100
          : 0;
        setLowestPriceMapping((prevState) => {
          return {
            ...prevState,
            [rarity]: price,
          };
        });
      });
    });
  }, [bonusSuccessRate]);

  const getReward = useCallback(
    (man_hours: number, difficulty: number, task_hours: number) => {
      return task_hours * (man_hours - difficulty) * (1 - tax / 100);
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
      coffee: CoffeeExtended,
      sleep: number
    ) => {
      const getPaybackPeriod = (ocoinPerHour: number, investPrice: number) => {
        let investPriceInOcoin = investPrice / ocoinPrice;
        if (includeNewSlotPrice) {
          investPriceInOcoin += newSlotPrice;
        }
        let paybackPeriod = investPriceInOcoin / (ocoinPerHour * 24);
        if (includeFeeDuration) {
          paybackPeriod += 5; // days
        }
        return paybackPeriod;
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

      const workTimeWithoutCoffee =
        (1 - rank.reduce_time / 100) * task.task_time;
      const workTime =
        (1 - rank.reduce_time / 100 - coffee.average_reduce_time / 100) *
        task.task_time;
      const averageWorkTime = (workTime * sleep + 10) / sleep;

      const successRate = rank.success_rate + coffee.average_success_rate;
      const averageSuccessRate =
        (successRate +
          (successRate - 0.25 * workTimeWithoutCoffee * (sleep - 1))) /
        2; // Average of maximum success rate and minimum success rate after working `sleep - 1` times

      console.log(
        `Sleep after working ${sleep} time: ${workTime}, ${averageWorkTime}, ${successRate}, ${averageSuccessRate}`
      );

      const averageReward = getAverageReward(
        rank.man_hours,
        task.task_diff,
        averageSuccessRate,
        task.task_time,
        coffeeCost
      );

      const averageRewardPerHour = getAverageRewardPerHour(
        averageReward,
        averageWorkTime
      );

      const paybackPeriod = getPaybackPeriod(
        averageRewardPerHour,
        lowestPriceMapping[rarity]
      );
      return {
        averageRewardPerHour,
        averageReward,
        averageSuccessRate,
        averageWorkTime,
        workTime,
        paybackPeriod,
      };
    },
    [
      getReward,
      includeFeeDuration,
      includeNewSlotPrice,
      lowestPriceMapping,
      newSlotPrice,
      ocoinPrice,
    ]
  );

  const rewardCalculations = useMemo(() => {
    const result: RewardCalculation[] = [];
    taskList.forEach((task) => {
      Object.entries(RARITY_INFO).forEach(([rarity, rank]) => {
        TASK_COUNT_BEFORE_SLEEP.forEach((sleep) => {
          coffees.forEach((coffee) => {
            const rewardInfo = calculateReward(
              task,
              rarity,
              rank,
              coffee,
              sleep
            );
            result.push({
              task,
              rarity,
              rank,
              coffee,
              rewardInfo,
              sleep,
            });
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
    <div className="container mx-auto px-4">
      <Head>
        <title>Officeland Boss Room</title>
      </Head>
      <div className="text-center my-8">
        <div className="text-2xl">Officeland Boss Room</div>
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
        <div className="text-sm mt-2">
          This calculation includes success rate, claim fee, withdraw fee,
          opened slots bonus, OCOIN price, etc.
        </div>
        <div className="bg-gray-800 px-2 py-1">
          OCOIN Price: {ocoinPrice} WAX
        </div>

        <div className="mt-2 text-left leading-loose border rounded-lg px-4 py-2">
          <div className="font-bold text-center">Settings</div>
          <div>
            <label>Opened slots</label>
            <input
              className="bg-gray-700 px-2 py-1 rounded-lg mx-2 w-16 text-center"
              type="text"
              value={openedSlots}
              onChange={(e) => setOpenedSlots(Number(e.target.value))}
            ></input>
            (+1% success rate per 2 purchased slots)
          </div>
          <div>
            <input
              className="mr-2 p-2"
              type="checkbox"
              checked={includeNewSlotPrice}
              onChange={(e) => setIncludeNewSlotPrice(e.target.checked)}
            ></input>
            Include new slot price (Slot #{openedSlots + 1})
          </div>
          <div>
            <input
              className="mr-2 p-2"
              type="checkbox"
              checked={includeFeeDuration}
              onChange={(e) => setIncludeFeeDuration(e.target.checked)}
            ></input>
            Include withdraw fee duration
          </div>
          <div>
            <input
              className="mr-2 p-2"
              type="checkbox"
              checked={true}
              onChange={(e) => {}}
            ></input>
            Include withdraw tax ({tax}%, assuming withdraw more than 1,000
            OCOIN at a time)
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-6">
        {Object.entries(RARITY_INFO).map(([rarity_name, rank]) => {
          return (
            <div
              className="col-span-2 lg:col-span-1"
              key={`header-${rarity_name}`}
            >
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
          <div
            className="grid grid-cols-6 gap-4 my-4"
            key={`task-${task.task_id}`}
          >
            <div className="col-span-6 my-4 font-bold">{task.task_name}</div>
            {Object.entries(RARITY_INFO).map(([rarity, rank]) => {
              const sortedRewards = rewardCalculations.filter(
                (rewardCalculation) =>
                  rewardCalculation.rarity === rarity &&
                  rewardCalculation.task.task_id === task.task_id
              );
              return (
                <div
                  className="col-span-2 lg:col-span-1"
                  key={`${task.task_id}-rarity-${rarity}`}
                >
                  {task.ranks.includes(rarity) && (
                    <div className="">
                      <RewardCard
                        rarity={rarity}
                        rewardCalculations={sortedRewards}
                      />
                    </div>
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
