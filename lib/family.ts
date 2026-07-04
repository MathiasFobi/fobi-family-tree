export type PersonStatus = "living" | "remembered";

export interface Person {
  id: string;
  name: string;
  middleName?: string | null;
  surname?: string | null;
  maidenName?: string | null;
  spouse?: string | null;
  status: PersonStatus;
  generation: 1 | 2 | 3;
  parentId?: string | null;
  children: string[];
}

export interface Ancestor {
  name: string;
  role: string;
}

export interface FamilyData {
  ancestors: Ancestor[];
  stats: {
    gen1: number;
    gen2: number;
    gen3: number;
    remembered: number;
    total: number;
  };
  generations: {
    "1": Person[];
    "2": Person[];
    "3": Person[];
  };
}

import raw from "@/data/family.json";
const data = raw as unknown as FamilyData;

export function getAllPeople(): Person[] {
  return [
    ...data.generations["1"],
    ...data.generations["2"],
    ...data.generations["3"],
  ];
}

export function getPersonById(id: string): Person | undefined {
  return getAllPeople().find((p) => p.id === id);
}

export function getChildren(personId: string): Person[] {
  return getAllPeople().filter((p) => p.parentId === personId);
}

export function getRemembered(): Person[] {
  return getAllPeople().filter((p) => p.status === "remembered");
}

export function getFamilyData(): FamilyData {
  return data;
}
