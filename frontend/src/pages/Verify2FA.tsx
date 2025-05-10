import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../components/contexts/AuthContext";

const Verify2FA = () => {
  const { verify2FA } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const userId = (location.state as { userId: string })?.userId;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError("Kullanıcı ID'si eksik.");
      return;
    }

    const result = await verify2FA(userId, code);

    if (!result.success) {
      setError(result.message || "Doğrulama başarısız.");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <section className="mx-auto w-full max-w-xl py-6 text-white">
      <div className="rounded-xl border border-zinc-800 text-center bg-[#0b1222]">
        <div className="p-8">
          <div className="mb-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 mx-auto opacity-75"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Two-Factor Authentication</h1>
          <p className="text-sm text-gray-400 mb-6">
            Please enter the 6-digit code from your authenticator app.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-black w-full px-4 py-2 rounded-md text-center text-lg tracking-widest"
              placeholder="------"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-zinc-800 hover:bg-zinc-700 py-2 px-4 rounded-lg text-white font-semibold"
            >
              Verify Code
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Verify2FA;
