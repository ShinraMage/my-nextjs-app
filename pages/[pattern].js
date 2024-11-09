import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const RollPage = () => {
  const [result, setResult] = useState(null);
  const router = useRouter();
  const { pattern } = router.query;  // Capture the dynamic pattern from the URL

  // Function to process the dice roll logic
  const processDiceRoll = (pattern) => {
    const match = pattern.match(/^(\d*)d(\d+)(\+(\d*\.?\d+))?.*/); // Match xdy+z format

    if (!match) {
      // If the pattern doesn't match, set an error message
      setResult("Invalid format. Please use format like: /3d6+5 or /d20-2.");
      return;
    }

    const x = match[1] ? parseInt(match[1], 10) : 1;  // Default to 1 if x is not provided
    const y = parseInt(match[2], 10);  // y is always required
    const z = match[4] ? parseFloat(match[4]) : 0;  // Default to 0 if z is not provided

    // Generate random dice rolls
    const rolls = Array.from({ length: x }, () => Math.floor(Math.random() * y) + 1);
    const sum = rolls.reduce((acc, val) => acc + val, 0) + z;

    const description = `🎲: ${sum} (${rolls.join(", ")}${z !== 0 ? ` + ${z}` : ""})`;
    setResult(description);
  };

  // Run the dice roll logic when the pattern changes
  useEffect(() => {
    if (pattern) {
      processDiceRoll(pattern);
    }
  }, [pattern]);

  return (
    <div>
      <h1>Dice Roll</h1>
      {result ? (
        <div>
          <h2>{result}</h2>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RollPage;
