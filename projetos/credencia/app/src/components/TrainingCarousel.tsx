import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ChartPanel } from "./ChartPanel";

const slides = [
  {
    id: "pedagogica",
    title: "Avaliação pedagógica",
    percent: 92,
    image: "./formacao/pedagogica.jpg",
    detail: "Clareza da mediação, aplicabilidade dos conteúdos e participação em sala.",
  },
  {
    id: "logistica",
    title: "Avaliação logística",
    percent: 87,
    image: "./formacao/logistica.jpg",
    detail: "Acolhimento, deslocamento, materiais e estrutura de apoio para a formação.",
  },
  {
    id: "organizacao",
    title: "Organização",
    percent: 94,
    image: "./formacao/organizacao.jpg",
    detail: "Fluxo de credenciamento, comunicação, horários e condução operacional.",
  },
];

export function TrainingCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const activeSlide = slides[activeIndex];
  const imageFailed = failedImages[activeSlide.image];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, []);

  function previousSlide() {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  }

  function nextSlide() {
    setActiveIndex((current) => (current + 1) % slides.length);
  }

  return (
    <ChartPanel title="Registro da formação" subtitle="Avaliações por dimensão com histórico">
      <div className="relative h-[320px] overflow-hidden rounded-lg border border-line bg-panelStrong">
        {imageFailed ? (
          <div className="grid grid-cols-1 h-full place-items-center bg-[linear-gradient(135deg,rgba(56,189,248,0.20),rgba(37,99,235,0.08))]">
            <div className="grid grid-cols-1 place-items-center gap-3 text-center">
              <ImageIcon size={34} className="text-accent" aria-hidden="true" />
              <span className="text-sm font-medium text-ink">Cena fictícia de formação</span>
            </div>
          </div>
        ) : (
          <img
            src={activeSlide.image}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setFailedImages((current) => ({ ...current, [activeSlide.image]: true }))}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <span className="field-label text-sky-200">{activeSlide.title}</span>
              <strong className="mt-2 block text-4xl font-medium leading-none text-white">{activeSlide.percent}%</strong>
              <p className="mt-2 max-w-md text-xs leading-5 text-sky-100/80">{activeSlide.detail}</p>
            </div>
            <div className="hidden min-w-[92px] text-right sm:block">
              <span className="field-label text-sky-200">Satisfação</span>
              <div className="mt-2 h-2 rounded-full bg-white/18">
                <div className="h-full rounded-full bg-accent" style={{ width: `${activeSlide.percent}%` }} />
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="absolute left-3 top-1/2 grid grid-cols-1 h-9 w-9 -translate-y-1/2 place-items-center rounded-lg border border-white/15 bg-slate-950/55 text-white transition hover:bg-slate-900"
          onClick={previousSlide}
          aria-label="Foto anterior"
          title="Foto anterior"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="absolute right-3 top-1/2 grid grid-cols-1 h-9 w-9 -translate-y-1/2 place-items-center rounded-lg border border-white/15 bg-slate-950/55 text-white transition hover:bg-slate-900"
          onClick={nextSlide}
          aria-label="Próxima foto"
          title="Próxima foto"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>

        <div className="absolute right-4 top-4 flex gap-1.5">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={`h-2.5 rounded-full transition ${activeIndex === index ? "w-6 bg-accent" : "w-2.5 bg-white/40 hover:bg-white/70"}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Abrir ${slide.title}`}
            />
          ))}
        </div>
      </div>
    </ChartPanel>
  );
}
