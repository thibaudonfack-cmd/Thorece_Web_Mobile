import logo from '../../assets/images/logo.png';

const imgLg1 = logo;

export default function Footer() {
  return (
    <footer className="bg-blue-400 min-h-[80px] md:min-h-[90px] flex items-center justify-center relative mt-auto shadow-xl py-4 px-4 gap-4 md:gap-0">
      <div className="shrink-0 w-12 h-12 md:w-[72px] md:h-[72px] md:absolute md:left-16 md:top-1/2 md:-translate-y-1/2">
        <div className="rotate-180 scale-y-[-100%] w-full h-full">
          <img
            alt="Cipe Studio Logo"
            className="w-full h-full object-cover"
            src={imgLg1}
          />
        </div>
      </div>
      <p className="font-poppins italic text-xs md:text-sm text-black text-center break-words w-full md:w-auto md:px-32">
        GROUPE 6 - Yacine Mamlouk - Merveil Kouwonou - Emmanuel Kouame - Thorece Donfack
      </p>
    </footer>
  );
}
