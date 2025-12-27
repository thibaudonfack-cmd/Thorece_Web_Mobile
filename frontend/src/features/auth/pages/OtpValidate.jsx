import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppHeader from "../../../components/layout/AppHeader";
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/ui/Button';
import { IMAGES } from "../../../constants/images";
import { authService } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

export default function OtpValidate() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userEmail, rememberMe } = location.state || {};
    const { reloadUser } = useAuth();

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const inputRefs = useRef([]);

    useEffect(() => {
        if (!userEmail) {
            navigate('/login');
            return;
        }
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [userEmail, navigate]);

    const handleChange = (index, value) => {
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6).replace(/\D/g, "");

        if (pastedData) {
            const newOtp = [...otp];
            pastedData.split("").forEach((char, index) => {
                if (index < 6) newOtp[index] = char;
            });
            setOtp(newOtp);

            const focusIndex = Math.min(pastedData.length, 5);
            if (inputRefs.current[focusIndex]) {
                inputRefs.current[focusIndex].focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const code = otp.join("");
        if (code.length !== 6) {
            setError("Le code doit contenir 6 chiffres.");
            return;
        }

        setLoading(true);

        try {
            await authService.verifyOtp({
                email: userEmail,
                otpCode: code,
            }, rememberMe);

            await reloadUser();
            navigate("/otp/success");

        } catch (err) {
            console.error(err);
            setError(err.message || "Code invalide ou erreur serveur.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-neutral-100 min-h-screen flex flex-col">
            <div className="flex-1 flex flex-col">
                <div className="flex flex-col lg:flex-row max-w-[1440px] w-full mx-auto shadow-2xl rounded-3xl overflow-hidden my-4 lg:my-8 flex-1">

                    <div className="w-full lg:w-[861px] bg-neutral-100 p-6 md:p-12 lg:p-16 animate-slide-in-left overflow-y-auto">
                        <AppHeader variant="auth" onLogoClick={() => navigate("/")} />

                        <div className="mt-12 lg:mt-24 max-w-[600px] mx-auto lg:mx-0 lg:ml-16">
                            <h2 className="font-inter font-bold text-2xl md:text-[32px] text-[#323232] mb-8">
                                Vérification du code OTP
                            </h2>

                            <p className="font-poppins text-[#b6b6b6] text-base md:text-[18px] mb-4 text-center lg:text-left">
                                Entrez le code à 6 chiffres reçu sur :{" "}
                                <span className="text-blue-500 font-medium">{userEmail}</span>
                            </p>

                            {error && (
                                <div className="mb-6 p-3 bg-red-100 border border-red-300 text-red-600 rounded-lg text-sm font-semibold">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-12">
                                <div className="flex gap-2 md:gap-4 justify-center lg:justify-start flex-wrap">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            onPaste={index === 0 ? handlePaste : undefined}
                                            className={`w-12 h-12 md:w-[60px] md:h-[60px] text-center text-xl md:text-2xl font-inter font-bold text-[#757575] rounded-[15px] border-[1.6px] transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                                digit
                                                    ? "border-blue-400 bg-blue-50"
                                                    : "border-[#dddddd] bg-neutral-100"
                                            }`}
                                            aria-label={`Chiffre ${index + 1} du code OTP`}
                                            disabled={loading}
                                        />
                                    ))}
                                </div>

                                <Button
                                    variant="submit"
                                    type="submit"
                                    disabled={loading}
                                    className="w-full max-w-[367px] mx-auto lg:mx-0"
                                >
                                    {loading ? "Vérification..." : "Confirmer"}
                                </Button>
                            </form>
                        </div>
                    </div>

                    <div className="hidden lg:flex relative w-[579px] bg-blue-400 items-center justify-center animate-slide-in-right">
                        <div className="w-full max-w-[550px] p-8">
                            <img
                                alt="Super-héros fille"
                                className="w-full h-auto object-contain animate-float"
                                src={IMAGES.heroGirlSticker}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}