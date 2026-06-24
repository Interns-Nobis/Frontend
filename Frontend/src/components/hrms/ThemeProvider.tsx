import { createContext, useContext, type ReactNode } from "react";

type Theme = "light" | "dark";

const Ctx = createContext<{
theme: Theme;
toggle: () => void;
set: (t: Theme) => void;
}>({
theme: "light",
toggle: () => {},
set: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
return (
<Ctx.Provider
value={{
theme: "light",
toggle: () => {},
set: () => {},
}}
>
{children}
</Ctx.Provider>
);
}

export const useTheme = () => useContext(Ctx);
