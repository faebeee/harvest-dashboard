import { loadTimeByClient, loadTimeByDay, loadTimeByProject, loadTimeByTask, loadTotalOfWeek } from './data-fetcher';
import round from './round';
import contrib from 'blessed-contrib';

const widgets = new Map();
const TABLE_TASK = 'task_table';
const TABLE_CLIENT = 'client_table';
const TABLE_PROJECT = 'project_table';
const BARS_DAILY = 'daily_bars';
const TEXT_WEEKLY = 'weekly_total';

/**
 *
 * @param grid
 * @param x
 * @param y
 * @param w
 * @param h
 * @param from
 * @param to
 * @param excludedClients
 * @return {Promise<TimeEntry>}
 */
export function timeByTask(grid, x, y, w, h, from, to, excludedClients) {
    if (!widgets.has(TABLE_TASK)) {
        const table = grid.set(y, x, h, w, contrib.table,
            {
                fg: 'white'
                , selectedFg: 'white'
                , label: `Report by Task`
                , border: { type: 'line', fg: 'cyan' }
                , columnSpacing: 10 //in chars
                , columnWidth: [50, 5, 5] /*in chars*/
            });
        widgets.set(TABLE_TASK, table);
    }

    return loadTimeByTask(from, to, excludedClients)
        .then((result) => {
            const headers = ['Task', 'Hours', 'Avg'];
            const data = [];

            result.forEach((val, key) => {
                data.push([key.slice(0, 50), round(val), round(val / 5)]);
            });

            widgets.get(TABLE_TASK).setData({
                headers,
                data,
            });
        });
}

/**
 *
 * @param grid
 * @param x
 * @param y
 * @param w
 * @param h
 * @param from
 * @param to
 * @param excludedClients
 * @return {Promise<TimeEntry>}
 */
export function timeByClient(grid, x, y, w, h, from, to, excludedClients) {
    if (!widgets.has(TABLE_CLIENT)) {
        const table = grid.set(y, x, h, w, contrib.table,
            {
                fg: 'white'
                , selectedFg: 'white'
                , selectedBg: 'blue'
                , label: `Report by Client`
                , border: { type: 'line', fg: 'cyan' }
                , columnSpacing: 10 //in chars
                , columnWidth: [30, 12, 12] /*in chars*/
            });
        widgets.set(TABLE_CLIENT, table);
    }

    return loadTimeByClient(from, to, excludedClients)
        .then((result) => {
            const data = [];
            const headers = ['Client    ', 'Hours', 'Avg'];

            result.forEach((val, key) => {
                data.push([key.slice(0, 30), round(val), round(val / 5)]);
            });

            widgets.get(TABLE_CLIENT).setData({
                headers,
                data,
            });
        });
}

/**
 *
 * @param grid
 * @param x
 * @param y
 * @param w
 * @param h
 * @param from
 * @param to
 * @param excludedClients
 * @return {Promise<TimeEntry>}
 */
export function timeByProject(grid, x, y, w, h, from, to, excludedClients) {
    if (!widgets.has(TABLE_PROJECT)) {
        const table = grid.set(y, x, h, w, contrib.table,
            {
                fg: 'white'
                , selectedFg: 'white'
                , selectedBg: 'blue'
                , label: `Report by Project`
                , border: { type: 'line', fg: 'cyan' }
                , columnSpacing: 10 //in chars
                , columnWidth: [30, 12, 12] /*in chars*/
            });
        widgets.set(TABLE_PROJECT, table);
    }

    return loadTimeByProject(from, to, excludedClients)
        .then((result) => {
            const data = [];
            const headers = ['Project', 'Hours', 'Avg'];

            result.forEach((val, key) => {
                data.push([key, round(val), round(val / 5)]);
            });

            widgets.get(TABLE_PROJECT).setData({
                headers,
                data,
            });
        });
}

/**
 *
 * @param grid
 * @param x
 * @param y
 * @param w
 * @param h
 * @param from
 * @param to
 * @param excludedClients
 * @return {Promise<TimeEntry>}
 */
export function timeByDay(grid, x, y, w, h, from, to, excludedClients) {
    if (!widgets.has(BARS_DAILY)) {
        const bar = grid.set(y, x, h, w, contrib.bar,
            {
                label: 'Hours by day'
                , barWidth: 12
                , barSpacing: 0
                , maxHeight: 12
            });
        widgets.set(BARS_DAILY, bar);
    }

    return loadTimeByDay(from, to, excludedClients)
        .then((result) => {
            const data = [];
            const titles = [];

            result.forEach((val, key) => {
                titles.push(key.slice(0, 30));
                data.push(round(val));
            });

            widgets.get(BARS_DAILY).setData({
                titles,
                data,
            });
        });
}

/**
 *
 * @param grid
 * @param x
 * @param y
 * @param w
 * @param h
 * @param from
 * @param to
 * @param excludedClients
 * @return {Promise<number>}
 */
export function weekTotal(grid, x, y, w, h, from, to, excludedClients) {
    if (!widgets.has(TEXT_WEEKLY)) {
        const lcd = grid.set(y, x, h, w, contrib.lcd,
            {
                segmentWidth: 0.06 // how wide are the segments in % so 50% = 0.5
                , segmentInterval: 0.11 // spacing between the segments in % so 50% = 0.550% = 0.5
                , strokeWidth: 0.11 // spacing between the segments in % so 50% = 0.5
                , elements: 4 // how many elements in the display. or how many characters can be displayed.
                , elementSpacing: 4 // spacing between each element
                , elementPadding: 2 // how far away from the edges to put the elements
                , color: 'white' // color for the segments
                , label: 'Hours this week'
            });
        widgets.set(TEXT_WEEKLY, lcd);
    }

    return loadTotalOfWeek(from, to, excludedClients)
        .then((hours) => {
            widgets.get(TEXT_WEEKLY).setDisplay(hours + 'H'); // will display "23G"
        });
}
