const message = "Some message from myModule.js";
const name = "Jaehun";
const location = "Seoul";

const getGreeting = (name) => `Welcome to the course ${name}`;

export { message as msg, name, location as default, getGreeting };
