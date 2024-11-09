import Link from 'next/link';

const Custom404 = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>format: /xdy + z</h1>
      <p>Use a format like: <code>/3d6+5</code> or <code>/d20-2</code></p>
      <p>
        Go back to the <Link href="/">home page</Link>.
      </p>
    </div>
  );
};

export default Custom404;
