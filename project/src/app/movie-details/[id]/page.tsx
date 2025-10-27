import Movie from "@/components/Movie";
import Navbar from "@/components/Navbar";
import ShowtimePanel from "@/components/ShowtimePanel";

interface MoviePageProps {
  params: { id: string };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = params;

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
        display: "grid",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <Movie movie={movie} />
      <ShowtimePanel movie={movie} />
    </main>
  );
}
