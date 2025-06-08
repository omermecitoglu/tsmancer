export function removeIndentations(
  text: string,
  numberOfIndentations: number,
  indentationSize: number,
) {
  return text.split("\n")
    .filter((line, index, arr) => (index > 0 && index < arr.length - 1) || line.trim().length > 0)
    .map(line => {
      const numberOfSpaces = numberOfIndentations * indentationSize;
      return numberOfSpaces >= 0 ? line.slice(numberOfSpaces) : (Array(-numberOfSpaces).fill(" ").join("") + line);
    })
    .join("\n");
}
