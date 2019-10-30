export enum Diet {
  vegan,
  vegetarian,
  meat,
  unknown
}
export interface Person {
  name: string;
  age: number;
  diet: Diet;
}

export interface Location {
  address: string;
  owner: Person;
}
export interface Beverage {
  name: string;
  minAge: number;
}

export interface Food {
  name: string;
  diet: Diet;
}
export interface Supplier {
  supplier: string;
  foods: Food[];
  beverages: Beverage[];
}
export interface Party {
  name: string;
  location: Location;
  participants: Person[];
  organisator: Person;
  desiredBeverages: Beverage[];
  desiredFoods: Food[];
  suppliers: Supplier[];
}

export interface Masterdata {
  partyPeople: Person[];
  foods: Food[];
  beverages: Beverage[];
  parties: Party[];
}
