// Modo de execução, lido da URL uma vez.
//   index.html                          app completo (demo pública)
//   index.html?vitrine=desktop&canal=x  tela grande da vitrine da home
//   index.html?vitrine=celular&canal=x  tela do celular da vitrine da home
// "canal" isola a sincronização entre os dois iframes de uma mesma vitrine.
const params = new URLSearchParams(window.location.search);
const vitrine = params.get("vitrine");

export const modoVitrine: "desktop" | "celular" | null =
  vitrine === "desktop" || vitrine === "celular" ? vitrine : null;
export const canalVitrine = params.get("canal") ?? "";

// Endereço da página pública de inscrição (usado no link e no QR code).
export function urlPublica() {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#/inscricao`;
}
