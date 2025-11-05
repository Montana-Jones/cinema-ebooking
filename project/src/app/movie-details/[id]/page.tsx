import Movie from "@/components/Movie";
import Navbar from "@/components/Navbar";

interface MoviePageProps {
  params: { id: string };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const res = await fetch(`http://localhost:8080/api/movies/${id}`, {
    cache: "no-store", // ensures fresh data each time
  });

  if (!res.ok) {
    return <p>Movie not found.</p>;
  }

  const movie = await res.json();

  if (!movie) {
    return <p>Movie not found.</p>;
  }

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <Movie movie={movie} />
    </main>
  );
}
