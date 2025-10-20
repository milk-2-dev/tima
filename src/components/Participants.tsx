import { Button } from "@/components/ui/button";

export default function Participants() {
  return (
    <div className="flex -space-x-[0.45rem]">
      <img
        className="ring-background rounded-full ring-1"
        src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-16_zn3ygb.jpg"
        width={24}
        height={24}
        alt="Avatar 01"
      />
      <img
        className="ring-background rounded-full ring-1"
        src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-10_qyybkj.jpg"
        width={24}
        height={24}
        alt="Avatar 02"
      />
      <img
        className="ring-background rounded-full ring-1"
        src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-15_fguzbs.jpg"
        width={24}
        height={24}
        alt="Avatar 03"
      />
    </div>
  );
}
