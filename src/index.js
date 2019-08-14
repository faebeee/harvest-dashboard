import { timeByClient, timeByDay, timeByProject, timeByTask, weekTotal } from './widgets';

const blessed = require('blessed');
const contrib = require('blessed-contrib');

const args = require('gar')(process.argv.slice(2));

const curr = new Date;
const from = new Date(args.from || new Date(curr.setDate(curr.getDate() - curr.getDay()))).toISOString();
const to = (args.to ? new Date(args.to) : new Date()).toISOString();
const screen = blessed.screen();
const grid = new contrib.grid({ rows: 8, cols: 8, screen: screen });
const markdown = grid.set(0, 0, 1, 6, contrib.markdown);
markdown.setMarkdown(`# Harvest Dashboard \n showing data from ${ from } to ${ to }`);
const excludedClients = [...args.ignore.split(',')];

Promise.all([
    weekTotal(grid, 6, 0, 2, 1, from, to, excludedClients),
    timeByTask(grid, 0, 1, 4, 3, from, to, excludedClients),
    timeByClient(grid, 4, 1, 4, 3, from, to, excludedClients),
    timeByProject(grid, 4, 4, 4, 4, from, to, excludedClients),
    timeByDay(grid, 0, 4, 4, 4, from, to, excludedClients),
]).then(() => {
    screen.render();
});


screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

