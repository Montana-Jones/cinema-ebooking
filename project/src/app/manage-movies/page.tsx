import ManageMovies from "../../components/ManageMovies";
import Navbar from "@/components/Navbar";
import AddMovieButton from "@/components/AddMovieButton";

export default function ManageMoviesPage() {
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
      <ManageMovies />
      <AddMovieButton />
    </main>
  );
}
