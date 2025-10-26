import AddMovie from "@/components/AddMovie";
import Navbar from "@/components/Navbar";

export default function AddMoviePage() {
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
      <AddMovie />
    </main>
  );
}
