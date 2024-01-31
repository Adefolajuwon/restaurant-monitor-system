import fs from fs
import csv from 'csv-parser';
import { Sequelize } from 'sequelize';

const titles_fd = "../data/titles.csv"

const menu = fs.createReadStream(titles_fd)
menu.on("")