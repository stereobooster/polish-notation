const tokenize = str => str.trim().split(/\s+/);

const isOperator = token => ["+", "-", "*", "/"].includes(token);
const isNumber = token => {
  const n = parseInt(token, 10);
  return !isNaN(n) || n < 0;
};

const parse = (tokens, depth = 0) => {
  if (tokens.length === 0 || tokens.length === 2) {
    throw new Error(`Unexpected EOF`);
  }
  if (tokens.length === 1) {
    const token = tokens.shift();
    if (!isNumber(token)) {
      throw new Error(`Expected number instead got ${token}`);
    }
    return [parseInt(token, 10)];
  }
  const operator = tokens.shift();
  if (!isOperator(operator)) {
    throw new Error(`Expected operator instead got ${operator}`);
  }
  let first;
  let next = tokens[0];
  if (!isOperator(next)) {
    first = tokens.shift();
    if (isNumber(first)) {
      first = parseInt(first, 10);
    }
  } else {
    first = parse(tokens, depth + 1);
  }
  next = tokens[0];
  let second;
  if (!isOperator(next)) {
    second = tokens.shift();
    if (isNumber(second)) {
      second = parseInt(second, 10);
    }
  } else {
    second = parse(tokens, depth + 1);
  }
  if (depth === 0 && tokens.length !== 0) {
    throw new Error(`Unexpected input ${tokens}`);
  }
  return [operator, first, second];
};

// parse(tokenize("+ / - - 3 2 - 5 1 * 2 4 3"));

const evaluate = (ast, variables) => {
  let token;
  if (!Array.isArray(ast)) {
    token = ast;
  } else if (ast.length === 1) {
    token = tokens[0];
  }
  if (token !== undefined) {
    if (Number.isInteger(token)) {
      return token;
    } else if (variables[token] === undefined) {
      throw new Error(`Unkonwn varaibale ${token}`);
    } else {
      return variables[token];
    }
  }
  const [operator, first, second] = ast;
  switch (operator) {
    case "+":
      return evaluate(first, variables) + evaluate(second, variables);
      break;
    case "-":
      return evaluate(first, variables) - evaluate(second, variables);
      break;
    case "*":
      return evaluate(first, variables) * evaluate(second, variables);
      break;
    case "/":
      return Math.floor(
        evaluate(first, variables) / evaluate(second, variables)
      );
      break;
    default:
      throw new Error(`Unknown operator ${operator}`);
  }
};

// evaluate(parse(tokenize("+ / - - 3 2 - 5 1 * 2 4 3")), {});

function result_expression(expression, variables) {
  try {
    return evaluate(parse(tokenize(expression)), variables);
  } catch (e) {
    return null;
  }
}