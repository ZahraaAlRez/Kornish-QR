"use client";

interface Props {
  cafeName: string;
  mainPictureUrl: string;
  onEnter: () => void;
}

export default function MainPicScreen({ cafeName, mainPictureUrl, onEnter }: Props) {
  return (
    <div
      className="relative flex h-dvh w-full flex-col items-center justify-end bg-cover bg-center pb-16"
      style={{ backgroundImage: `url(${mainPictureUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-espresso/40" />
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <h1 className="font-serif text-4xl italic text-cream drop-shadow-lg">{cafeName}</h1>
        <p className="text-xs uppercase tracking-[0.3em] text-gold-light">Scan · Browse · Order</p>
        <button
          onClick={onEnter}
          className="rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-wide text-espresso shadow-card transition hover:bg-gold-light"
        >
          View Menu
        </button>
      </div>
    </div>
  );
}
