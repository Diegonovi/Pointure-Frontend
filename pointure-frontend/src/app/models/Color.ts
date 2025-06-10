export enum ColorCode 
{
    Red = 10,
    Green = 20,
    Blue = 30,
    Yellow = 40,
    Black = 50,
    White = 60,
    Purple = 70,
    Orange = 80,
    Pink = 90,
    Brown = 100,
    Gray = 110
}

export interface Color {
    id: number;
    name: string;
    hexCode: string;
    code: number;
}
