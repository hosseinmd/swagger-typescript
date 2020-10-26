
const snakeRegex = /[-_]/gi
const upperCaseRegex = /([A-Z][a-z]+)/g

const lower = (s: string) => s.toLowerCase();

class NamingParser {
    pascal = (str: string) => {
        return str.split(snakeRegex)
            .map(s => `${s[0].toUpperCase()}${s.substr(1)}`)
            .join('');
    };
    "snake-upper" = (str: string) => {
        return str.replace('-', '_')
            .split(upperCaseRegex)
            .filter(a => a)
            .map(lower)
            .join('_')
            .replace(/__+/g, '_').toUpperCase();
    };
    snake = (str: string) => {
        return str.replace('-', '_')
            .split(upperCaseRegex)
            .filter(a => a)
            .map(lower)
            .join('_')
            .replace(/__+/g, '_');
    };
    camel = (str: string) => {
        return str.split(snakeRegex)
            .filter(a => a)
            .map((s, i) => (i === 0 ? s[0].toLowerCase() + s.substr(1) : s[0].toUpperCase() + s.substr(1)))
            .join('')
    }
}

const namingParse = new NamingParser();

function getNamingParse<T extends keyof NamingParser>(parserName: T): NamingParser[T] {
    return namingParse[parserName];
}

export { getNamingParse }