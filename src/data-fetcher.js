import Harvest from 'harvest';
import { getAll, getTimeByClient, getTimeByDay, getTimeByProject, getTimeByTask } from './time-entry-composer';

require('dotenv').config();

const HARVVEST_CACHE = new Map();
const harvest = new Harvest({
    subdomain: 'localhost',
    userAgent: 'Weekly Dashboard',
    concurrency: 1,
    auth: {
        accessToken: process.env.ACCESS_TOKEN,
        accountId: process.env.ACCOUNT_ID
    }
});

/**
 *
 * @param {TimeEntry[]} time_entries
 * @param {number[]} excludedClients
 * @return {TimeEntry[]}
 */
function filterEntries(time_entries, excludedClients) {
    return time_entries.filter((entry) => {
        return !excludedClients.includes(entry.client.id);
    })
}

/**
 *
 * @param {TimeEntry[]} time_entries
 * @return {TimeEntry[]}
 */
function sortEntries(time_entries) {
    return time_entries.sort((entryA, entryB) => {
        return new Date(entryA.created_at) >= new Date(entryB.created_at) ? 1 : -1;
    })
}

function getTimeEntries(from, to) {
    if (HARVVEST_CACHE.has('time_entries')) {
        return Promise.resolve({ time_entries: HARVVEST_CACHE.get('time_entries') });
    }
    return harvest.timeEntries.list({
        from,
        to
    })
        .then((response) => {
            HARVVEST_CACHE.set('time_entries', response.time_entries);
            return response.time_entries;
        })
}

export function loadTimeByTask(from, to, excludedClients) {
    return getTimeEntries(from, to)
        .then((time_entries) => filterEntries(time_entries, excludedClients))
        .then((time_entries) => sortEntries(time_entries))
        .then((time_entries) => getTimeByTask(time_entries))
}

export function loadTimeByClient(from, to, excludedClients) {
    return getTimeEntries(from, to)
        .then((time_entries) => filterEntries(time_entries, excludedClients))
        .then((time_entries) => sortEntries(time_entries))
        .then((time_entries) => getTimeByClient(time_entries))
}

export function loadTimeByDay(from, to, excludedClients) {
    return getTimeEntries(from, to)
        .then((time_entries) => filterEntries(time_entries, excludedClients))
        .then((time_entries) => sortEntries(time_entries))
        .then((time_entries) => getTimeByDay(time_entries))
}

export function loadTimeByProject(from, to, excludedClients) {
    return getTimeEntries(from, to)
        .then((time_entries) => filterEntries(time_entries, excludedClients))
        .then((time_entries) => sortEntries(time_entries))
        .then((time_entries) => getTimeByProject(time_entries))
}

export function loadTotalOfWeek(from, to, excludedClients) {
    return getTimeEntries(from, to)
        .then((time_entries) => filterEntries(time_entries, excludedClients))
        .then((time_entries) => sortEntries(time_entries))
        .then((time_entries) => getAll(time_entries))
}
