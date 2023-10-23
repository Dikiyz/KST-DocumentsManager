export default class System {
    static Debug_ON = true;
    static Info_ON = true;

    static debug(text, ...args) {
        try {
            if (!this.Debug_ON) return;
            if (args.length > 0) console.log(
                `\x1b[36m[SERVER_DEBUG] ` +
                `\x1b[33m[${this.getTime()}]` +
                `\x1b[0m: ${text}`, args
            );
            else console.log(
                `\x1b[36m[SERVER_DEBUG] ` +
                `\x1b[33m[${this.getTime()}]` +
                `\x1b[0m: ${text}`
            );
        } catch (err) { /* TODO */ }
    }

    static error(text, ...args) {
        try {
            if (args.length > 0) console.log(
                `\x1b[31m[SERVER_ERROR] ` +
                `\x1b[33m[${this.getTime()}]` +
                `\x1b[0m: ${text}`, args
            );
            else console.log(
                `\x1b[31m[SERVER_ERROR] ` +
                `\x1b[33m[${this.getTime()}]` +
                `\x1b[0m: ${text}`
            );
            // TODO: MySQL write.
        } catch (err) { /* TODO */ }
    }

    static successful(text, ...args) {
        try {
            if (!this.Info_ON) return;
            if (args.length > 0) console.log(
                `\x1b[32m[SERVER_SUCCESSFUL] ` +
                `\x1b[33m[${this.getTime()}]` +
                `\x1b[0m: ${text}`, args
            );
            else console.log(
                `\x1b[32m[SERVER_SUCCESSFUL] ` +
                `\x1b[33m[${this.getTime()}]` +
                `\x1b[0m: ${text}`
            );
        } catch (err) { /* TODO */ }
    }

    static getTime() {
        try {
            const date = new Date();
            return `${this.formatTime(date.getHours(), date.getMinutes())} ${this.formatDate(date)}`;
        } catch (err) { error(`Time getting error: ` + err); }
    }

    static formatDate(date) {
        try {
            const day = String(date.getDate());
            const month = String(date.getMonth() + 1);
            return `${day.length === 1 ? `0${day}` : `${day}`}-${month.length === 1 ? `0${month}` : `${month}`}-${date.getFullYear()}`;
        } catch (err) { error(`Time formating error: ` + err); }
    }

    static formatTime(hours = 0, minutes = 0) {
        try {
            hours = String(hours);
            minutes = String(minutes);
            return `${hours.length === 1 ? `0${hours}` : `${hours}`}:${minutes.length === 1 ? `0${minutes}` : `${minutes}`}`;
        } catch (err) { error(`Time formating error: ` + err); }
    }
};