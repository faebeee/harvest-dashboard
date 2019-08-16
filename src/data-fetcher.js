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

/**
 *
 * @param {string} from
 * @param {string} to
 * @return {Promise<TimeEntry[]>}
 */
function getTimeEntries(from, to) {
    return harvest.timeEntries.list({
        from,
        to
    })
        .then((response) => {
            HARVVEST_CACHE.set('time_entries', response.time_entries);
            return response.time_entries;
        })
}

/**
 *
 * @param from
 * @param to
 * @param excludedClients
 * @return {Promise<TimeEntry>}
 */
export function loadTimeByTask(from, to, excludedClients) {
    return getTimeEntries(from, to)
        .then((time_entries) => filterEntries(time_entries, excludedClients))
        .then((time_entries) => sortEntries(time_entries))
        .then((time_entries) => getTimeByTask(time_entries))
}

/**
 *
 * @param from
 * @param to
 * @param excludedClients
 * @return {Promise<TimeEntry>}
 */
export function loadTimeByClient(from, to, excludedClients) {
    return getTimeEntries(from, to)
        .then((time_entries) => filterEntries(time_entries, excludedClients))
        .then((time_entries) => sortEntries(time_entries))
        .then((time_entries) => getTimeByClient(time_entries))
}

/**
 *
 * @param from
 * @param to
 * @param excludedClients
 * @return {Promise<TimeEntry>}
 */
export function loadTimeByDay(from, to, excludedClients) {
    return getTimeEntries(from, to)
        .then((time_entries) => filterEntries(time_entries, excludedClients))
        .then((time_entries) => sortEntries(time_entries))
        .then((time_entries) => getTimeByDay(time_entries))
}

/**
 *
 * @param from
 * @param to
 * @param excludedClients
 * @return {Promise<TimeEntry>}
 */
export function loadTimeByProject(from, to, excludedClients) {
    return getTimeEntries(from, to)
        .then((time_entries) => filterEntries(time_entries, excludedClients))
        .then((time_entries) => sortEntries(time_entries))
        .then((time_entries) => getTimeByProject(time_entries))
}

/**
 *
 * @param from
 * @param to
 * @param excludedClients
 * @return {Promise<number>}
 */
export function loadTotalOfWeek(from, to, excludedClients) {
    return getTimeEntries(from, to)
        .then((time_entries) => filterEntries(time_entries, excludedClients))
        .then((time_entries) => sortEntries(time_entries))
        .then((time_entries) => getAll(time_entries))
}
