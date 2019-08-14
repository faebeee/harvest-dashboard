import { loadTimeByClient, loadTimeByDay, loadTimeByProject, loadTimeByTask, loadTotalOfWeek } from './data-fetcher';
import round from './round';
import contrib from 'blessed-contrib';

export function timeByTask(grid, x, y, w, h, from, to, excludedClients) {
    return loadTimeByTask(from, to, excludedClients)
        .then((result) => {
            const headers = ['Task', 'Hours', 'Avg'];
            const data = [];

            const table = grid.set(y, x, h, w, contrib.table,
                {
                    fg: 'white'
                    , selectedFg: 'white'
                    , label: `Report by Task`
                    , border: { type: 'line', fg: 'cyan' }
                    , columnSpacing: 10 //in chars
                    , columnWidth: [50, 5, 5] /*in chars*/
                });

            result.forEach((val, key) => {
                data.push([key.slice(0, 50), round(val), round(val / 5)]);
            });

            table.setData({
                headers,
                data,
            });
        });
}

export function timeByClient(grid, x, y, w, h, from, to, excludedClients) {
    return loadTimeByClient(from, to, excludedClients)
        .then((result) => {
            const headers = ['Client    ', 'Hours', 'Avg'];
            const data = [];

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

            result.forEach((val, key) => {
                data.push([key.slice(0, 30), round(val), round(val / 5)]);
            });

            table.setData({
                headers,
                data,
            });
        });
}

export function timeByProject(grid, x, y, w, h, from, to, excludedClients) {
    return loadTimeByProject(from, to, excludedClients)
        .then((result) => {
            const headers = ['Project', 'Hours', 'Avg'];
            const data = [];

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

            result.forEach((val, key) => {
                data.push([key, round(val), round(val / 5)]);
            });

            table.setData({
                headers,
                data,
            });
        });
}

export function timeByDay(grid, x, y, w, h, from, to, excludedClients) {
    return loadTimeByDay(from, to, excludedClients)
        .then((result) => {
            const data = [];
            const bar = grid.set(y, x, h, w, contrib.bar,
                {
                    label: 'Hours by day'
                    , barWidth: 12
                    , barSpacing: 0
                    , maxHeight: 12
                });

            const titles = [];

            result.forEach((val, key) => {
                titles.push(key.slice(0, 30));
                data.push(round(val));
            });

            bar.setData({
                titles,
                data,
            });
        });
}

export function weekTotal(grid, x, y, w, h, from, to, excludedClients) {
    return loadTotalOfWeek(from, to, excludedClients)
        .then((hours) => {
            var lcd = grid.set(y, x, h, w, contrib.lcd,
                {
                    segmentWidth: 0.06 // how wide are the segments in % so 50% = 0.5
                    , segmentInterval: 0.11 // spacing between the segments in % so 50% = 0.550% = 0.5
                    , strokeWidth: 0.11 // spacing between the segments in % so 50% = 0.5
                    , elements: 4 // how many elements in the display. or how many characters can be displayed.
                    , display: 321 // what should be displayed before first call to setDisplay
                    , elementSpacing: 4 // spacing between each element
                    , elementPadding: 2 // how far away from the edges to put the elements
                    , color: 'white' // color for the segments
                    , label: 'Hours this week'
                });

            lcd.setDisplay(hours + 'H'); // will display "23G"
        });
}
