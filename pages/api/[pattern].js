export default function handler(req, res) {
    const { pattern } = req.query;
  
    // Match the pattern xdy+z
    const match = pattern.match(/^(\d+)d(\d+)\+(\d+)$/);
    if (!match) {
      res.setHeader("Content-Type", "text/html");
      res.status(400).send("<h1>Invalid format. Please use /xdy+z format.</h1>");
      return;
    }
  
    // Extract x, y, and z
    const x = parseInt(match[1], 10);
    const y = parseInt(match[2], 10);
    const z = parseInt(match[3], 10);
  
    // Generate random dice rolls
    const rolls = Array.from({ length: x }, () => Math.floor(Math.random() * y) + 1);
  
    // Calculate the sum
    const sum = rolls.reduce((acc, val) => acc + val, 0) + z;
  
    // Send clean HTML response
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`<h1>${sum} = [${rolls.join(", ")}] + ${z}</h1>`);
  }
  