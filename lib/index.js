export default class StlParser {
  constructor(data) {
    this.data = data;

    this.trimmedLines = this.data.split('\n').reduce((acc, line) => {
      const trimmedLine = line.trim();

      if (trimmedLine) {
        acc.push(trimmedLine);
      }

      return acc;
    }, []);
  }
}
