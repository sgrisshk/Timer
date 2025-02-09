declare module '*.svg' {
    import React = require('react');
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement> & { className?: string }>;
    const src: string;
    export default src;
}
declare module '*.mp3' {
    const src: string;
    export default src;
}