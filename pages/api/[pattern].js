export default function handler(req, res) {
  const { pattern } = req.query;

  // Match the pattern xdy+z (e.g., 2d6+3 or d20)
  const match = pattern.match(/^(\d*)d(\d+)(\+(\d+))?$/);

  if (!match) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.setHeader("Expires", "-1");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Content-Type", "text/html");
    res.status(400).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
          <meta http-equiv="Pragma" content="no-cache">
          <meta http-equiv="Expires" content="0">
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
  const x = match[1] ? parseInt(match[1], 10) : 1;
  const y = parseInt(match[2], 10);
  const z = match[4] ? parseInt(match[4], 10) : 0;

  // Get current second for random seed
  const currentSecond = new Date().getSeconds();
  
  // Generate random dice rolls using current second
  const rolls = Array.from({ length: x }, () => {
    const randomValue = Math.floor(Math.random() * 1000) + currentSecond;
    return (randomValue % y) + 1;
  });

  // Calculate the sum
  const sum = rolls.reduce((acc, val) => acc + val, 0) + z;

  // Create a descriptive title and description
  const title = `Rolling ${x}d${y}${z !== 0 ? `+${z}` : ''}`;
  const description = `Result: ${sum} (Rolls: [${rolls.join(", ")}] + ${z})`;

  // Set comprehensive no-cache headers
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  res.setHeader("Expires", "-1");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Expires" content="0">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${description}">
        <meta property="og:type" content="website">
        <meta name="twitter:card" content="summary">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${description}">
        <title>${title}</title>
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
          .time {
            color: #999;
            font-size: 0.9rem;
            margin-top: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="result">
          <h1>${sum}</h1>
          <div class="formula">[${rolls.join(", ")}] + ${z}</div>
          <div class="time">Generated at: ${new Date().toLocaleTimeString()}</div>
        </div>
      </body>
    </html>
  `);
}