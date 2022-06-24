/// <reference types="react" />
export declare type CounterProps = {
    value: number;
    maxValue?: number;
    minValue: number;
    onIncrement: Function;
    onDecrement: Function;
};
export default function Counter({ value, maxValue, minValue, onIncrement, onDecrement, }: CounterProps): JSX.Element;
