import { useCallback, useContext } from "react";
import { AppContext } from "../pages/_app";
import { CoffeeExtended } from "../types";

export const useReward = () => {
  const { tax, ocoinPrice } = useContext(AppContext);

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
        // if (includeNewSlotPrice) {
        //   investPriceInOcoin += newSlotPrice;
        // }
        let paybackPeriod = investPriceInOcoin / (ocoinPerHour * 24);
        // if (includeFeeDuration) {
        //   paybackPeriod += 5; // days
        // }
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
      const reducedSuccessRate = 0.25 * workTimeWithoutCoffee;
      const averageSuccessRate =
        (successRate + (successRate - reducedSuccessRate * (sleep - 1))) / 2; // Average of maximum success rate and minimum success rate after working `sleep - 1` times

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

      // const paybackPeriod = getPaybackPeriod(
      //   averageRewardPerHour,
      //   lowestPriceMapping[rarity]
      // );
      return {
        averageRewardPerHour,
        averageReward,
        averageSuccessRate,
        averageWorkTime,
        reducedSuccessRate,
        workTime,
        // paybackPeriod,
      };
    },
    [getReward, ocoinPrice]
  );

  return {
    calculateReward,
  }
};
