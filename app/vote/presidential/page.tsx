"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GalleryHorizontal, Rows3 } from "lucide-react";
import SingleVoteCarouselViewProps from "@/components/custom/single-vote-carouselview";
import { Candidate } from "@/lib/definitions";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SingleVoteListView from "@/components/custom/single-vote-listview";

const candidates: Candidate[] = [
  {
    id: 1,
    name: "Bongbong Marcos",
    party: "Partido Federal ng Pilipinas",
    image: "https://picsum.photos/id/1015/800/600",
  },
  {
    id: 2,
    name: "Leni Robredo",
    party: "Liberal Party",
    image: "https://picsum.photos/id/1029/800/600",
  },
  {
    id: 3,
    name: "Manny Pacquiao",
    party: "PROMDI",
    image: "https://picsum.photos/id/1018/800/600",
  },
  {
    id: 4,
    name: "Isko Moreno",
    party: "Aksyon Demokratiko",
    image: "https://picsum.photos/id/1019/800/600",
  },
  {
    id: 5,
    name: "Ping Lacson",
    party: "Partido Reporma",
    image: "https://picsum.photos/id/1020/800/600",
  },
  {
    id: 6,
    name: "Leody de Guzman",
    party: "Partido Lakas ng Masa",
    image: "https://picsum.photos/id/1021/800/600",
  },
  {
    id: 7,
    name: "Norberto Gonzales",
    party: "Partido Demokratiko Sosyalista ng Pilipinas",
    image: "https://picsum.photos/id/1022/800/600",
  },
];

type DisplayType = "list" | "carousel" | "grid";

type DisplayTogglesType = {
  id: DisplayType;
  icon: () => JSX.Element;
};

const DisplayToggles: DisplayTogglesType[] = [
  {
    id: "carousel",
    icon: () => <GalleryHorizontal />,
  },
  {
    id: "list",
    icon: () => <Rows3 />,
  },
];

function Presidential() {
  const [displayType, setDisplayType] = useState<DisplayType>("list");

  return (
    <div className='flex flex-1 flex-col p-3 min-w-[340px]'>
      <div className='justify-end flex'>
        <ToggleGroup size='lg' defaultValue={displayType} type='single'>
          {DisplayToggles.map((item: DisplayTogglesType) => (
            <ToggleGroupItem
              key={item.id}
              onClick={() => setDisplayType(item.id)}
              value={item.id}>
              {item.icon()}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className='flex justify-start mt-5'>
        <div
          className={`${
            displayType === "carousel" ? "block" : "hidden"
          } w-full`}>
          <SingleVoteCarouselViewProps candidates={candidates} />
        </div>

        <div
          className={`${displayType === "list" ? "block" : "hidden"} w-full`}>
          <SingleVoteListView candidates={candidates} />
        </div>
      </div>
    </div>
  );
}

export default Presidential;
