// fixmissionbox.tsx

import { Button } from "@nextui-org/react";

type Mission = {
  missionId: number;
  name: string;
  isFinish: boolean; // isFinish 속성 추가
}

type MissionboxProps = {
  category: string;
  missions: Mission[];
  addMissionToToday: (mission: Mission) => void;
}

function FixMissionbox({ category, missions, addMissionToToday }: MissionboxProps) {
  const handleAddMission = (mission: Mission) => {
    addMissionToToday(mission);
  };

  return (
    <div className="bg-[#f4f4f4] p-4 rounded-lg mb-4 border-2 border-gray-500 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">{category}</h2>
      <div className="space-y-4">
        {missions.map((mission) => (
          <div
            key={mission.missionId}
            className="flex justify-between items-center"
          >
            <p>{mission.name}</p>
            <Button
              radius="full"
              className={`bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg`}
              onClick={() => handleAddMission(mission)}
            >
              추가
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FixMissionbox;
