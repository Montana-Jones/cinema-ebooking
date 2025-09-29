import dummyMovies from "@/data/DummyMovies";
import Movie from "@/components/Movie";
import Navbar from "@/components/Navbar";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movie = dummyMovies.find((m) => m._id === id);

  if (!movie) return <p>Movie not found.</p>;

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
