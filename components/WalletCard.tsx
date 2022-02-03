import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { FunctionComponent, useEffect, useState } from "react";
import WorkingCard from "../components/WorkingCard";
import { useReward } from "../hooks/useReward";
import { AssignedTask, StaffInfo } from "../types";
import {
  getAssignedTasks,
  getNFTByAssetIds,
  getWorkingStaff
} from "../utils/officeland";

dayjs.extend(duration);

interface WalletCardProps {
  address: string;
}

const WalletCard: FunctionComponent<WalletCardProps> = ({ address }) => {
  const [ownedStaffs, setOwnedStaffs] = useState<StaffInfo[]>([]);
  const [employeeAssetIds, setEmployeeAssetIds] = useState<string[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<AssignedTask[]>([]);

  useEffect(() => {
    try {
      if (address) {
        let assetIds: string[] = [];
        getWorkingStaff(address as string)
          .then((staff) => {
            assetIds = staff[0]?.asset_ids || [];
            setEmployeeAssetIds(assetIds);
          })
          .then(() => {
            getNFTByAssetIds(assetIds).then((staff) => setOwnedStaffs(staff));
          });
        getAssignedTasks(address as string).then((tasks) =>
          setAssignedTasks(tasks)
        );
      }
    } catch (error) {
      console.error(error);
    }
  }, [address]);

  const getStaffInfo = (asset_id: string) => {
    return ownedStaffs.find((staff) => staff.asset_id === asset_id);
  };

  const { calculateReward } = useReward()

  return (
    <div className="shadow-lg rounded-lg bg-stone-800 p-4">
      <div className="my-4">
        <div className="text-xl font-mono">{address}</div>
      </div>
      <div className="flex flex-col gap-2">
        {employeeAssetIds.map((employeeAssetId) => {
          const employeeInfo = getStaffInfo(employeeAssetId);
          const assignedTask = assignedTasks.find(
            (task) => employeeAssetId === task.asset_id
          );
          const taskEndTime = assignedTask
            ? dayjs(assignedTask.task_end * 1000)
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

export default WalletCard;
