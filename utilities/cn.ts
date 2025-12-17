import { twMerge } from "tailwind-merge";

const cn = (...classes: string[]) => twMerge(...classes);

export default cn;
