import { useState } from 'react';
import { IMAGES } from '../../constants/images';

export default function FlipResourceCard({ 
  resource, 
  statsComponent, 
  actionsFront, 
  actionsBack 
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const stopProp = (e) => e.stopPropagation();

  const faceStyle = "absolute inset-0 h-full w-full bg-white rounded-[30px] border border-black overflow-hidden flex flex-col [backface-visibility:hidden]";

  return (
    <div 
      className="group h-[300px] w-[260px] cursor-pointer [perspective:1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >

        <div className={faceStyle}>
          
          {/* IMAGE (HAUT 50%) + BORDURE NOIRE EN BAS */}
          <div className="h-[45%] w-full shrink-0 border-b border-black">
            <img 
              src={resource.cover || IMAGES.bookCover} 
              alt={resource.title} 
              className="h-full w-full object-cover"
            />
          </div>
          
          {/* CONTENU (BAS 50%) */}
          <div className="h-[50%] flex flex-col">
            {/* Stats au milieu */}
            <div className="flex-1 flex flex-col justify-center items-center px-2">
               {statsComponent}
            </div>

            {/* Actions en bas */}
            <div className="pb-4 flex items-center justify-center px-4" onClick={stopProp}>
              {actionsFront}
            </div>
          </div>
        </div>

        <div className={`${faceStyle} [transform:rotateY(180deg)]`}>
          
          <div className="h-[50%] w-full shrink-0 border-b border-black">
             <img 
              src={resource.cover || IMAGES.bookCover} 
              alt={resource.title} 
              className="h-full w-full object-cover opacity-90"
            />
          </div>

          <div className="h-[50%] flex flex-col">
            {/* Description */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex items-center justify-center">
               <p className="font-poppins text-xs text-slate-500 text-center leading-relaxed line-clamp-4">
                {resource.description || "Aucune description."}
              </p>
            </div>

            {/* Actions Arrière */}
            <div className="pb-4 flex items-center justify-center px-4" onClick={stopProp}>
              {actionsBack}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}