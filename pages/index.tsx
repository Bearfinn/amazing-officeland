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
import { getOcoinPrice } from "../utils/wax";

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
  const [ocoinPrice, setOcoinPrice] = useState(0);

  useEffect(() => {
    getTaskList().then((taskList) => setTaskList(taskList));
    getCoffees().then((coffees) =>
      setCoffees(
        [
          {
            success_rate: [0, 0],
            reduce_time: [0, 0],
            item_name: "No",
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

  const getReward = (
    man_hours: number,
    difficulty: number,
    task_hours: number
  ) => {
    return task_hours * (man_hours - difficulty);
  };

  const getRewardPerHour = (total_reward: number, work_hours: number) => {
    return total_reward / work_hours;
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

  const getAverageRewardPerHour = (
    average_reward: number,
    work_hours: number
  ) => {
    return average_reward / work_hours
  };

  const formatNumber = (number: number | string) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(Number(number));
  };

  const getPaybackPeriod = (ocoinPerHour: number, investPrice: number) => {
    const investPriceInOcoin = investPrice / ocoinPrice;
    return investPriceInOcoin / (ocoinPerHour * 24);
  };

  return (
    <div className="container mx-auto">
      <div className="text-2xl text-center my-8">Boss Space</div>

      {/* Header */}
      <div className="grid grid-cols-7">
        <div></div>
        {Object.entries(RARITY_INFO).map(([rarity_name, rank]) => {
          return (
            <div key={`header-${rarity_name}`}>
              <div className="uppercase">{rarity_name}</div>
              <div>
                Lowest price: {formatNumber(lowestPriceMapping[rarity_name])}{" "}
                WAX
              </div>
            </div>
          );
        })}
      </div>

      {/* Tasks */}
      {taskList.map((task) => {
        return (
          <div className="grid grid-cols-7 my-4" key={`task-${task.task_id}`}>
            <div>{task.task_name}</div>
            {Object.entries(RARITY_INFO).map(([rarity, rank]) => {
              return (
                <div className="w-96" key={`${task.task_id}-rarity-${rarity}`}>
                  {task.ranks.includes(rarity) && (
                    <>
                      <div>
                        {coffees.map((coffee) => {
                          const coffeeCost = Number(
                            coffee.item_amount.split(" ")[0]
                          );
                          const workTime =
                            ((100 -
                              rank.reduce_time -
                              coffee.average_reduce_time) /
                              100) *
                            task.task_time;

                          const averageReward = getAverageReward(
                            rank.man_hours,
                            task.task_diff,
                            rank.success_rate + coffee.average_success_rate,
                            task.task_time,
                            coffeeCost
                          );

                          const averageRewardPerHour = getAverageRewardPerHour(averageReward, workTime)
                          return (
                            <div
                              className="flex text-sm"
                              key={`coffee-${coffee.item_id}`}
                            >
                              <div className="w-9">
                                {coffee.item_name.slice(0, 3)}
                              </div>
                              <div>
                                <div>
                                  {formatNumber(averageReward)} in {formatNumber(workTime)}h (
                                  {formatNumber(averageRewardPerHour)}/hr)
                                </div>
                                <div>
                                  <span className="uppercase text-gray-400 text-xs">
                                    PB{" "}
                                  </span>
                                  <span className="font-mono">
                                    {formatNumber(
                                      getPaybackPeriod(
                                        averageRewardPerHour,
                                        lowestPriceMapping[rarity]
                                      )
                                    )}{" "}
                                    Days
                                  </span>
                                </div>
                              </div>
                              <div className="col-span-2"></div>
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
