import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function createIconProps({ size = 18, ...props }: IconProps) {
    return {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
        'aria-hidden': true,
        ...props,
    };
}

export function ShareIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <circle cx="18" cy="5" r="2.6" />
            <circle cx="6" cy="12" r="2.6" />
            <circle cx="18" cy="19" r="2.6" />
            <line x1="8.3" y1="10.7" x2="15.7" y2="6.3" />
            <line x1="8.3" y1="13.3" x2="15.7" y2="17.7" />
        </svg>
    );
}

export function MessageIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7A2.5 2.5 0 0 1 17.5 15H10l-4.5 4.2a.6.6 0 0 1-1-.44V15h-.5A2.5 2.5 0 0 1 4 12.5z" />
        </svg>
    );
}

export function CopyIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
        </svg>
    );
}

export function ReceiptScanIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <path d="M6 3h12v18l-2.5-1.6L13 21l-2.5-1.6L8 21l-2-1.6z" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="9" y1="12" x2="15" y2="12" />
            <line x1="9" y1="16" x2="12.5" y2="16" />
        </svg>
    );
}
