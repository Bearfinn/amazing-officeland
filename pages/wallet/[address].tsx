import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";
import { AssignedTask, StaffInfo, WorkingStaffInfo } from "../../types";
import {
  getAssignedTasks,
  getOwnedStaffs,
  getWorkingStaff,
  RARITY_INFO,
} from "../../utils/officeland";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import WorkingCard from "../../components/WorkingCard";
dayjs.extend(duration);

interface WalletPageProps {}

const WalletPage: FunctionComponent<WalletPageProps> = () => {
  const [ownedStaffs, setOwnedStaffs] = useState<StaffInfo[]>([]);
  const [employeeAssetIds, setEmployeeAssetIds] = useState<string[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<AssignedTask[]>([]);
  const { query } = useRouter();
  const { address } = query;

  useEffect(() => {
    if (address) {
      getWorkingStaff(address as string).then((staff) =>
        setEmployeeAssetIds(staff[0].asset_ids)
      );
      getOwnedStaffs(address as string).then((staff) => setOwnedStaffs(staff));
      getAssignedTasks(address as string).then((tasks) =>
        setAssignedTasks(tasks)
      );
    }
  }, [address]);

  const getStaffInfo = (asset_id: string) => {
    return ownedStaffs.find((staff) => staff.asset_id === asset_id);
  };

  return (
    <div className="container mx-auto">
      <div>{address}</div>
      <div className="flex flex-col gap-2">
        {employeeAssetIds.map((employeeAssetId) => {
          const employeeInfo = getStaffInfo(employeeAssetId);
          const assignedTask = assignedTasks.find(
            (task) => employeeAssetId === task.asset_id
          );
          const taskEndTime = assignedTask
            ? dayjs(assignedTask.task_end * 1000)
            : null;
          const remainingTime = taskEndTime
            ? dayjs.duration(taskEndTime.diff(dayjs())).format("HH:mm:ss")
            : null;
          return employeeInfo ? (
            <WorkingCard
              key={employeeAssetId}
              employeeInfo={employeeInfo}
              taskEndTime={taskEndTime}
            ></WorkingCard>
          ) : (
            <div></div>
          );
        })}
      </div>
    </div>
  );
};

export default WalletPage;
