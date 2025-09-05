interface PageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: PageProps) {
  const { slug } = params;

  return (
    <div>
      <h1>community: {slug}</h1>
    </div>
  );
}
