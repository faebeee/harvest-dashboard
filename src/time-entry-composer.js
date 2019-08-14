/**
 * @param {TimeEntry[]} time_entries
 */
export function getTimeByTask(time_entries) {
    return time_entries.reduce((tasks, time_entry) => {
        const { hours, task, project, notes } = time_entry;
        const entryName = `${ project.code || project.name } ${ task.name } ${ notes || '' }`;
        let actualHours = tasks.has(entryName) ? tasks.get(entryName) : 0;
        tasks.set(entryName, actualHours + hours);
        return tasks;
    }, new Map());
}

/**
 * @param {TimeEntry[]} time_entries
 */
export function getTimeByClient(time_entries) {
    return time_entries.reduce((tasks, time_entry) => {
        const { hours, client } = time_entry;
        const entryName = `${ client.name }`;
        let actualHours = tasks.has(entryName) ? tasks.get(entryName) : 0;
        tasks.set(entryName, actualHours + hours);
        return tasks;
    }, new Map());
}

/**
 * @param {TimeEntry[]} time_entries
 */
export function getTimeByProject(time_entries) {
    return time_entries.reduce((tasks, time_entry) => {
        const { hours, project } = time_entry;
        const entryName = `${ project.code || project.name }`;
        let actualHours = tasks.has(entryName) ? tasks.get(entryName) : 0;
        tasks.set(entryName, actualHours + hours);
        return tasks;
    }, new Map());
}

/**
 * @param {TimeEntry[]} time_entries
 */
export function getTimeByDay(time_entries) {
    return time_entries.reduce((tasks, time_entry) => {
        const { hours, spent_date } = time_entry;
        const entryName = `${ spent_date }`;
        let actualHours = tasks.has(entryName) ? tasks.get(entryName) : 0;
        tasks.set(entryName, actualHours + hours);
        return tasks;
    }, new Map());
}

/**
 * @param {TimeEntry[]} time_entries
 */
export function getAll(time_entries) {
    return time_entries.reduce((acc, time_entry) => {
        const { hours } = time_entry;
        return acc + hours;
    }, 0);
}
