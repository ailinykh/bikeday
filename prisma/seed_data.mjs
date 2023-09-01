import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

let users = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileName = path.join(__dirname, "users.json");

if (fs.existsSync(fileName)) {
  const data = fs.readFileSync(fileName);
  users = JSON.parse(data);
  console.info(
    `read ${users.length} users from ${fileName}`
  );
} else {
  console.warn(`${fileName} not found`);
}

const events = [
  {
    title: "Велодень 2012",
    date: new Date("2012-05-26T09:00:00"),
  },
  {
    title: "Велодень 2013",
    date: new Date("2013-05-25T09:00:00"),
  },
  {
    title: "Велодень 2014",
    date: new Date("2014-05-31T09:00:00"),
  },
  {
    title: "Велодень 2015",
    date: new Date("2015-05-31T09:00:00"),
  },
  {
    title: "Велодень 2016",
    date: new Date("2016-05-29T09:00:00"),
  },
  {
    title: "Велодень 2017",
    date: new Date("2017-05-28T09:00:00"),
  },
  {
    title: "Велодень 2018",
    date: new Date("2018-05-20T09:00:00"),
  },
  {
    title: "Велодень 2019",
    date: new Date("2019-06-02T09:00:00"),
  },
  {
    title: "Велодень 2022",
    date: new Date("2022-06-05T09:00:00"),
  },
  {
    title: "Велодень 2023",
    date: new Date("2023-09-10T09:00:00"),
  },
];

export { events, users };
