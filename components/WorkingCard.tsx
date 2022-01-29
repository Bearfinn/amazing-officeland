import dayjs from "dayjs";
import { FunctionComponent, useEffect, useState } from "react";
import { RARITY_INFO } from "../utils/officeland";
import duration from "dayjs/plugin/duration";
import { StaffInfo } from "../types";
dayjs.extend(duration);

interface WorkingCardProps {
  employeeInfo: StaffInfo;
  taskEndTime: dayjs.Dayjs | null;
}

const WorkingCard: FunctionComponent<WorkingCardProps> = ({
  employeeInfo,
  taskEndTime,
}) => {
  const [time, setTime] = useState<string | null>("");
  useEffect(() => {
    const timer = setInterval(() => {
      const remainingTime = taskEndTime
      ? dayjs.duration(taskEndTime.diff(dayjs())).format("HH:mm:ss")
      : null;
      setTime(remainingTime)
    }, 1000)

    return () => clearInterval(timer)
  }, [taskEndTime])

  return (
    <div key={employeeInfo.asset_id} className="flex gap-2">
      <div
        className={`uppercase text-xs px-2 py-1 rounded inline ${
          RARITY_INFO[employeeInfo?.data.rarity || "intern"].bg_color
        }`}
      >
        {employeeInfo?.data.rarity}
      </div>
      <div>{employeeInfo?.name}</div>
      <div>{time}</div>
    </div>
  );
};

export default WorkingCard;
