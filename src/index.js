import myLocation, { msg, name, getGreeting } from "./myModule";
import sum, { subtract } from "./math";

console.log(`Hello GraphQL, ${msg}, My Name is ${name}`);
console.log(myLocation);
console.log(getGreeting(name));

console.log(sum(10, 5));
console.log(subtract(10, 5));
