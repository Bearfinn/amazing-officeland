import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { getLowestPriceOfRarity } from "../utils/atomic";
import {
  Coffee,
  getCoffees,
  getTaskList,
  RARITY_INFO,
  TaskList,
} from "../utils/officeland";

type CoffeeExtended = Coffee & {
  average_reduce_time: number;
  average_success_rate: number;
};

const Home: NextPage = () => {
  const [taskList, setTaskList] = useState<TaskList[]>([]);
  const [coffees, setCoffees] = useState<CoffeeExtended[]>([]);
  const [lowestPriceMapping, setLowestPriceMapping] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    getTaskList().then((taskList) => setTaskList(taskList));
    getCoffees().then((coffees) =>
      setCoffees(
        [
          {
            success_rate: [0, 0],
            reduce_time: [0, 0],
            item_name: "-",
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

  const getRewardPerHour = (man_hours: number, difficulty: number) => {
    return man_hours - difficulty;
  };

  const getAverageRewardPerHour = (
    man_hours: number,
    difficulty: number,
    success_rate_percent: number,
    item_cost?: number
  ) => {
    const reward = getRewardPerHour(man_hours, difficulty);
    return (
      (success_rate_percent / 100) * reward +
      (1 - success_rate_percent / 100) * 0.2 * reward -
      (item_cost || 0)
    );
  };

  const formatNumber = (number: number | string) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(Number(number));
  };

  return (
    <div className="overflow-x-scroll">
      {taskList.map((task) => {
        return (
          <div className="flex" key={`task-${task.task_id}`}>
            <div>{task.task_name}</div>
            {Object.entries(RARITY_INFO).map(([rarity, rank]) => {
              const reward = getRewardPerHour(rank.man_hours, task.task_diff);
              const rewardAverage = getAverageRewardPerHour(
                rank.man_hours,
                task.task_diff,
                rank.success_rate
              );
              return (
                <div className="w-96" key={`${task.task_id}-rarity-${rarity}`}>
                  {task.ranks.includes(rarity) && (
                    <>
                      <div className="uppercase">{rarity}</div>
                      {lowestPriceMapping[rarity]}
                      Base:
                      <div>
                        {formatNumber(reward * task.task_time)} OCOIN in{" "}
                        {task.task_time} hr ({formatNumber(reward)} OCOIN/hr)
                      </div>
                      <div>
                        {coffees.map((coffee) => {
                          const coffeeCost = Number(
                            coffee.item_amount.split(" ")[0]
                          );
                          const rewardAveragePerHour = getAverageRewardPerHour(
                            rank.man_hours,
                            task.task_diff,
                            rank.success_rate - coffee.average_success_rate,
                            coffeeCost
                          );
                          const rewardAverage =
                            rewardAveragePerHour *
                            (task.task_time - coffee.average_reduce_time / 60);
                          return (
                            <div
                              className="grid grid-cols-7"
                              key={`coffee-${coffee.item_id}`}
                            >
                              <div>{coffee.item_name.slice(0, 3)}</div>
                              <div className="col-span-2">
                                <span className="uppercase text-gray-400 text-xs">
                                  Avg{" "}
                                </span>
                                <span className="font-mono">
                                  {formatNumber(rewardAverage)}
                                </span>
                              </div>
                              <div className="col-span-2">
                                <span className="uppercase text-gray-400 text-xs">
                                  Avg/hr{" "}
                                </span>
                                <span className="font-mono">
                                  {formatNumber(rewardAveragePerHour)}
                                </span>
                              </div>
                              <div className="col-span-2">
                                <span className="uppercase text-gray-400 text-xs">
                                  PB{" "}
                                </span>
                                <span className="font-mono">Day</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
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
