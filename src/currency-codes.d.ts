declare module 'currency-codes' {
    export function code(currency: string): { code: string; number: string; digits: number; currency: string } | undefined;
    export function number(number: string): { code: string; number: string; digits: number; currency: string } | undefined;
    export function country(countryName: string): { code: string; number: string; digits: number; currency: string }[] | undefined;
    export function currency(code: string): { code: string; number: string; digits: number; currency: string } | undefined;
    export function codes(): string[];
}