import Navbar from "../components/Navbar";

const WelcomePage = () => {
  return (
    <>
      <Navbar />
      <div className="pt-24 text-center">
        <h1 className="text-4xl font-bold text-blue-600">Hoş geldin Varixa!</h1>
        <p className="mt-4 text-gray-600">Bu, Welcome Page'imizin başlangıcı.</p>
      </div>
    </>
  );
};

export default WelcomePage;
