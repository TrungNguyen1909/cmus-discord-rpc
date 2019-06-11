const pad = arg => arg < 10 ? `0${arg}` : `${arg}`;

const parseTime = (arg) => {
    let hr = Math.floor(arg / 3600),
        min = Math.floor((arg % 3600) / 60)
        sec = Math.floor(arg % 60);
    return `${hr ? `${pad(hr)}:` : ''}${pad(min)}:${pad(sec)}`
}

module.exports = { parseTime }