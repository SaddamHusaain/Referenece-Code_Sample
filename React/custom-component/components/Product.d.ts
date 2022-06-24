/// <reference types="react" />
import { CounterProps } from './Counter';
export declare type ProductProps = {
    title: string;
    price: number;
    isRSVP?: boolean;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
} & CounterProps;
export default function Product({ title, price, isRSVP, subtitle, description, value, minValue, maxValue, onIncrement, onDecrement, }: ProductProps): JSX.Element;
