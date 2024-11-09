export default function handler(req, res) {
  const { pattern } = req.query;

  // Match the pattern xdy+z where z can be a float, followed by any tail (e.g., _aaaaa)
  const match = pattern.match(/^(\d*)d(\d+)(\+(\d*\.?\d+))?.*/); // optional +z part, allow any tail

  if (!match) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"); // Disable caching for invalid input
    res.setHeader("Content-Type", "text/html");
    res.status(400).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta property="og:title" content="Dice Roll Error">
          <meta property="og:description" content="Invalid dice roll format">
          <meta name="twitter:card" content="summary">
          <meta name="twitter:title" content="Dice Roll Error">
          <meta name="twitter:description" content="Invalid dice roll format">
          <title>Dice Roll Error</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background-color: #f5f5f5;
            }
            h1 {
              color: #dc3545;
              text-align: center;
              padding: 2rem;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          <h1>Invalid format. Please use /xdy+z format.</h1>
        </body>
      </html>
    `);
    return;
  }

  // Extract x, y, and z from the regex match
  const x = match[1] ? parseInt(match[1], 10) : 1;  // Default to 1 if x is not provided
  const y = parseInt(match[2], 10);  // y is always required
  const z = match[4] ? parseFloat(match[4]) : 0;  // Default to 0 if z is not provided, ensure it's a float

  // Generate random dice rolls
  const rolls = Array.from({ length: x }, () => Math.floor(Math.random() * y) + 1);

  // Calculate the sum
  const sum = rolls.reduce((acc, val) => acc + val, 0) + z;

  // Create a descriptive title and description
  const description = `🎲: ${sum} ( = [${rolls.join(", ")}] + ${z})`;

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"); // Disable caching for this response
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta property="og:title" content="${description}">
        <meta property="og:description" content="${description}">
        <meta property="og:type" content="website">
        <meta name="twitter:card" content="summary">
        <meta name="twitter:title" content="${description}">
        <meta name="twitter:description" content="${description}">
        <title>${description}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
          }
          .result {
            text-align: center;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          h1 {
            color: #2c3e50;
            margin-bottom: 1rem;
          }
          .formula {
            color: #666;
            font-size: 1.2rem;
          }
        </style>
      </head>
      <body>
        <div class="result">
          <h1>🎲: ${sum}</h1>
          <div class="formula"> = [${rolls.join(", ")}] + ${z}</div>
        </div>
      </body>
    </html>
  `);
}
