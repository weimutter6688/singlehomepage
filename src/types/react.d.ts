import type {
    ReactElement,
    ComponentType,
    CSSProperties,
    SyntheticEvent
} from 'react';

declare global {
    namespace JSX {
        type Element = ReactElement<unknown>;
        type ElementType = ComponentType<unknown>;
        interface IntrinsicElements {
            [elemName: string]: {
                children?: ReactElement | ReactElement[] | string | number;
                className?: string;
                style?: CSSProperties;
                id?: string;
                role?: string;
                onClick?: () => void;
                onChange?: (event: SyntheticEvent) => void;
                [key: string]: unknown;
            };
        }
    }
}