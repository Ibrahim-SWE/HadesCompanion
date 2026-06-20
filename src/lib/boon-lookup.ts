import boonsData from "$lib/data/hades2/boons.json";
import type { BoonData } from "$lib/types/hades2";

const boonByName = new Map<string, BoonData>(
  Object.values(boonsData).map((boon) => [boon.name, boon as BoonData]),
);

export function getBoonByName(name: string): BoonData | undefined {
  return boonByName.get(name);
}
