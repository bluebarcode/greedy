import {
  Beverage,
  Diet,
  Food,
  Location,
  Masterdata,
  Party,
  Person
} from './party-types';
// Persons
export const Luke: Person = {
  name: 'Luke Skywalker',
  diet: Diet.meat,
  age: 21
};
export const Leia: Person = {
  name: 'Leia Skywalker',
  diet: Diet.vegetarian,
  age: 21
};
export const Anakin: Person = {
  name: 'Anakin Skywalker',
  diet: Diet.vegan,
  age: 39
};
export const Sheev: Person = {
  name: 'Sheev Palpatine',
  diet: Diet.meat,
  age: 56
};
export const Rey: Person = { name: 'Rey', diet: Diet.vegetarian, age: 10 };
export const r2d2: Person = { name: 'r2d2', diet: Diet.unknown, age: 29 };
export const Padme: Person = {
  name: 'Padme Amidala',
  diet: Diet.vegan,
  age: 49
};
export const JarJar: Person = {
  name: 'JarJar Binks',
  diet: Diet.meat,
  age: 80
};
export const allPersons = [Luke, Leia, Anakin, Sheev, Rey, r2d2, Padme, JarJar];

// Food
export const Zucchini: Food = { name: 'Zucchini', diet: Diet.vegan };
export const GarlicSauce: Food = { name: 'Carrot', diet: Diet.vegetarian };
export const Ketchup: Food = { name: 'Ketchup', diet: Diet.vegan };
export const Mustard: Food = { name: 'Mustard', diet: Diet.vegan };
export const Steaks: Food = { name: 'Steaks', diet: Diet.meat };
export const GarlicBread: Food = { name: 'Garlic bread', diet: Diet.vegan };
export const Haloumi: Food = { name: 'Haloumi', diet: Diet.vegetarian };
// Beverages
export const Beer: Beverage = { name: 'Beer', minAge: 16 };
export const SparklingWater: Beverage = { name: 'Sparkling Water', minAge: 0 };
export const AppleJuice: Beverage = { name: 'Apple Juice', minAge: 0 };
export const Vodka: Beverage = { name: 'Vodka', minAge: 18 };
export const Gin: Beverage = { name: 'Gin', minAge: 18 };
export const Rum: Beverage = { name: 'Rum', minAge: 18 };
export const Cola: Beverage = { name: 'Cola', minAge: 10 };
export const EnergyDrink: Beverage = { name: 'Energy Drink', minAge: 14 };
export const Wine: Beverage = { name: 'Wine', minAge: 16 };
export const Sangria: Beverage = { name: 'Sangria', minAge: 16 };
export const Tonic: Beverage = { name: 'Tonic', minAge: 0 };

//Locations
export const Deathstar: Location = { address: 'Space', owner: Sheev };
export const Tatooine: Location = { address: 'Tatooine', owner: Anakin };
export const Naboo: Location = { address: 'Naboo', owner: Padme };

// Party
export const Deathstar1: Party = {
  desiredBeverages: [Gin, Tonic, Vodka, EnergyDrink],
  desiredFoods: [Steaks, Zucchini, GarlicBread, GarlicSauce],
  location: Deathstar,
  organisator: Sheev, // Not participant
  participants: [Luke, Leia, Anakin, r2d2],
  name: 'Battle of Yavin',
  suppliers: [
    { beverages: [Vodka, EnergyDrink], foods: [Zucchini], supplier: Anakin },
    {
      beverages: [Gin, Tonic],
      foods: [GarlicBread, GarlicSauce],
      supplier: JarJar // Jar Jar is not Invited/ does no participate
    },
    { beverages: [Wine], foods: [Ketchup], supplier: Leia } // Ketchup & Wine??? (-> Not Desired)
  ]
};

export const masterdata: Masterdata = {
  beverages: [
    Beer,
    SparklingWater,
    AppleJuice,
    Vodka,
    Gin,
    Rum,
    Cola,
    EnergyDrink,
    Wine,
    Sangria,
    Tonic
  ],
  foods: [
    Zucchini,
    GarlicSauce,
    Ketchup,
    Mustard,
    Steaks,
    GarlicBread,
    Haloumi
  ],
  parties: [Deathstar1],
  partyPeople: [Luke, Leia, Anakin, r2d2, Padme, JarJar, Sheev, Rey]
};
