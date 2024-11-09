import Head from 'next/head';

export async function getServerSideProps(context) {
  const { pattern } = context.params;

  // Match the pattern xdy+z
  const match = pattern.match(/^(\d+)d(\d+)\+(\d+)$/);
  if (!match) {
    return {
      props: {
        error: 'Invalid format. Please use /xdy+z format.',
      },
    };
  }

  // Extract x, y, and z
  const x = parseInt(match[1], 10);
  const y = parseInt(match[2], 10);
  const z = parseInt(match[3], 10);

  // Generate random dice rolls
  const rolls = Array.from({ length: x }, () => Math.floor(Math.random() * y) + 1);

  // Calculate the sum
  const sum = rolls.reduce((acc, val) => acc + val, 0) + z;

  return {
    props: {
      sum,
      rolls,
      z,
      pattern,
      error: null,
    },
  };
}

export default function DiceRollPage({ sum, rolls, z, pattern, error }) {
  const description = error
    ? error
    : `Result: ${sum} = [${rolls.join(', ')}] + ${z}`;

  return (
    <>
      <Head>
        <title>Dice Roll Result: {pattern}</title>
        <meta property="og:title" content={`Dice Roll Result: ${pattern}`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://my-nextjs-app-olive.vercel.app/${pattern}`} />
        <meta property="og:image" content="https://your-image-url.com/dice-preview.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Dice Roll Result: ${pattern}`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://your-image-url.com/dice-preview.jpg" />
      </Head>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        {error ? (
          <h1>{error}</h1>
        ) : (
          <h1>
            {sum} = [{rolls.join(', ')}] + {z}
          </h1>
        )}
      </div>
    </>
  );
}
