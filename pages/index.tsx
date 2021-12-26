import type { NextPage } from "next";
import { useEffect, useState } from "react";
import {
  Coffee,
  getCoffees,
  getTaskList,
  RARITY_INFO,
  TaskList,
} from "../utils/officeland";

const Home: NextPage = () => {
  const [taskList, setTaskList] = useState<TaskList[]>([]);
  const [coffees, setCoffees] = useState<Coffee[]>([]);

  useEffect(() => {
    getTaskList().then((taskList) => setTaskList(taskList));
    getCoffees().then((coffees) => setCoffees([{
      success_rate: [0, 0],
      reduce_time: [0, 0],
      item_name: "-",
      item_amount: "0.0000 OCOIN"
    }, ...coffees]));
  }, []);

  return (
    <div>
      {taskList.map((task) => {
        return (
          <div className="grid grid-cols-7" key={`rarity-${name}`}>
            <div>{task.task_name}</div>
            {Object.entries(RARITY_INFO).map(([name, rank]) => {
              const reward = task.task_time * (rank.man_hours - task.task_diff);
              const rewardAverage =
                (rank.success_rate / 100) * reward +
                (1 - rank.success_rate / 100) * 0.2 * reward;
              return (
                <div className="" key={name}>
                  {task.ranks.includes(name) && (
                    <>
                      <div className="uppercase">{name}</div>
                      <div>
                        {new Intl.NumberFormat("en-US", {
                          maximumFractionDigits: 2,
                        }).format(reward)}{" "}
                        OCOIN in {task.task_time} hr (
                        {new Intl.NumberFormat("en-US", {
                          maximumFractionDigits: 2,
                        }).format(reward / task.task_time)}{" "}
                        OCOIN/hr)
                      </div>
                      <div>
                        {coffees.map((coffee) => {
                          const averageSuccess =
                            (coffee.success_rate[0] + coffee.success_rate[1]) /
                            2 /
                            100;
                          const averageTimeReduce =
                            (coffee.reduce_time[0] + coffee.reduce_time[1]) /
                            2 /
                            60;
                          const coffeeCost = Number(
                            coffee.item_amount.split(" ")[0]
                          );
                          const rewardAverage =
                            (rank.success_rate / 100 + averageSuccess) *
                              reward +
                            (1 - rank.success_rate / 100) * 0.2 * reward -
                            coffeeCost;
                          return (
                            <div
                              className="grid grid-cols-5"
                              key={`coffee-${coffee.item_id}`}
                            >
                              <div>{coffee.item_name.slice(0, 3)}</div>
                              <div className="col-span-2">
                                <span className="uppercase text-gray-400 text-xs">
                                  Avg{" "}
                                </span>
                                <span className="font-mono">
                                  {new Intl.NumberFormat("en-US", {
                                    maximumFractionDigits: 2,
                                  }).format(rewardAverage)}
                                </span>
                              </div>
                              <div className="col-span-2">
                                <span className="uppercase text-gray-400 text-xs">
                                  Avg/hr{" "}
                                </span>
                                <span className="font-mono">
                                  {new Intl.NumberFormat("en-US", {
                                    maximumFractionDigits: 2,
                                  }).format(
                                    rewardAverage /
                                      (task.task_time - averageTimeReduce)
                                  )}
                                </span>
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
